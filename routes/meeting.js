const router = require('express').Router()
const Meeting = require('../models/meeting')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
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

router.get('/:id', auth, async (req, res) => {
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

router.post('/', auth, async (req, res) => {
  try {
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

router.put('/:id', auth, async (req, res) => {
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

router.delete('/:id', auth, async (req, res) => {
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
