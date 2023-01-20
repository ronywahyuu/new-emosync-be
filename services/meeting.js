const Meeting = require('../models/meeting')

let recognitionInterval = {}

const get = async ({ role, createdBy }) => {
  return await Meeting.find(
    role.includes('superadmin') ? {} : { createdBy }
  ).sort({ createdAt: 'desc' })
}

const getById = async ({ id }) => {
  return await Meeting.findById(id)
}

const getCount = async ({ role, createdBy }) => {
  return await Meeting.count(role.includes('superadmin') ? {} : { createdBy })
}

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

const addParticipant = async ({ id, body }) => {
  const doc = await Meeting.findOne({ code: id })
  doc.participants.addToSet({
    _id: body.userId,
    ...body,
  })
  const socket = io()
  socket.to(id).emit('USER_JOINED')
  return await doc.save()
}

const setStart = async ({ meetingId, body }) => {
  const { status } = body
  if (status === 'started') {
    recognitionInterval[meetingId] = setInterval(() => {
      const socket = io()
      socket.to(`student-${meetingId}`).emit('RECOGNITION_STATUS', status)
    }, 5000)
  } else {
    clearInterval(recognitionInterval[meetingId])
    delete recognitionInterval[meetingId]
  }
  const data = status
  return data
}

const setStop = async ({ meetingId }) => {
  const status = 'stopped'
  const socket = io()
  socket.to(meetingId).emit('RECOGNITION_STATUS', status)
  const data = 'Stop recognition'
  return data
}

const remove = async ({ id }) => {
  const data = await Meeting.findById(id)
  if (!data) return
  return await data.remove()
}

module.exports = {
  get,
  getById,
  getCount,
  create,
  update,
  addParticipant,
  setStart,
  setStop,
  remove,
}
