const Meeting = require('../models/meeting')
const Class = require('../models/class')
const io = require('../utils/socketio')

let recognitionInterval = {}

const get = async ({role, createdBy}) => {
    return Meeting.find(
        role.includes('superadmin') ? {} : {createdBy}
    ).sort({createdAt: 'desc'});
}

const getByUserId = async ({userId}) => {
    return await Meeting.find({participants: {$elemMatch: {userId: userId}}})
}  

const getById = async ({id}) => {
    return await Meeting.findById(id)
}

const getByEmoviewCode = async ({emoviewCode}) => {
    return await Meeting.find({emoviewCode: emoviewCode});
}

const getByMeetCode = async ({meetCode}) => {
    return await Meeting.find({meetCode: meetCode}).sort({createdAt: 'desc'});
};

const getCount = async ({role, createdBy}) => {
    return await Meeting.count(role.includes('superadmin') ? {} : {createdBy})
}

const getCountMeetInstance = async ({meetCode}) => {
    return await Meeting.count({meetCode: meetCode});
};

const create = async ({body, createdBy}) => {
    const timestamp = new Date(Date.now()).toISOString();
    const emoviewCode = timestamp.replace(/[-:]/g, '').replace('.', '').replace('T', '').replace('Z', '')
    const data = new Meeting({...body, emoviewCode, createdBy});
    await Class.updateOne({meetCode: body.meetCode}, {countOfMeetings: body.countOfMeetings}).exec();
    await data.save();
    // let count = await Class.findOne({ meetCode: body.meetCode });
    // count.countOfMeetings += 1;
    // await Class.updateOne({ meetCode: body.meetCode }, { countOfMeetings: count }).exec();
    return data;
}

const update = async ({emoviewCode, body}) => {
    return await Meeting.findOneAndUpdate({emoviewCode: emoviewCode}, {...body}, {
        upsert: true,
        new: true,
    })
}

const addParticipant = async ({emoviewCode, body}) => {
    const doc = await Meeting.findOne({emoviewCode: emoviewCode})
    doc.participants.addToSet({
        _id: body.userId,
        ...body,
    })
    const socket = io()
    socket.to(emoviewCode).emit('USER_JOINED')
    return await doc.save()
}

const setStart = async ({emoviewCode, body}) => {
    const {status} = body
    if (status === 'started') {
        recognitionInterval[emoviewCode] = setInterval(() => {
            const socket = io()
            socket.to(`student-${emoviewCode}`).emit('RECOGNITION_STATUS', status)
        }, 5000)
    } else {
        clearInterval(recognitionInterval[emoviewCode])
        delete recognitionInterval[emoviewCode]
    }
    const data = status
    return data
}

const setStop = async ({emoviewCode}) => {
    const status = 'stopped'
    const socket = io()
    socket.to(emoviewCode).emit('RECOGNITION_STATUS', status)
    const data = 'Stop recognition'
    return data
}

const remove = async ({emoviewCode}) => {
    // const data = await Meeting.findOneAndDelete({emoviewCode: emoviewCode})
    const meeting = await Meeting.findOne({emoviewCode: emoviewCode});
    if (!meeting) return

    const classToUpdate = await Class.findOne({meetCode: meeting.meetCode});
    if (classToUpdate) {
        classToUpdate.countOfMeetings -= 1;
        console.log(classToUpdate.countOfMeetings)
        await classToUpdate.save();
    }


    const deleteItem = await Meeting.deleteOne({emoviewCode: emoviewCode});

    //   await meeting.remove();
    if (!deleteItem) return

    return deleteItem;
    // return await data.remove()
}

const removeByEmoviewCode = async ({emoviewCode}) => {
    const data = await Meeting.find({emoviewCode: emoviewCode});
    if (!data) return
    return await data.remove()
};

const removeByMeetCode = async ({meetCode}) => {
    const data = await Meeting.find({meetCode: meetCode});
    if (!data) return
    return await data.deleteMany();
};

module.exports = {
    get,
    getByUserId,
    getById, // replace with getByEmoviewCode
    getByEmoviewCode, // get meeting using emoview code (individual)
    getByMeetCode, // get meeting using meet code (collectively)
    getCount,
    getCountMeetInstance,
    create,
    update,
    addParticipant,
    setStart,
    setStop,
    remove, // replace with removeByEmoviewCode
    removeByEmoviewCode, // remove meeting using emoview code (individual)
    removeByMeetCode, // remove meeting using meet code (collectively)
}
