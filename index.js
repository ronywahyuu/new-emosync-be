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
const index = require('./routes')
const cors = require('cors')

// sheets api
const process = require('process');
const {google} = require('googleapis');
require('dotenv').config()

const serviceAccountKeyFile = "./project-emosync-5cc7841a1889.json";
const sheetId = process.env.GOOGLE_SHEETS_ID
const tabName = 'Form Responses 1'
const range = 'A:W'

async function _getGoogleSheetClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: serviceAccountKeyFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const authClient = await auth.getClient();
  return google.sheets({
    version: 'v4',
    auth: authClient,
  });
}

async function _readGoogleSheet(googleSheetClient, sheetId, tabName, range) {
  const res = await googleSheetClient.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tabName}!${range}`,
  });

  // const res = await googleSheetClient.

  return res.data.values;
}

async function main() {
  // Generating google sheet client
  const googleSheetClient = await _getGoogleSheetClient();

  // Reading Google Sheet from a specific range
  const data = await _readGoogleSheet(googleSheetClient, sheetId, tabName, range);
  
  // time is at index 0
  const mapTime = data.map((item) => {
    return item[0]
  })
  

  // email is at index 1
  const mapEmail = data.map((item) => {
    return item[1]
  })

  // score is at index 2
  const mapScore = data.map((item) => {
    return item[2]
  })

  // console.log(data);

  console.log(mapTime);
  console.log(mapEmail);
  console.log(mapScore);

  // Adding a new row to Google Sheet
  // const dataToBeInserted = [
  //    ['11', 'rohith', 'Rohith', 'Sharma', 'Active'],
  //    ['12', 'virat', 'Virat', 'Kohli', 'Active']
  // ]
  // await _writeGoogleSheet(googleSheetClient, sheetId, tabName, range, dataToBeInserted);
}

main().then(() => {
  console.log('Completed')
})

// authorize().then(listMajors).catch(console.error);
mongoose
  .connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connected to DB')
  })
  .catch(({ message }) => {
    console.log(message)
  })
process.on('unhandledRejection', ({ message }) => {
  console.log('unhandledRejection', message)
})

const app = express()
app.use(compression())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/class', _class)
app.use('/meeting', meeting)
app.use('/user', user)
app.use('/recognition', recognition)
app.use('/profile', profile)
app.use('/auth', auth)
app.use('/', index)

const httpServer = http.createServer(app)
require('./utils/socketio')(httpServer)
require('./utils/socketioRoom')

httpServer.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
