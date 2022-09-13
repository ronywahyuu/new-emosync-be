const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  // name: String,
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
    predict: {
      type: String,
    },
  },
  profile_img: String,
  cloudinary_id: String,
});
module.exports = mongoose.model('User', userSchema);
