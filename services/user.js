const mongoose = require('mongoose')
const User = require('../models/user')

const get = async (role, meetings, recognitions) => {
  return await User.find({
    ...(role && { role }),
    ...(meetings && { meetings: mongoose.Types.ObjectId(meetings) }),
    ...(recognitions && { recognitions: mongoose.Types.ObjectId(meetings) }),
  })
    .select('-meetings -recognitions')
    .sort({ createdAt: 'desc' })
}

const getById = async (id) => {
  return await User.findById(id).select('-meetings -recognitions')
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
  const data = await User.findOneAndUpdate({ userId }, body, {
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
  create,
  update,
  remove,
}
