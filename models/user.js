const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  neutral: Number,
  happy: Number,
  sad: Number,
  angry: Number,
  fearful: Number,
  disgusted: Number,
  surprised: Number,
  predict: String,
  image: String,
});

module.exports = mongoose.model('User', userSchema);
