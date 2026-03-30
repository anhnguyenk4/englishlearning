function normalizeText(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

function isCorrect({ question, userAnswer }) {
  const correct = normalizeText(question.correctAnswer)
  const ans = normalizeText(userAnswer)
  if (!ans) return false

  // MVP: chấm theo exact text (đã normalize)
  switch (question.type) {
    case 'MULTIPLE_CHOICE':
    case 'FILL_BLANK':
    case 'LISTENING':
    case 'WRITING':
    case 'RANDOM':
      return ans === correct
    default:
      return false
  }
}

function gradeQuiz({ questions, answers }) {
  let correctCount = 0

  for (const q of questions) {
    const userAnswer = answers[q.id] ?? answers[String(q.id)]
    if (isCorrect({ question: q, userAnswer })) correctCount += 1
  }

  const total = questions.length
  const score = total === 0 ? 0 : Math.round((correctCount / total) * 100)
  return { correctCount, totalQuestions: total, score }
}

module.exports = { gradeQuiz }

