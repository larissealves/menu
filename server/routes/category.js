import express from 'express'
import { PrismaClient } from '@prisma/client'
import { useParams } from 'react-router-dom'

const router = express.Router()
const prisma = new PrismaClient()

router.post('/new/category', async (req, res) => {
  const { name, isActive} = req.body
  try {
    const newCategory = await prisma.category.create ({
      data: {
        name,
        isActive: isActive === 'true' || isActive === true,
        updatedAt: new Date(),
      },
    })
    res.status(201).json(newCategory)
  } catch (error) {
    console.error('Error ao criar nova categoria', error)
    res.status(500).json({ error: 'Error ao criar categoria'})
  }
})

router.get('/get/categoryList', async (req, res) => {
  try {
    const categories = await prisma.category.findMany()
    res.status(200).json(categories)
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    res.status(500).json({ error: 'Erro ao buscar categorias' })
  }
})

router.put('/update/category/:id', async (req, res) => {
  const categoryId = parseInt(req.params.id)
  const { name, isActive} =  res.body

  try {
    const updated = await prisma.category.update({
      where: { id: categoryId},
      data: {
        name,
        isActive: Boolean(isActive),
        updatedAt: new Date(),
      },
    })
    res.status(200).json(updated)
  }catch (error) {
    console.error('Error ao atualizar a categoria', error)
    res.status(500).json({error: 'Erro ao atualizar a categoria'})
  }
})

export default router
