const express = require('express')
const mongoose = require('mongoose')
const compression = require('compression')
const dataRoutes = require('./routes/data')
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
app.use('/data', dataRoutes)
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
