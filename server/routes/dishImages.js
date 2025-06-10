import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

/* ============== GET IMAGE BY DISH ID ================= */
router.get('/get/imagesByDishId/:id', async (req, res) => {
  const dishId = parseInt(req.params.id);

  try {
    const images = await prisma.dishImage.findMany({
      where: { dishId },
      select: {
        id: true,
        imageUrl: true,
        imageName: true,
        imageType: true,
        isPrimary: true,
        updatedAt: true,
      },
    });

    if (!images || images.length === 0) {
      return res.status(404).json({ message: 'Nenhuma imagem encontrada para esse prato.' });
    }

    res.status(200).json(images);
  } catch (error) {
    console.error('Erro ao buscar imagens:', error);
    res.status(500).json({ error: 'Erro interno ao buscar imagens.' });
  }
});
