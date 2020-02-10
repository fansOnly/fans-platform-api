
const router = require('koa-router')()

const loginController = require('../controllers/login');

router.post('/', loginController.login)

module.exports = router;