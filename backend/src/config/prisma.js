const { PrismaClient } = require('@prisma/client')

// PrismaClient được khởi tạo 1 lần để tránh tạo nhiều connection
const prisma = new PrismaClient()

module.exports = { prisma }

