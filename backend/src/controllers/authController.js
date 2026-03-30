const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { prisma } = require('../config/prisma')
const { jwtSecret, jwtExpiresIn } = require('../config/jwt')

async function register(req, res) {
  const { email, password, name } = req.body || {}
  if (!email || !password) return res.status(400).json({ message: 'Email và mật khẩu bắt buộc' })

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(409).json({ message: 'Email đã tồn tại' })

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: passwordHash,
      name: name || null,
    },
    select: { id: true, email: true, role: true, name: true, avatar: true, level: true },
  })

  return res.status(201).json({ message: 'Đăng ký thành công', user })
}

async function login(req, res) {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ message: 'Email và mật khẩu bắt buộc' })

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' })

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' })

  const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn })

  const safeUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    avatar: user.avatar,
    level: user.level,
  }

  return res.json({ token, user: safeUser })
}

async function changePassword(req, res) {
  const userId = req.user.id
  const { oldPassword, newPassword } = req.body || {}
  if (!oldPassword || !newPassword) return res.status(400).json({ message: 'Thiếu oldPassword/newPassword' })

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' })

  const ok = await bcrypt.compare(oldPassword, user.password)
  if (!ok) return res.status(400).json({ message: 'Mật khẩu cũ không đúng' })

  const passwordHash = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({ where: { id: userId }, data: { password: passwordHash } })

  return res.json({ message: 'Đổi mật khẩu thành công' })
}

module.exports = { register, login, changePassword }

