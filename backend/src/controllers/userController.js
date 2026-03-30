const path = require('path')
const { prisma } = require('../config/prisma')

async function getProfile(req, res) {
  const userId = req.user.id
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, name: true, avatar: true, level: true, createdAt: true },
  })
  return res.json({ user })
}

async function updateProfile(req, res) {
  const userId = req.user.id
  const { name } = req.body || {}

  let avatar = undefined
  if (req.file) {
    // Lưu đường dẫn tương đối để frontend hiển thị (MVP)
    avatar = `/uploads/${path.basename(req.file.path)}`
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      name: name ?? undefined,
      avatar: avatar !== undefined ? avatar : undefined,
    },
    select: { id: true, email: true, role: true, name: true, avatar: true, level: true },
  })

  return res.json({ message: 'Cập nhật profile thành công', user: updated })
}

module.exports = { getProfile, updateProfile }

