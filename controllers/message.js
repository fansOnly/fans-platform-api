const Sequelize = require('sequelize')
const sequelize = require('../db')
const Op = Sequelize.Op
const Message = require('../models/message')

const MessageController = {
    getMessageList: async ctx => {
        let { page, pageSize, nickname, phone, state, id, create_time } = ctx.request.query;
        page = page || 1;
        pageSize = pageSize || 999999;
        const nicknameFilter = nickname ? { nickname: { [Op.like]: `%${nickname}%` } } : {};
        const idFilter = id ? { id: id } : {};
        const phoneFilter = phone ? { phone: { [Op.like]: `%${phone}%` } } : {};
        const createTimeFilter = create_time ? { create_time: {
            [Op.lt]: new Date(create_time).getTime() + 16 * 60 * 60 * 1000,
            [Op.gt]: new Date(create_time).getTime() - 8 * 60 * 60 * 1000
        } } : {};
        const stateFilter = state ? { state: state } : {};
        await Message.findAndCountAll({
            where: {
                ...nicknameFilter,
                ...idFilter,
                ...phoneFilter,
                ...createTimeFilter,
                ...stateFilter
            },
            offset: parseInt(page - 1) * parseInt(pageSize),
            limit: parseInt(pageSize),
            order: [['state', 'DESC'], ['create_time', 'DESC']],
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '获取留言列表成功!',
                data: res.rows,
                total: res.count
            }
        }).catch(err => {
            console.log('getMessageList', err);
            ctx.body = {
                code: 500,
                msg: '获取留言列表失败!'
            }
        })
    },
    getMessage: async ctx => {
        const { id } = ctx.request.query;
        await sequelize.transaction(t => {
            // 在这里链接你的所有查询. 确保你返回他们.
            return Message.findOne({
                where: {
                    id: parseInt(id)
                }
            }, {transaction: t}).then(message => {
                if (message.state == 0) {
                    Message.update({
                        state: 1
                    }, {
                        where: {
                            id: parseInt(id)
                        }
                    }, {transaction: t});
                    message.state = 1;
                }
                return message
            });
        }).then(res => {
            // 事务已被提交
            ctx.body = {
                code: 200,
                msg: '获取留言成功!',
                data: res
            }
            // result 是 promise 链返回到事务回调的结果
        }).catch(err => {
            // 事务已被回滚
            // err 是拒绝 promise 链返回到事务回调的错误
            console.log('getMessage', err);
            ctx.body = {
                code: 500,
                msg: '留言不存在!'
            }
        });
    },
    updateMessage: async ctx => {
        const params = ctx.request.body;
        await Message.update({
            ...params
        }, {
            where: {
                id: params.id
            },
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '更新留言成功!'
            }
        }).catch(err => {
            console.log('updateMessage', err);
            ctx.body = {
                code: 500,
                msg: err.name+ ":" + err.parent.sqlMessage
            }
        })
    },
    deleteMessage: async ctx => {
        const { ids } = ctx.request.body;
        await Message.destroy({
            where: {
                id: ids
            },
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '删除留言成功!'
            }
        }).catch(err => {
            console.log('deleteMessage', err);
            ctx.body = {
                code: 500,
                msg: '留言不存在!'
            }
        })
    },
}

module.exports = MessageController;