async function updateAfterQuiz({ prisma, userId, lessonId, score }) {
  // 1) Cập nhật progress theo từng bài học
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, select: { id: true, courseId: true } })
  if (!lesson) throw new Error('Lesson không tồn tại')

  const status = score >= 60 ? 'COMPLETED' : 'IN_PROGRESS'

  const completedAt = status === 'COMPLETED' ? new Date() : null

  await prisma.progress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { status, completedAt },
    create: { userId, lessonId, status, completedAt },
  })

  // 2) Tính lại tiến độ khóa học (Enrollment.progress)
  const totalLessons = await prisma.lesson.count({ where: { courseId: lesson.courseId } })
  const completedLessons = await prisma.progress.count({
    where: {
      userId,
      status: 'COMPLETED',
      lesson: { courseId: lesson.courseId },
    },
  })

  const progressPercent = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100)

  await prisma.enrollment.update({
    where: { userId_courseId: { userId, courseId: lesson.courseId } },
    data: { progress: progressPercent },
  })

  // 3) Cập nhật level user
  const completedTotal = await prisma.progress.count({ where: { userId, status: 'COMPLETED' } })
  const level = Math.floor(completedTotal / 5) + 1
  await prisma.user.update({ where: { id: userId }, data: { level } })

  // 4) Award badge (MVP theo rule đơn giản trong condition JSON)
  const badges = await prisma.badge.findMany()
  const quizzesSubmitted = await prisma.result.count({ where: { userId } })

  for (const b of badges) {
    const condition = b.condition || {}
    let shouldAward = false

    if (condition.type === 'COMPLETED_LESSONS') {
      shouldAward = completedTotal >= Number(condition.min || 0)
    } else if (condition.type === 'QUIZZES_SUBMITTED') {
      shouldAward = quizzesSubmitted >= Number(condition.min || 0)
    }

    if (!shouldAward) continue

    const already = await prisma.userBadge.count({ where: { userId, badgeId: b.id } })
    if (!already) {
      await prisma.userBadge.create({ data: { userId, badgeId: b.id } })
    }
  }

  // 5) Cập nhật leaderboard (MVP: tổng score các kết quả quiz)
  const agg = await prisma.result.aggregate({
    _sum: { score: true },
    where: { userId },
  })
  const totalScore = agg._sum.score || 0

  await prisma.leaderboard.upsert({
    where: { userId },
    update: { score: totalScore },
    create: { userId, score: totalScore },
  })

  return { status, level }
}

module.exports = { updateAfterQuiz }

