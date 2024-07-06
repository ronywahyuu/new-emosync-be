const router = require('express').Router()
const auth = require('../middleware/auth')
const feedback = require('../controllers/feedback')

router.post('/', auth, feedback.create)
router.get('/', auth, feedback.getAll)

module.exports = router