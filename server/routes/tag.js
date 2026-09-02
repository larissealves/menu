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
router.post('/tags', adminAuth,  async (req, res) => {
  const { name, isActive } = req.body
  try {
    const newTag = await prisma.tag.create({
      data: {
        name,
        isActive: isActive === 'true' || isActive === true,
        //updatedAt: new Date(),
      },
    })
    res.status(201).json(newTag)
  } catch (error) {
    console.error('Error ao adicionar tag', error)
    res.status(500).json({ error: 'Error ao adicionar tag' })
  }
})


/* ============== GET ALL ITEMS ================= */
router.get('/tags', 
  async (req, res) => {
  try {
    const filterOnlyActives = req.query.onlyActives === 'true'
      ? true
      : req.query.onlyActives === 'false' ? false : null;

    const hasPagination =
      req.query.limititemsPerPage !== undefined ||
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

    const [tags, totalItems] = await Promise.all([
    prisma.tag.findMany({
      where,
      skip,
      take,

      orderBy: [
        { isActive: 'desc' },
        { name: 'asc' },
      ],
    }),

    prisma.tag.count({
      where,
    }),
    ])

    const paginationDetails = {
      totalPages: Math.ceil(totalItems / paginationLimit),
      currentPage: paginationCurrentPage,
      itemsPerPage: paginationLimit,
    }

    res.status(200).json({
      data: tags,
      paginationDetails,
    })

  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar as tags' })
  }
});

/* ============== GET ONE ITEM - FOR ID ================= */
router.get('/tags/:id', async (req, res) => {
  const tagId = parseInt(req.params.id);

  try {
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
    });

    if (!tag) {
      return res.status(404).json({ error: 'tag não encontrada' });
    }

    res.status(200).json(tag);
  } catch (error) {
    console.error('Erro ao buscar tage por ID:', error);
    res.status(500).json({ error: 'Erro ao buscar tage' });
  }
});

/* ============== UPDATE ================= */
router.put('/tags/:id', adminAuth, async (req, res) => {
  const tagId = parseInt(req.params.id)
  const { name, isActive } = req.body

  try {
    const updated = await prisma.tag.update({
      where: { id: tagId },
      data: {
        name,
        isActive: isActive === 'true' || isActive === true,
        //updatedAt: new Date(),
      },
    })
    res.status(200).json(updated)
  } catch (error) {
    console.error('Error ao atualizar a tag', error)
    res.status(500).json({ error: 'Erro ao atualizar a tag' })
  }
})


/* ============== DELETE ================= */
router.delete('/tags/:id', adminAuth, async (req, res) => {
  const tagId = parseInt(req.params.id)
  try {
    const res = await prisma.tag.delete({
      where: { id: tagId },
    })
    res.status(200).end()
  } catch (error) {
    console.error('Error ao deletar tag', error)
    res.status(500).json({ error: 'Erro ao deletar tag' })
  }
})


export default router
