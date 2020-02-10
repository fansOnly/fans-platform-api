const Koa = require('koa');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const session = require("koa-session2");
const Store = require("./store");
const jwt = require('koa-jwt');
const compress = require('koa-compress');
const onerror = require('koa-onerror');
const { accessLogger, systemLogger, errorLogger } = require('./utils/logs');
const staticFiles = require('koa-static');
const path = require('path');
const routes = require('./routes');

const app = new Koa();

// 跨域设置
app.use(cors({
    // origin: function(ctx) { //设置允许来自指定域名请求
    //     if (/^\/api/.test(ctx.url)) {
    //         return '*'; // 允许来自所有域名请求
    //     }
    //     return 'http://localhost:8088'; //只允许http://localhost:8080这个域名的请求
    // },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
    maxAge: 100,
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous', 'x-requested-with'],
}));

// 解析post请求参数
app.use(bodyParser());

// 设置静态资源访问路径
app.use(staticFiles(path.join(__dirname + '')));

// session+redis
app.keys = ['jwt-user-secret'];
app.use(session({
    store: new Store({
        key: 'koa:sess',   //cookie key (default is koa:sess)
        maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
        overwrite: true,  //是否可以overwrite    (默认default true)
        httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
        signed: true,   //签名默认true
        rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
        renew: false,  //(boolean) renew session when session is nearly expired,
    })
}));

// 开启token验证
app.use(
    jwt({ secret: 'jwt-user-secret' })
    .unless({ path: [/^\/upload/, /^\/api\/login/] })
);

// gzip压缩
app.use(compress({
    threshold: 2048
}));

// 路由
app.use(routes.routes(), routes.allowedMethods())

// 开启访问日志
app.use(accessLogger());

// 打印请求日志
// app.use(async (ctx, next) => {
//     const start = new Date()
//     await next()
//     const ms = new Date() - start
//     systemLogger.info(`Process ${ctx.method} ${ctx.url} - ${ms}ms`)
// })

// 开启错误日志
app.on('error', (err, ctx) => {
    errorLogger.error('server error', err)
})

// 开启控制台报错
onerror(app, {});

app.listen(3000, () => {
    console.log('app started at port 3000...');
});