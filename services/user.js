const mongoose = require('mongoose')
const Meeting = require('../models/meeting')
const User = require('../models/user')
const Recognition = require('../models/recognition')

const get = async ({role, meetingId, createdBy, userRole}) => {
    return User.find({
        ...(meetingId && {
            userId: {
                $in: await Recognition.find({meetingId}).distinct('userId'),
            },
        }),
        ...(!meetingId &&
            role &&
            role !== 'teacher' && {
                userId: {
                    $in: await Recognition.find({
                        meetingId: {
                            $in: await Meeting.find({
                                ...(!userRole.includes('superadmin') && {createdBy}),
                            }).distinct('emoviewCode'),
                        },
                    }).distinct('userId'),
                },
            }),
        ...(role && {role}),
    }).sort({createdAt: 'desc'});
}

const getIsFormFilledStatus = async ({userId}) => {
    const user = await User.findOne({userId});
    return user.isPersonalityFormFilled;
}

const getSameMeeting = async ({emoviewCode}) => {
    let students = [];
    const {participants} = await Meeting.findOne({emoviewCode: emoviewCode}, 'participants')
    for (const value of participants) {
        const {role} = await User.findOne({userId: value.userId}, 'role');
        if (role === 'student') {
            students.push(value);
        }
    }
    return students;
    // return await Meeting.find({meetCode: emoviewCode}, 'participants');
}

const getById = async ({id}) => {
    // cast string id to ObjectId


    return await User.findById(id)
    // return await User.findOne(id)
}

const getByUserId = async ({userId}) => {
    return await User.find({userId: userId})
}

const getCount = async ({userRole, createdBy, role}) => {
    return await User.count({
        ...(role !== 'teacher' && {
            _id: {
                $in: await Recognition.find({
                    meetingId: {
                        $in: await Meeting.find({
                            ...(!userRole.includes('superadmin') && {createdBy}),
                        }).distinct('code'),
                    },
                }).distinct('userId'),
            },
        }),
        ...(role && {role}),
    })
}

const getOverview = async ({id, role, createdBy}) => {
    const data = await Recognition.aggregate([
        {
            $match: {
                userId: id,
                emoviewCode: {
                    $in: await Meeting.find({
                        ...(!role.includes('superadmin') && {createdBy}),
                    }).distinct('emoviewCode'),
                },
            },
        },
        {
            $group: {
                _id: null,
                neutral: {$avg: '$neutral'},
                happy: {$avg: '$happy'},
                sad: {$avg: '$sad'},
                angry: {$avg: '$angry'},
                fearful: {$avg: '$fearful'},
                disgusted: {$avg: '$disgusted'},
                surprised: {$avg: '$surprised'},
            },
        },
        {
            $project: {
                neutral: {$round: {$multiply: ['$neutral', 100]}},
                happy: {$round: {$multiply: ['$happy', 100]}},
                sad: {$round: {$multiply: ['$sad', 100]}},
                angry: {$round: {$multiply: ['$angry', 100]}},
                fearful: {$round: {$multiply: ['$fearful', 100]}},
                disgusted: {$round: {$multiply: ['$disgusted', 100]}},
                surprised: {$round: {$multiply: ['$surprised', 100]}},
            },
        },
        {$unset: ['_id']},
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
    return data[0] ? {labels, datas: Object.values(data[0])} : {}
}

const getSummary = async ({id, role, createdBy}) => {
    const data = await Recognition.aggregate([
        {
            $match: {
                userId: id,
                emoviewCode: {
                    $in: await Meeting.find({
                        ...(!role.includes('superadmin') && {createdBy}),
                    }).distinct('emoviewCode'),
                },
            },
        },
        {
            $group: {
                _id: null,
                positive: {$sum: {$add: ['$happy', '$surprised']}},
                negative: {
                    $sum: {$add: ['$sad', '$angry', '$fearful', '$disgusted']},
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
                        {$eq: ['$count', 0]},
                        0,
                        {
                            $round: {
                                $multiply: [{$divide: ['$positive', '$count']}, 100],
                            },
                        },
                    ],
                },
                negative: {
                    $cond: [
                        {$eq: ['$count', 0]},
                        0,
                        {
                            $round: {
                                $multiply: [{$divide: ['$negative', '$count']}, 100],
                            },
                        },
                    ],
                },
            },
        },
        {$unset: ['_id', 'count']},
    ])
    const labels = ['Positive', 'Negative']
    return data[0] ? {labels, datas: Object.values(data[0])} : {}
}

const create = async ({body}) => {
    const {email} = body
    const user = await User.findOne({email})
    if (user) return user
    const data = await User.findOneAndUpdate({email}, body, {
        upsert: true,
        new: true,
    })
    if (!data) return
    return data
}

const update = async ({userId, body}) => {
    const data = await User.findByIdAndUpdate(userId, body, {
        upsert: true,
        new: true,
    })
    if (!data) return
    return data
}

const remove = async ({id}) => {
    const data = await User.findById(id)
    if (!data) return
    return await data.remove()
}

module.exports = {
    get,
    getById,
    getByUserId,
    getCount,
    getOverview,
    getSummary,
    getSameMeeting,
    create,
    update,
    remove,
    getIsFormFilledStatus
}
