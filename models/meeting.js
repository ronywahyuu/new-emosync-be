const mongoose = require('mongoose')
const Recognition = require('./recognition')

const meetingSchema = new mongoose.Schema(
  {
    name: String,
    subject: String,
    description: String,
    link: String,
    code: String,
    createdBy: String,
    isStart: { type: Boolean, default: false },
    startedAt: { type: Date, default: Date.now },
    isEnded: { type: Boolean, default: false },
    endedAt: { type: Date, default: null },
    configuration: {
      size: String,
      emotionDisplay: String,
    },
    participants: [
      {
        _id: String,
        userId: String,
        fullname: String,
        email: String,
        picture: String,
      },
    ],
  },
  { timestamps: true }
)

meetingSchema.set('toJSON', {
  versionKey: false,
})

meetingSchema.pre('remove', function () {
  return Recognition.deleteMany({ meetingId: this._id })
})

module.exports = mongoose.model('Meeting', meetingSchema)
