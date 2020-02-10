const crypto = require('crypto');

const MD5 = (secret, type='hex') => {
    let md5 = crypto.createHash("md5"); // 创建 md5
    let md5Sum = md5.update(secret); // update 加密
    return md5Sum.digest(type);
}

module.exports = {
    MD5
};