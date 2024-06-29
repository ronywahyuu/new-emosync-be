const MiniSurvey = require('../models/miniSurvey')

const create = async ({
  emotions,
  environtmentSupport,
  reasons,
  otherReason,
  meetingCode,
  user,
}) => {
  let miniSurvey = new MiniSurvey({
    emotions,
    environtmentSupport,
    reasons,
    otherReason,
    meetingCode,
    user: {
      name: user.name,
      email: user.email,
      picture: user.picture,
      sub: user.sub,
    },
  })

  return await miniSurvey.save((err) => {
    if (err) {
      console.log(err)
    }
  })
}

const getAll = async () => {
  const miniSurvey = await MiniSurvey.find()

  return miniSurvey
}

const getByUser = async ({ userId, meetingCode }) => {
  const miniSurvey = await MiniSurvey.find({
    'user.sub': userId,
    'meetingCode': meetingCode,
  })

  return miniSurvey
}

module.exports = {
  create,
  getAll,
  getByUser,
}
