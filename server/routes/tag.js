import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()


/* ============== GET ALL ITEMS ================= */
router.get('/get/tagList', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany()
    res.status(200).json(tags)
  } catch (error) {
    console.error('Erro ao buscar as tags', error)
    res.status(500).json({ error: 'Erro ao buscar as tags' })
  }
})

export default router
