const router = require('express').Router()
const _class = require('../controllers/class')

router.get('/', _class.get)
router.post('/', _class.create)

module.exports = router