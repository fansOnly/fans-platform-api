
const router = require('koa-router')()

const articleController = require('../controllers/article');

router.get('/class/list', articleController.getSectionList)
router.get('/class/index', articleController.getSectionIndex)
router.get('/class/tree', articleController.getSectionTree)
router.get('/class/detail', articleController.getSectionDetail)
router.post('/class/add', articleController.addSection)
router.post('/class/update', articleController.updateSection)
router.post('/class/delete', articleController.deleteSection)

router.get('/list', articleController.getArticleList)
router.get('/detail', articleController.getArticleDetail)
router.post('/add', articleController.addArticle)
router.post('/update', articleController.updateArticle)
router.post('/delete', articleController.deleteArticle)
router.get('/recycle', articleController.getRecycleList)
router.post('/clear', articleController.clearArticle)
router.post('/restore', articleController.restoreArticle)
router.post('/clearAll', articleController.clearAllArticle)

module.exports = router;