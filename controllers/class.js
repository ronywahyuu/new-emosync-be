const _class = require('../services/class')

const get = async (req, res, next) => {
  try {
    const {
      'https://customclaim.com/role': role,
      'https://customclaim.com/id': createdBy,
    } = req.auth.payload
    const searchQuery = req.query.q
    const data = await _class.get({ role, createdBy, searchQuery })
    if (!data.length) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const getByMeetCode = async (req, res, next) => {
  try {
    const {
      'https://customclaim.com/id': createdBy,
    } = req.auth.payload
    const meetCode = req.params.meetCode
    const data = await _class.getByMeetCode({ createdBy, meetCode })
    if (!data.length) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

// get class by user id
const getByUserId = async (req, res, next) => {
  try {
    const {
      'https://customclaim.com/id': createdBy,
    } = req.auth.payload
    const userId = req.params.userId
    const data = await _class.getByUserId({ createdBy, userId })
    if (!data.length) {
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
    const { 'https://customclaim.com/id': createdBy } = req.auth.payload
    const data = await _class.create({ body: req.body, createdBy })
    if (!data) {
      return res.status(404).send({ message: "Data can't be saved!" })
    }
    return res.status(201).send({ data })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const data = await _class.update({ id: req.params.id, body: req.body })
    if (!data) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const data = await _class.remove({ id: req.params.id })
    if (!data) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

module.exports = {
  get,
  getByMeetCode,
  create,
  update,
  remove,
  getByUserId,
}
