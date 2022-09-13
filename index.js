const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const cors = require('cors');

require('dotenv').config();

//Connect to database
try {
  mongoose.connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log('connected to db');
} catch (error) {
  handleError(error);
}
process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection', error.message);
});

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRoutes);

app.listen(process.env.PORT || 8080, function () {
  console.log('App running!');
});
