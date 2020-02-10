const Sequelize = require('sequelize')
const sequelize = require('../db')

const BannerClass = sequelize.define('banner_class', {
    name: Sequelize.STRING(20),
    content: Sequelize.STRING(255),
}, {
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time',
})
//创建表，默认是false，true则是删除原有表，再创建
// BannerClass.sync({
//     force: false,
// });

module.exports = BannerClass;