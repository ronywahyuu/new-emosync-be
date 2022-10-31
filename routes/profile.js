const router = require('express').Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
  try {
    const { sub: userId } = req.auth.payload
    const data = await User.findOne({ userId }).select(
      '-meetings -recognitions'
    )
    if (!data) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data })
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
