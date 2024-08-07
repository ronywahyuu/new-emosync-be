const router = require('express').Router()
const auth = require('../middleware/auth')
const _class = require('../controllers/class')

router.get('/', auth, _class.get)
router.get('/:meetCode', auth, _class.getByMeetCode)
router.post('/', auth, _class.create)
router.patch('/:id', auth, _class.update)
router.delete('/:id', auth, _class.remove)

// get class by user who joined
// router.get('/user/:userId', auth, _class.getByUserId)

module.exports = router
