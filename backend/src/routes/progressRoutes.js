const express = require('express')
const asyncHandler = require('../utils/asyncHandler')
const { authenticateJWT } = require('../middlewares/authMiddleware')
const { getProgress, updateProgress } = require('../controllers/progressController')

const router = express.Router()

router.get('/progress', authenticateJWT, asyncHandler(getProgress))
router.post('/progress/update', authenticateJWT, asyncHandler(updateProgress))

module.exports = router

