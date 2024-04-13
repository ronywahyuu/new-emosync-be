const router = require('express').Router()
const auth = require('../middleware/auth')
const _interventionWords = require('../controllers/interventionWords')


router.get('/', auth, _interventionWords.getListInterventionWords)
router.get('/all', auth, _interventionWords.getListInterventionWords)
router.get('/random', auth, _interventionWords.getRandomInterventionWords)

module.exports = router