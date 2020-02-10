/**
 * 判断是否空对象
 * @param {object} obj
 * @returns {Boolean}
 */
const isEmptyObject = obj => {
	if (Object.prototype.toString.call(obj) !== '[object Object]') {
		throw new TypeError('object needed.')
	}
	return Object.keys(obj).length == 0;
}

/**
 * 获取客户端ip
 * @param {*} req 
 */
const getClientIp = req => {
    return (req.headers['x-forwarded-for'] || '').split(',')[0] || req.ip;
}

module.exports = {
    isEmptyObject,
    getClientIp,
}