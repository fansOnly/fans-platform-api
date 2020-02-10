const Sequelize = require('sequelize')
const sequelize = require('../db')

const Setting = sequelize.define('setting', {
    base_info: Sequelize.JSON,
    advance_info: Sequelize.JSON,
    seo_info: Sequelize.JSON,
    upload_info: Sequelize.JSON
}, {
})
//创建表，默认是false，true则是删除原有表，再创建
// Setting.sync({
//     force: false,
// });

module.exports = Setting;