const router = require('express').Router()
const auth = require('../middleware/auth')
const recognition = require('../controllers/recognition')

router.get('/overview', auth, recognition.getOverview)
router.get('/summary', auth, recognition.getSummary)
router.post('/archive', auth, recognition.getArchive)
router.get('/:id', auth, recognition.get)
router.get('/:id/:userId', auth, recognition.getById)
router.post('/', auth, recognition.create)
router.put('/:id', auth, recognition.update)
router.delete('/:id', auth, recognition.remove)

module.exports = router
