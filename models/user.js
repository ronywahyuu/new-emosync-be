const mongoose = require('mongoose')
const Meeting = require('./meeting')

const userSchema = new mongoose.Schema(
  {
    name: String,
    fullname: String,
    authId: String,
    email: String,
    picture: String,
    role: {
      type: String,
      enum: ['student', 'teacher', 'superadmin'],
      default: 'student',
    },
  },
  { timestamps: true }
)

userSchema.set('toJSON', {
  versionKey: false,
})

userSchema.pre('deleteMany', function () {
  return Meeting.deleteMany({ createdBy: this._id })
})

module.exports = mongoose.model('User', userSchema)
