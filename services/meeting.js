const Meeting = require('../models/meeting')

const get = async (userId, recognitionId) => {
  return await Meeting.find({
    ...(userId && { userId }),
    ...(recognitionId && { recognitionId }),
  })
    .select('-recognitions -users')
    .sort({ createdAt: 'desc' })
}

const getById = async (id) => {
  return await Meeting.findById(id).select('-recognitions -users')
}

const create = async (body) => {
  const data = new Meeting(body)
  return await data.save()
}

const update = async (id, body) => {
  return await Meeting.findByIdAndUpdate(id, body, {
    upsert: true,
    new: true,
  })
}

const remove = async (id) => {
  const data = await Meeting.findById(id)
  if (!data) return
  return await data.remove()
}

module.exports = {
  get,
  getById,
  create,
  update,
  remove,
}
