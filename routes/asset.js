
const router = require('koa-router')()

const assetController = require('../controllers/asset')

router.get('/list', assetController.getAssetList)
router.post('/delete', assetController.deleteAsset)

module.exports = router;