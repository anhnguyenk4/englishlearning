/* eslint-disable no-console */
const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Xoá dữ liệu cũ để seed lại cho dễ demo (MVP)
  await prisma.result.deleteMany()
  await prisma.progress.deleteMany()
  await prisma.userBadge.deleteMany()
  await prisma.leaderboard.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.question.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.badge.deleteMany()
  await prisma.course.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await bcrypt.hash('admin123', 10)

  await prisma.user.create({
    data: {
      email: 'admin@nedu.edu',
      password: passwordHash,
      role: 'ADMIN',
      name: 'Admin NEDU',
      level: 10,
    },
  })

  await prisma.badge.createMany({
    data: [
      { name: 'Starter', condition: { type: 'COMPLETED_LESSONS', min: 1 } },
      { name: 'Level Up', condition: { type: 'COMPLETED_LESSONS', min: 5 } },
      { name: 'Quiz Hunter', condition: { type: 'QUIZZES_SUBMITTED', min: 3 } },
    ],
  })

  // Courses
  const courseBeginner = await prisma.course.create({
    data: {
      title: 'English Basics',
      description: 'Từ vựng & ngữ pháp nền tảng cho người mới bắt đầu.',
      level: 'BEGINNER',
      duration: 30,
    },
  })

  const courseIntermediate = await prisma.course.create({
    data: {
      title: 'Everyday Communication',
      description: 'Luyện câu nói theo ngữ cảnh: hỏi đáp, mô tả, hội thoại.',
      level: 'INTERMEDIATE',
      duration: 45,
    },
  })

  const courseAdvanced = await prisma.course.create({
    data: {
      title: 'Advanced Grammar & Reading',
      description: 'Nâng cấp ngữ pháp và kỹ năng đọc hiểu theo chuẩn nâng cao.',
      level: 'ADVANCED',
      duration: 60,
    },
  })

  const courses = [courseBeginner, courseIntermediate, courseAdvanced]

  // Lessons + Questions
  for (const course of courses) {
    const lesson1 = await prisma.lesson.create({
      data: {
        courseId: course.id,
        title: 'Lesson 1: Greetings',
        type: 'VOCABULARY',
        content: 'Xin chào / Chào hỏi (VOCAB).',
        orderIndex: 0,
      },
    })

    const lesson2 = await prisma.lesson.create({
      data: {
        courseId: course.id,
        title: 'Lesson 2: Present Simple',
        type: 'GRAMMAR',
        content: 'Cách dùng Present Simple: I/You/We/They + V, He/She/It + Vs.',
        orderIndex: 1,
      },
    })

    const lesson3 = await prisma.lesson.create({
      data: {
        courseId: course.id,
        title: 'Lesson 3: Listening (Demo)',
        type: 'LISTENING',
        content: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        orderIndex: 2,
      },
    })

    // Questions: lesson1
    await prisma.question.createMany({
      data: [
        {
          lessonId: lesson1.id,
          type: 'MULTIPLE_CHOICE',
          question: 'Chọn đáp án đúng: "How are you?"',
          options: ['I am fine', 'I am five', 'I am from'],
          correctAnswer: 'I am fine',
          orderIndex: 0,
        },
        {
          lessonId: lesson1.id,
          type: 'FILL_BLANK',
          question: 'Điền vào chỗ trống: "Nice to ____ you."',
          options: null,
          correctAnswer: 'meet',
          orderIndex: 1,
        },
      ],
    })

    // Questions: lesson2
    await prisma.question.createMany({
      data: [
        {
          lessonId: lesson2.id,
          type: 'MULTIPLE_CHOICE',
          question: 'Chọn câu đúng: "She ____ to school every day."',
          options: ['go', 'goes', 'going'],
          correctAnswer: 'goes',
          orderIndex: 0,
        },
        {
          lessonId: lesson2.id,
          type: 'WRITING',
          question: 'Viết lại câu: "I go to work." (Trả lời đúng chính tả)',
          options: null,
          correctAnswer: 'I go to work.',
          orderIndex: 1,
        },
        {
          lessonId: lesson2.id,
          type: 'RANDOM',
          question: 'Câu ngẫu nhiên (MVP): "Complete: They ____."',
          options: null,
          correctAnswer: 'play',
          orderIndex: 2,
        },
      ],
    })

    // Questions: lesson3
    await prisma.question.createMany({
      data: [
        {
          lessonId: lesson3.id,
          type: 'LISTENING',
          question: 'Nghe audio (demo) và nhập đáp án: "Hello!"',
          options: null,
          correctAnswer: 'hello',
          orderIndex: 0,
        },
      ],
    })
  }

  // Tạo enrollment/progress cho demo admin (không bắt buộc)
  const admin = await prisma.user.findUnique({ where: { email: 'admin@nedu.edu' } })
  if (admin) {
    for (const course of await prisma.course.findMany()) {
      await prisma.enrollment.create({
        data: {
          userId: admin.id,
          courseId: course.id,
          progress: 0,
        },
      }).catch(() => {})
    }
  }

  console.log('Seed done!')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

