require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const rateLimit = require('express-rate-limit')
const cors = require('cors')
const path = require('path')

const authRoutes = require('./api/auth')
const alertRoutes = require('./api/alerts')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dashboard')))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, slow down' }
})
app.use(limiter)

app.use('/api/auth', authRoutes)
app.use('/api', alertRoutes)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard', 'index.html'))
})

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT, () => {
      console.log(`DeadCode API running on port ${process.env.PORT}`)
    })
  })
  .catch(err => console.log('DB Error:', err))

module.exports = app