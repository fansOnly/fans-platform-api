const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Member = require('../models/member');
const { MD5 } = require('../utils/secret')

const MemberController = {
    getMemberList: async ctx => {
        let { page, pageSize, username, nickname, phone, state, id, create_time } = ctx.request.query;
        page = page || 1;
        pageSize = pageSize || 999999;
        const usernameFilter = username ? { username: { [Op.like]: `%${username}%` } } : {};
        const nicknameFilter = nickname ? { nickname: { [Op.like]: `%${nickname}%` } } : {};
        const idFilter = id ? { id: id } : {};
        const phoneFilter = phone ? { phone: { [Op.like]: `%${phone}%` } } : {};
        const createTimeFilter = create_time ? { create_time: {
            [Op.lt]: new Date(create_time).getTime() + 16 * 60 * 60 * 1000,
            [Op.gt]: new Date(create_time).getTime() - 8 * 60 * 60 * 1000
        } } : {};
        const stateFilter = state ? { state: state } : {};
        await Member.findAndCountAll({
            where: {
                ...usernameFilter,
                ...nicknameFilter,
                ...idFilter,
                ...phoneFilter,
                ...createTimeFilter,
                ...stateFilter
            },
            offset: parseInt(page - 1) * parseInt(pageSize),
            limit: parseInt(pageSize),
            order: [['create_time', 'DESC']],
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '获取会员列表成功!',
                data: res.rows,
                total: res.count
            }
        }).catch(err => {
            console.log('getMemberList', err);
            ctx.body = {
                code: 500,
                msg: '获取会员列表失败!'
            }
        })
    },
    getMember: async ctx => {
        const { id } = ctx.request.query;
        await Member.findOne({
            where: {
                id: parseInt(id)
            },
            attributes: {exclude: 'password'}
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '获取会员成功!',
                data: res
            }
        }).catch(err => {
            console.log('getMember', err);
            ctx.body = {
                code: 500,
                msg: '会员不存在!'
            }
        })
    },
    addMember: async ctx => {
        const params = ctx.request.body;
        await Member.create({
            ...params,
            password: MD5(params.password)
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '创建会员成功!',
            }
        }).catch(err => {
            console.log('addMember', err);
            ctx.body = {
                code: 500,
                msg: '创建会员失败！',
            }
        })
    },
    updateMember: async ctx => {
        const params = ctx.request.body;
        await Member.update({
            ...params
        }, {
            where: {
                id: params.id
            },
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '更新会员成功!'
            }
        }).catch(err => {
            console.log('updateMember', err);
            ctx.body = {
                code: 500,
                msg: err.name+ ":" + err.parent.sqlMessage
            }
        })
    },
    deleteMember: async ctx => {
        const { ids } = ctx.request.body;
        await Member.destroy({
            where: {
                id: ids
            },
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '删除会员成功!'
            }
        }).catch(err => {
            console.log('deleteMember', err);
            ctx.body = {
                code: 500,
                msg: '会员不存在!'
            }
        })
    },
    getMemberPass: async ctx => {
        const { id } = ctx.request.query;
        await Member.findOne({
            where: {
                id: parseInt(id)
            },
            attributes: ['password']
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '获取成功!',
                data: res
            }
        }).catch(err => {
            console.log('getMemberPass', err);
            ctx.body = {
                code: 500,
                msg: '获取失败!'
            }
        })
    },
    updateMemberPass: async ctx => {
        const { id, newpass } = ctx.request.body;
        await Member.update({
            password: MD5(newpass)
        }, {
            where: {
                id: parseInt(id)
            },
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '更新密码成功!',
            }
        }).catch(err => {
            console.log('updateMemberPass', err);
            ctx.body = {
                code: 500,
                msg: '更新密码失败！',
            }
        })
    },
}

module.exports = MemberController;