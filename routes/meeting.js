const router = require('express').Router()
const Meeting = require('../models/meeting')
const { auth } = require('express-oauth2-jwt-bearer')

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
})

router.get('/', checkJwt, async (req, res) => {
  try {
    const { userId, recognitionId } = req.query
    const data = await Meeting.find({
      ...(userId && { userId }),
      ...(recognitionId && { recognitionId }),
    })
      .select('-recognitions -users')
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
    const data = await Meeting.findById(id).select('-recognitions -users')
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
    console.log(req.body)
    const data = new Meeting(req.body)
    await data.save()
    if (!data) {
      return res.status(404).send({ message: "Data can't be saved!" })
    }
    return res.status(201).send({ data })
  } catch (err) {
    console.log(err)
  }
})

router.put('/:id', checkJwt, async (req, res) => {
  try {
    const { id } = req.params
    const data = await Meeting.findByIdAndUpdate(id, req.body, {
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
    const data = await Meeting.findById(id)
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
