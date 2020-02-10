const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const fs = require('fs');
const sequelize = require('../db');
const Category = require('../models/category');
const Product = require('../models/product');

const ProductController = {
    getCategoryList: async ctx => {
        let { parent_id } = ctx.request.query;
        const parentIdFilter = parent_id ? { parent_id: parent_id } : {};
        await Category.findAll({
            where: {
                ...parentIdFilter,
            },
            order: [['id', 'ASC']],
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '获取产品分类成功!',
                data: res
            }
        }).catch(err => {
            console.log('getCategoryList', err);
            ctx.body = {
                code: 500,
                msg: '获取产品分类失败!'
            }
        })
    },
    getCategoryIndex: async ctx => {
        const parents = await Category.findAll({
            where: {
                parent_id: 0
            },
            order: [['sortnum', 'ASC']]
        })
        const parentIds = parents.map(item => item.id);
        const seconds = await Category.findAll({
            where: {
                parent_id: parentIds
            },
            order: [['sortnum', 'ASC']]
        })
        const secondIds = seconds.map(item => item.id);
        const thirds = await Category.findAll({
            where: {
                parent_id: secondIds
            },
            order: [['sortnum', 'ASC']]
        })
        thirds.map(t => t.dataValues.level = 3)
        seconds.map(s => {
            const children = thirds.filter(t => t.parent_id == s.id);
            s.dataValues.level = 2;
            s.dataValues.children = children;
        })
        parents.map(p => {
            const children = seconds.filter(s => s.parent_id == p.id);
            p.dataValues.level = 1;
            p.dataValues.children = children;
        })
        ctx.body = {
            code: 200,
            msg: '获取产品分类成功!',
            data: parents
        }
    },
    getCategoryTree: async ctx => {
        await Category.findAll({
            where: {},
            attributes: ['id', ['parent_id', 'pId'], ['name', 'label'], ['id', 'value']],
            order: [['id', 'ASC']],
        }).then(res => {
            res.unshift({'id': '-1','pId': '0','value': '0','label': '作为一级分类'});
            ctx.body = {
                code: 200,
                msg: '获取产品分类树成功!',
                data: res
            }
        }).catch(err => {
            console.log('getCategoryList', err);
            ctx.body = {
                code: 500,
                msg: '获取产品分类树失败!'
            }
        })
    },
    getCategoryDetail: async ctx => {
        const { id } = ctx.request.query;
        await Category.findOne({
            where: {
                id: parseInt(id)
            },
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '获取产品分类详情成功!',
                data: res
            }
        }).catch(err => {
            console.log('getCategoryDetail', err);
            ctx.body = {
                code: 500,
                msg: '产品分类不存在!'
            }
        })
    },
    addCategory: async ctx => {
        const params = ctx.request.body;
        await Category.create({
            ...params
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '创建产品分类成功!',
            }
        }).catch(err => {
            console.log('getCategory', err);
            ctx.body = {
                code: 500,
                msg: '创建产品分类失败！',
            }
        })
    },
    updateCategory: async ctx => {
        const params = ctx.request.body;
        await Category.update({
            ...params
        }, {
            where: {
                id: params.id
            },
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '更新产品分类成功!'
            }
        }).catch(err => {
            console.log('updateCategory', err);
            ctx.body = {
                code: 500,
                msg: '产品分类不存在!'
            }
        })
    },
    deleteCategory: async ctx => {
        const { ids } = ctx.request.body;
        await Category.destroy({
            where: {
                id: ids
            },
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '删除产品分类成功!'
            }
        }).catch(err => {
            console.log('deleteCategory', err);
            ctx.body = {
                code: 500,
                msg: '产品分类不存在!'
            }
        })
    },
    getProductList: async ctx => {
        let { page, pageSize, title, id, create_time, Category_id, state } = ctx.request.query;
        page = page || 1;
        pageSize = pageSize || 999999;
        const CategoryIdFilter = Category_id ? { Category_id: Category_id } : {};
        const titleFilter = title ? { title: { [Op.like]: `%${title}%` } } : {};
        const createTimeFilter = create_time ? { publish_time: {
            [Op.lt]: new Date(create_time).getTime() + 16 * 60 * 60 * 1000,
            [Op.gt]: new Date(create_time).getTime() - 8 * 60 * 60 * 1000
        } } : {};
        const idFilter = id ? { id: id } : {};
        const stateFilter = state ? { state: state } : {};
        await sequelize.transaction(t => {
            return Product.findAndCountAll({
                where: {
                    ...CategoryIdFilter,
                    ...titleFilter,
                    ...idFilter,
                    ...createTimeFilter,
                    ...stateFilter,
                },
                offset: parseInt(page - 1) * parseInt(pageSize),
                limit: parseInt(pageSize),
                order: [['state', 'DESC'],['sortnum', 'DESC'], ['create_time', 'DESC']],
            }, {transaction: t}).then(data => {
                data.rows.map(item => {
                    if (item.thumbnail && item.thumbnail.length) {
                        fs.exists(item.thumbnail[0].path, function(exists) {
                            if (!exists) {
                                Product.update({
                                    thumbnail: [{
                                        ...item.thumbnail[0],
                                        state: 0
                                    }]
                                }, {
                                    where: {
                                        id: item.id
                                    }
                                }, {transaction: t})
                                item.thumbnail[0].state = 0;
                            }
                        });
                    }
                })
                return data;
            })
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '获取产品列表成功!',
                data: res.rows,
                total: res.count
            }
        }).catch(err => {
            console.log('getBannerList', err);
            ctx.body = {
                code: 500,
                msg: '获取产品列表失败!'
            }
        })
    },
    getProductDetail: async ctx => {
        const { id } = ctx.request.query;
        const product = await Product.findOne({
            where: {
                id: parseInt(id)
            },
        })
        await product.increment('views')
        .then(res => {
            res.views += 1;
            ctx.body = {
                code: 200,
                msg: '获取产品详情成功!',
                data: res
            }
        }).catch(err => {
            console.log('getProductDetail', err);
            ctx.body = {
                code: 500,
                msg: '产品不存在!'
            }
        })
    },
    addProduct: async ctx => {
        const params = ctx.request.body;
        await Product.create({
            ...params
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '创建产品成功!',
                id: res.id
            }
        }).catch(err => {
            console.log('getProduct', err);
            ctx.body = {
                code: 500,
                msg: '创建产品失败！',
            }
        })
    },
    updateProduct: async ctx => {
        const params = ctx.request.body;
        await Product.update({
            ...params
        }, {
            where: {
                id: params.id
            },
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '更新产品成功!',
            }
        }).catch(err => {
            console.log('updateProduct', err);
            ctx.body = {
                code: 500,
                msg: '产品不存在!'
            }
        })
    },
    deleteProduct: async ctx => {
        const { ids } = ctx.request.body;
        await Product.destroy({
            where: {
                id: ids
            },
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '删除产品成功!'
            }
        }).catch(err => {
            console.log('deleteProduct', err);
            ctx.body = {
                code: 500,
                msg: '产品不存在!'
            }
        })
    },
    getRecycleList: async ctx => {
        let { page, pageSize, title, id, create_time, Category_id, state } = ctx.request.query;
        page = page || 1;
        pageSize = pageSize || 999999;
        const CategoryIdFilter = Category_id ? { Category_id: Category_id } : {};
        const titleFilter = title ? { title: { [Op.like]: `%${title}%` } } : {};
        const createTimeFilter = create_time ? { publish_time: {
            [Op.lt]: new Date(create_time).getTime() + 16 * 60 * 60 * 1000,
            [Op.gt]: new Date(create_time).getTime() - 8 * 60 * 60 * 1000
        } } : {};
        const idFilter = id ? { id: id } : {};
        const stateFilter = state ? { state: state } : {};
        await Product.findAndCountAll({
            where: {
                ...CategoryIdFilter,
                ...titleFilter,
                ...idFilter,
                ...createTimeFilter,
                ...stateFilter,
                delete_time: {
                    [Op.ne]: null
                }
            },
            paranoid: false,
            offset: parseInt(page - 1) * parseInt(pageSize),
            limit: parseInt(pageSize),
            order: [['state', 'DESC'],['sortnum', 'DESC'], ['create_time', 'DESC']],
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '获取产品回收站列表成功!',
                data: res.rows,
                total: res.count
            }
        }).catch(err => {
            console.log('getRecycleList', err);
            ctx.body = {
                code: 500,
                msg: '获取产品回收站列表失败!'
            }
        })
    },
    clearProduct: async ctx => {
        const { ids } = ctx.request.body;
        await Product.destroy({
            where: {
                id: ids
            },
            force: true,
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '彻底删除产品成功!'
            }
        }).catch(err => {
            console.log('clearProduct', err);
            ctx.body = {
                code: 500,
                msg: '产品不存在!'
            }
        })
    },
    clearAllProduct: async ctx => {
        await Product.destroy({
            where: {
                delete_time: {
                    [Op.ne]: null
                }
            },
            paranoid: false,
            force: true,
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '清空回收站成功!'
            }
        }).catch(err => {
            console.log('clearAllProduct', err);
            ctx.body = {
                code: 500,
                msg: '清空回收站失败!'
            }
        })
    },
    restoreProduct: async ctx => {
        const { ids } = ctx.request.body;
        await Product.restore({
            where: {
                id: ids
            },
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '还原产品成功!'
            }
        }).catch(err => {
            console.log('restoreProduct', err);
            ctx.body = {
                code: 500,
                msg: '产品不存在!'
            }
        })
    },
}

module.exports = ProductController;