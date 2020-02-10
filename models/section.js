const Sequelize = require('sequelize')
const sequelize = require('../db')

const Section = sequelize.define('section', {
    sortnum: Sequelize.INTEGER(11),
    parent_id: Sequelize.INTEGER(11),
    name: Sequelize.STRING(20),
    en_name: Sequelize.STRING(20),
    mode: Sequelize.STRING(20),
    path: Sequelize.STRING(64),
    content: Sequelize.STRING(255),
    url: Sequelize.STRING(255),
    thumbnail: Sequelize.JSON,
    state: Sequelize.INTEGER(11),
}, {
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time',
})
//timestamp字段，默认为true，表示数据库中是否会自动更新createdAt和updatedAt字段，false表示不会增加这个字段。
//freezeTableName,默认为true,会自动给表名表示为复数: user => users，为false则表示，使用我设置的表名

//创建表，默认是false，true则是删除原有表，再创建
// Section.sync({
//     force: false,
// });

module.exports = Section;