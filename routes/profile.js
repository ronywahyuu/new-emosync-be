const router = require('express').Router()
const auth = require('../middleware/auth')
const profile = require('../controllers/profile')

router.get('/', auth, profile.get)

module.exports = router
