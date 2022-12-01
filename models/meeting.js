const mongoose = require('mongoose')
const Recognition = require('./recognition')

const meetingSchema = new mongoose.Schema(
  {
    code: String,
    description: String,
    isStart: { type: Boolean, default: false },
    startedAt: { type: Date, default: Date.now },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
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
