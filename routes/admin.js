
const router = require('koa-router')()

const adminController = require('../controllers/admin');

router.get('/index', adminController.getUserList)
router.get('/detail', adminController.getUser)
router.post('/add', adminController.addUser)
router.post('/update', adminController.updateUser)
router.post('/delete', adminController.deleteUser)


router.get('/permission/index', adminController.getPermissionList)

router.get('/getpass', adminController.getUserPass)
router.post('/changepass', adminController.updateUserPass)

// router.prefix('/api');

module.exports = router;