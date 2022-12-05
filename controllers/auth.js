const auth = require('../services/auth')
const checkClientId = require('../middleware/clientId')

const get = async (req, res, next) => {
  try {
    const { authorization: token } = req.headers
    if (!checkClientId(token)) {
      return res.status(401).send({ message: 'Unauthorized' })
    }
    const { authId } = req.params
    const data = await auth.get({ authId })
    if (!data) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const { authorization: token } = req.headers
    if (!checkClientId(token)) {
      return res.status(401).send({ message: 'Unauthorized' })
    }
    const data = await auth.create({ body: req.body })
    if (!data) {
      return res.status(404).send({ message: "Data can't be saved!" })
    }
    return res.status(201).send({ data })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

module.exports = { get, create }
