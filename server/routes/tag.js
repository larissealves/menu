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
router.post('/new/tag', requireAuth, adminAuth,  async (req, res) => {
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
router.get('/get/tagList/:onlyActivesItems/:limitItemsPerPage/:currentPage', requireAuth,
  async (req, res) => {
  try {
    const filterOnlyActives = req.params.onlyActivesItems === 'true'
      ? true
      : req.params.onlyActivesItems === 'false' ? false : null;

    const paginationLimit = Number(req.params.limitItemsPerPage) || 6;
    const paginationCurrentPage = Number(req.params.currentPage) || 1;

    const skip =
      (paginationCurrentPage - 1) * paginationLimit;

    const take =
      paginationLimit;

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

/* ============== GET ALL ITEMS - ACTIVE ================= */
router.get('/get/tagList/active', requireAuth, async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { name: 'asc' },
        { isActive: 'desc' },
      ]
    });

    res.status(200).json(tags)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar as tags' })
  }
})

/* ============== GET ONE ITEM - FOR ID ================= */
router.get('/get/tagID/:id', async (req, res) => {
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
router.put('/update/tag/:id', requireAuth, adminAuth, async (req, res) => {
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
router.delete('/delete/tag/:id', requireAuth, adminAuth, async (req, res) => {
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
