const Sequelize = require('sequelize')
const sequelize = require('../db')

const Message = sequelize.define('message', {
    member_id: Sequelize.INTEGER(11),
    nickname: Sequelize.STRING(255),
    phone: Sequelize.STRING(20),
    email: Sequelize.STRING(255),
    content: Sequelize.TEXT,
    reply_admin_id: Sequelize.INTEGER(11),
    reply: Sequelize.TEXT,
    reply_time: Sequelize.DATE,
    more: Sequelize.JSON,
    state: Sequelize.INTEGER(11),
}, {
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time',
})
//timestamp字段，默认为true，表示数据库中是否会自动更新createdAt和updatedAt字段，false表示不会增加这个字段。

//创建表，默认是false，true则是删除原有表，再创建
// Message.sync({
//     force: false,
// });

module.exports = Message;