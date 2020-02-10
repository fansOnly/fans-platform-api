const Sequelize = require('sequelize')
const sequelize = require('../db')

const Member = sequelize.define('member', {
    username: Sequelize.STRING(255),
    password: Sequelize.STRING(255),
    nickname: Sequelize.STRING(255),
    avatar: Sequelize.STRING(255),
    phone: Sequelize.STRING(20),
    email: Sequelize.STRING(255),
    gender: Sequelize.INTEGER(1),
    intro: Sequelize.STRING(255),
    last_login_time: Sequelize.DATE,
    last_login_ip: Sequelize.STRING(255),
    state: Sequelize.INTEGER(11),
}, {
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time',
})
//timestamp字段，默认为true，表示数据库中是否会自动更新createdAt和updatedAt字段，false表示不会增加这个字段。

//创建表，默认是false，true则是删除原有表，再创建
// Member.sync({
//     force: false,
// });

module.exports = Member;