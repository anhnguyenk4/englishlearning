const path = require('path')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const courseRoutes = require('./routes/courseRoutes')
const lessonRoutes = require('./routes/lessonRoutes')
const quizRoutes = require('./routes/quizRoutes')
const progressRoutes = require('./routes/progressRoutes')
const adminRoutes = require('./routes/adminRoutes')
const leaderboardRoutes = require('./routes/leaderboardRoutes')

const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(morgan('dev'))

// Serve avatar uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.get('/', (_req, res) => {
  res.send('NEDU Backend (English Learning)')
})

// Health
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK' })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api', courseRoutes)
app.use('/api', lessonRoutes)
app.use('/api', quizRoutes)
app.use('/api', progressRoutes)
app.use('/api', leaderboardRoutes)
app.use('/api', adminRoutes)

// 404
app.use((req, res) => {
  res.status(404).json({ message: `Không tìm thấy route: ${req.method} ${req.originalUrl}` })
})

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error(err)
  const message = err?.message || 'Server error'
  res.status(500).json({ message })
})

module.exports = app

