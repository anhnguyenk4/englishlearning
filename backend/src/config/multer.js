const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, '../../uploads'))
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname || '')
    const base = path.basename(file.originalname || 'avatar', ext)
    const safeBase = base.replace(/\s+/g, '-').toLowerCase()
    cb(null, `${safeBase}-${Date.now()}${ext}`)
  },
})

// MVP: chỉ upload ảnh avatar
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (_req, file, cb) => {
    const ok = file.mimetype.startsWith('image/')
    cb(ok ? null : new Error('Chỉ hỗ trợ ảnh'), ok)
  },
})

module.exports = { upload }

