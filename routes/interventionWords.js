const router = require('express').Router()
const auth = require('../middleware/auth')
const _interventionWords = require('../controllers/interventionWords')


router.get('/random', auth,  _interventionWords.getRandomInterventionWords)

module.exports = router