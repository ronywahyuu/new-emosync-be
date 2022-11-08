const router = require('express').Router()
const auth = require('../middleware/auth')
const meeting = require('../controllers/meeting')

router.get('/', auth, meeting.get)
router.get('/count', auth, meeting.getCount)
router.get('/:id', auth, meeting.getById)
router.post('/', auth, meeting.create)
router.put('/:id', auth, meeting.update)
router.delete('/:id', auth, meeting.remove)

module.exports = router
