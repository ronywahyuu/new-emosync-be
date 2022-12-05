const express = require('express')
const mongoose = require('mongoose')
const compression = require('compression')
const http = require('http')
const meeting = require('./routes/meeting')
const user = require('./routes/user')
const recognition = require('./routes/recognition')
const profile = require('./routes/profile')
const auth = require('./routes/auth')
const index = require('./routes')
const cors = require('cors')
require('dotenv').config()

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
