const Meeting = require('../models/meeting')
const io = require('../utils/socketio')

let recognitionInterval = {}

const get = async ({ role, createdBy }) => {
  return await Meeting.find(
    role.includes('superadmin') ? {} : { createdBy }
  ).sort({ createdAt: 'desc' })
}

const getById = async ({ id }) => {
  return await Meeting.findById(id)
}

const getByEmoviewCode = async ({ emoviewCode }) => {
  return await Meeting.find({emoviewCode: emoviewCode});
}

const getByMeetCode = async ({ meetCode }) => {
  return await Meeting.find({meetCode: meetCode});
};

const getCount = async ({ role, createdBy }) => {
  return await Meeting.count(role.includes('superadmin') ? {} : { createdBy })
}

const getCountMeetInstance = async ({ meetCode }) => {
  return await Meeting.count({ meetCode: meetCode });
};

const create = async ({ body, createdBy }) => {
  const data = new Meeting({ ...body, createdBy })
  return await data.save()
}

const update = async ({ id, body }) => {
  return await Meeting.findByIdAndUpdate(id, body, {
    upsert: true,
    new: true,
  })
}

const addParticipant = async ({ emoviewCode, body }) => {
  const doc = await Meeting.findOne({ emoviewCode: emoviewCode })
  doc.participants.addToSet({
    _id: body.userId,
    ...body,
  })
  const socket = io()
  socket.to(emoviewCode).emit('USER_JOINED')
  return await doc.save()
}

const setStart = async ({ emoviewCode, body }) => {
  const { status } = body
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

const setStop = async ({ emoviewCode }) => {
  const status = 'stopped'
  const socket = io()
  socket.to(emoviewCode).emit('RECOGNITION_STATUS', status)
  const data = 'Stop recognition'
  return data
}

const remove = async ({ id }) => {
  const data = await Meeting.findById(id)
  if (!data) return
  return await data.remove()
}

const removeByEmoviewCode = async ({ emoviewCode }) => {
  const data = await Meeting.find({emoviewCode: emoviewCode});
  if (!data) return
  return await data.remove()
};

const removeByMeetCode = async ({ meetCode }) => { 
  const data = await Meeting.find({meetCode: meetCode});
  if (!data) return
  return await data.deleteMany();
};

module.exports = {
  get,
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
