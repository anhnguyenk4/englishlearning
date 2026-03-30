const { prisma } = require('../config/prisma')

async function getStats(req, res) {
  const [users, courses, lessons] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.lesson.count(),
  ])

  return res.json({
    stats: {
      users,
      courses,
      lessons,
    },
  })
}

async function getLeaderboard(req, res) {
  // MVP: leaderboard = top total score (sum of results)
  const rows = await prisma.leaderboard.findMany({
    take: 10,
    orderBy: { score: 'desc' },
    include: { user: { select: { id: true, name: true, email: true } } },
  })

  return res.json({
    leaderboard: rows.map((r) => ({
      userId: r.userId,
      name: r.user.name,
      email: r.user.email,
      score: r.score,
    })),
  })
}

module.exports = { getStats, getLeaderboard }

