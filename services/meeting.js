const Meeting = require('../models/meeting')

const get = async (role, createdBy) => {
  return await Meeting.find(role.includes('superadmin') ? {} : { createdBy })
    .select('-recognitions -users')
    .sort({ createdAt: 'desc' })
}

const getById = async (id) => {
  return await Meeting.findById(id).select('-recognitions -users')
}

const getCount = async (role, createdBy) => {
  return await Meeting.count(role.includes('superadmin') ? {} : { createdBy })
}

const create = async (body, createdBy) => {
  const data = new Meeting({ ...body, createdBy })
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
  getCount,
  create,
  update,
  remove,
}
