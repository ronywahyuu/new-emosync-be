const User = require('../models/user')

const get = async (id) => {
  return await User.findById(id).select('-meetings -recognitions')
}

module.exports = { get }
