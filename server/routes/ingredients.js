import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()


/* ============== GET ALL ITEMS ================= */
router.get('/get/ingredientList', async (req, res) => {
  try {
    const ingredients = await prisma.ingredient.findMany()
    res.status(200).json(ingredients)
  } catch (error) {
    console.error('Erro ao buscar os ingredientes:', error)
    res.status(500).json({ error: 'Erro ao buscar os ingredientes' })
  }
})

export default router
