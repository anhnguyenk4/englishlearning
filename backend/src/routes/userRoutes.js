const express = require('express')
const asyncHandler = require('../utils/asyncHandler')
const { authenticateJWT } = require('../middlewares/authMiddleware')
const { upload } = require('../config/multer')
const { getProfile, updateProfile } = require('../controllers/userController')

const router = express.Router()

router.get('/profile', authenticateJWT, asyncHandler(getProfile))
router.put('/profile', authenticateJWT, upload.single('avatar'), asyncHandler(updateProfile))

module.exports = router

