const { prisma } = require('../config/prisma')

async function adminCreateQuestion(req, res) {
  const { lessonId, type, question, options, correctAnswer, orderIndex } = req.body || {}
  if (!lessonId || !type || !question || correctAnswer === undefined || orderIndex === undefined) {
    return res.status(400).json({ message: 'Thiếu dữ liệu tạo question' })
  }

  const q = await prisma.question.create({
    data: {
      lessonId: Number(lessonId),
      type,
      question,
      options: options ?? null,
      correctAnswer,
      orderIndex: Number(orderIndex),
    },
  })

  return res.status(201).json({ question: q })
}

async function adminUpdateQuestion(req, res) {
  const { id } = req.params
  const { type, question, options, correctAnswer, orderIndex } = req.body || {}

  const q = await prisma.question.update({
    where: { id: Number(id) },
    data: {
      type,
      question,
      options: options ?? null,
      correctAnswer,
      orderIndex: orderIndex !== undefined ? Number(orderIndex) : undefined,
    },
  })

  return res.json({ question: q })
}

async function adminDeleteQuestion(req, res) {
  const { id } = req.params
  await prisma.question.delete({ where: { id: Number(id) } })
  return res.json({ message: 'Xóa question thành công' })
}

async function adminListQuestions(req, res) {
  const { lessonId } = req.params
  const questions = await prisma.question.findMany({
    where: { lessonId: Number(lessonId) },
    orderBy: { orderIndex: 'asc' },
  })
  return res.json({ questions })
}

module.exports = { adminCreateQuestion, adminUpdateQuestion, adminDeleteQuestion, adminListQuestions }

