const express = require('express')
const asyncHandler = require('../utils/asyncHandler')
const { authenticateJWT } = require('../middlewares/authMiddleware')
const { getLeaderboard } = require('../controllers/adminController')

const router = express.Router()

router.get('/leaderboard', authenticateJWT, asyncHandler(getLeaderboard))

module.exports = router

