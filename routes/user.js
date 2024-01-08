const router = require('express').Router()
const auth = require('../middleware/auth')
const user = require('../controllers/user')

router.get('/', auth, user.get)
router.get('/count', auth, user.getCount)
router.get('/:id', auth, user.getById)
router.get('/userId/:userId', auth, user.getByUserId)
router.get('/:id/overview', auth, user.getOverview)
router.get('/:id/summary', auth, user.getSummary)
router.get('/same-meeting/:emoviewCode', auth, user.getSameMeeting)
router.post('/', auth, user.create)
router.put('/', auth, user.update)
router.delete('/:id', auth, user.remove)

router.get('/personality-form/:userId', auth, user.getIsFormFilledStatus)

module.exports = router
