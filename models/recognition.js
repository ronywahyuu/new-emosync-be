const mongoose = require('mongoose');

const recognitionSchema = new mongoose.Schema(
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
    name: String,
    meetingId: String,
  },
  { timestamps: true }
);

recognitionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

module.exports = mongoose.model('Recognition', recognitionSchema);
