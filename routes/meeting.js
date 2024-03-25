const router = require('express').Router()
const auth = require('../middleware/auth')
const meeting = require('../controllers/meeting')

router.get('/', auth, meeting.get)
router.get('/:userId', auth, meeting.getByUserId)
router.get('/count', auth, meeting.getCount)
// router.get('/:id', auth, meeting.getById)
router.get('/class/:meetCode', auth, meeting.getByMeetCode) // get class list
router.get('/class/meeting/:emoviewCode', auth, meeting.getByEmoviewCode) // get meetings in class
router.post('/', auth, meeting.create)
router.patch('/class/meeting/:emoviewCode', auth, meeting.update)
router.patch('/add-participant/:emoviewCode', auth, meeting.addParticipant)
router.patch('/start/:emoviewCode', auth, meeting.setStart)
router.delete('/class/meeting/:emoviewCode', auth, meeting.remove)

module.exports = router
