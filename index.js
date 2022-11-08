const express = require('express')
const mongoose = require('mongoose')
const compression = require('compression')
const http = require('http')
const meetingRoutes = require('./routes/meeting')
const userRoutes = require('./routes/user')
const recognitionRoutes = require('./routes/recognition')
const profileRoutes = require('./routes/profile')
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
app.use('/meeting', meetingRoutes)
app.use('/user', userRoutes)
app.use('/recognition', recognitionRoutes)
app.use('/profile', profileRoutes)
app.get('/', async (_, res) =>
  res.status(200).send({ message: 'server running well' })
)

const httpServer = http.createServer(app)
require('./utils/socketio')(httpServer)

httpServer.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
