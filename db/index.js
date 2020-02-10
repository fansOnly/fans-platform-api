const Sequelize = require('sequelize');

const dbConfig = require('../config/dbConfig');

const { dbLogger } = require('../utils/logs');

const options = {
    protocol: 'tcp',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false,
        // 可以给表设置别名，为true表示不用复数表名
        freezeTableName: true,
        // 字段以下划线（_）来分割（默认是驼峰命名风格）
        underscored: true
    },
    dialectOptions: { // 去掉时间中带的字母
        dateStrings: true,
        typeCast: true,
        decimalNumbers: true
    },
    timezone: '+08:00',
    logging: function(sql) {
        dbLogger.trace(sql);
    }
};

const sequelize = new Sequelize(`${dbConfig.dialect}://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`, options);

sequelize.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;