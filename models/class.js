const mongoose = require('mongoose')

const meetingSchema = new mongoose.Schema(
  {    
    meetCode: String, // google meet code
    name: String,
    description: String,
    link: String,
    createdBy: String,
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

meetingSchema.set('toJSON', {
  versionKey: false,
})

module.exports = mongoose.model('Meeting', meetingSchema)
