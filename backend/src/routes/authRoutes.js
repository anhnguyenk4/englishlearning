const express = require('express')
const asyncHandler = require('../utils/asyncHandler')
const { register, login, changePassword } = require('../controllers/authController')
const { authenticateJWT } = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/register', asyncHandler(register))
router.post('/login', asyncHandler(login))

// Đổi mật khẩu
router.put('/change-password', authenticateJWT, asyncHandler(changePassword))

module.exports = router

