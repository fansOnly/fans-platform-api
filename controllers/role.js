const Role = require('../models/role');

const roleController = {
    getRoleList: async ctx => {
        let { page, pageSize, state, name } = ctx.request.query;
        page = page || 1;
        pageSize = pageSize || 999999;
        const nameFilter = name ? { name: { [Sequelize.Op.like]: `%${name}%` } } : {};
        const stateFilter = state ? { state: state }: {};
        await Role.findAndCountAll({
            where: {
                ...nameFilter,
                ...stateFilter
            },
            offset: parseInt(page - 1) * parseInt(pageSize),
            limit: parseInt(pageSize),
            order: [['create_time', 'ASC']],
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '获取管理员分类列表成功!',
                data: res.rows,
                total: res.count
            }
        }).catch(err => {
            console.log('getRoleList', err);
            ctx.body = {
                code: 500,
                msg: '获取管理员分类列表失败!'
            }
        })
    },
    getRole: async ctx => {
        const { id } = ctx.request.query;
        await Role.findOne({
            where: {
                id: parseInt(id)
            },
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '获取管理员分类详情成功!',
                data: res
            }
        }).catch(err => {
            console.log('err', err);
            ctx.body = {
                code: 500,
                msg: '管理员分类不存在!'
            }
        })
    },
    addRole: async ctx => {
        const params = ctx.request.body;
        await Role.create({
            ...params
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '创建管理员分类成功!',
            }
        }).catch(err => {
            console.log('getRole', err);
            ctx.body = {
                code: 500,
                msg: '创建管理员分类失败！',
            }
        })
    },
    updateRole: async ctx => {
        const params = ctx.request.body;
        await Role.update({
            ...params
        }, {
            where: {
                id: params.id
            },
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '更新管理员分类成功!'
            }
        }).catch(err => {
            console.log('updateRole', err);
            ctx.body = {
                code: 500,
                msg: '管理员分类不存在!'
            }
        })
    },
    deleteRole: async ctx => {
        const { ids } = ctx.request.body;
        await Role.destroy({
            where: {
                id: ids
            },
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '删除管理员分类成功!'
            }
        }).catch(err => {
            console.log('deleteRole', err);
            ctx.body = {
                code: 500,
                msg: '管理员分类不存在!'
            }
        })
    },
}

module.exports = roleController;