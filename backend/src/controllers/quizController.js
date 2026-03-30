const { prisma } = require('../config/prisma')
const { gradeQuiz } = require('../services/quizService')
const { updateAfterQuiz } = require('../services/gamificationService')

const QUIZ_DURATION_SEC = 300

async function getQuiz(req, res) {
  const userId = req.user.id
  const { lessonId } = req.params
  const lid = Number(lessonId)

  const lesson = await prisma.lesson.findUnique({
    where: { id: lid },
    select: { id: true, courseId: true, title: true, type: true, content: true },
  })
  if (!lesson) return res.status(404).json({ message: 'Lesson không tồn tại' })

  // Kiểm tra user đã enroll course chưa
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: lesson.courseId } },
    select: { id: true },
  })
  if (!enrollment) return res.status(403).json({ message: 'Bạn chưa enroll khóa học này' })

  // Tính unlocked theo thứ tự bài học
  const lessons = await prisma.lesson.findMany({
    where: { courseId: lesson.courseId },
    select: { id: true, orderIndex: true },
    orderBy: { orderIndex: 'asc' },
  })
  const progress = await prisma.progress.findMany({
    where: { userId, lessonId: { in: lessons.map((l) => l.id) } },
    select: { lessonId: true, status: true },
  })
  const progressMap = new Map(progress.map((p) => [p.lessonId, p.status]))

  const idx = lessons.findIndex((l) => l.id === lid)
  if (idx === -1) return res.status(404).json({ message: 'Lesson không thuộc khóa học' })

  const unlocked = idx === 0 ? true : progressMap.get(lessons[idx - 1].id) === 'COMPLETED'
  if (!unlocked) return res.status(403).json({ message: 'Bài này đang bị khóa. Hãy hoàn thành bài trước.' })

  // Lấy câu hỏi
  const allQuestions = await prisma.question.findMany({
    where: { lessonId: lid },
    orderBy: { orderIndex: 'asc' },
    select: { id: true, type: true, question: true, options: true, correctAnswer: true, orderIndex: true },
  })

  // MVP: RANDOM => chọn 1 câu ngẫu nhiên để hiển thị
  const randomOnes = allQuestions.filter((q) => q.type === 'RANDOM')
  const nonRandom = allQuestions.filter((q) => q.type !== 'RANDOM')
  const chosenRandom = randomOnes.length ? [randomOnes[Math.floor(Math.random() * randomOnes.length)]] : []
  const selected = [...nonRandom, ...chosenRandom].sort((a, b) => a.orderIndex - b.orderIndex)

  const questions = selected.map((q) => ({
    id: q.id,
    type: q.type,
    prompt: q.question,
    // FRONTEND chỉ cần options cho multiple-choice
    options: q.type === 'MULTIPLE_CHOICE' ? q.options || [] : [],
  }))

  return res.json({
    lesson,
    quizDurationSec: QUIZ_DURATION_SEC,
    questions,
  })
}

async function submitQuiz(req, res) {
  const userId = req.user.id
  const { lessonId, questionIds, answers } = req.body || {}
  const lid = Number(lessonId)
  const ids = Array.isArray(questionIds) ? questionIds.map(Number) : []

  if (!lid || !ids.length) return res.status(400).json({ message: 'Thiếu lessonId/questionIds' })

  // Kiểm tra enroll
  const lesson = await prisma.lesson.findUnique({ where: { id: lid }, select: { id: true, courseId: true } })
  if (!lesson) return res.status(404).json({ message: 'Lesson không tồn tại' })

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: lesson.courseId } },
    select: { id: true },
  })
  if (!enrollment) return res.status(403).json({ message: 'Bạn chưa enroll khóa học này' })

  const questions = await prisma.question.findMany({
    where: { lessonId: lid, id: { in: ids } },
    select: { id: true, type: true, correctAnswer: true },
  })

  if (questions.length !== ids.length) {
    return res.status(400).json({ message: 'questionIds không hợp lệ cho lesson này' })
  }

  const graded = gradeQuiz({ questions, answers: answers || {} })

  await prisma.result.create({ data: { userId, lessonId: lid, score: graded.score } })
  const gamed = await updateAfterQuiz({ prisma, userId, lessonId: lid, score: graded.score })

  return res.json({
    ...graded,
    level: gamed.level,
  })
}

module.exports = { getQuiz, submitQuiz }

