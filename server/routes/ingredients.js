import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

/* ============== CREATE ================= */
router.post('/new/ingredient', async (req, res) => {
  const { name, isActive} = req.body
  try {
    const newIngredient = await prisma.ingredient.create ({
      data: {
        name,
        isActive: isActive === 'true' || isActive === true,
        //updatedAt: new Date(),
      },
    })
    res.status(201).json(newIngredient)
  } catch (error) {
    console.error('Error ao adicionar ingrediente', error)
    res.status(500).json({ error: 'Error ao adicionar ingrediente'})
  }
})


/* ============== GET ONE ITEM - FOR ID ================= */
router.get('/get/ingredientID/:id', async (req, res) => {
  const ingredientId = parseInt(req.params.id);

  try {
    const ingredient = await prisma.ingredient.findUnique({
      where: { id: ingredientId },
    });

    if (!ingredient) {
      return res.status(404).json({ error: 'ingrediente não encontrada' });
    }

    res.status(200).json(ingredient);
  } catch (error) {
    console.error('Erro ao buscar ingrediente por ID:', error);
    res.status(500).json({ error: 'Erro ao buscar ingrediente' });
  }
});


/* ============== UPDATE ================= */
router.put('/update/ingredient/:id', async (req, res) => {
  const ingredientId = parseInt(req.params.id)
  const { name, isActive} =  req.body

  try {
    const updated = await prisma.ingredient.update({
      where: { id: ingredientId},
      data: {
        name,
        isActive: isActive === 'true' || isActive === true,
        //updatedAt: new Date(),
      },
    })
    res.status(200).json(updated)
  }catch (error) {
    console.error('Error ao atualizar a ingrediente', error)
    res.status(500).json({error: 'Erro ao atualizar a ingrediente'})
  }
})

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

/* ============== GET ALL ITEMS - Active ================= */
router.get('/get/ingredientList/active', async (req, res) => {
  try {
    const ingredients = await prisma.ingredient.findMany
    ({
      where:{
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      }
    });
    res.status(200).json(ingredients)
  } catch (error) {
    console.error('Erro ao buscar os ingredientes:', error)
    res.status(500).json({ error: 'Erro ao buscar os ingredientes' })
  }
})


/* ============== DELETE ================= */
router.delete('/delete/ingredient/:id', async (req, res) => {
  const ingredientId = parseInt(req.params.id)
  try {
    const res = await prisma.ingredient.delete({
      where: { id: ingredientId},
    })
    res.status(200).end()
  }catch (error) {
    console.error('Error ao deletar o ingrediente', error)
    res.status(500).json({error: 'Erro ao deletar o ingrediente'})
  }
})

export default router
