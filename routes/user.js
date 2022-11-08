const router = require('express').Router()
const auth = require('../middleware/auth')
const user = require('../controllers/user')

router.get('/', auth, user.get)
router.get('/:id', auth, user.getById)
router.post('/', auth, user.create)
router.put('/', auth, user.update)
router.delete('/:id', auth, user.remove)

module.exports = router
