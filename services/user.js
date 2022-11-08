const mongoose = require('mongoose')
const Meeting = require('../models/meeting')
const User = require('../models/user')
const Recognition = require('../models/recognition')

const get = async (createdBy, userRole, role, meetings, recognitions) => {
  const getMeetingIds = async () => {
    const currentMeeting = await Meeting.find({
      ...(!userRole.includes('superadmin') && { createdBy }),
    })
      .select('_id')
      .lean()
    return currentMeeting.map(({ _id }) => _id)
  }
  return await User.find({
    ...(!userRole.includes('superadmin') && {
      meetings: { $in: await getMeetingIds() },
    }),
    ...(role && { role }),
    ...(meetings && { meetings }),
    ...(recognitions && { recognitions }),
  })
    .select('-meetings -recognitions')
    .sort({ createdAt: 'desc' })
}

const getById = async (id) => {
  return await User.findById(id).select('-meetings -recognitions')
}

const getCount = async (userRole, createdBy, role) => {
  const getMeetingIds = async () => {
    const currentMeeting = await Meeting.find({
      ...(!userRole.includes('superadmin') && { createdBy }),
    })
      .select('_id')
      .lean()
    return currentMeeting.map(({ _id }) => _id)
  }
  return await User.count({
    ...(!userRole.includes('superadmin') && {
      meetings: { $in: await getMeetingIds() },
    }),
    ...(role && { role }),
  })
}

const getOverview = async (id, role, createdBy) => {
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
      $match: {
        user: mongoose.Types.ObjectId(id),
        meeting: { $in: await getMeetingIds() },
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

const getSummary = async (id, role, createdBy) => {
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
      $match: {
        user: mongoose.Types.ObjectId(id),
        meeting: { $in: await getMeetingIds() },
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
  ])
  const labels = ['Positive', 'Negative']
  return { labels, datas: Object.values(data[0] || {}) }
}

const create = async (body) => {
  const { email } = body
  const user = await User.findOne({ email })
  if (user) return user
  const data = await User.findOneAndUpdate({ email }, body, {
    upsert: true,
    new: true,
  })
  if (!data) return
  return data
}

const update = async (userId, body) => {
  const data = await User.findByIdAndUpdate(userId, body, {
    upsert: true,
    new: true,
  }).select('-meetings -recognitions')
  if (!data) return
  return data
}

const remove = async (id) => {
  const data = await User.findById(id)
  if (!data) return
  return await data.remove()
}

module.exports = {
  get,
  getById,
  getCount,
  getOverview,
  getSummary,
  create,
  update,
  remove,
}
