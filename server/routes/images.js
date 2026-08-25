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

/* ============== DELETE ================= */
router.delete('/delete/imageByDishId/:id', requireAuth, adminAuth, async (req, res) => {
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