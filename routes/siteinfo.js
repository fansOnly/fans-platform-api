
const router = require('koa-router')()

const settingController = require('../controllers/siteinfo');

router.get('/detail', settingController.getSetting)
router.post('/update', settingController.updateSetting)

router.get('/hotword/list', settingController.getHotwordList)
router.post('/hotword/add', settingController.addHotword)
router.post('/hotword/delete', settingController.deleteHotword)

router.get('/upload/detail', settingController.getUploadSetting)
router.post('/upload/update', settingController.updateUploadSetting)

module.exports = router;