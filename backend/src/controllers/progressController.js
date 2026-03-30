const { prisma } = require('../config/prisma')

function formatDateLabel(d) {
  try {
    const date = new Date(d)
    return `${date.getMonth() + 1}/${date.getDate()}`
  } catch {
    return ''
  }
}

async function getProgress(req, res) {
  const userId = req.user.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, name: true, avatar: true, level: true },
  })

  const completedLessons = await prisma.progress.count({ where: { userId, status: 'COMPLETED' } })

  // courses mà user đã enroll
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          _count: { select: { lessons: true } },
        },
      },
    },
  })

  // Ước lượng completedLessons theo từng khóa (MVP - N+1 nhẹ)
  const enrolledCourses = []
  for (const e of enrollments) {
    const totalLessons = e.course._count.lessons
    const completed = await prisma.progress.count({
      where: { userId, status: 'COMPLETED', lesson: { courseId: e.courseId } },
    })
    enrolledCourses.push({
      courseId: e.courseId,
      title: e.course.title,
      progressPercent: e.progress,
      totalLessons,
      completedLessons: completed,
    })
  }

  const historyRows = await prisma.result.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: { score: true, createdAt: true },
  })

  const history = historyRows
    .slice()
    .reverse()
    .map((r) => ({ dateLabel: formatDateLabel(r.createdAt), score: r.score }))

  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    include: { badge: { select: { id: true, name: true } } },
  })

  return res.json({
    user,
    completedLessons,
    enrolledCourses,
    history,
    badges: userBadges.map((b) => b.badge),
  })
}

async function updateProgress(req, res) {
  const userId = req.user.id
  const { lessonId, status } = req.body || {}
  const lid = Number(lessonId)
  if (!lid || !status) return res.status(400).json({ message: 'Thiếu lessonId/status' })
  if (!['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
    return res.status(400).json({ message: 'status không hợp lệ' })
  }

  const lesson = await prisma.lesson.findUnique({ where: { id: lid }, select: { id: true, courseId: true } })
  if (!lesson) return res.status(404).json({ message: 'Lesson không tồn tại' })

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: lesson.courseId } },
    select: { id: true },
  })
  if (!enrollment) return res.status(403).json({ message: 'Bạn chưa enroll khóa học' })

  const completedAt = status === 'COMPLETED' ? new Date() : null

  await prisma.progress.upsert({
    where: { userId_lessonId: { userId, lessonId: lid } },
    update: { status, completedAt },
    create: { userId, lessonId: lid, status, completedAt },
  })

  return res.json({ message: 'Update progress thành công' })
}

module.exports = { getProgress, updateProgress }

