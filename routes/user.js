const router = require('express').Router()
const User = require('../models/user')
const { auth } = require('express-oauth2-jwt-bearer')

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
})

router.get('/', checkJwt, async (req, res) => {
  try {
    const { id, meetingId, recognitionId } = req.query
    const data = await User.find({
      ...(id && { _id: id }),
      ...(meetingId && { meetingId }),
      ...(recognitionId && { recognitionId }),
    })
      .select('-meetings -recognitions')
      .sort({ createdAt: 'desc' })
    if (!data.length) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data })
  } catch (err) {
    console.log(err)
  }
})

router.get('/:id', checkJwt, async (req, res) => {
  try {
    const { id } = req.params
    const data = await User.findById(id).select('-meetings -recognitions')
    if (!data) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data })
  } catch (err) {
    console.log(err)
  }
})

router.post('/', checkJwt, async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (user) return res.status(200).send({ data: user })
    const data = await User.findOneAndUpdate({ email }, req.body, {
      upsert: true,
      new: true,
    })
    if (!data) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data })
  } catch (err) {
    console.log(err)
  }
})

router.put('/', checkJwt, async (req, res) => {
  try {
    const { sub: userId } = req.auth.payload
    const user = await User.findOne({ userId })
    const data = await User.findOneAndUpdate({ email: user.email }, req.body, {
      upsert: true,
      new: true,
    })
    if (!data) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data })
  } catch (err) {
    console.log(err)
  }
})

router.delete('/:id', checkJwt, async (req, res) => {
  try {
    const { id } = req.params
    const data = await User.findById(id)
    if (!data) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    await data.remove()
    return res.status(200).send({ data })
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
