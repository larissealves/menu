import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

/* ============== CREATE DISH ================= */
router.post('/new/addDishes', async (req, res) => {
  const { 
    name, price, 
    description, 
    categoryId, 
    tags = [], 
    ingredients = []
  } = req.body

  try {
    const newDish = await prisma.dish.create({
      data: {
        name,
        price: parseFloat(price),
        description,
        categoryId: parseInt(categoryId),
      },
    });

    const newDishId = newDish.id;

    if (tags.length > 0 ) {
      console.log('tem tags')
      await prisma.dishTag.createMany({
        data: tags.map((tagId) => ({
          dishId: newDishId,
          tagId,
          updatedAt: new Date(),
        })),
      });
    }

    if (ingredients.length > 0 ) {
      
      console.log('tem ingredientes')
      await prisma.dishIngredient.createMany({
        data: ingredients.map((ingredientId) => ({
          dishId: newDishId,
          ingredientId,
          updatedAt: new Date(),
        })),
      });
    }

    res.status(201).json(newDish)
  } catch (error) {
    console.error('Erro ao criar prato:', error)
    res.status(500).json({ error: 'Erro ao criar prato' })
  }
})

/* ============== UPDATE ================= */
router.put('/update/editDishes/:id', async (req, res) => {
  const dishID = parseInt(req.params.id)
  const { name, price, description, categoryId } = req.body

  try {
    const update = await prisma.dish.update({
      where: { id: dishID },
      data: {
        name,
        price: parseFloat(price),
        description,
        categoryId: parseInt(categoryId),
      },
    })

    res.status(200).json(update)
  } catch (error) {
    console.error('Erro ao editar o prato:', error)
    res.status(500).json({ error: 'Erro ao editar o prato' })
  }
})

/* ============== DELETE ================= */
router.delete('/delete/dish/:id', async (req, res) => {
  const dishId = parseInt(req.params.id);

  try {
    await prisma.$transaction([
      // 1. Deletar relacionamentos com tags
      prisma.dishTag.deleteMany({
        where: { dishId },
      }),

      // 2. Deletar relacionamentos com ingredientes
      prisma.dishIngredient.deleteMany({
        where: { dishId },
      }),

      // 3. Deletar o prato
      prisma.dish.delete({
        where: { id: dishId },
      }),
    ]);

    res.status(200).json({ message: 'Prato e relacionamentos deletados com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar com rollback automático:', error);
    res.status(500).json({ error: 'Erro ao deletar o prato. Nenhuma alteração foi feita.' });
  }
});





/* ============== LIST ALL ITEMS ================= */
router.get('/get/dishes', async (req, res) => {
  try {
    const dishes = await prisma.dish.findMany({
      include: {
        category: true,
      },
    })
    res.status(200).json(dishes)
  } catch (error) {
    console.error('Erro ao buscar pratos:', error)
    res.status(500).json({ error: 'Erro ao buscar pratos' })
  }
})


/* ============== GET ONE ITEM - FOR DISH ID  ================= */
router.get('/get/disheID/:id', async (req, res) => {
  const dishID = parseInt(req.params.id)

  try {
    const dish = await prisma.dish.findUnique({
      where: { id: dishID },
    })

    if (!dish) {
      return res.status(404).json({ error: 'Prato não encontrado' })
    }

    res.status(200).json(dish)
  } catch (error) {
    console.error('Erro ao buscar prato:', error)
    res.status(500).json({ error: 'Erro ao buscar prato' })
  }
});

/* ============== FILTER DISHES BY CATEGORY ID ================= */
router.get('/get/filterDishesById/:id', async (req, res) => {
  const categoryId = parseInt(req.params.id);

  try {
    const dishes = await prisma.dish.findMany({
      where: {
        categoryId: categoryId,
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
      },
    });

    if (dishes.length === 0) {
      console.log('Nenhum prato encontrado para esta categoria');
    }

    res.status(200).json(dishes);
  } catch (error) {
    console.error('Erro ao buscar pratos por categoryId:', error);
    res.status(500).json({ error: 'Erro ao buscar pratos por categoryId' });
  }
});


/* ============== FILTER DISHES BY TAG ID ================= */
router.get('/get/filterDishesByTag/:id', async (req, res) => {
  const tagId = parseInt(req.params.id);

  try {
    const dishesTag = await prisma.dishTag.findMany({
      where: {
        tagId: tagId,
      },
      select: {
        id: true,
        isActive: true,
        dish: true,
      },
    });

    if (dishesTag.length === 0) {
      console.log('Nenhum prato encontrado para esta categoria');
    }

    res.status(200).json(dishesTag);
  } catch (error) {
    console.error('Erro ao buscar pratos por tagId:', error);
    res.status(500).json({ error: 'Erro ao buscar pratos por tagId' });
  }
});

/* ============== FILTER TAGS BY DISH ID ================= */
router.get('/get/filterTagByDishId/:id', async (req, res) => {
  const dishId = parseInt(req.params.id);

  try {
    const dishesTag = await prisma.dishTag.findMany({
      where: {
        dishId: dishId,
      },
      include: {
        tag: true,
      },
    });

    if (dishesTag.length === 0) {
      console.log('Nenhuma tag encontrada para este prato');
    }

    res.status(200).json(dishesTag);
    console.log('BACK -lista de tags', dishesTag)
  } catch (error) {
    console.error('Erro ao buscar as tags vinculadas a este prato', error);
    res.status(500).json({ error: 'Erro ao buscar as tags vinculadas a este prato' });
  }
});

/* ============== FILTER INGREDIENT BY DISHES ID ================= */
router.get('/get/filterIngredientsByDishId/:id', async (req, res) => {
  const in_dishId = parseInt(req.params.id);

  try {
    const dishesIngredient = await prisma.dishIngredient.findMany({
      where: {
        dishId: in_dishId,
      },
      include: {
        ingredient: true,
      },
    });

    if (dishesIngredient.length === 0) {
      console.log('Nenhum ingrediente encontrado para este prato');
    }
    console.log('BACK - Lista de ingredientes: ', dishesIngredient)
    res.status(200).json(dishesIngredient);
  } catch (error) {
    console.error('Erro ao buscar os ingredientes pelo dishId:', error);
    res.status(500).json({ error: 'Erro ao buscar os ingredientes pelo dishId' });
  }
});



export default router
