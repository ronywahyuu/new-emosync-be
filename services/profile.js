const User = require('../models/user')

const get = async (userId) => {
  return await User.findOne({ userId }).select('-meetings -recognitions')
}

module.exports = { get }
