const Sequelize = require('sequelize')
const sequelize = require('../db')

const Asset = sequelize.define('asset', {
    admin_id: Sequelize.INTEGER(11),
    uid: Sequelize.STRING(255),
    filename: Sequelize.STRING(255),
    originalname: Sequelize.STRING(255),
    path: Sequelize.STRING(255),
    size: Sequelize.STRING(255),
    mimetype: Sequelize.STRING(11),
    suffix: Sequelize.STRING(11),
    more: Sequelize.JSON,
    state: Sequelize.INTEGER(11),
}, {
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: false
})
//timestamp字段，默认为true，表示数据库中是否会自动更新createdAt和updatedAt字段，false表示不会增加这个字段。

//创建表，默认是false，true则是删除原有表，再创建
// Asset.sync({
//     force: false,
// });

module.exports = Asset;