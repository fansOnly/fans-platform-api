const Sequelize = require('sequelize')
const sequelize = require('../db')

const Banner = sequelize.define('banner', {
    sortnum: Sequelize.INTEGER(11),
    title: Sequelize.STRING(20),
    class_id: Sequelize.INTEGER(11),
    url: Sequelize.STRING(255),
    thumbnail: Sequelize.JSON,
    content: Sequelize.STRING(255),
    blank: Sequelize.INTEGER(11),
    state: Sequelize.INTEGER(11),
}, {
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time',
})
//创建表，默认是false，true则是删除原有表，再创建
// Banner.sync({
//     force: false,
// });

module.exports = Banner;