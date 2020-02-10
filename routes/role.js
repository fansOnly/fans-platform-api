
const router = require('koa-router')()

const roleController = require('../controllers/role');

router.get('/index', roleController.getRoleList)
router.get('/detail', roleController.getRole)
router.post('/add', roleController.addRole)
router.post('/update', roleController.updateRole)
router.post('/delete', roleController.deleteRole)

module.exports = router;