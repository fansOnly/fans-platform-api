const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const fs = require('fs');
const sequelize = require('../db');
const Section = require('../models/section');
const Article = require('../models/article');

const articleController = {
    getSectionList: async ctx => {
        let { parent_id } = ctx.request.query;
        const parentIdFilter = parent_id ? { parent_id: parent_id } : {};
        await Section.findAll({
            where: {
                ...parentIdFilter,
            },
            order: [['id', 'ASC']],
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '获取文章分类成功!',
                data: res
            }
        }).catch(err => {
            console.log('getSectionList', err);
            ctx.body = {
                code: 500,
                msg: '获取文章分类失败!'
            }
        })
    },
    getSectionIndex: async ctx => {
        const parents = await Section.findAll({
            where: {
                parent_id: 0
            },
            order: [['sortnum', 'ASC']]
        })
        const parentIds = parents.map(item => item.id);
        const seconds = await Section.findAll({
            where: {
                parent_id: parentIds
            },
            order: [['sortnum', 'ASC']]
        })
        const secondIds = seconds.map(item => item.id);
        const thirds = await Section.findAll({
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
            msg: '获取文章分类成功!',
            data: parents
        }
    },
    getSectionTree: async ctx => {
        await Section.findAll({
            where: {},
            attributes: ['id', ['parent_id', 'pId'], ['name', 'label'], ['id', 'value']],
            order: [['id', 'ASC']],
        }).then(res => {
            res.unshift({'id': '-1','pId': '0','value': '0','label': '作为一级分类'});
            ctx.body = {
                code: 200,
                msg: '获取文章分类树成功!',
                data: res
            }
        }).catch(err => {
            console.log('getSectionList', err);
            ctx.body = {
                code: 500,
                msg: '获取文章分类树失败!'
            }
        })
    },
    getSectionDetail: async ctx => {
        const { id } = ctx.request.query;
        await Section.findOne({
            where: {
                id: parseInt(id)
            },
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '获取文章分类详情成功!',
                data: res
            }
        }).catch(err => {
            console.log('getSectionDetail', err);
            ctx.body = {
                code: 500,
                msg: '文章分类不存在!'
            }
        })
    },
    addSection: async ctx => {
        const params = ctx.request.body;
        await Section.create({
            ...params
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '创建文章分类成功!',
            }
        }).catch(err => {
            console.log('getSection', err);
            ctx.body = {
                code: 500,
                msg: '创建文章分类失败！',
            }
        })
    },
    updateSection: async ctx => {
        const params = ctx.request.body;
        await Section.update({
            ...params
        }, {
            where: {
                id: params.id
            },
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '更新文章分类成功!'
            }
        }).catch(err => {
            console.log('updateSection', err);
            ctx.body = {
                code: 500,
                msg: '文章分类不存在!'
            }
        })
    },
    deleteSection: async ctx => {
        const { ids } = ctx.request.body;
        await Section.destroy({
            where: {
                id: ids
            },
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '删除文章分类成功!'
            }
        }).catch(err => {
            console.log('deleteSection', err);
            ctx.body = {
                code: 500,
                msg: '文章分类不存在!'
            }
        })
    },
    getArticleList: async ctx => {
        let { page, pageSize, title, id, create_time, section_id, state } = ctx.request.query;
        page = page || 1;
        pageSize = pageSize || 999999;
        const sectionIdFilter = section_id ? { section_id: section_id } : {};
        const titleFilter = title ? { title: { [Op.like]: `%${title}%` } } : {};
        const createTimeFilter = create_time ? { publish_time: {
            [Op.lt]: new Date(create_time).getTime() + 16 * 60 * 60 * 1000,
            [Op.gt]: new Date(create_time).getTime() - 8 * 60 * 60 * 1000
        } } : {};
        const idFilter = id ? { id: id } : {};
        const stateFilter = state ? { state: state } : {};
        await sequelize.transaction(t => {
            return Article.findAndCountAll({
                where: {
                    ...sectionIdFilter,
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
                                Article.update({
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
                msg: '获取文章列表成功!',
                data: res.rows,
                total: res.count
            }
        }).catch(err => {
            console.log('getBannerList', err);
            ctx.body = {
                code: 500,
                msg: '获取文章列表失败!'
            }
        })
    },
    getArticleDetail: async ctx => {
        const { id } = ctx.request.query;
        const article = await Article.findOne({
            where: {
                id: parseInt(id)
            },
        })
        await article.increment('views')
        .then(res => {
            res.views += 1;
            ctx.body = {
                code: 200,
                msg: '获取文章详情成功!',
                data: res
            }
        }).catch(err => {
            console.log('getArticleDetail', err);
            ctx.body = {
                code: 500,
                msg: '文章不存在!'
            }
        })
    },
    addArticle: async ctx => {
        const params = ctx.request.body;
        await Article.create({
            ...params
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '创建文章成功!',
                id: res.id
            }
        }).catch(err => {
            console.log('getArticle', err);
            ctx.body = {
                code: 500,
                msg: '创建文章失败！',
            }
        })
    },
    updateArticle: async ctx => {
        const params = ctx.request.body;
        await Article.update({
            ...params
        }, {
            where: {
                id: params.id
            },
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '更新文章成功!',
            }
        }).catch(err => {
            console.log('updateArticle', err);
            ctx.body = {
                code: 500,
                msg: '文章不存在!'
            }
        })
    },
    deleteArticle: async ctx => {
        const { ids } = ctx.request.body;
        await Article.destroy({
            where: {
                id: ids
            },
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '删除文章成功!'
            }
        }).catch(err => {
            console.log('deleteArticle', err);
            ctx.body = {
                code: 500,
                msg: '文章不存在!'
            }
        })
    },
    getRecycleList: async ctx => {
        let { page, pageSize, title, id, create_time, section_id, state } = ctx.request.query;
        page = page || 1;
        pageSize = pageSize || 999999;
        const sectionIdFilter = section_id ? { section_id: section_id } : {};
        const titleFilter = title ? { title: { [Op.like]: `%${title}%` } } : {};
        const createTimeFilter = create_time ? { publish_time: {
            [Op.lt]: new Date(create_time).getTime() + 16 * 60 * 60 * 1000,
            [Op.gt]: new Date(create_time).getTime() - 8 * 60 * 60 * 1000
        } } : {};
        const idFilter = id ? { id: id } : {};
        const stateFilter = state ? { state: state } : {};
        await Article.findAndCountAll({
            where: {
                ...sectionIdFilter,
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
                msg: '获取文章回收站列表成功!',
                data: res.rows,
                total: res.count
            }
        }).catch(err => {
            console.log('getRecycleList', err);
            ctx.body = {
                code: 500,
                msg: '获取文章回收站列表失败!'
            }
        })
    },
    clearArticle: async ctx => {
        const { ids } = ctx.request.body;
        await Article.destroy({
            where: {
                id: ids
            },
            force: true,
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '彻底删除文章成功!'
            }
        }).catch(err => {
            console.log('clearArticle', err);
            ctx.body = {
                code: 500,
                msg: '文章不存在!'
            }
        })
    },
    clearAllArticle: async ctx => {
        await Article.destroy({
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
            console.log('clearAllArticle', err);
            ctx.body = {
                code: 500,
                msg: '清空回收站失败!'
            }
        })
    },
    restoreArticle: async ctx => {
        const { ids } = ctx.request.body;
        await Article.restore({
            where: {
                id: ids
            },
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '还原文章成功!'
            }
        }).catch(err => {
            console.log('restoreArticle', err);
            ctx.body = {
                code: 500,
                msg: '文章不存在!'
            }
        })
    },
}

module.exports = articleController;