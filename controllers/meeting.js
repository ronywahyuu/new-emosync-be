const meeting = require('../services/meeting')

const get = async (req, res, next) => {
  try {
    const {
      'https://customclaim.com/role': role,
      'https://customclaim.com/id': createdBy,
    } = req.auth.payload
    const data = await meeting.get({ role, createdBy })
    if (!data.length) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const getByUserId = async (req, res, next) => {
  try {
    const data = await meeting.getByUserId({ userId: req.params.userId })
    if (!data) {
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
    const data = await meeting.getByMeetCode({ meetCode: req.params.meetCode })
    if (!data) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const getByEmoviewCode = async (req, res, next) => {
  try {
    const data = await meeting.getByEmoviewCode({ emoviewCode: req.params.emoviewCode })
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
      'https://customclaim.com/role': role,
      'https://customclaim.com/id': createdBy,
    } = req.auth.payload
    const data = await meeting.getCount({ role, createdBy })
    if (data === undefined) {
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
    const data = await meeting.create({ body: req.body, createdBy })
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
    const data = await meeting.update({ emoviewCode: req.params.emoviewCode, body: req.body })
    if (!data) {
      return res.status(404).send({ message: 'Data not found!' })
    }
    return res.status(200).send({ data })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const addParticipant = async (req, res, next) => {
  try {
    const data = await meeting.addParticipant({
      emoviewCode: req.params.emoviewCode,
      body: req.body,
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

// const setMeetingStatus = async (req, res, next) => {
//   try {
//     const data = await meeting.update({
//       emoviewCode: req.params.id,
//       body: req.body,
//     })
//     if (!data) {
//       return res.status(404).send({ message: 'Data not found!' })
//     }
//     return res.status(200).send({ data })
//   } catch (error) {
//     console.log(error)
//     next(error)
//   }
// }

const setStart = async (req, res, next) => {
  try {
    const data = await meeting.setStart({
      emoviewCode: req.params.emoviewCode,
      body: req.body,
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

const setStop = async (req, res, next) => {
  try {
    const data = await meeting.setStop({
      body: req.body,
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

const remove = async (req, res, next) => {
  try {
    const data = await meeting.remove({ emoviewCode: req.params.emoviewCode })
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
  // getById,
  getByUserId,
  getByMeetCode,
  getByEmoviewCode,
  getCount,
  create,
  update,
  addParticipant,
  // setMeetingStatus,
  setStart,
  setStop,
  remove,
}
