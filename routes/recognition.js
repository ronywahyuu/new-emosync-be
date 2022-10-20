const router = require('express').Router()
const Meeting = require('../models/meeting')
const User = require('../models/user')
const Recognition = require('../models/recognition')
const cloudinary = require('../utils/cloudinary')
const auth = require('../middleware/auth')

router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const data = await Meeting.findById(id)
      .select('-users')
      .populate('recognitions')
    if (!data) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data })
  } catch (err) {
    console.log(err)
  }
})

router.get('/:id/:userId', auth, async (req, res) => {
  try {
    const { id, userId } = req.params
    const data = await Meeting.findById(id)
      .populate({
        path: 'users',
        match: { _id: userId },
        select: '-recognitions -meetings',
      })
      .populate({ path: 'recognitions', match: { user: userId } })
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
    const { sub: userId } = req.auth.payload
    const { meetingId, image, ...rest } = req.body
    const user = await User.findOne({ userId })
    const meeting = await Meeting.findOne({ meetingId })
    const { secure_url } = await cloudinary.uploader.upload(image)
    const recognition = new Recognition({
      ...rest,
      image: secure_url,
      meeting: meeting.id,
      user: user.id,
    })
    const data = await recognition.save()
    user.recognitions = user.recognitions.concat(data.id)
    meeting.recognitions = meeting.recognitions.concat(data.id)
    if (!meeting.users.includes(user.id)) {
      meeting.users = meeting.users.concat(user.id)
    }
    if (!user.meetings.includes(meeting.id)) {
      user.meetings = user.meetings.concat(meeting.id)
    }
    await user.save()
    await meeting.save()
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
    const { isStart } = req.body
    const data = await Meeting.findByIdAndUpdate(
      id,
      {
        isStart,
        ...(isStart && { startedAt: new Date() }),
      },
      { new: true }
    ).select('-recognitions -users')
    if (!data) {
      return res.status(404).send({ message: "Data can't be saved!" })
    }
    return res.status(200).send({ data })
  } catch (err) {
    console.log(err)
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const data = await Recognition.findById(id)
    if (!data) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    const public_id = data.image.substring(
      data.image.indexOf('.jpg') - 20,
      data.image.indexOf('.jpg')
    )
    await cloudinary.uploader.destroy(public_id)
    await data.remove()
    return res.status(200).send({ data })
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
