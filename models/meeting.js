const mongoose = require('mongoose')

const meetingSchema = new mongoose.Schema(
  {
    meetingId: String,
    description: String,
    isStart: { type: Boolean, default: false },
    startedAt: { type: Date, default: Date.now },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    recognitions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recognition',
      },
    ],
  },
  { timestamps: true }
)

meetingSchema.set('toJSON', {
  versionKey: false,
})

module.exports = mongoose.model('Meeting', meetingSchema)
