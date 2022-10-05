const router = require('express').Router()
const cloudinary = require('../utils/cloudinary')
const Recognition = require('../models/recognition')
const { auth } = require('express-oauth2-jwt-bearer')

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
})

router.post('/', async (req, res) => {
  try {
    const { secure_url } = await cloudinary.uploader.upload(req.body.image)
    const recognition = new Recognition({ ...req.body, image: secure_url })
    await recognition.save()
    return res.status(201).send({ data: recognition })
  } catch (err) {
    console.log(err)
  }
})

router.get('/', checkJwt, async (req, res) => {
  try {
    const { name, meetingId } = req.query
    const recognition = await Recognition.find({
      ...(name && { name }),
      ...(meetingId && { meetingId }),
    }).exec()
    if (!recognition.length) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data: recognition })
  } catch (err) {
    console.log(err)
  }
})

router.get('/meeting-id', checkJwt, async (_, res) => {
  try {
    const recognition = await Recognition.distinct('meetingId').exec()
    if (!recognition.length) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data: recognition })
  } catch (err) {
    console.log(err)
  }
})

router.get('/student-name', checkJwt, async (req, res) => {
  try {
    const { meetingId } = req.query
    const recognition = await Recognition.find({
      ...(meetingId && { meetingId }),
    })
      .distinct('name')
      .exec()
    if (!recognition.length) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data: recognition })
  } catch (err) {
    console.log(err)
  }
})

router.get('/:id', checkJwt, async (req, res) => {
  try {
    const recognition = await Recognition.findById(req.params.id)
    if (!recognition) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data: recognition })
  } catch (err) {
    console.log(err)
  }
})

router.delete('/:id', checkJwt, async (req, res) => {
  try {
    const recognition = await Recognition.findById(req.params.id)
    const public_id = recognition.image.substring(
      recognition.image.indexOf('.jpg') - 20,
      recognition.image.indexOf('.jpg')
    )
    await cloudinary.uploader.destroy(public_id)
    await recognition.remove()
    return res.status(200).send({ data: recognition })
  } catch (err) {
    console.log(err)
  }
})

router.put('/:id', checkJwt, async (req, res) => {
  try {
    const recognition = await Recognition.findById(req.params.id)
    const public_id = recognition.image.substring(
      recognition.image.indexOf('.jpg') - 20,
      recognition.image.indexOf('.jpg')
    )
    await cloudinary.uploader.destroy(public_id)
    const result = await cloudinary.uploader.upload(req.body.image)
    const data = {
      name: req.body.name || recognition.name,
      image: result.secure_url || recognition.image,
    }
    const recognitionUpdated = await Recognition.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    )
    return res.status(200).send({ data: recognitionUpdated })
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
