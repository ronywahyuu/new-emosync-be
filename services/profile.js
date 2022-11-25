const User = require('../models/user')

const get = async ({ id }) => {
  return await User.findById(id)
}

module.exports = { get }
