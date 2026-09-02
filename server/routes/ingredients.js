import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

function adminAuth(req, res, next) {
  const adminKey = req.headers["x-admin-key"];

  if (!adminKey) {
    return res.status(401).json({
      error: "Admin key required"
    });
  }

  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({
      error: "Invalid admin key"
    });
  }

  next();
}

/* ============== CREATE ================= */
router.post('/ingredients', adminAuth, async (req, res) => {
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
router.get('/ingredients/:id', async (req, res) => {
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
router.put('/ingredients/:id', adminAuth, async (req, res) => {
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
router.get('/ingredients', 
  async (req, res) => {
  try {

    const filterOnlyActives = req.query.onlyActives === 'true' 
    ? true 
    : req.query.onlyActives === 'false' ? false : null;

    const hasPagination =
      req.query.itemsPerPage !== undefined ||
      req.query.currentPage !== undefined;

    const paginationLimit = Number(req.query.limitItemsPerPage) || 6;
    const paginationCurrentPage = Number(req.query.currentPage) || 1;

    const skip = hasPagination
      ? (paginationCurrentPage - 1) * paginationLimit
      : undefined;

    const take = hasPagination
      ? paginationLimit
      : undefined;

    const where = {
      ...(filterOnlyActives !== null && {
        isActive: filterOnlyActives,
      }),
    }

    const [ingredients, totalItems ]= await Promise.all([
    prisma.ingredient.findMany({
      where,
      skip,
      take,

      orderBy: [
        {isActive:'desc'},
        {name:'asc'},
      ],
    }),

    prisma.ingredient.count({
      where,
    }),
    ])

    const paginationDetails = {
      totalPages: Math.ceil(totalItems / paginationLimit),
      currentPage: paginationCurrentPage,
      itemsPerPage: paginationLimit,
    }


     res.status(200).json({
      data: ingredients,
      paginationDetails,
    })

  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os ingredientes' })
  }
}),


/* ============== DELETE ================= */
router.delete('/ingredients/:id', adminAuth, async (req, res) => {
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
