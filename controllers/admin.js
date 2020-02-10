const Sequelize = require('sequelize');
const Admin = require('../models/admin');
const Role = require('../models/role');
const { MD5 } = require('../utils/secret');

const userController = {
    getUserList: async ctx => {
        let { page, pageSize, name, state, id, create_time, class_id } = ctx.request.query;
        page = page || 1;
        pageSize = pageSize || 999999;
        const roleIdFilter = class_id ? { role_id: class_id } : {};
        const usernameFilter = name ? { username: { [Sequelize.Op.like]: `%${name}%` } } : {};
        const idFilter = id ? { id: id } : {};
        const createTimeFilter = create_time ? { create_time: {
            [Sequelize.Op.lt]: new Date(create_time).getTime() + 16 * 60 * 60 * 1000,
            [Sequelize.Op.gt]: new Date(create_time).getTime() - 8 * 60 * 60 * 1000
        } } : {};
        const stateFilter = state ? { state: state } : {};
        await Admin.findAndCountAll({
            where: {
                ...roleIdFilter,
                ...usernameFilter,
                ...idFilter,
                ...createTimeFilter,
                ...stateFilter
            },
            include: [{
                model: Role,
                where: { id: Sequelize.col('admin.role_id') },
                attributes: []
            }],
            offset: parseInt(page - 1) * parseInt(pageSize),
            limit: parseInt(pageSize),
            order: [['create_time', 'DESC']],
            attributes: {include: [[Sequelize.col('role.name'), 'role_name']], exclude: ['password', 'update_time', 'roleId']},
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '获取管理员列表成功!',
                data: res.rows,
                total: res.count
            }
        }).catch(err => {
            console.log('getUserList', err);
            ctx.body = {
                code: 500,
                msg: '获取管理员列表失败!'
            }
        })
    },
    getUser: async ctx => {
        const { id } = ctx.request.query;
        await Admin.findOne({
            where: {
                id: parseInt(id)
            },
            include: [{
                model: Role,
                where: { id: Sequelize.col('admin.role_id') },
                attributes: []
            }],
            attributes: {include: [[Sequelize.col('role.name'), 'role_name']], exclude: ['password', 'update_time', 'roleId']},
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '获取管理员成功!',
                data: res
            }
        }).catch(err => {
            console.log('getUser', err);
            ctx.body = {
                code: 500,
                msg: '管理员不存在!'
            }
        })
    },
    addUser: async ctx => {
        const params = ctx.request.body;
        await Admin.create({
            ...params,
            password: MD5(password)
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '创建管理员成功!',
            }
        }).catch(err => {
            console.log('addUser', err);
            ctx.body = {
                code: 500,
                msg: '创建管理员失败！',
            }
        })
    },
    updateUser: async ctx => {
        const params = ctx.request.body;
        await Admin.update({
            ...params
        }, {
            where: {
                id: params.id
            },
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '更新管理员成功!'
            }
        }).catch(err => {
            console.log('updateUser', err);
            ctx.body = {
                code: 500,
                msg: '管理员不存在!'
            }
        })
    },
    deleteUser: async ctx => {
        const { ids } = ctx.request.body;
        await Admin.destroy({
            where: {
                id: ids
            },
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '删除管理员成功!'
            }
        }).catch(err => {
            console.log('deleteUser', err);
            ctx.body = {
                code: 500,
                msg: '管理员不存在!'
            }
        })
    },
    getUserPass: async ctx => {
        const { id } = ctx.request.query;
        await Admin.findOne({
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
            console.log('getUserPass', err);
            ctx.body = {
                code: 500,
                msg: '获取失败!'
            }
        })
    },
    updateUserPass: async ctx => {
        const { id, newpass } = ctx.request.body;
        await Admin.update({
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
            console.log('updateUserPass', err);
            ctx.body = {
                code: 500,
                msg: '更新密码失败！',
            }
        })
    },
    getPermissionList: async ctx => {
        await Admin.findAll({
            where: {},
            // order: [['create_time', 'DESC']],
            // attributes: [],
            raw: true
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '获取权限列表成功!',
                data: res
            }
        }).catch(err => {
            console.log('getPermissionList', err);
            ctx.body = {
                code: 500,
                msg: '获取权限列表失败!'
            }
        })
    },
}

module.exports = userController;