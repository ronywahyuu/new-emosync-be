const user = require('../services/user')

const get = async (req, res, next) => {
  try {
    const {
      'https://api-fer-graphql.fly.dev/id': createdBy,
      'https://api-fer-graphql.fly.dev/role': userRole,
    } = req.auth.payload
    const { role, meetings, recognitions } = req.query
    const data = await user.get(
      createdBy,
      userRole,
      role,
      meetings,
      recognitions
    )
    if (!data.length) {
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
    const data = await user.getById(req.params.id)
    if (!data) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const getCount = async (req, res, next) => {
  try {
    const {
      'https://api-fer-graphql.fly.dev/id': createdBy,
      'https://api-fer-graphql.fly.dev/role': userRole,
    } = req.auth.payload
    const { role } = req.query
    const data = await user.getCount(userRole, createdBy, role)
    if (data === undefined) {
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
      'https://api-fer-graphql.fly.dev/role': role,
      'https://api-fer-graphql.fly.dev/id': createdBy,
    } = req.auth.payload
    const data = await user.getOverview(req.params.id, role, createdBy)
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
      'https://api-fer-graphql.fly.dev/role': role,
      'https://api-fer-graphql.fly.dev/id': createdBy,
    } = req.auth.payload
    const data = await user.getSummary(req.params.id, role, createdBy)
    if (!data?.datas?.length) {
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
    const data = await user.create(req.body)
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
    const { 'https://api-fer-graphql.fly.dev/id': userId } = req.auth.payload
    const data = await user.update(userId, req.body)
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
    const data = await user.remove(req.params.id)
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
  getCount,
  getOverview,
  getSummary,
  create,
  update,
  remove,
}
