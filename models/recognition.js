const mongoose = require('mongoose')

const recognitionSchema = new mongoose.Schema({
  neutral: Number,
  happy: Number,
  sad: Number,
  angry: Number,
  fearful: Number,
  disgusted: Number,
  surprised: Number,
  predict: String,
  image: String,
  meeting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

recognitionSchema.set('toJSON', {
  versionKey: false,
})

module.exports = mongoose.model('Recognition', recognitionSchema)
