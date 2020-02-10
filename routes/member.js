
const router = require('koa-router')()

const memberController = require('../controllers/member');

router.get('/list', memberController.getMemberList)
router.get('/detail', memberController.getMember)
router.post('/add', memberController.addMember)
router.post('/update', memberController.updateMember)
router.post('/delete', memberController.deleteMember)

module.exports = router;