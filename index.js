const express = require('express')
const mongoose = require('mongoose')
const compression = require('compression')
const http = require('http')
const _class = require('./routes/class');
const meeting = require('./routes/meeting')
const user = require('./routes/user')
const recognition = require('./routes/recognition')
const profile = require('./routes/profile')
const auth = require('./routes/auth')
const feedback = require('./routes/feedback');
const interventionWords = require('./routes/interventionWords');
const facialInterventions = require('./routes/facialInterventionGif');
const miniSurvey = require('./routes/mini-survey');
const index = require('./routes')
const cors = require('cors')
const {sheetsServiceInit, getScoresByEmail, getScoreByEmailFormatted} = require('./services/googleSheetsService')

// sheets api
const process = require('process');
require('dotenv').config()

// sheetsServiceInit().then((res) => {
//   console.log('Google Sheets Connected')
//   // console.log(res)
// })

// authorize().then(listMajors).catch(console.error);
mongoose
    .connect(process.env.MONGODB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log('Connected to DB')
    })
    .catch(({message}) => {
      console.log(message)
    })
process.on('unhandledRejection', ({message}) => {
  console.log('unhandledRejection', message)
})

const app = express()
app.use(compression())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/class', _class)
app.use('/meeting', meeting)
app.use('/user', user)
app.use('/recognition', recognition)
app.use('/profile', profile)
app.use('/feedback', feedback)
app.use('/mini-survey', miniSurvey)
app.use('/intervention-words', interventionWords)
app.use('/facial-interventions', facialInterventions)
app.use('/auth', auth)
app.use('/', index)
app.get('/sheet/list', async (req, res) => {
  try {
    const mapScoreARCS = await sheetsServiceInit();
    res.json(mapScoreARCS);
  } catch (error) {
    res.status(500).json({error: error.toString()});
  }
});

// get sheet by email
app.get('/sheet/', async (req, res) => {
  try {
    const email = req.query.email;
    const data = await getScoresByEmail(email);
    res.json(data);
  } catch (error) {
    res.status(500).json({error: error.toString()});
  }
});

app.get('/sheet/formatted', async (req, res) => {
  try {
    const email = req.query.email;
    const data = await getScoreByEmailFormatted(email);
    res.json(data);
  } catch (error) {
    res.status(404).json({
      error: true,
      message: 'Email not found'
    });
  }
});





const httpServer = http.createServer(app)
require('./utils/socketio')(httpServer)
require('./utils/socketioRoom')
const {SAD, ANGRY, FEAR, DISGUST} = require("./utils/interventionWords");
// const {personalizeMessage} = require("./utils/helper");

httpServer.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
