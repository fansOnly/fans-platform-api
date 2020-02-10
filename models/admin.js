const Sequelize = require('sequelize')
const sequelize = require('../db')
const Role = require('./role');

const Admin = sequelize.define('admin', {
    username: Sequelize.STRING(20),
    password: Sequelize.STRING(64),
    nickname: Sequelize.STRING(20),
    avatar: Sequelize.STRING(20),
    phone: Sequelize.STRING(20),
    role_id: Sequelize.INTEGER(11),
    email: Sequelize.STRING(20),
    intro: Sequelize.STRING(255),
    last_login_time: Sequelize.DATE,
    last_login_ip: Sequelize.STRING(20),
    state: Sequelize.INTEGER(1),
}, {
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time',
    // (请记住启用paranoid以使其工作)
    // deletedAt: 'delete_time',
    // paranoid: true,
})
//timestamp字段，默认为true，表示数据库中是否会自动更新createdAt和updatedAt字段，false表示不会增加这个字段。
//freezeTableName,默认为true,会自动给表名表示为复数: user => users，为false则表示，使用我设置的表名

//创建表，默认是false，true则是删除原有表，再创建
// Admin.sync({
//     force: false,
// });

Admin.belongsTo(Role);

module.exports = Admin;