const express = require('express')
const asyncHandler = require('../utils/asyncHandler')
const { authenticateJWT } = require('../middlewares/authMiddleware')
const { getQuiz, submitQuiz } = require('../controllers/quizController')

const router = express.Router()

router.get('/quiz/:lessonId', authenticateJWT, asyncHandler(getQuiz))
router.post('/quiz/submit', authenticateJWT, asyncHandler(submitQuiz))

module.exports = router

