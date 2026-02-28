import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/auth.js'
import routineRoutes from './routes/routine.js'
import labRoutes from './routes/lab.js'
import examRoutes from './routes/exam.js'
import calendarRoutes from './routes/calendar.js'
import aiMentorRoutes from './routes/aiMentor.js'
import libraryRoutes from './routes/library.js'
import adminRoutes from './routes/admin.js'
import dashboardRoutes from './routes/dashboard.js'

import { errorHandler } from './middleware/error.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3001',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use('/api/', limiter)

app.use('/api/auth', authRoutes)
app.use('/api/routine', routineRoutes)
app.use('/api/lab', labRoutes)
app.use('/api/exam', examRoutes)
app.use('/api/calendar', calendarRoutes)
app.use('/api/ai-mentor', aiMentorRoutes)
app.use('/api/library', libraryRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use('/uploads', express.static('uploads'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-college')
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  })

export default app
