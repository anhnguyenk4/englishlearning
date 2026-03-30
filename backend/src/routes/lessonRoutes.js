const express = require('express')
const asyncHandler = require('../utils/asyncHandler')
const { authenticateJWT } = require('../middlewares/authMiddleware')
const { getLessons } = require('../controllers/lessonController')

const router = express.Router()

router.get('/lessons/:courseId', authenticateJWT, asyncHandler(getLessons))

module.exports = router

