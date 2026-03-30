const express = require('express')
const asyncHandler = require('../utils/asyncHandler')
const { authenticateJWT, requireRole } = require('../middlewares/authMiddleware')
const { getStats, getLeaderboard } = require('../controllers/adminController')
const {
  adminCreateCourse,
  adminListCourses,
  adminUpdateCourse,
  adminDeleteCourse,
} = require('../controllers/courseController')
const {
  adminCreateLesson,
  adminListLessons,
  adminUpdateLesson,
  adminDeleteLesson,
} = require('../controllers/lessonController')
const {
  adminCreateQuestion,
  adminListQuestions,
  adminUpdateQuestion,
  adminDeleteQuestion,
} = require('../controllers/questionController')
const { adminUpdateUserRole } = require('../controllers/adminUserController')

const router = express.Router()

router.get('/admin/stats', authenticateJWT, requireRole('ADMIN'), asyncHandler(getStats))
// (Public leaderboard endpoint được tách riêng ở /api/leaderboard)
router.get('/admin/leaderboard', authenticateJWT, requireRole('ADMIN'), asyncHandler(getLeaderboard))

// CRUD Courses
router.get('/admin/courses', authenticateJWT, requireRole('ADMIN'), asyncHandler(adminListCourses))
router.post('/admin/courses', authenticateJWT, requireRole('ADMIN'), asyncHandler(adminCreateCourse))
router.put('/admin/courses/:id', authenticateJWT, requireRole('ADMIN'), asyncHandler(adminUpdateCourse))
router.delete('/admin/courses/:id', authenticateJWT, requireRole('ADMIN'), asyncHandler(adminDeleteCourse))

// CRUD Lessons
router.get('/admin/lessons/:courseId', authenticateJWT, requireRole('ADMIN'), asyncHandler(adminListLessons))
router.post('/admin/lessons', authenticateJWT, requireRole('ADMIN'), asyncHandler(adminCreateLesson))
router.put('/admin/lessons/:id', authenticateJWT, requireRole('ADMIN'), asyncHandler(adminUpdateLesson))
router.delete('/admin/lessons/:id', authenticateJWT, requireRole('ADMIN'), asyncHandler(adminDeleteLesson))

// CRUD Questions
router.get('/admin/questions/:lessonId', authenticateJWT, requireRole('ADMIN'), asyncHandler(adminListQuestions))
router.post('/admin/questions', authenticateJWT, requireRole('ADMIN'), asyncHandler(adminCreateQuestion))
router.put('/admin/questions/:id', authenticateJWT, requireRole('ADMIN'), asyncHandler(adminUpdateQuestion))
router.delete('/admin/questions/:id', authenticateJWT, requireRole('ADMIN'), asyncHandler(adminDeleteQuestion))

// Manage users: update role
router.patch('/admin/users/:id/role', authenticateJWT, requireRole('ADMIN'), asyncHandler(adminUpdateUserRole))

module.exports = router

