import express from 'express'
import { PrismaClient } from '@prisma/client'
import { useParams } from 'react-router-dom'

const router = express.Router()
const prisma = new PrismaClient()

/* ============== CREATE ================= */
router.post('/new/category', async (req, res) => {
  const { name, isActive} = req.body
  try {
    const newCategory = await prisma.category.create ({
      data: {
        name,
        isActive: isActive === 'true' || isActive === true,
        //updatedAt: new Date(),
      },
    })
    res.status(201).json(newCategory)
  } catch (error) {
    console.error('Error ao criar nova categoria', error)
    res.status(500).json({ error: 'Error ao criar categoria'})
  }
})


/* ============== GET ALL ITEMS ================= */
router.get('/get/categoryList', async (req, res) => {
  try {
    const categories = await prisma.category.findMany()
    res.status(200).json(categories)
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    res.status(500).json({ error: 'Erro ao buscar categorias' })
  }
})


/* ============== GET ALL ITEMS - Active ================= */
router.get('/get/categoryList/active', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where:{
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      }
    });
    res.status(200).json(categories)
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    res.status(500).json({ error: 'Erro ao buscar categorias' })
  }
})


/* ============== GET ONE ITEM - FOR ID ================= */
router.get('/get/categoryID/:id', async (req, res) => {
  const categoryId = parseInt(req.params.id);

  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error('Erro ao buscar categoria por ID:', error);
    res.status(500).json({ error: 'Erro ao buscar categoria' });
  }
});


/* ============== UPDATE ================= */
router.put('/update/category/:id', async (req, res) => {
  const categoryId = parseInt(req.params.id)
  const { name, isActive} =  req.body

  try {
    const updated = await prisma.category.update({
      where: { id: categoryId},
      data: {
        name,
        isActive: isActive === 'true' || isActive === true,
        //updatedAt: new Date(),
      },
    })
    res.status(200).json(updated)
  }catch (error) {
    console.error('Error ao atualizar a categoria', error)
    res.status(500).json({error: 'Erro ao atualizar a categoria'})
  }
})


/* ============== DELETE ================= */
router.delete('/delete/category/:id', async (req, res) => {
  const categoryId = parseInt(req.params.id)
  try {
    const res = await prisma.category.delete({
      where: { id: categoryId},
    })
    res.status(200).end()
  }catch (error) {
    console.error('Error ao atualizar a categoria', error)
    res.status(500).json({error: 'Erro ao atualizar a categoria'})
  }
})

export default router
