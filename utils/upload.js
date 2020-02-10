const multer = require('@koa/multer')
const fs = require('fs')
const path = require('path')
const dayjs = require('dayjs')

// 检验文件夹是否存在并创建
const syncDir = dir => {
    const pathArr = dir.split('/');
    let _path = '';
    for (let i = 0; i < pathArr.length; i++) {
        if (pathArr[i]) {
            _path += `/${pathArr[i]}`;
            if (!fs.existsSync(_path)) {
                fs.mkdirSync(_path);
            }
        }
    }
}

//配置
const storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        const dir = path.resolve(__dirname, '../upload/' + dayjs().format('YYYY-MM-DD'));
        syncDir(dir);
        cb(null, dir)
    },
    //修改文件名称
    filename: function (req, file, cb) {
        let type = file.originalname.split('.')[1];
        cb(null, `${file.fieldname}-${Date.now().toString(16)}.${type}`)
    },
    // fileFilter: function(req, file, cb){
    //     // 限制文件上传类型，仅可上传jpg/png格式图片
    //     if(['image/png', 'image/jpg', 'video/mp4'].includes(file.mimetype)){
    //         cb(null, true)
    //     } else {
    //         cb(null, false)
    //     }
    // }
})
//文件上传限制
const limits = {
    fields: 10, // 非文件字段的数量
    fileSize: 100 * 1024 * 1024, // 文件大小 100M
    files: 9 // 文件数量
}
//加载配置
const upload = multer({ storage, limits });

module.exports = upload;