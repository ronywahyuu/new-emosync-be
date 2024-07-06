const router = require('express').Router()
// const auth = require('../middleware/auth')
const _facialInterventionGif = require('../controllers/facialInterventionGif')

router.get('/giphy', _facialInterventionGif.getListFacialInterventionGifGiphy)

router.get('/random', _facialInterventionGif.getSingleRandomFacialInterventionGif)

router.get('/default', _facialInterventionGif.getSingleDefaultFacialInterventionGif)

router.get('/emotion', _facialInterventionGif.getSingleByTypeOfEmotion)
module.exports = router