
const router = require('koa-router')()

const productController = require('../controllers/product');

router.get('/category/list', productController.getCategoryList)
router.get('/category/index', productController.getCategoryIndex)
router.get('/category/tree', productController.getCategoryTree)
router.get('/category/detail', productController.getCategoryDetail)
router.post('/category/add', productController.addCategory)
router.post('/category/update', productController.updateCategory)
router.post('/category/delete', productController.deleteCategory)

router.get('/list', productController.getProductList)
router.get('/detail', productController.getProductDetail)
router.post('/add', productController.addProduct)
router.post('/update', productController.updateProduct)
router.post('/delete', productController.deleteProduct)
router.get('/recycle', productController.getRecycleList)
router.post('/clear', productController.clearProduct)
router.post('/restore', productController.restoreProduct)
router.post('/clearAll', productController.clearAllProduct)

module.exports = router;