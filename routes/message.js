
const router = require('koa-router')()

const messageController = require('../controllers/message');

router.get('/list', messageController.getMessageList)
router.get('/detail', messageController.getMessage)
router.post('/update', messageController.updateMessage)
router.post('/delete', messageController.deleteMessage)

module.exports = router;