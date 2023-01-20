const User = require('../models/user')

const get = async ({ id }) => {
  return await User.find({ userId: id })
}

module.exports = { get }
