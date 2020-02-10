const fs = require('fs')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const sequelize = require('../db')
const Asset = require('../models/asset')

const assetController = {
    getAssetList: async ctx => {
        let { page, pageSize, state, name, create_time } = ctx.request.query;
        page = page || 1;
        pageSize = pageSize || 999999;
        const originalnameFilter = name ? { originalname: { [Op.like]: `%${name}%` } } : {};
        const stateFilter = state ? { state: state }: {};
        const createTimeFilter = create_time ? { create_time: {
            [Op.lt]: new Date(create_time).getTime() + 16 * 60 * 60 * 1000,
            [Op.gt]: new Date(create_time).getTime() - 8 * 60 * 60 * 1000
        } } : {};
        await sequelize.transaction(t => {
            return Asset.findAndCountAll({
                where: {
                    ...originalnameFilter,
                    ...stateFilter,
                    ...createTimeFilter,
                },
                offset: parseInt(page - 1) * parseInt(pageSize),
                limit: parseInt(pageSize),
                order: [['create_time', 'DESC']],
            }, {transaction: t}).then(data => {
                data.rows.map(item => {
                    fs.exists(item.path, function(exists) {
                        if (!exists) {
                            Asset.update({
                                state: 0,
                            }, {
                                where: {
                                    id: item.id
                                }
                            }, {transaction: t})
                            item.state = 0;
                        }
                    });
                })
                return data;
            })
        })
        .then(res => {
            ctx.body = {
                code: 200,
                msg: '获取资源列表成功!',
                data: res.rows,
                total: res.count
            }
        }).catch(err => {
            console.log('getAssetList', err);
            ctx.body = {
                code: 500,
                msg: '获取资源列表失败!'
            }
        })
    },
    deleteAsset: async ctx => {
        const { ids } = ctx.request.body;
        await Asset.destroy({
            where: {
                id: ids
            },
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '删除资源成功!'
            }
        }).catch(err => {
            console.log('deleteAsset', err);
            ctx.body = {
                code: 500,
                msg: '资源不存在!'
            }
        })
    },
}

module.exports = assetController;