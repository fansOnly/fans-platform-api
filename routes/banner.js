
const router = require('koa-router')()

const bannerController = require('../controllers/banner');

router.get('/class/list', bannerController.getBannerClassList)
router.get('/class/detail', bannerController.getBannerClassDetail)
router.post('/class/add', bannerController.addBannerClass)
router.post('/class/update', bannerController.updateBannerClass)
router.post('/class/delete', bannerController.deleteBannerClass)

router.get('/list', bannerController.getBannerList)
router.get('/detail', bannerController.getBannerDetail)
router.post('/add', bannerController.addBanner)
router.post('/update', bannerController.updateBanner)
router.post('/delete', bannerController.deleteBanner)

module.exports = router;