const { prisma } = require('../config/prisma')

async function adminUpdateUserRole(req, res) {
  const { id } = req.params
  const { role } = req.body || {}
  if (!role) return res.status(400).json({ message: 'Thiếu role' })
  if (!['USER', 'ADMIN'].includes(role)) return res.status(400).json({ message: 'Role không hợp lệ' })

  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { role },
    select: { id: true, email: true, role: true, name: true, avatar: true, level: true },
  })

  return res.json({ user })
}

module.exports = { adminUpdateUserRole }

