const Sequelize = require('sequelize')
const sequelize = require('../db')

const Role = sequelize.define('role', {
    name: Sequelize.STRING(20),
    content: Sequelize.STRING(255),
    permission: Sequelize.JSON,
    state: Sequelize.INTEGER(1),
}, {
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time'
})
//创建表，默认是false，true则是删除原有表，再创建
// Role.sync({
//     force: false,
// });

module.exports = Role;