require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const serverless = require('serverless-http')
const authRoutes = require('./routes/auth')

const app = express()

// In production, allow all origins; in dev, your Vite port
const origin = process.env.NODE_ENV === 'production'
  ? true
  : 'http://localhost:5173'
app.use(cors({ origin, credentials: true }))

app.use(express.json())
app.use('/api/auth', authRoutes)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(console.error)

// Export the wrapped handler instead of listening
module.exports = serverless(app)