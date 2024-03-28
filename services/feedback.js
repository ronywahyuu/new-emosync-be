const Feedback = require('../models/feedback')

const create = async ({ body, email, host }) => {
  // return await Feedback.create({body, email})
  let feedback = new Feedback({
    body,
    email,
    host
  })

  return await feedback.save((err) => {
    if (err) {
      console.log(err)
    }
  })
}

module.exports = {
  create,
}
