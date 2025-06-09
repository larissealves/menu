import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router();
const prisma = new PrismaClient()

/* ============== GET DISH BY TAG ================= */
router.get('get/dishesByTags/:id', async (requestAnimationFrame, res) => {
    const tagID = parseInt(req.params.id);

    try {
        const dishesByTag =  await prisma.dishTag.findMany({
            where: {
                id: tagID,
            },
            select: {
                id: true,
                tagId: true,
                dishId: true,
                isActive: true,
                updatedAt: true,
                dish: {
                    name: true,
                    isActive: true,
                tag: {
                    name: true,
                    isActive: true,
                }
            }

            },
        });

        if(dishesByTag.length === 0) {
            console.log('Não foram encontrados pratos para a tag informada');
        }

        res.status(200).json(dishesByTag);
    } catch (error) {
        console.error('erro ao buscar a lista de pratos pela Tag informada', error);
        res.status(500).json({error: 'erro ao buscar a lista de pratos pela Tag informada'});
    }
} );