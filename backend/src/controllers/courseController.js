const { prisma } = require('../config/prisma')

async function listCourses(req, res) {
  const userId = req.user ? req.user.id : null
  const { level } = req.query || {}

  const where = {}
  if (level && level !== 'ALL') where.level = level

  const courses = await prisma.course.findMany({
    where,
    select: {
      id: true,
      title: true,
      description: true,
      level: true,
      duration: true,
      _count: { select: { lessons: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const enrollmentMap = new Map()
  if (userId) {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      select: { courseId: true, progress: true },
    })
    enrollments.forEach((e) => enrollmentMap.set(e.courseId, e.progress))
  }

  return res.json({
    courses: courses.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      level: c.level,
      duration: c.duration,
      lessonsCount: c._count.lessons,
      enrolled: userId ? enrollmentMap.has(c.id) : false,
      progress: userId ? enrollmentMap.get(c.id) || 0 : 0,
    })),
  })
}

async function getCourse(req, res) {
  const userId = req.user.id
  const { id } = req.params

  const course = await prisma.course.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      title: true,
      description: true,
      level: true,
      duration: true,
      createdAt: true,
      _count: { select: { lessons: true } },
    },
  })

  if (!course) return res.status(404).json({ message: 'Course không tồn tại' })

  const enrolled = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: course.id } },
    select: { id: true },
  })

  return res.json({
    course: {
      ...course,
      enrolled: !!enrolled,
      lessonsCount: course._count.lessons,
    },
  })
}

async function enrollCourse(req, res) {
  const userId = req.user.id
  const { id } = req.params
  const courseId = Number(id)

  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { id: true } })
  if (!course) return res.status(404).json({ message: 'Course không tồn tại' })

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: {},
    create: { userId, courseId, progress: 0 },
  })

  // Ensure Progress for each lesson
  const lessons = await prisma.lesson.findMany({ where: { courseId }, select: { id: true } })
  const lessonIds = lessons.map((l) => l.id)

  const existing = await prisma.progress.findMany({
    where: { userId, lessonId: { in: lessonIds } },
    select: { lessonId: true },
  })
  const existingSet = new Set(existing.map((p) => p.lessonId))

  const toCreate = lessons.filter((l) => !existingSet.has(l.id)).map((l) => ({
    userId,
    lessonId: l.id,
    status: 'NOT_STARTED',
  }))

  if (toCreate.length) {
    await prisma.progress.createMany({ data: toCreate })
  }

  return res.json({ message: 'Đã tham gia khóa học' })
}

// ---------------- Admin CRUD ----------------
async function adminCreateCourse(req, res) {
  const { title, description, level, duration } = req.body || {}
  if (!title || !description || !level || !duration) return res.status(400).json({ message: 'Thiếu dữ liệu' })

  const course = await prisma.course.create({
    data: {
      title,
      description,
      level,
      duration: Number(duration),
    },
  })
  return res.status(201).json({ course })
}

async function adminUpdateCourse(req, res) {
  const { id } = req.params
  const { title, description, level, duration } = req.body || {}

  const course = await prisma.course.update({
    where: { id: Number(id) },
    data: {
      title,
      description,
      level,
      duration: duration !== undefined ? Number(duration) : undefined,
    },
  })
  return res.json({ course })
}

async function adminDeleteCourse(req, res) {
  const { id } = req.params
  await prisma.course.delete({ where: { id: Number(id) } })
  return res.json({ message: 'Xóa khóa học thành công' })
}

async function adminListCourses(req, res) {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      level: true,
      duration: true,
      _count: { select: { lessons: true } },
    },
  })
  return res.json({ courses })
}

module.exports = {
  listCourses,
  getCourse,
  enrollCourse,
  adminCreateCourse,
  adminListCourses,
  adminUpdateCourse,
  adminDeleteCourse,
}

