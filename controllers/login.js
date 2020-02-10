const Admin = require('../models/admin');
const jsonwebtoken = require('jsonwebtoken');
const dayjs = require('dayjs');
const { MD5 } = require('../utils/secret')
const { getClientIp } = require('../utils/util');

const loginController = {
    login: async ctx => {
        const { username, password } = ctx.request.body;
        const user = await Admin.findOne({
            where: {
                username: username
            },
            attributes: ['id', 'username', 'password', 'nickname', 'role_id', 'avatar', 'state']
        })
        if (user) {
            if (user.state == 0) {
                ctx.body = {
                    code: 500,
                    msg: '该账号已被冻结!',
                }
            }
            if (user.password === MD5(password)) {
                const res = await Admin.update({
                    last_login_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    // last_login_ip: ctx.request.ip,
                    last_login_ip: getClientIp(ctx),
                }, {
                    where: {
                        id: user.id
                    }
                })
                if (res == 1) {
                    // 生成 token 返回给客户端
                    const token = jsonwebtoken.sign({
                        data: user.id,
                        // 设置 token 过期时间
                        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
                    }, 'jwt-user-secret');
                    // ctx.session.token = token;
                    const userx = {
                        id: user.id,
                        username: user.username,
                        avatar: user.avatar,
                        nickname: user.nickname,
                        role_id: user.role_id,
                    }
                    ctx.body = {
                        code: 200,
                        msg: '登录成功!',
                        token,
                        data: userx
                    }
                } else {
                    ctx.body = {
                        code: 400,
                        msg: '登录失败!'
                    }
                }
            } else {
                ctx.body = {
                    code: 500,
                    msg: '密码错误!',
                }
            }
        } else {
            ctx.body = {
                code: 500,
                msg: '用户不存在!'
            }
        }
    }
}

module.exports = loginController;