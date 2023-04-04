const mongoose = require('mongoose')
const Recognition = require('../models/recognition')
const Meeting = require('../models/meeting')
const User = require('../models/user')
const cloudinary = require('../utils/cloudinary')
const io = require('../utils/socketio')

let recognitionInterval = {}

const get = async ({ id, limit }) => {
  const [
    meeting,
    recognitionDetail,
    recognitionsOverview,
    recognitionsSummary,
  ] = await Promise.all([
    Meeting.findOne({ code: id }),
    Recognition.aggregate([
      { $match: { meetingId: id } },
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
        $match: { meetingId: id },
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
        $match: { meetingId: id },
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
    recognitionStream: [...recognitionDetail],
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
  }
}

const getById = async ({ id, userId, limit }) => {
  const [
    meeting,
    // user,
    recognitionDetail,
    recognitionsOverview,
    recognitionsSummary,
  ] = await Promise.all([
    Meeting.findOne({ code: id }),
    // User.findById(userId).lean(),
    limit
      ? Recognition.aggregate([
          {
            $match: {
              meetingId: id,
              userId: userId,
            },
          },
          { $sort: { createdAt: -1 } },
          { $limit: parseInt(limit, 10) },
          { $sort: { createdAt: 1 } },
        ])
      : Recognition.find({
          meetingId: id,
          userId: userId,
        }).select('-meeting -user'),
    Recognition.aggregate([
      {
        $match: {
          meetingId: id,
          userId: userId,
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
          meetingId: id,
          userId: userId,
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
  if (!meeting) return
  return {
    recognitionStream: [...recognitionDetail],
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
  }
}

const getOverview = async ({ role, createdBy }) => {
  const data = await Recognition.aggregate([
    {
      $match: {
        meetingId: {
          $in: await Meeting.find({
            ...(!role.includes('superadmin') && { createdBy }),
          }).distinct('_id'),
        },
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
  return data[0] ? { labels, datas: Object.values(data[0]) } : {}
}

const getSummary = async ({ role, createdBy }) => {
  const data = await Recognition.aggregate([
    {
      $match: {
        meetingId: {
          $in: await Meeting.find({
            ...(!role.includes('superadmin') && { createdBy }),
          }).distinct('_id'),
        },
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
  return data[0] ? { labels, datas: Object.values(data[0]) } : {}
}

const getArchive = async ({ limit, ids }) => {
  const [recognitionDetail] = await Promise.all([
    Recognition.aggregate([
      { $match: { meetingId: { $in: [...ids] } } },
      {
        $project: {
          _id: 0,
          createdAt: 1,
          meetingId: 1,
          userId: 1,
          neutral: { $round: ['$neutral', 2] },
          happy: { $round: ['$happy', 2] },
          sad: { $round: ['$sad', 2] },
          angry: { $round: ['$angry', 2] },
          fearful: { $round: ['$fearful', 2] },
          disgusted: { $round: ['$disgusted', 2] },
          surprised: { $round: ['$surprised', 2] },
          image: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      ...(limit ? [{ $limit: parseInt(limit, 10) }] : []),
      { $sort: { createdAt: 1 } },
    ]),
  ])
  return {
    // recognitionStream: [...recognitionDetail],
    // recognitionsDetail: {
    labels: recognitionDetail.map(({ createdAt }) => createdAt),
    meeting: recognitionDetail.map(({ meetingId }) => meetingId),
    user: recognitionDetail.map(({ userId }) => userId),
    neutral: recognitionDetail.map(({ neutral }) => neutral),
    happy: recognitionDetail.map(({ happy }) => happy),
    sad: recognitionDetail.map(({ sad }) => sad),
    angry: recognitionDetail.map(({ angry }) => angry),
    fearful: recognitionDetail.map(({ fearful }) => fearful),
    disgusted: recognitionDetail.map(({ disgusted }) => disgusted),
    surprised: recognitionDetail.map(({ surprised }) => surprised),
    image: recognitionDetail.map(({ image }) => image),
    // },
  }
}

const create = async ({ userId, image, rest }) => {
  const { secure_url } = await cloudinary.uploader.upload(image, {
    folder: `${rest.meetingId}/${userId}`,
  })
  const recognition = new Recognition({
    ...rest,
    image: secure_url,
    userId,
  })
  const data = await recognition.save()
  if (!data) return
  const socket = io()
  socket
    .to(rest.meetingId)
    .to(`${rest.meetingId}-${userId}`)
    .emit('RECOGNITION_DATA_ADDED')

  return data
}

const update = async ({ id, isStart, code }) => {
  const data = await Meeting.findByIdAndUpdate(
    id,
    {
      isStart,
      ...(isStart && { startedAt: new Date() }),
    },
    { new: true }
  )
  if (isStart) {
    recognitionInterval[code] = setInterval(() => {
      const socket = io()
      socket
        .to(`student-${code}`)
        .emit('SEND_RECOGNITION_DATA', { meetingId: id, datetime: new Date() })
    }, 5000)
  } else {
    clearInterval(recognitionInterval[code])
    delete recognitionInterval[code]
  }
  if (!data) return
  return data
}

const remove = async ({ id }) => {
  const data = await Recognition.findById(id)
  if (!data) return
  const public_id = data.image.substring(
    data.image.indexOf('.jpg') - 20,
    data.image.indexOf('.jpg')
  )
  await Promise.all([
    cloudinary.uploader.destroy(
      `${data.meetingId}/${data.userId}/${public_id}`
    ),
    data.remove(),
  ])
  return data
}

module.exports = {
  get,
  getById,
  getOverview,
  getSummary,
  getArchive,
  create,
  update,
  remove,
}
