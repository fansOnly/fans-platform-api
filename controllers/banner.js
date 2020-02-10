const Sequelize = require('sequelize');
const BannerClass = require('../models/bannerClass');
const Banner = require('../models/banner');

const bannerController = {
    getBannerClassList: async ctx => {
        let { page, pageSize, name, id, create_time } = ctx.request.query;
        page = page || 1;
        pageSize = pageSize || 999999;
        const nameFilter = name ? { name: { [Sequelize.Op.like]: `%${name}%` } } : {};
        const idFilter = id ? { id: id } : {};
        const createTimeFilter = create_time ? { create_time: {
            [Sequelize.Op.lt]: new Date(create_time).getTime() + 16 * 60 * 60 * 1000,
            [Sequelize.Op.gt]: new Date(create_time).getTime() - 8 * 60 * 60 * 1000
        } } : {};
        await BannerClass.findAndCountAll({
            where: {
                ...nameFilter,
                ...idFilter,
                ...createTimeFilter
            },
            offset: parseInt(page - 1) * parseInt(pageSize),
            limit: parseInt(pageSize),
            order: [['create_time', 'ASC']],
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '获取幻灯片分类列表成功!',
                data: res.rows,
                total: res.count
            }
        }).catch(err => {
            console.log('getBannerClassList', err);
            ctx.body = {
                code: 500,
                msg: '获取幻灯片分类列表失败!'
            }
        })
    },
    getBannerClassDetail: async ctx => {
        const { id } = ctx.request.query;
        await BannerClass.findOne({
            where: {id: id}
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '获取幻灯片分类详情成功!',
                data: res
            }
        }).catch(err => {
            console.log('getBannerClassDetail', err);
            ctx.body = {
                code: 500,
                msg: '获取幻灯片分类详情失败!',
            }
        })
    },
    addBannerClass: async ctx => {
        const params = ctx.request.body;
        await BannerClass.create({
            ...params
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '新增幻灯片分类详情成功!',
                data: res
            }
        }).catch(err => {
            console.log('addBannerClass', err);
            ctx.body = {
                code: 500,
                msg: '新增幻灯片分类详情失败!',
            }
        })
    },
    updateBannerClass: async ctx => {
        const params = ctx.request.body;
        await BannerClass.update({
            ...params
        }, {
            where: {
                id: params.id
            }
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '更新幻灯片分类详情成功!',
            }
        }).catch(err => {
            console.log('updateBannerClass', err);
            ctx.body = {
                code: 500,
                msg: '更新幻灯片分类详情失败!',
            }
        })
    },
    updateBannerClass: async ctx => {
        const params = ctx.request.body;
        await BannerClass.update({
            ...params
        }, {
            where: {
                id: params.id
            }
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '更新幻灯片分类详情成功!',
            }
        }).catch(err => {
            console.log('updateBannerClass', err);
            ctx.body = {
                code: 500,
                msg: '更新幻灯片分类详情失败!',
            }
        })
    },
    deleteBannerClass: async ctx => {
        const { ids } = ctx.request.body;
        await BannerClass.destroy({
            where: {
                id: ids
            }
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '删除幻灯片分类详情成功!',
            }
        }).catch(err => {
            console.log('deleteBannerClass', err);
            ctx.body = {
                code: 500,
                msg: '删除幻灯片分类详情失败!',
            }
        })
    },
    getBannerList: async ctx => {
        let { page, pageSize, title, id, create_time, class_id, state } = ctx.request.query;
        page = page || 1;
        pageSize = pageSize || 999999;
        const classIdFilter = class_id ? { class_id: class_id } : {};
        const titleFilter = title ? { title: { [Sequelize.Op.like]: `%${title}%` } } : {};
        const createTimeFilter = create_time ? { create_time: {
            [Sequelize.Op.lt]: new Date(create_time).getTime() + 16 * 60 * 60 * 1000,
            [Sequelize.Op.gt]: new Date(create_time).getTime() - 8 * 60 * 60 * 1000
        } } : {};
        const idFilter = id ? { id: id } : {};
        const stateFilter = state ? { state: state } : {};
        await Banner.findAndCountAll({
            where: {
                ...classIdFilter,
                ...titleFilter,
                ...idFilter,
                ...createTimeFilter,
                ...stateFilter,
            },
            offset: parseInt(page - 1) * parseInt(pageSize),
            limit: parseInt(pageSize),
            order: [['sortnum', 'DESC'], ['create_time', 'DESC']],
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '获取幻灯列表成功!',
                data: res.rows,
                total: res.count
            }
        }).catch(err => {
            console.log('getBannerList', err);
            ctx.body = {
                code: 500,
                msg: '获取幻灯片列表失败!'
            }
        })
    },
    getBannerDetail: async ctx => {
        const { id } = ctx.request.query;
        await Banner.findOne({
            where: {id: id}
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '获取幻灯片详情成功!',
                data: res
            }
        }).catch(err => {
            console.log('getBannerDetail', err);
            ctx.body = {
                code: 500,
                msg: '获取幻灯片详情失败!',
            }
        })
    },
    addBanner: async ctx => {
        const params = ctx.request.body;
        await Banner.create({
            ...params
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '新增幻灯片详情成功!',
                data: res
            }
        }).catch(err => {
            console.log('addBanner', err);
            ctx.body = {
                code: 500,
                msg: '新增幻灯片详情失败!',
            }
        })
    },
    updateBanner: async ctx => {
        const params = ctx.request.body;
        await Banner.update({
            ...params
        }, {
            where: {
                id: params.id
            }
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '更新幻灯片详情成功!',
            }
        }).catch(err => {
            console.log('updateBanner', err);
            ctx.body = {
                code: 500,
                msg: '更新幻灯片详情失败!',
            }
        })
    },
    updateBanner: async ctx => {
        const params = ctx.request.body;
        await Banner.update({
            ...params
        }, {
            where: {
                id: params.id
            }
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '更新幻灯片详情成功!',
            }
        }).catch(err => {
            console.log('updateBanner', err);
            ctx.body = {
                code: 500,
                msg: '更新幻灯片详情失败!',
            }
        })
    },
    deleteBanner: async ctx => {
        const { ids } = ctx.request.body;
        await Banner.destroy({
            where: {
                id: ids
            }
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '删除幻灯片详情成功!',
            }
        }).catch(err => {
            console.log('deleteBanner', err);
            ctx.body = {
                code: 500,
                msg: '删除幻灯片详情失败!',
            }
        })
    },
}

module.exports = bannerController;