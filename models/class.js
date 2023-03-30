const mongoose = require('mongoose')

const classSchema = new mongoose.Schema(
  {    
    meetCode: String, // google meet code
    name: String,
    description: String,
    link: String,
    createdBy: String,
    startedAt: { type: Date, default: null },
    endedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

classSchema.set('toJSON', {
  versionKey: false,
})

module.exports = mongoose.model('Class', classSchema)
