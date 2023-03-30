const mongoose = require('mongoose')
const Recognition = require('./recognition')

const meetingSchema = new mongoose.Schema(
  {
    emoviewCode: String, // unique code for every pertemuan
    meetCode: String, // google meet code
    name: String,
    subject: String,
    description: String,
    link: String,
    createdBy: String,
    isStart: { type: Boolean, default: false },
    startedAt: { type: Date, default: Date.now },
    isEnded: { type: Boolean, default: false },
    endedAt: { type: Date, default: null },
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
  return Recognition.deleteMany({ emoviewCode: this.emoviewCode })
})

module.exports = mongoose.model('Meeting', meetingSchema)
