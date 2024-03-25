const mongoose = require('mongoose')
const Recognition = require('../models/recognition')
const Meeting = require('../models/meeting')
const User = require('../models/user')
const cloudinary = require('../utils/cloudinary')
const io = require('../utils/socketio')

let recognitionInterval = {}

// get from 1 meeting instance
const get = async ({ emoviewCode, limit }) => {
  const [
    meeting,
    recognitionDetail,
    recognitionsOverview,
    recognitionsSummary
  ] = await Promise.all([
    Meeting.findOne({ emoviewCode: emoviewCode }),
    Recognition.aggregate([
      { $match: { emoviewCode: emoviewCode } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d %H:%M:%S',
              date: { $toDate: { $floor: { $toDecimal: '$createdAt' } } }
            }
          },
          neutral: { $avg: '$neutral' },
          happy: { $avg: '$happy' },
          sad: { $avg: '$sad' },
          angry: { $avg: '$angry' },
          fearful: { $avg: '$fearful' },
          disgusted: { $avg: '$disgusted' },
          surprised: { $avg: '$surprised' }
        }
      },
      {
        $project: {
          _id: { $dateFromString: { dateString: '$_id', format: '%Y-%m-%d %H:%M:%S' } },
          neutral: { $round: ['$neutral', 2] },
          happy: { $round: ['$happy', 2] },
          sad: { $round: ['$sad', 2] },
          angry: { $round: ['$angry', 2] },
          fearful: { $round: ['$fearful', 2] },
          disgusted: { $round: ['$disgusted', 2] },
          surprised: { $round: ['$surprised', 2] }
        }
      },
      { $sort: { _id: -1 } },
      ...(limit ? [{ $limit: parseInt(limit, 10) }] : []),
      { $sort: { _id: 1 } }
    ]),
    Recognition.aggregate([
      {
        $match: { emoviewCode: emoviewCode }
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
          surprised: { $avg: '$surprised' }
        }
      },
      {
        $project: {
          neutral: { $round: { $multiply: ['$neutral', 100] } },
          happy: { $round: { $multiply: ['$happy', 100] } },
          sad: { $round: { $multiply: ['$sad', 100] } },
          angry: { $round: { $multiply: ['$angry', 100] } },
          fearful: { $round: { $multiply: ['$fearful', 100] } },
          disgusted: { $round: { $multiply: ['$disgusted', 100] } },
          surprised: { $round: { $multiply: ['$surprised', 100] } }
        }
      },
      { $unset: ['_id'] }
    ]),
    Recognition.aggregate([
      {
        $match: { emoviewCode: emoviewCode }
      },
      {
        $group: {
          _id: null,
          positive: { $sum: { $add: ['$happy', '$surprised'] } },
          negative: {
            $sum: { $add: ['$sad', '$angry', '$fearful', '$disgusted'] }
          },
          count: {
            $sum: {
              $add: [
                '$happy',
                '$sad',
                '$angry',
                '$fearful',
                '$disgusted',
                '$surprised'
              ]
            }
          }
        }
      },
      {
        $project: {
          positive: {
            $cond: [
              { $eq: ['$count', 0] },
              0,
              {
                $round: {
                  $multiply: [{ $divide: ['$positive', '$count'] }, 100]
                }
              }
            ]
          },
          negative: {
            $cond: [
              { $eq: ['$count', 0] },
              0,
              {
                $round: {
                  $multiply: [{ $divide: ['$negative', '$count'] }, 100]
                }
              }
            ]
          }
        }
      },
      { $unset: ['_id', 'count'] }
    ])
  ])
  const labelsOverview = [
    'Neutral',
    'Happy',
    'Sad',
    'Angry',
    'Fearful',
    'Disgusted',
    'Surprised'
  ]
  const labelsSummary = ['Positive', 'Negative']
  if (!meeting) return
  return {
    recognitionStream: [...recognitionDetail],
    recognitionsOverview: {
      labels: labelsOverview,
      datas: Object.values(recognitionsOverview[0] || {})
    },
    recognitionsSummary: {
      labels: labelsSummary,
      datas: Object.values(recognitionsSummary[0] || {})
    },
    recognitionsDetail: {
      labels: recognitionDetail.map(({ _id }) => _id),
      neutral: recognitionDetail.map(({ neutral }) => neutral),
      happy: recognitionDetail.map(({ happy }) => happy),
      sad: recognitionDetail.map(({ sad }) => sad),
      angry: recognitionDetail.map(({ angry }) => angry),
      fearful: recognitionDetail.map(({ fearful }) => fearful),
      disgusted: recognitionDetail.map(({ disgusted }) => disgusted),
      surprised: recognitionDetail.map(({ surprised }) => surprised)
    }
  }
}

// const getOverallDataByUserId = async ({ userId }) => {
//   const data = await Recognition.aggregate([
//     {
//       $match: { userId: userId }
//     },
//     {
//       $group: {
//         _id: null,
//         neutral: { $avg: '$neutral' },
//         happy: { $avg: '$happy' },
//         sad: { $avg: '$sad' },
//         angry: { $avg: '$angry' },
//         fearful: { $avg: '$fearful' },
//         disgusted: { $avg: '$disgusted' },
//         surprised: { $avg: '$surprised' }
//       }
//     },
//     {
//       $project: {
//         neutral: { $round: { $multiply: ['$neutral', 100] } },
//         happy: { $round: { $multiply: ['$happy', 100] } },
//         sad: { $round: { $multiply: ['$sad', 100] } },
//         angry: { $round: { $multiply: ['$angry', 100] } },
//         fearful: { $round: { $multiply: ['$fearful', 100] } },
//         disgusted: { $round: { $multiply: ['$disgusted', 100] } },
//         surprised: { $round: { $multiply: ['$surprised', 100] } }
//       }
//     },
//     { $unset: ['_id'] }
//   ]);

//   const labels = [
//     'Neutral',
//     'Happy',
//     'Sad',
//     'Angry',
//     'Fearful',
//     'Disgusted',
//     'Surprised'
//   ];

//   // Transforming data into the format similar to `get` function
//   const formattedData = {
//     recognitionsOverview: {
//       labels,
//       datas: Object.values(data[0] || {})
//     },
//     recognitionsSummary: {
//       labels: [], // You can populate this if there's relevant summary data
//       datas: [] // You can populate this if there's relevant summary data
//     },
//     recognitionsDetail: {
//       labels: [], // You can populate this if there's relevant detail data
//       neutral: [], // You can populate this if there's relevant detail data
//       happy: [], // You can populate this if there's relevant detail data
//       sad: [], // You can populate this if there's relevant detail data
//       angry: [], // You can populate this if there's relevant detail data
//       fearful: [], // You can populate this if there's relevant detail data
//       disgusted: [], // You can populate this if there's relevant detail data
//       surprised: [] // You can populate this if there's relevant detail data
//     },
//     recognitionStream: [] // No streaming data for overall data
//   };

//   return formattedData;
// };

const getOverallDataByUserId = async ({ userId }) => {
  const data = await Recognition.aggregate([
    {
      $match: { userId: userId }
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
        surprised: { $avg: '$surprised' }
      }
    },
    {
      $project: {
        neutral: { $multiply: [{ $avg: '$neutral' }, 100] },
        happy: { $multiply: [{ $avg: '$happy' }, 100] },
        sad: { $multiply: [{ $avg: '$sad' }, 100] },
        angry: { $multiply: [{ $avg: '$angry' }, 100] },
        fearful: { $multiply: [{ $avg: '$fearful' }, 100] },
        disgusted: { $multiply: [{ $avg: '$disgusted' }, 100] },
        surprised: { $multiply: [{ $avg: '$surprised' }, 100] }
      }
    },
    { $unset: ['_id'] }
  ]);

  // Calculate the total positive and negative emotions
  const positive = data[0].happy + data[0].surprised;
  const negative = data[0].sad + data[0].angry + data[0].fearful + data[0].disgusted;
  const total = positive + negative;

  // Calculate percentages and round to integers
  const positivePercentage = Math.round((positive / total) * 100);
  const negativePercentage = Math.round((negative / total) * 100);

  // Transforming data into the format similar to `get` function
  const formattedData = {
    recognitionsOverview: {
      labels: [
        'Neutral',
        'Happy',
        'Sad',
        'Angry',
        'Fearful',
        'Disgusted',
        'Surprised'
      ],
      datas: Object.values(data[0]).map(value => Math.round(value))
    },
    recognitionsSummary: {
      labels: ['Positive', 'Negative'],
      datas: [positivePercentage, negativePercentage]
    },
    recognitionsDetail: {},
    recognitionStream: []
  };

  return formattedData;
};


const getFromAllInstance = async ({ meetCode, limit }) => {
  const [
    meeting,
    recognitionDetail,
    recognitionsOverview,
    recognitionsSummary
  ] = await Promise.all([
    Meeting.find({ meetCode: meetCode }),
    Recognition.aggregate([
      { $match: { meetCode: meetCode } },
      {
        $group: {
          _id: { $toString: '$createdAt' },
          neutral: { $avg: '$neutral' },
          happy: { $avg: '$happy' },
          sad: { $avg: '$sad' },
          angry: { $avg: '$angry' },
          fearful: { $avg: '$fearful' },
          disgusted: { $avg: '$disgusted' },
          surprised: { $avg: '$surprised' }
        }
      },
      {
        $project: {
          neutral: { $round: ['$neutral', 2] },
          happy: { $round: ['$happy', 2] },
          sad: { $round: ['$sad', 2] },
          angry: { $round: ['$angry', 2] },
          fearful: { $round: ['$fearful', 2] },
          disgusted: { $round: ['$disgusted', 2] },
          surprised: { $round: ['$surprised', 2] }
        }
      },
      { $sort: { _id: -1 } },
      ...(limit ? [{ $limit: parseInt(limit, 10) }] : []),
      { $sort: { _id: 1 } }
    ]),
    Recognition.aggregate([
      {
        $match: { meetCode: meetCode }
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
          surprised: { $avg: '$surprised' }
        }
      },
      {
        $project: {
          neutral: { $round: { $multiply: ['$neutral', 100] } },
          happy: { $round: { $multiply: ['$happy', 100] } },
          sad: { $round: { $multiply: ['$sad', 100] } },
          angry: { $round: { $multiply: ['$angry', 100] } },
          fearful: { $round: { $multiply: ['$fearful', 100] } },
          disgusted: { $round: { $multiply: ['$disgusted', 100] } },
          surprised: { $round: { $multiply: ['$surprised', 100] } }
        }
      },
      { $unset: ['_id'] }
    ]),
    Recognition.aggregate([
      {
        $match: { meetCode: meetCode }
      },
      {
        $group: {
          _id: null,
          positive: { $sum: { $add: ['$happy', '$surprised'] } },
          negative: {
            $sum: { $add: ['$sad', '$angry', '$fearful', '$disgusted'] }
          },
          count: {
            $sum: {
              $add: [
                '$happy',
                '$sad',
                '$angry',
                '$fearful',
                '$disgusted',
                '$surprised'
              ]
            }
          }
        }
      },
      {
        $project: {
          positive: {
            $cond: [
              { $eq: ['$count', 0] },
              0,
              {
                $round: {
                  $multiply: [{ $divide: ['$positive', '$count'] }, 100]
                }
              }
            ]
          },
          negative: {
            $cond: [
              { $eq: ['$count', 0] },
              0,
              {
                $round: {
                  $multiply: [{ $divide: ['$negative', '$count'] }, 100]
                }
              }
            ]
          }
        }
      },
      { $unset: ['_id', 'count'] }
    ])
  ])
  const labelsOverview = [
    'Neutral',
    'Happy',
    'Sad',
    'Angry',
    'Fearful',
    'Disgusted',
    'Surprised'
  ]
  const labelsSummary = ['Positive', 'Negative']
  if (!meeting) return
  return {
    recognitionStream: [...recognitionDetail],
    recognitionsOverview: {
      labels: labelsOverview,
      datas: Object.values(recognitionsOverview[0])
    },
    recognitionsSummary: {
      labels: labelsSummary,
      datas: Object.values(recognitionsSummary[0])
    },
    recognitionsDetail: {
      labels: recognitionDetail.map(({ _id }) => _id),
      neutral: recognitionDetail.map(({ neutral }) => neutral),
      happy: recognitionDetail.map(({ happy }) => happy),
      sad: recognitionDetail.map(({ sad }) => sad),
      angry: recognitionDetail.map(({ angry }) => angry),
      fearful: recognitionDetail.map(({ fearful }) => fearful),
      disgusted: recognitionDetail.map(({ disgusted }) => disgusted),
      surprised: recognitionDetail.map(({ surprised }) => surprised)
    }
  }
}

const getById = async ({ emoviewCode, userId, limit }) => {
  const [
    meeting,
    recognitionDetail,
    recognitionsOverview,
    recognitionsSummary
  ] = await Promise.all([
    Meeting.findOne({ emoviewCode: emoviewCode }),
    limit
      ? Recognition.aggregate([
        {
          $match: {
            emoviewCode: emoviewCode,
            userId: userId
          }
        },
        { $sort: { createdAt: -1 } },
        { $limit: parseInt(limit, 10) },
        { $sort: { createdAt: 1 } }
      ])
      : Recognition.find({
        emoviewCode: emoviewCode,
        userId: userId
      }).select('-meeting -user'),
    Recognition.aggregate([
      {
        $match: {
          emoviewCode: emoviewCode,
          userId: userId
        }
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
          surprised: { $avg: '$surprised' }
        }
      },
      {
        $project: {
          neutral: { $round: { $multiply: ['$neutral', 100] } },
          happy: { $round: { $multiply: ['$happy', 100] } },
          sad: { $round: { $multiply: ['$sad', 100] } },
          angry: { $round: { $multiply: ['$angry', 100] } },
          fearful: { $round: { $multiply: ['$fearful', 100] } },
          disgusted: { $round: { $multiply: ['$disgusted', 100] } },
          surprised: { $round: { $multiply: ['$surprised', 100] } }
        }
      },
      { $unset: ['_id'] }
    ]),
    Recognition.aggregate([
      {
        $match: {
          emoviewCode: emoviewCode,
          userId: userId
        }
      },
      {
        $group: {
          _id: null,
          positive: { $sum: { $add: ['$happy', '$surprised'] } },
          negative: {
            $sum: { $add: ['$sad', '$angry', '$fearful', '$disgusted'] }
          },
          count: {
            $sum: {
              $add: [
                '$happy',
                '$sad',
                '$angry',
                '$fearful',
                '$disgusted',
                '$surprised'
              ]
            }
          }
        }
      },
      {
        $project: {
          positive: {
            $cond: [
              { $eq: ['$count', 0] },
              0,
              {
                $round: {
                  $multiply: [{ $divide: ['$positive', '$count'] }, 100]
                }
              }
            ]
          },
          negative: {
            $cond: [
              { $eq: ['$count', 0] },
              0,
              {
                $round: {
                  $multiply: [{ $divide: ['$negative', '$count'] }, 100]
                }
              }
            ]
          }
        }
      },
      { $unset: ['_id', 'count'] }
    ])
  ])
  const labelsOverview = [
    'Neutral',
    'Happy',
    'Sad',
    'Angry',
    'Fearful',
    'Disgusted',
    'Surprised'
  ]
  const labelsSummary = ['Positive', 'Negative']
  if (!meeting) return

  const result = {
    recognitionStream: [...recognitionDetail],
    recognitionsOverview: {
      labels: labelsOverview,
      datas: Object.values(recognitionsOverview[0])
    },
    recognitionsSummary: {
      labels: labelsSummary,
      datas: Object.values(recognitionsSummary[0])
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
      image: recognitionDetail.map(({ image }) => image)
    }
  }

  const socket = io()

  socket.emit('SEND_RECOGNITION_STREAM', result.recognitionStream)

  return result
}

const getOverview = async ({ role, createdBy }) => {
  const data = await Recognition.aggregate([
    {
      $match: {
        emoviewCode: {
          $in: await Meeting.find({
            ...(!role.includes('superadmin') && { createdBy })
          }).distinct('emoviewCode')
        }
      }
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
        surprised: { $avg: '$surprised' }
      }
    },
    {
      $project: {
        neutral: { $round: { $multiply: ['$neutral', 100] } },
        happy: { $round: { $multiply: ['$happy', 100] } },
        sad: { $round: { $multiply: ['$sad', 100] } },
        angry: { $round: { $multiply: ['$angry', 100] } },
        fearful: { $round: { $multiply: ['$fearful', 100] } },
        disgusted: { $round: { $multiply: ['$disgusted', 100] } },
        surprised: { $round: { $multiply: ['$surprised', 100] } }
      }
    },
    { $unset: ['emoviewCode'] }
  ])
  const labels = [
    'Neutral',
    'Happy',
    'Sad',
    'Angry',
    'Fearful',
    'Disgusted',
    'Surprised'
  ]
  return data[0] ? { labels, datas: Object.values(data[0]) } : {}
}

const getSummary = async ({ role, createdBy }) => {
  const data = await Recognition.aggregate([
    {
      $match: {
        emoviewCode: {
          $in: await Meeting.find({
            ...(!role.includes('superadmin') && { createdBy })
          }).distinct('emoviewCode')
        }
      }
    },
    {
      $group: {
        _id: null,
        positive: { $sum: { $add: ['$happy', '$surprised'] } },
        negative: {
          $sum: { $add: ['$sad', '$angry', '$fearful', '$disgusted'] }
        },
        count: {
          $sum: {
            $add: [
              '$happy',
              '$sad',
              '$angry',
              '$fearful',
              '$disgusted',
              '$surprised'
            ]
          }
        }
      }
    },
    {
      $project: {
        positive: {
          $cond: [
            { $eq: ['$count', 0] },
            0,
            {
              $round: {
                $multiply: [{ $divide: ['$positive', '$count'] }, 100]
              }
            }
          ]
        },
        negative: {
          $cond: [
            { $eq: ['$count', 0] },
            0,
            {
              $round: {
                $multiply: [{ $divide: ['$negative', '$count'] }, 100]
              }
            }
          ]
        }
      }
    },
    { $unset: ['emoviewCode', 'count'] }
  ])
  const labels = ['Positive', 'Negative']
  return data[0] ? { labels, datas: Object.values(data[0]) } : {}
}

const getArchive = async ({ limit, emoviewCode }) => {
  const [recognitionDetail, recognitionsOverview, recognitionsSummary] = await Promise.all([
    Recognition.aggregate([
      { $match: { emoviewCode: { $in: [...emoviewCode] } } },
      {
        $project: {
          _id: 0,
          createdAt: 1,
          meetCode: 1,
          emoviewCode: 1,
          userId: 1,
          neutral: { $round: ['$neutral', 2] },
          happy: { $round: ['$happy', 2] },
          sad: { $round: ['$sad', 2] },
          angry: { $round: ['$angry', 2] },
          fearful: { $round: ['$fearful', 2] },
          disgusted: { $round: ['$disgusted', 2] },
          surprised: { $round: ['$surprised', 2] },
          image: 1
        }
      },
      { $sort: { createdAt: -1 } },
      ...(limit ? [{ $limit: parseInt(limit, 10) }] : []),
      { $sort: { createdAt: 1 } }
    ]),
    Recognition.aggregate([
      {
        $match: { emoviewCode: { $in: [...emoviewCode] } }
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
          surprised: { $avg: '$surprised' }
        }
      },
      {
        $project: {
          neutral: { $round: { $multiply: ['$neutral', 100] } },
          happy: { $round: { $multiply: ['$happy', 100] } },
          sad: { $round: { $multiply: ['$sad', 100] } },
          angry: { $round: { $multiply: ['$angry', 100] } },
          fearful: { $round: { $multiply: ['$fearful', 100] } },
          disgusted: { $round: { $multiply: ['$disgusted', 100] } },
          surprised: { $round: { $multiply: ['$surprised', 100] } }
        }
      },
      { $unset: ['_id'] }
    ]),
    Recognition.aggregate([
      {
        $match: { emoviewCode: { $in: [...emoviewCode] } }
      },
      {
        $group: {
          _id: null,
          positive: { $sum: { $add: ['$happy', '$surprised'] } },
          negative: {
            $sum: { $add: ['$sad', '$angry', '$fearful', '$disgusted'] }
          },
          count: {
            $sum: {
              $add: [
                '$happy',
                '$sad',
                '$angry',
                '$fearful',
                '$disgusted',
                '$surprised'
              ]
            }
          }
        }
      },
      {
        $project: {
          positive: {
            $cond: [
              { $eq: ['$count', 0] },
              0,
              {
                $round: {
                  $multiply: [{ $divide: ['$positive', '$count'] }, 100]
                }
              }
            ]
          },
          negative: {
            $cond: [
              { $eq: ['$count', 0] },
              0,
              {
                $round: {
                  $multiply: [{ $divide: ['$negative', '$count'] }, 100]
                }
              }
            ]
          }
        }
      },
      { $unset: ['_id', 'count'] }
    ])
  ])
  const labelsOverview = [
    'Neutral',
    'Happy',
    'Sad',
    'Angry',
    'Fearful',
    'Disgusted',
    'Surprised'
  ]
  const labelsSummary = ['Positive', 'Negative']
  return {
    // recognitionStream: [...recognitionDetail],
    recognitionsDetail: {
      labels: recognitionDetail.map(({ createdAt }) => createdAt),
      class: recognitionDetail.map(({ meetCode }) => meetCode),
      meeting: recognitionDetail.map(({ emoviewCode }) => emoviewCode),
      user: recognitionDetail.map(({ userId }) => userId),
      neutral: recognitionDetail.map(({ neutral }) => neutral),
      happy: recognitionDetail.map(({ happy }) => happy),
      sad: recognitionDetail.map(({ sad }) => sad),
      angry: recognitionDetail.map(({ angry }) => angry),
      fearful: recognitionDetail.map(({ fearful }) => fearful),
      disgusted: recognitionDetail.map(({ disgusted }) => disgusted),
      surprised: recognitionDetail.map(({ surprised }) => surprised),
      image: recognitionDetail.map(({ image }) => image)
    },
    recognitionsOverview: {
      labels: labelsOverview,
      datas: Object.values(recognitionsOverview)
    },
    recognitionsSummary: {
      labels: labelsSummary,
      datas: Object.values(recognitionsSummary)
    }
  }
}

const create = async ({ userId, image, rest }) => {
  const { secure_url } = await cloudinary.uploader.upload(image, {
    folder: `${rest.emoviewCode}/${userId}`
  })
  const recognition = new Recognition({
    ...rest,
    image: secure_url,
    userId
  })
  const data = await recognition.save()
  if (!data) return
  const socket = io()
  socket
    .to(rest.emoviewCode)
    .to(`${rest.emoviewCode}-${userId}`)
    .emit('RECOGNITION_DATA_ADDED')

  return data
}

const update = async ({ emoviewCode, isStart, code }) => {
  const data = await Meeting.findOneAndUpdate(
    { emoviewCode: emoviewCode },
    {
      isStart,
      ...(isStart && { startedAt: new Date() })
    },
    { new: true }
  )
  if (isStart) {
    recognitionInterval[code] = setInterval(() => {
      const socket = io()
      socket
        .to(`student-${code}`)
        .emit('SEND_RECOGNITION_DATA', { emoviewCode: emoviewCode, datetime: new Date() })
    }, 5000)
  } else {
    clearInterval(recognitionInterval[code])
    delete recognitionInterval[code]
  }
  if (!data) return
  return data
}

const remove = async ({ emoviewCode }) => {
  const data = await Recognition.findOne({ emoviewCode: emoviewCode })
  if (!data) return
  const public_id = data.image.substring(
    data.image.indexOf('.jpg') - 20,
    data.image.indexOf('.jpg')
  )
  await Promise.all([
    cloudinary.uploader.destroy(
      `${data.meetingId}/${data.userId}/${public_id}`
    ),
    data.remove()
  ])
  return data
}

module.exports = {
  get,
  getOverallDataByUserId,
  getById,
  getFromAllInstance,
  getOverview,
  getSummary,
  getArchive,
  create,
  update,
  remove
}
