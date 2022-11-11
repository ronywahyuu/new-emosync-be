const mongoose = require('mongoose')
const Recognition = require('../models/recognition')
const Meeting = require('../models/meeting')
const User = require('../models/user')
const cloudinary = require('../utils/cloudinary')
const io = require('../utils/socketio')

const get = async (id, limit) => {
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
      { $sort: { _id: -1 } },
      ...(limit ? [{ $limit: parseInt(limit, 10) }] : []),
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
  if (!meeting) return
  return {
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
  }
}

const getById = async (id, userId, limit) => {
  const [
    meeting,
    user,
    recognitionDetail,
    recognitionsOverview,
    recognitionsSummary,
  ] = await Promise.all([
    Meeting.findById(id).select('-users -recognitions').lean(),
    User.findById(userId).select('-meetings -recognitions').lean(),
    limit
      ? Recognition.aggregate([
          {
            $match: {
              meeting: mongoose.Types.ObjectId(id),
              user: mongoose.Types.ObjectId(userId),
            },
          },
          { $sort: { createdAt: -1 } },
          { $limit: parseInt(limit, 10) },
          { $sort: { createdAt: 1 } },
        ])
      : Recognition.find({
          meeting: id,
          user: userId,
        }).select('-meeting -user'),
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
  if (!meeting || !user) return
  return {
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
  }
}

const getOverview = async (role, createdBy) => {
  const getMeetingIds = async () => {
    const currentMeeting = await Meeting.find({
      ...(!role.includes('superadmin') && { createdBy }),
    })
      .select('_id')
      .lean()
    return currentMeeting.map(({ _id }) => _id)
  }
  const data = await Recognition.aggregate([
    {
      $match: { meeting: { $in: await getMeetingIds() } },
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
  ])
  const labels = [
    'Neutral',
    'Happy',
    'Sad',
    'Angry',
    'Fearful',
    'Disgusted',
    'Surprised',
  ]
  return { labels, datas: Object.values(data[0] || {}) }
}

const getSummary = async (role, createdBy) => {
  const getMeetingIds = async () => {
    const currentMeeting = await Meeting.find({
      ...(!role.includes('superadmin') && { createdBy }),
    })
      .select('_id')
      .lean()
    return currentMeeting.map(({ _id }) => _id)
  }
  const data = await Recognition.aggregate([
    {
      $match: { meeting: { $in: await getMeetingIds() } },
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
  ])
  const labels = ['Positive', 'Negative']
  return { labels, datas: Object.values(data[0] || {}) }
}

const create = async (userId, meetingId, image, rest) => {
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
  if (!data) return
  const socket = io()
  socket.emit('RECOGNITION_DATA_ADDED')
  return data
}

const update = async (id, isStart) => {
  const data = await Meeting.findByIdAndUpdate(
    id,
    {
      isStart,
      ...(isStart && { startedAt: new Date() }),
    },
    { new: true }
  ).select('-recognitions -users')
  if (!data) return
  return data
}

const remove = async (id) => {
  const data = await Recognition.findById(id)
  if (!data) return
  const public_id = data.image.substring(
    data.image.indexOf('.jpg') - 20,
    data.image.indexOf('.jpg')
  )
  await cloudinary.uploader.destroy(public_id)
  await data.remove()
  return data
}

module.exports = {
  get,
  getById,
  getOverview,
  getSummary,
  create,
  update,
  remove,
}
