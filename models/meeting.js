const mongoose = require('mongoose')

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

module.exports = mongoose.model('Meeting', meetingSchema)
