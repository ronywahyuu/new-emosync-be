const feedback = require('../services/feedback')
const create = async (req, res, next) => {
  // console.log(req.headers.host)
  try {
    const data = await feedback.create({ body: req.body.body, email: req.body.email, host: req.body.host })

    console.log(data)

    return res.status(201).send({ data })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const getAll = async (req, res, next) => {
  try {
    const data = await feedback.getAll()

    return res.status(200).send({ data })
  } catch (error) {
    next(error)
  }
}
module.exports = {
  create,
  getAll,
}
