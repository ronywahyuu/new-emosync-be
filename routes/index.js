const router = require('express').Router()
const index = require('../controllers')

router.get('/', index.get)

module.exports = router
