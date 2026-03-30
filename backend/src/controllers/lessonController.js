const { prisma } = require('../config/prisma')

async function getLessons(req, res) {
  const userId = req.user.id
  const { courseId } = req.params
  const cid = Number(courseId)

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: cid } },
    select: { id: true },
  })
  if (!enrollment) return res.status(403).json({ message: 'Bạn chưa enroll khóa học này' })

  const lessons = await prisma.lesson.findMany({
    where: { courseId: cid },
    select: { id: true, title: true, type: true, content: true, orderIndex: true },
    orderBy: { orderIndex: 'asc' },
  })

  const progress = await prisma.progress.findMany({
    where: { userId, lessonId: { in: lessons.map((l) => l.id) } },
    select: { lessonId: true, status: true },
  })
  const progressMap = new Map(progress.map((p) => [p.lessonId, p.status]))

  const response = lessons.map((l, idx) => {
    const prev = idx === 0 ? null : lessons[idx - 1]
    const prevCompleted = idx === 0 ? true : progressMap.get(prev.id) === 'COMPLETED'
    const status = progressMap.get(l.id) || 'NOT_STARTED'
    return {
      id: l.id,
      title: l.title,
      type: l.type,
      content: l.content,
      orderIndex: l.orderIndex,
      status,
      unlocked: prevCompleted,
    }
  })

  return res.json({ lessons: response })
}

// ---------------- Admin CRUD Lesson ----------------
async function adminCreateLesson(req, res) {
  const { courseId, title, type, content, orderIndex } = req.body || {}
  if (!courseId || title === undefined || !type || content === undefined || orderIndex === undefined) {
    return res.status(400).json({ message: 'Thiếu dữ liệu tạo lesson' })
  }

  const lesson = await prisma.lesson.create({
    data: {
      courseId: Number(courseId),
      title,
      type,
      content,
      orderIndex: Number(orderIndex),
    },
  })

  return res.status(201).json({ lesson })
}

async function adminUpdateLesson(req, res) {
  const { id } = req.params
  const { title, type, content, orderIndex } = req.body || {}

  const lesson = await prisma.lesson.update({
    where: { id: Number(id) },
    data: {
      title,
      type,
      content,
      orderIndex: orderIndex !== undefined ? Number(orderIndex) : undefined,
    },
  })

  return res.json({ lesson })
}

async function adminDeleteLesson(req, res) {
  const { id } = req.params
  await prisma.lesson.delete({ where: { id: Number(id) } })
  return res.json({ message: 'Xóa lesson thành công' })
}

async function adminListLessons(req, res) {
  const { courseId } = req.params
  const lessons = await prisma.lesson.findMany({
    where: { courseId: Number(courseId) },
    orderBy: { orderIndex: 'asc' },
  })
  return res.json({ lessons })
}

module.exports = { getLessons, adminCreateLesson, adminUpdateLesson, adminDeleteLesson, adminListLessons }

