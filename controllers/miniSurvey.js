const miniSurvey = require('../services/miniSurvey')

const getAll = async (req, res, next) => {
  try {
    const data = await miniSurvey.getAll()

    return res.status(200).send({ data })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = await miniSurvey.getById(id)

    return res.status(200).send({ data })
  } catch (error) {
    next(error)
  }

}

const getByUser = async (req, res, next) => {
  try {
    const { userId, meetingCode } = req.body

    const data = await miniSurvey.getByUser({userId, meetingCode})

    return res.status(200).send({ data })
  } catch (error) {
    next(error)
  }

}

const create = async (req, res, next) => {
  try {
    const data = await miniSurvey.create(req.body)

    return res.status(201).send({ data })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAll,
  create,
  getByUser,
}