import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

// Criar novo prato
router.post('/new/addDishes', async (req, res) => {
  const { name, price, description, categoryId } = req.body

  try {
    const newDish = await prisma.dish.create({
      data: {
        name,
        price: parseFloat(price),
        description,
        categoryId: parseInt(categoryId),
      },
    })

    res.status(201).json(newDish)
  } catch (error) {
    console.error('Erro ao criar prato:', error)
    res.status(500).json({ error: 'Erro ao criar prato' })
  }
})

// Listar todos os pratos
router.get('/get/dishes', async (req, res) => {
  try {
    const dishes = await prisma.dish.findMany({
      include: {
        category: true, 
      },
    })
    res.status(200).json(dishes)
  } catch (error) {
    console.error('Erro ao buscar pratos:', error)
    res.status(500).json({ error: 'Erro ao buscar pratos' })
  }
})

export default router
