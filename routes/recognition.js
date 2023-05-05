const router = require('express').Router()
const auth = require('../middleware/auth')
const recognition = require('../controllers/recognition')

router.get('/overview', auth, recognition.getOverview)
router.get('/summary', auth, recognition.getSummary)
router.get('/:emoviewCode', auth, recognition.get)
router.get('/:emoviewCode/:userId', auth, recognition.getById)
router.post('/reports/:emoviewCode', auth, recognition.getByIds)
router.post('/archive', auth, recognition.getArchive)
router.post('/', auth, recognition.create)
router.put('/:emoviewCode', auth, recognition.update)
router.delete('/:emoviewCode', auth, recognition.remove)

module.exports = router
