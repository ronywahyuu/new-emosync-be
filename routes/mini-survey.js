const router = require('express').Router()
const auth = require('../middleware/auth')
const miniSurvey = require('../controllers/miniSurvey')

router.post('/', auth, miniSurvey.create)
router.get('/', auth, miniSurvey.getAll)
router.get('/user', miniSurvey.getByUser)

module.exports = router