const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: String,
    fullname: String,
    userId: String,
    email: String,
    picture: String,
    role: {
      type: String,
      enum: ['student', 'teacher'],
      default: 'student',
    },
    meetings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meeting',
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

userSchema.set('toJSON', {
  versionKey: false,
})

module.exports = mongoose.model('User', userSchema)
