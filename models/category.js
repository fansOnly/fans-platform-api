const Sequelize = require('sequelize')
const sequelize = require('../db')

const Category = sequelize.define('category', {
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

//创建表，默认是false，true则是删除原有表，再创建
// Category.sync({
//     force: false,
// });

module.exports = Category;