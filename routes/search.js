
const router = require('koa-router')()
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const sequelize = require('../db')

const Article = require('../models/article');

// 方案一 union多表无关联联合查询 模糊查询报错，未解决
// router.get('/', async (ctx, next) => {
//     const keyword = ctx.request.query;
//     await sequelize.query('SELECT id, title FROM article where title like ? union all select id, content from message where content like ?', { replacements: ["'%"+keyword+"%'", "'%"+keyword+"%'"], type: sequelize.QueryTypes.SELECT})
//     .then(res => {
//         ctx.body = {
//             code: 200,
//             msg: '查询成功!',
//             data: res
//         }
//     })
//     .catch(err => {
//         ctx.body = {
//             code: 500,
//             msg: '查询失败!',
//             err
//         }
//     })
// })

// 方案二 临时表查询

// 方案三  单表查询
router.get('/', async (ctx, next) => {
    let { page, pageSize, keyword, create_time, state, id} = ctx.request.query;
    page = page || 1;
    pageSize = pageSize || 999999;
    const idFilter = id ? { id: id } : {};
    const titleFilter = keyword ? { title: { [Op.like]: `%${keyword}%` } } : {};
    const createTimeFilter = create_time ? { create_time: {
        [Sequelize.Op.lt]: new Date(create_time).getTime() + 16 * 60 * 60 * 1000,
        [Sequelize.Op.gt]: new Date(create_time).getTime() - 8 * 60 * 60 * 1000
    } } : {};
    const stateFilter = state ? { state: state } : {};
    await Article.findAndCountAll({
        where: {
            ...idFilter,
            ...titleFilter,
            ...createTimeFilter,
            ...stateFilter
        },
        offset: parseInt(page - 1) * parseInt(pageSize),
        limit: parseInt(pageSize),
        order: [['state', 'DESC'], ['create_time', 'DESC']],
        attributes: ['id', 'title', 'create_time', 'state']
    }).then(res => {
        ctx.body = {
            code: 200,
            msg: '查询搜索结果成功!',
            data: res.rows,
            total: res.count
        }
    })
    .catch(err => {
        ctx.body = {
            code: 500,
            msg: '查询搜索结果失败!',
            err
        }
    })
})

module.exports = router;