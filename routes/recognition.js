const router = require('express').Router()
const Meeting = require('../models/meeting')
const User = require('../models/user')
const Recognition = require('../models/recognition')
const cloudinary = require('../utils/cloudinary')
const mongoose = require('mongoose')
const auth = require('../middleware/auth')

router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const [
      meeting,
      recognitionDetail,
      recognitionsOverview,
      recognitionsSummary,
    ] = await Promise.all([
      Meeting.findById(id).select('-users -recognitions').lean(),
      Recognition.aggregate([
        { $match: { meeting: mongoose.Types.ObjectId(id) } },
        {
          $group: {
            _id: { $toString: '$createdAt' },
            neutral: { $avg: '$neutral' },
            happy: { $avg: '$happy' },
            sad: { $avg: '$sad' },
            angry: { $avg: '$angry' },
            fearful: { $avg: '$fearful' },
            disgusted: { $avg: '$disgusted' },
            surprised: { $avg: '$surprised' },
          },
        },
        {
          $project: {
            neutral: { $round: ['$neutral', 2] },
            happy: { $round: ['$happy', 2] },
            sad: { $round: ['$sad', 2] },
            angry: { $round: ['$angry', 2] },
            fearful: { $round: ['$fearful', 2] },
            disgusted: { $round: ['$disgusted', 2] },
            surprised: { $round: ['$surprised', 2] },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Recognition.aggregate([
        {
          $match: { meeting: mongoose.Types.ObjectId(id) },
        },
        {
          $group: {
            _id: null,
            neutral: { $avg: '$neutral' },
            happy: { $avg: '$happy' },
            sad: { $avg: '$sad' },
            angry: { $avg: '$angry' },
            fearful: { $avg: '$fearful' },
            disgusted: { $avg: '$disgusted' },
            surprised: { $avg: '$surprised' },
          },
        },
        {
          $project: {
            neutral: { $round: { $multiply: ['$neutral', 100] } },
            happy: { $round: { $multiply: ['$happy', 100] } },
            sad: { $round: { $multiply: ['$sad', 100] } },
            angry: { $round: { $multiply: ['$angry', 100] } },
            fearful: { $round: { $multiply: ['$fearful', 100] } },
            disgusted: { $round: { $multiply: ['$disgusted', 100] } },
            surprised: { $round: { $multiply: ['$surprised', 100] } },
          },
        },
        { $unset: ['_id'] },
      ]),
      Recognition.aggregate([
        {
          $match: { meeting: mongoose.Types.ObjectId(id) },
        },
        {
          $group: {
            _id: null,
            positive: { $sum: { $add: ['$happy', '$surprised'] } },
            negative: {
              $sum: { $add: ['$sad', '$angry', '$fearful', '$disgusted'] },
            },
            count: {
              $sum: {
                $add: [
                  '$happy',
                  '$sad',
                  '$angry',
                  '$fearful',
                  '$disgusted',
                  '$surprised',
                ],
              },
            },
          },
        },
        {
          $project: {
            positive: {
              $cond: [
                { $eq: ['$count', 0] },
                0,
                {
                  $round: {
                    $multiply: [{ $divide: ['$positive', '$count'] }, 100],
                  },
                },
              ],
            },
            negative: {
              $cond: [
                { $eq: ['$count', 0] },
                0,
                {
                  $round: {
                    $multiply: [{ $divide: ['$negative', '$count'] }, 100],
                  },
                },
              ],
            },
          },
        },
        { $unset: ['_id', 'count'] },
      ]),
    ])
    const labelsOverview = [
      'Neutral',
      'Happy',
      'Sad',
      'Angry',
      'Fearful',
      'Disgusted',
      'Surprised',
    ]
    const labelsSummary = ['Positive', 'Negative']
    if (!meeting) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({
      data: {
        meeting: {
          ...meeting,
          recognitionsOverview: {
            labels: labelsOverview,
            datas: Object.values(recognitionsOverview[0]),
          },
          recognitionsSummary: {
            labels: labelsSummary,
            datas: Object.values(recognitionsSummary[0]),
          },
          recognitionsDetail: {
            labels: recognitionDetail.map(({ _id }) => _id),
            neutral: recognitionDetail.map(({ neutral }) => neutral),
            happy: recognitionDetail.map(({ happy }) => happy),
            sad: recognitionDetail.map(({ sad }) => sad),
            angry: recognitionDetail.map(({ angry }) => angry),
            fearful: recognitionDetail.map(({ fearful }) => fearful),
            disgusted: recognitionDetail.map(({ disgusted }) => disgusted),
            surprised: recognitionDetail.map(({ surprised }) => surprised),
          },
        },
      },
    })
  } catch (err) {
    console.log(err)
  }
})

router.get('/:id/:userId', auth, async (req, res) => {
  try {
    const { id, userId } = req.params
    const [
      meeting,
      user,
      recognitionDetail,
      recognitionsOverview,
      recognitionsSummary,
    ] = await Promise.all([
      Meeting.findById(id).select('-users -recognitions').lean(),
      User.findById(userId).select('-meetings -recognitions').lean(),
      Recognition.find({ meeting: id, user: userId })
        .select('-meeting -user')
        .lean(),
      Recognition.aggregate([
        {
          $match: {
            meeting: mongoose.Types.ObjectId(id),
            user: mongoose.Types.ObjectId(userId),
          },
        },
        {
          $group: {
            _id: null,
            neutral: { $avg: '$neutral' },
            happy: { $avg: '$happy' },
            sad: { $avg: '$sad' },
            angry: { $avg: '$angry' },
            fearful: { $avg: '$fearful' },
            disgusted: { $avg: '$disgusted' },
            surprised: { $avg: '$surprised' },
          },
        },
        {
          $project: {
            neutral: { $round: { $multiply: ['$neutral', 100] } },
            happy: { $round: { $multiply: ['$happy', 100] } },
            sad: { $round: { $multiply: ['$sad', 100] } },
            angry: { $round: { $multiply: ['$angry', 100] } },
            fearful: { $round: { $multiply: ['$fearful', 100] } },
            disgusted: { $round: { $multiply: ['$disgusted', 100] } },
            surprised: { $round: { $multiply: ['$surprised', 100] } },
          },
        },
        { $unset: ['_id'] },
      ]),
      Recognition.aggregate([
        {
          $match: {
            meeting: mongoose.Types.ObjectId(id),
            user: mongoose.Types.ObjectId(userId),
          },
        },
        {
          $group: {
            _id: null,
            positive: { $sum: { $add: ['$happy', '$surprised'] } },
            negative: {
              $sum: { $add: ['$sad', '$angry', '$fearful', '$disgusted'] },
            },
            count: {
              $sum: {
                $add: [
                  '$happy',
                  '$sad',
                  '$angry',
                  '$fearful',
                  '$disgusted',
                  '$surprised',
                ],
              },
            },
          },
        },
        {
          $project: {
            positive: {
              $cond: [
                { $eq: ['$count', 0] },
                0,
                {
                  $round: {
                    $multiply: [{ $divide: ['$positive', '$count'] }, 100],
                  },
                },
              ],
            },
            negative: {
              $cond: [
                { $eq: ['$count', 0] },
                0,
                {
                  $round: {
                    $multiply: [{ $divide: ['$negative', '$count'] }, 100],
                  },
                },
              ],
            },
          },
        },
        { $unset: ['_id', 'count'] },
      ]),
    ])
    const labelsOverview = [
      'Neutral',
      'Happy',
      'Sad',
      'Angry',
      'Fearful',
      'Disgusted',
      'Surprised',
    ]
    const labelsSummary = ['Positive', 'Negative']
    if (!meeting || !user) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({
      data: {
        user,
        meeting: {
          ...meeting,
          recognitionsOverview: {
            labels: labelsOverview,
            datas: Object.values(recognitionsOverview[0]),
          },
          recognitionsSummary: {
            labels: labelsSummary,
            datas: Object.values(recognitionsSummary[0]),
          },
          recognitionsDetail: {
            labels: recognitionDetail.map(({ createdAt }) => createdAt),
            neutral: recognitionDetail.map(({ neutral }) => neutral),
            happy: recognitionDetail.map(({ happy }) => happy),
            sad: recognitionDetail.map(({ sad }) => sad),
            angry: recognitionDetail.map(({ angry }) => angry),
            fearful: recognitionDetail.map(({ fearful }) => fearful),
            disgusted: recognitionDetail.map(({ disgusted }) => disgusted),
            surprised: recognitionDetail.map(({ surprised }) => surprised),
            image: recognitionDetail.map(({ image }) => image),
          },
        },
      },
    })
  } catch (err) {
    console.log(err)
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { sub: userId } = req.auth.payload
    const { meetingId, image, ...rest } = req.body
    const [user, meeting] = await Promise.all([
      User.findOne({ userId }),
      Meeting.findOne({ meetingId }),
    ])
    const { secure_url } = await cloudinary.uploader.upload(image)
    const recognition = new Recognition({
      ...rest,
      image: secure_url,
      meeting: meeting.id,
      user: user.id,
    })
    const data = await recognition.save()
    await Promise.all([
      User.findByIdAndUpdate(user.id, {
        $push: {
          recognitions: data.id,
          ...(!user.meetings.includes(meeting.id) && {
            meetings: meeting.id,
          }),
        },
      }),
      Meeting.findByIdAndUpdate(meeting.id, {
        $push: {
          recognitions: data.id,
          ...(!meeting.users.includes(user.id) && { users: user.id }),
        },
      }),
    ])
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
