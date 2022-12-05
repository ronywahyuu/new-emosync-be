const User = require('../models/user')

const get = async ({ authId }) => {
  return await User.findOne({ authId })
}

const create = async ({ body }) => {
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

module.exports = { get, create }
