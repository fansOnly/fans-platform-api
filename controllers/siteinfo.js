const Setting = require('../models/siteinfo');
const Hotword = require('../models/hotword');

const settingController = {
    getSetting: async ctx => {
        await Setting.findOne({
            where: { id: 1 },
            attributes: ['base_info', 'advance_info', 'seo_info']
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '获取网站设置成功!',
                data: res
            }
        }).catch(err => {
            console.log('getSetting', err);
            ctx.body = {
                code: 500,
                msg: '获取网站设置失败!'
            }
        });
    },
    updateSetting: async ctx => {
        const params = ctx.request.body;
        await Setting.update({
            ...params
        }, {
            where: { id: 1}
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '更新网站设置成功!',
            }
        }).catch(err => {
            console.log('updateSetting', err);
            ctx.body = {
                code: 500,
                msg: '更新网站设置失败!'
            }
        })
    },
    getHotwordList: async ctx => {
        await Hotword.findAndCountAll({
            where: {},
            order: [['id', 'DESC']],
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '获取热词成功!',
                data: res.rows,
                total: res.count
            }
        }).catch(err => {
            console.log('err', err);
            ctx.body = {
                code: 500,
                msg: '获取热词失败!'
            }
        })
    },
    addHotword: async ctx => {
        const params = ctx.request.body;
        await Hotword.create({
            ...params
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '新增热词成功!',
            }
        }).catch(err => {
            console.log('addHotword', err);
            ctx.body = {
                code: 500,
                msg: '新增热词失败！',
            }
        })
    },
    deleteHotword: async ctx => {
        const { id } = ctx.request.body;
        await Hotword.destroy({
            where: {
                id: id
            },
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '删除热词成功!'
            }
        }).catch(err => {
            console.log('deleteHotword', err);
            ctx.body = {
                code: 500,
                msg: '删除热词失败!'
            }
        })
    },
    getUploadSetting: async ctx => {
        await Setting.findOne({
            where: {id: 1},
            attributes: ['upload_info']
        }).then(res => {
            ctx.body = {
                code: 200,
                msg: '获取上传设置成功!',
                data: res
            }
        }).catch(err => {
            console.log('getUploadSetting', err);
            ctx.body = {
                code: 500,
                msg: '获取上传设置失败!'
            }
        })
    },
    updateUploadSetting: async ctx => {
        const params = ctx.request.body;
        await Setting.update({
            upload_info: params
        }, {
            where: {id: 1}
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '更新上传设置成功!'
            }
        }).catch(err => {
            console.log('updateUploadSetting', err);
            ctx.body = {
                code: 500,
                msg: '更新上传设置失败!'
            }
        })
    },
}

module.exports = settingController;