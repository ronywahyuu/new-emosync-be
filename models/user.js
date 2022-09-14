const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    neutral: Number,
    happy: Number,
    sad: Number,
    angry: Number,
    fearful: Number,
    disgusted: Number,
    surprised: Number,
    predict: String,
    image: String,
    meetingId: String,
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

module.exports = mongoose.model('User', userSchema);
