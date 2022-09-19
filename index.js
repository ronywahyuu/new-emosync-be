const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const dataRoutes = require('./routes/data');
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

const app = express();

app.use(compression());
app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use('/data', dataRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
