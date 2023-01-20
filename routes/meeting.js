const router = require('express').Router()
const auth = require('../middleware/auth')
const meeting = require('../controllers/meeting')

router.get('/', auth, meeting.get)
router.get('/count', auth, meeting.getCount)
router.get('/:id', auth, meeting.getById)
router.post('/', auth, meeting.create)
router.patch('/:id', auth, meeting.update)
router.patch('/add-participant/:id', auth, meeting.addParticipant)
router.patch('/start/:id', auth, meeting.setStart)
router.delete('/:id', auth, meeting.remove)

module.exports = router
