import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

/* ============== CREATE ================= */
router.post('/new/tag', async (req, res) => {
  const { name, isActive} = req.body
  try {
    const newTag = await prisma.tag.create ({
      data: {
        name,
        isActive: isActive === 'true' || isActive === true,
        //updatedAt: new Date(),
      },
    })
    res.status(201).json(newTag)
  } catch (error) {
    console.error('Error ao adicionar tag', error)
    res.status(500).json({ error: 'Error ao adicionar tag'})
  }
})


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

/* ============== GET ALL ITEMS - ACTIVE ================= */
router.get('/get/tagList/active', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      where:{
        isActive: true,
      },
      orderBy: [
        {name: 'asc'},
        {isActive: 'desc'},
      ]
    });

    res.status(200).json(tags)
  } catch (error) {
    console.error('Erro ao buscar as tags', error)
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
router.put('/update/tag/:id', async (req, res) => {
  const tagId = parseInt(req.params.id)
  const { name, isActive} =  req.body

  try {
    const updated = await prisma.tag.update({
      where: { id: tagId},
      data: {
        name,
        isActive: isActive === 'true' || isActive === true,
        //updatedAt: new Date(),
      },
    })
    res.status(200).json(updated)
  }catch (error) {
    console.error('Error ao atualizar a tag', error)
    res.status(500).json({error: 'Erro ao atualizar a tag'})
  }
})


/* ============== DELETE ================= */
router.delete('/delete/tag/:id', async (req, res) => {
  const tagId = parseInt(req.params.id)
  try {
    const res = await prisma.tag.delete({
      where: {id: tagId},
    })
    res.status(200).end()
  }catch (error) {
    console.error('Error ao deletar tag', error)
    res.status(500).json({error: 'Erro ao deletar tag'})
  }
})


export default router
