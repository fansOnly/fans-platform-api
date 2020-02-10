const Sequelize = require('sequelize')
const sequelize = require('../db')

const Hotword = sequelize.define('hotword', {
    name: Sequelize.STRING(20),
}, {
})
//创建表，默认是false，true则是删除原有表，再创建
// Hotword.sync({
//     force: false,
// });

module.exports = Hotword;