const mongoose = require('mongoose')
const miniSurveySchema = new mongoose.Schema(
  {
    emotions: String,
    environtmentSupport: String,
    reasons: [String],
    otherReason: String,
    meetingCode: String,
    user:{
      name: String,
      email: String,
      picture: String,
      sub: String,
    },
    timestamp: Date,
  },
  {timestamps: true}
)
miniSurveySchema.set('toJSON', {
  versionKey: false,
})

module.exports = mongoose.model('MiniSurvey', miniSurveySchema)