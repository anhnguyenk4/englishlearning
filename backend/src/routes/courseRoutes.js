const express = require('express')
const asyncHandler = require('../utils/asyncHandler')
const { authenticateJWT } = require('../middlewares/authMiddleware')
const {
  listCourses,
  getCourse,
  enrollCourse,
  adminCreateCourse,
} = require('../controllers/courseController')
const { requireRole } = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/courses', authenticateJWT, asyncHandler(listCourses))
router.get('/courses/:id', authenticateJWT, asyncHandler(getCourse))
router.post('/courses/:id/enroll', authenticateJWT, asyncHandler(enrollCourse))
// Theo spec: admin tạo khóa học tại POST /api/courses
router.post('/courses', authenticateJWT, requireRole('ADMIN'), asyncHandler(adminCreateCourse))

module.exports = router

