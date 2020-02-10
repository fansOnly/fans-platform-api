const path = require('path');//引入原生path模块
const log4js = require('koa-log4');//引入koa-log4

log4js.configure({
    appenders: {
        // 访问日志
        access: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log', //通过日期来生成文件
            alwaysIncludePattern: true, //文件名始终以日期区分
            encoding: "utf-8",
            filename: path.join('logs/access/', 'access') //生成文件路径和文件名
        },
        // 系统日志
        // application: {
        //     type: 'dateFile',
        //     pattern: '-yyyy-MM-dd.log', //通过日期来生成文件
        //     alwaysIncludePattern: true, //文件名始终以日期区分
        //     encoding: "utf-8",
        //     filename: path.join('logs/application/', 'application') //生成文件路径和文件名
        // },
        // 错误日志
        error: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log', //通过日期来生成文件
            alwaysIncludePattern: true, //文件名始终以日期区分
            encoding: "utf-8",
            filename: path.join('logs/error/', 'error') //生成文件路径和文件名
        },
        // sql日志
        db: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log', //通过日期来生成文件
            alwaysIncludePattern: true, //文件名始终以日期区分
            encoding: "utf-8",
            filename: path.join('logs/dbsql/', 'db') //生成文件路径和文件名
        },
        out: {
            type: 'console'
        }
    },
    categories: {
        default: { appenders: ['out'], level: 'TRACE' },
        // application: { appenders: ['application'], level: 'DEBUG' },
        access: { appenders: ['access'], level: 'INFO' },
        error: { appenders: ['error'], level: 'ERROR' },
        db: { appenders: ['db'], level: 'TRACE' },
    }
});

exports.accessLogger = () => log4js.koaLogger(log4js.getLogger('access'));
exports.errorLogger = log4js.getLogger('error');
// exports.systemLogger = log4js.getLogger('application');
exports.dbLogger = log4js.getLogger('db');