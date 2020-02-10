const Sequelize = require('sequelize')
const sequelize = require('../db')

const Product = sequelize.define('product', {
    sortnum: Sequelize.INTEGER(11),
    admin_id: Sequelize.INTEGER(11),
    category_id: Sequelize.INTEGER(11),
    title: Sequelize.STRING(20),
    subtitle: Sequelize.STRING(20),
    price: Sequelize.STRING(20),
    views: Sequelize.INTEGER(11),
    intro: Sequelize.STRING(255),
    content: Sequelize.TEXT,
    url: Sequelize.STRING(255),
    thumbnail: Sequelize.JSON,
    photos: Sequelize.JSON,
    file: Sequelize.JSON,
    tags: Sequelize.JSON,
    state: Sequelize.INTEGER(11),
    publish_time: Sequelize.DATE
}, {
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time',
    // (请记住启用paranoid以使其工作)
    deletedAt: 'delete_time',
    paranoid: true,
})

//创建表，默认是false，true则是删除原有表，再创建
// Product.sync({
//     force: false,
// });

module.exports = Product;