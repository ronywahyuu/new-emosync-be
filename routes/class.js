const router = require('express').Router()
const auth = require('../middleware/auth')
const _class = require('../controllers/class')

router.get('/', auth, _class.get)
router.post('/', auth, _class.create)

module.exports = router