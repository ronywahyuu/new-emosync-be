const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    proba: {
      neutral: Number,
      happy: Number,
      sad: Number,
      angry: Number,
      fearful: Number,
      disgusted: Number,
      surprised: Number,
    },
    predict: String,
  },
  profile_img: String,
  cloudinary_id: String,
});
module.exports = mongoose.model('User', userSchema);
