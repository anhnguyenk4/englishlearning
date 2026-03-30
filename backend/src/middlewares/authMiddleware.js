const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../config/jwt')

function authenticateJWT(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Chưa cung cấp token' })
  }

  const token = header.slice('Bearer '.length)
  try {
    const payload = jwt.verify(token, jwtSecret)
    req.user = { id: payload.userId, role: payload.role }
    return next()
  } catch (e) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' })
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Chưa xác thực' })
    if (req.user.role !== role) return res.status(403).json({ message: 'Không đủ quyền' })
    return next()
  }
}

module.exports = { authenticateJWT, requireRole }

