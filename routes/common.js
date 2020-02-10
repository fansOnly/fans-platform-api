
const router = require('koa-router')()
const upload = require('../utils/upload')
const path = require('path')
const Asset = require('../models/asset')

router.post('/upload', async (ctx, next) => {
    try {
        await upload.single('file')(ctx, next)
        // 手动转换传路径位相对路径
        ctx.file.src = ctx.file.destination.replace(path.join(__dirname, '../'), '')
            
        await Asset.create({
            filename: ctx.file.filename,
            originalname: ctx.file.originalname,
            path: ctx.file.src + '/' + ctx.file.filename,
            size: ctx.file.size,
            mimetype: ctx.file.mimetype,
            suffix: ctx.file.originalname.split('.')[ctx.file.originalname.split('.').length-1]
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '新增资源上传记录成功!',
                data: ctx.file
            }
        }).catch(err => {
            console.log('add upload record', err);
            ctx.body = {
                code: 500,
                msg: '新增资源上传记录失败！',
            }
        })
    } catch (err) {
        console.log('upload error', err);
        ctx.body = {
            code: 500,
            err
        }
    }
})

router.post('/uploadMulti', async (ctx, next) => {
    try {
        await upload.array('files', 9)(ctx, next)
        // 手动转换传路径位相对路径
        let datas = [];
        ctx.files.map(file => {
            file.src = file.destination.replace(path.join(__dirname, '../'), '')
            const item = {
                filename: file.filename,
                originalname: file.originalname,
                path: file.src + '/' + file.filename,
                size: file.size,
                mimetype: file.mimetype,
                suffix: ctx.file.originalname.split('.')[ctx.file.originalname.split('.').length-1]
            }
            datas.push(item);
        })
            
        await Asset.bulkCreate(datas).then(() => {
            ctx.body = {
                code: 200,
                msg: '新增资源上传记录成功!',
                data: ctx.files
            }
        }).catch(err => {
            console.log('add upload record', err);
            ctx.body = {
                code: 500,
                msg: '新增资源上传记录失败！',
            }
        })
    } catch (err) {
        console.log('upload error', err);
        ctx.body = {
            code: 500,
            err
        }
    }
})

router.post('/froala/upload', async (ctx, next) => {
    try {
        await upload.single('file')(ctx, next)
        // 手动转换传路径位相对路径
        ctx.file.src = ctx.file.destination.replace(path.join(__dirname, '../'), '')
            
        await Asset.create({
            filename: ctx.file.filename,
            originalname: ctx.file.originalname,
            path: ctx.file.src + '/' + ctx.file.filename,
            size: ctx.file.size,
            mimetype: ctx.file.mimetype,
            suffix: ctx.file.originalname.split('.')[ctx.file.originalname.split('.').length-1]
        }).then(() => {
            ctx.body = {
                code: 200,
                msg: '新增资源上传记录成功!',
                link: ctx.request.protocol + '://' + ctx.request.host + '/' + ctx.file.src + '/' + ctx.file.filename
            }
        }).catch(err => {
            console.log('add upload record', err);
            ctx.body = {
                code: 500,
                msg: '新增资源上传记录失败！',
            }
        })
    } catch (err) {
        console.log('upload error', err);
        ctx.body = {
            code: 500,
            err
        }
    }
})

// router.post('/upload', async (ctx, next) => {
//     await upload.single('file')(ctx, next)
//     .then(res => {
//         // 手动转换传路径位相对路径
//         ctx.file.src = ctx.file.destination.replace(path.join(__dirname, '../'), '')
//         ctx.body = {
//             code: 200,
//             data: ctx.file
//         }
//     })
//     .catch(err => {
//         console.log('upload error', err);
//         ctx.body = {
//             code: 500,
//             err
//         }
//     })
// })

// router.post('/uploadMulti', async (ctx, next) => {
//     await upload.array('files', 9)(ctx, next)
//     .then(res => {
//         // 手动转换传路径位相对路径
//         ctx.files.map(file => {
//             file.src = file.destination.replace(path.join(__dirname, '../'), '')
//         })
//         ctx.body = {
//             code: 200,
//             data: ctx.files
//         }
//     })
//     .catch(err => {
//         console.log('upload error', err);
//         ctx.body = {
//             code: 500,
//             err
//         }
//     })
// })

// router.post('/froala/upload', async (ctx, next) => {
//     await upload.single('file')(ctx, next)
//     .then(res => {
//         // 手动转换传路径位相对路径
//         ctx.file.src = ctx.file.destination.replace(path.join(__dirname, '../'), '')
//         ctx.body = {
//             code: 200,
//             // link: ctx.file.src + '/' + ctx.file.filename,
//             link: ctx.request.protocol + '://' + ctx.request.host + '/' + ctx.file.src + '/' + ctx.file.filename
//         }
//     })
//     .catch(err => {
//         console.log('upload error', err);
//         ctx.body = {
//             code: 500,
//             err
//         }
//     })
// })

module.exports = router;