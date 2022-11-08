const profile = require('../services/profile')

const get = async (req, res, next) => {
  try {
    const { sub: userId } = req.auth.payload
    const data = await profile.get(userId)
    if (!data) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

module.exports = { get }
