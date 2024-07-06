const mongoose = require('mongoose');
const feedbackSchema = new mongoose.Schema(
    {
      body: String,
      email: String,
      host: String,
    },
    {timestamps: true}
)

feedbackSchema.set('toJSON', {
  versionKey: false,
})

module.exports = mongoose.model('Feedback', feedbackSchema)