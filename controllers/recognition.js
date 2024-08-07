const recognition = require('../services/recognition')

const get = async (req, res, next) => {
  try {
    const data = await recognition.get({
      emoviewCode: req.params.emoviewCode,
      limit: req.query.limit,
    })
    if (!data) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const getOverallDataByUserId = async (req, res, next) => {
  try {
    const data = await recognition.getOverallDataByUserId({
      userId: req.params.userId,
    })
    if (!data) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data })
  } catch (error) {
    console.log(error)
    next(error)
  }

}

const getById = async (req, res, next) => {
  try {
    const data = await recognition.getById({
      emoviewCode: req.params.emoviewCode,
      userId: req.params.userId,
      limit: req.query.limit,
    })
    if (!data) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const getByIds = async (req, res, next) => {
  try {
    const { ids } = req.body
    const emoviewCode = req.params.emoviewCode
    const limit = req.query.limit

    let data = []
    await Promise.all(
      ids.map(async (value) => {
        const items = await recognition.getById({
          emoviewCode: emoviewCode,
          userId: value,
          limit: limit,
        })
        data.push({
          userId: value,
          recognitionsOverview: items.recognitionsOverview,
          recognitionsSummary: items.recognitionsSummary,
        })
      })
    )
    if (!data) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const getOverview = async (req, res, next) => {
  try {
    const {
      'https://customclaim.com/role': role,
      'https://customclaim.com/id': createdBy,
    } = req.auth.payload
    const data = await recognition.getOverview({ role, createdBy })
    if (!data?.datas?.length) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const getSummary = async (req, res, next) => {
  try {
    const {
      'https://customclaim.com/role': role,
      'https://customclaim.com/id': createdBy,
    } = req.auth.payload
    const data = await recognition.getSummary({ role, createdBy })
    if (!data?.datas?.length) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const getArchive = async (req, res, next) => {
  try {
    const { ids } = req.body
    const data = await recognition.getArchive({
      emoviewCode: ids,
    })
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
    const { 'https://customclaim.com/id': userId } = req.auth.payload
    const { image, ...rest } = req.body
    const data = await recognition.create({ userId, image, rest })
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
    const data = await recognition.update({
      emoviewCode: req.params.emoviewCode,
      isStart: req.body.isStart,
      code: req.body.code,
    })
    if (!data) {
      return res.status(404).send({ message: "Data can't be saved!" })
    }
    return res.status(200).send({ data })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const data = await recognition.remove({
      emoviewCode: req.params.emoviewCode,
    })
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
  getById,
  getOverallDataByUserId,
  getByIds,
  getOverview,
  getSummary,
  getArchive,
  create,
  update,
  remove,
}
