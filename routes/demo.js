
const router = require('koa-router')()

router.get('/', function (ctx, next) {
    let url = ctx.url;
    //从request中获取GET请求
    let request = ctx.request;
    let req_query = request.query;
    let req_querystring = request.querystring;
    //从上下文中直接获取
    let ctx_query = ctx.query;
    let ctx_querystring = ctx.querystring;
    ctx.body = {
        url,
        req_query,
        req_querystring,
        ctx_query,
        ctx_querystring
    }
})

router.post('/post', function (ctx, next) {
    let url = ctx.url;
    //从request中获取GET请求
    let req_query = ctx.request.body;
    ctx.body = {
        url,
        req_query,
    }
})

module.exports = router