import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()


const requireAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  const api_secret = `Bearer ${process.env.API_SECRET}`;
  if (!auth || auth !== api_secret) {
    return res.status(401).json({
      error: "Não autorizado :D ;D",
    });
  }
  next();
};

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
router.post('/categories', requireAuth, adminAuth, async (req, res) => {
  const { name, isActive } = req.body
  try {
    const newCategory = await prisma.category.create({
      data: {
        name,
        isActive: isActive === 'true' || isActive === true,
        //updatedAt: new Date(),
      },
    })
    res.status(201).json(newCategory)
  } catch (error) {
    console.error('Error ao criar nova categoria', error)
    res.status(500).json({ error: 'Error ao criar categoria' })
  }
})


/* ============== GET ALL ITEMS ================= */
router.get('/categories',
  requireAuth, async (req, res) => {

    try {
      const filterOnlyActives = req.query.onlyActives === 'true'
        ? true
        : req.query.onlyActives === 'false' ? false : null;

      const hasPagination =
        req.query.itemsPerPage !== undefined ||
        req.query.currentPage !== undefined;

      const paginationLimit = Number(req.query.itemsPerPage) || 6;
      const paginationCurrentPage = Number(req.query.currentPage) || 1;

      const skip = hasPagination ?
        (paginationCurrentPage - 1) * paginationLimit : undefined;

      const take = hasPagination ?
        paginationLimit : undefined;

      const where = {
        ...(filterOnlyActives !== null && {
          isActive: filterOnlyActives,
        }),
      }

      const [categories, totalItems] = await Promise.all([
        prisma.category.findMany({
          where,
          skip,
          take,

          orderBy: [
            { isActive: 'desc' },
            { name: 'asc' },
          ],
        }),

        prisma.category.count({
          where,
        }),
      ])

      const paginationDetails = {
        totalPages: Math.ceil(totalItems / paginationLimit),
        currentPage: paginationCurrentPage,
        itemsPerPage: paginationLimit,
      }

      res.status(200).json({
        data: categories,
        paginationDetails,
      })

    } catch (error) {
      res.status(500).json({
        error: 'Erro ao buscar categorias'
      })
    }
  });


/* ============== GET ONE ITEM - FOR ID ================= */
router.get('/categories/:id', async (req, res) => {
  const categoryId = parseInt(req.params.id);

  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    res.status(200).json({
      data: category,
    });

  } catch (error) {
    console.error('Erro ao buscar categoria por ID:', error);
    res.status(500).json({ error: 'Erro ao buscar categoria' });
  }
});


/* ============== UPDATE ================= */
router.put('/categories/:id', requireAuth, adminAuth, async (req, res) => {
  const categoryId = parseInt(req.params.id)
  const { name, isActive } = req.body

  try {
    const updated = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        isActive: isActive === 'true' || isActive === true,
        //updatedAt: new Date(),
      },
    })
    res.status(200).json(updated)
  } catch (error) {
    console.error('Error ao atualizar a categoria', error)
    res.status(500).json({ error: 'Erro ao atualizar a categoria' })
  }
})


/* ============== DELETE ================= */
router.delete('/categories/:id', requireAuth, adminAuth, async (req, res) => {
  const categoryId = parseInt(req.params.id)
  try {
    const res = await prisma.category.delete({
      where: { id: categoryId },
    })
    res.status(200).json()
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar a categoria id ', categoryId })
  }
})

export default router
