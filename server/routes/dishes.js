import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

/* ============== CREATE ================= */
router.post('/new/addDishes', async (req, res) => {
  const { name, price, description, categoryId } = req.body

  try {
    const newDish = await prisma.dish.create({
      data: {
        name,
        price: parseFloat(price),
        description,
        categoryId: parseInt(categoryId),
      },
    })

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
      where: { id:  dishID },
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
      where: { id:  dishID },
    })

    if(!dish) {
      return res.status(404).json({error: 'Prato não encontrado'})
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
  } catch (error) {
    console.error('Erro ao buscar as tags vinculadas a este prato', error);
    res.status(500).json({ error: 'Erro ao buscar as tags vinculadas a este prato' });
  }
});

/* ============== FILTER DISHES BY INGREDIENT ID ================= */
router.get('/get/filterDishesByIngredient/:id', async (req, res) => {
  const ingredientId = parseInt(req.params.id);

  try {
    const dishesIngredient = await prisma.dishIngredient.findMany({
      where: {
        ingredientId: ingredientId,
      },
      select: {
        id: true,
        isActive: true,
        dish: true,
      },
    });

    if (dishesIngredient.length === 0) {
      console.log('Nenhum prato encontrado para esta categoria');
    }

    res.status(200).json(dishesIngredient);
  } catch (error) {
    console.error('Erro ao buscar pratos por tagId:', error);
    res.status(500).json({ error: 'Erro ao buscar pratos por tagId' });
  }
});



export default router
