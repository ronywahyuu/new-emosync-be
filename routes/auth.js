const router = require('express').Router()
const auth = require('../controllers/auth')

router.get('/:authId', auth.get)
router.post('/', auth.create)

module.exports = router
