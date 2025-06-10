import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

/* ============== DELETE ================= */
router.delete('/delete/imageByDishId/:id', async (req, res) => {
  const imageId = parseInt(req.params.id);

  try {
    // Verifica se existe um binário relacionado à imagem
    const hasImage = await prisma.dishImageBinary.findUnique({
      where: { dishImageId: imageId }
    });

    // Se houver, remove o binário primeiro
    if (hasImage) {
      await prisma.dishImageBinary.delete({
        where: { dishImageId: imageId }
      });
    }

    // Agora deleta o registro da imagem
    await prisma.dishImage.delete({
      where: { id: imageId }
    });

    res.status(200).json({ message: 'Imagem excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    res.status(500).json({ error: 'Erro ao deletar imagem.' });
  }
});


export default router