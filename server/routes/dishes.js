import express from 'express'
import { PrismaClient } from '@prisma/client'

import multer from 'multer'
import path from 'path'
import fs from 'fs/promises';


const router = express.Router()
const prisma = new PrismaClient()

/* Configuração do Multer - Imagens  */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // ou outro caminho onde deseja salvar
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


/* ============== CREATE DISH ================= */
router.post('/new/addDishes', upload.array('images'), async (req, res) => {
  const { name, price, description, categoryId, isActive } = req.body;
  console.log('AAAA', req.body)
  const tags = JSON.parse(req.body.tags || '[]');
  const ingredients = JSON.parse(req.body.ingredients || '[]');

  try {
    const newDish = await prisma.dish.create({
      data: {
        name,
        price: parseFloat(price),
        description,
        categoryId: parseInt(categoryId),
        isActive: isActive === 'true' || isActive === true,
        //updatedAt: new Date(),
      },
    });

    const newDishId = newDish.id;

    if (tags.length > 0) {
      await prisma.dishTag.createMany({
        data: tags.map((tagId) => ({
          dishId: newDishId,
          tagId,
         // updatedAt: new Date(),
        })),
      });
    }

    if (ingredients.length > 0) {
      await prisma.dishIngredient.createMany({
        data: ingredients.map((ingredientId) => ({
          dishId: newDishId,
          ingredientId,
          //updatedAt: new Date(),
        })),
      });
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // 1. Salva os metadados na tabela DishImage
        const dishImage = await prisma.dishImage.create({
          data: {
            dishId: newDishId,
            imageUrl: `/uploads/${file.filename}`,
            imageName: file.originalname,
            imageType: file.mimetype,
            isPrimary: false,
          },
        });

        // 2. Lê o binário do arquivo salvo
        const binary = await fs.readFile(file.path); // lê como Buffer

        // 3. Salva o binário na tabela DishImageBinary
        await prisma.dishImageBinary.create({
          data: {
            dishImageId: dishImage.id,
            binaryData: binary,
          },
        });
      }
    }

    res.status(201).json(newDish);
  } catch (error) {
    console.error('Erro ao criar prato:', error);
    res.status(500).json({ error: 'Erro ao criar prato' });
  }
});


/* ============== UPDATE DISH ================= */
router.put('/update/editDishes/:id', upload.array('images'), async (req, res) => {
  const dishID = parseInt(req.params.id);
  const { name, price, description, categoryId, isActive } = req.body;
  console.log('update dish', req.body)

  const tags = JSON.parse(req.body.tags || '[]');
  const ingredients = JSON.parse(req.body.ingredients || '[]');

  try {
    // Atualiza prato
    const updatedDish = await prisma.dish.update({
      where: { id: dishID },
      data: {
        name,
        price: parseFloat(price),
        description,
        categoryId: parseInt(categoryId),
        isActive: isActive === 'true' || isActive === true,
        //updateAt: new Date(),
      },
    });

    // Atualiza tags: apaga e recria
    await prisma.dishTag.deleteMany({ where: { dishId: dishID } });
    if (tags.length > 0) {
      await prisma.dishTag.createMany({
        data: tags.map(tagId => ({
          dishId: dishID,
          tagId,
          //updatedAt: new Date(),
        })),
      });
    }

    // Atualiza ingredientes: apaga e recria
    await prisma.dishIngredient.deleteMany({ where: { dishId: dishID } });
    if (ingredients.length > 0) {
      await prisma.dishIngredient.createMany({
        data: ingredients.map(ingredientId => ({
          dishId: dishID,
          ingredientId,
         // updatedAt: new Date(),
        })),
      });
    }

    // Se houver novas imagens, salva
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const newImage = await prisma.dishImage.create({
          data: {
            dishId: dishID,
            imageUrl: `/uploads/${file.filename}`,
            imageName: file.originalname,
            imageType: file.mimetype,
            isPrimary: false,
          },
        });

        const binary = await fs.readFile(file.path);
        await prisma.dishImageBinary.create({
          data: {
            dishImageId: newImage.id,
            binaryData: binary,
          },
        });
      }
    }

    res.status(200).json(updatedDish);
  } catch (error) {
    console.error('Erro ao editar o prato:', error);
    res.status(500).json({ error: 'Erro ao editar o prato' });
  }
});

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

      // 3. Deletar imagens
      prisma.dishImage.deleteMany({
        where: { dishId },
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
      orderBy: {
        name: 'asc',
      }
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
// controls delete button status - screen settings
router.get('/get/filterDishesByCategoryId/:id', async (req, res) => {
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




/* ============== FILTER DISHES BY INGREDIENT ID ================= */
// controls delete button status - screen settings
router.get('/get/filterDishesByIngredientId/:id', async (req, res) => {
  const ingredientId = parseInt(req.params.id);

  try {
    const dishes = await prisma.dishIngredient.findMany({
      where: {
        ingredientId: ingredientId,
      },
      include: {
        ingredient: true,
      },
    });

    if (dishes.length === 0) {
      console.log('Nenhum prato encontrado para este ingrediente');
    }

    res.status(200).json(dishes);
  } catch (error) {
    console.error('Erro ao buscar pratos por ingredientId:', error);
    res.status(500).json({ error: 'Erro ao buscar pratos por ingredientId' });
  }
});


/* ============== FILTER DISHES BY TAG ID ================= */
// controls delete button status - screen settings
router.get('/get/filterDishesByTag/:id', async (req, res) => {
  const tagId = parseInt(req.params.id);

  try {
    const dishesTag = await prisma.dishTag.findMany({
      where: {
        tagId: tagId,
      },
      include: {
        tag: true,
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
        tag: {
          isActive: true,
        }
      },
      include: {
       tag: true,
      },
      orderBy: {
        tag: {
          name: 'asc',
        },
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
        ingredient: {
          isActive: true, // Filtrando diretamente pela relação
        }
      },
      include: {
        ingredient: true,
      },
      orderBy: {
        ingredient: {
          name: 'asc', // Ordenando pela relação
        }
      }
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

//=============== FILTERS FRONT-END ==========
router.get('/get/dishes-id-relations', async (req, res) => {
  try {
    const dishes = await prisma.dish.findMany({
  where: {
    isActive: true,
  },
  orderBy: [
  { name: 'asc' },
  { isActive: 'asc' }
  ],
  select: {
    id: true,
    name: true,
    price: true,
    categoryId: true,
    description: true,
    tags: {
      select: {
        tagId: true,
      },
    },
    ingredients: {
      select: {
        ingredientId: true,
      },
    },
  },
});

    res.status(200).json(dishes);
  } catch (error) {
    console.error('Erro ao buscar dados leves de pratos:', error);
    res.status(500).json({ error: 'Erro ao buscar os pratos simplificados' });
  }
});

/* ============== GET IMAGE BY DISH ID ================= */
router.get('/get/imagesByDishId/:id', async (req, res) => {
  const dishId = parseInt(req.params.id);

  try {
    const images = await prisma.dishImage.findMany({
      where: { dishId },
    });

    if (!images || images.length === 0) {
      return res.status(404).json({ message: 'Nenhuma imagem encontrada para esse prato.' });
    }

    // Buscar binário para cada imagem
    const imagesWithBinary = await Promise.all(
      images.map(async (img) => {
        const binary = await prisma.dishImageBinary.findUnique({
          where: { dishImageId: img.id },
        });

        return {
          ...img,
          binaryData: binary?.binaryData || null,
        };
      })
    );

    console.log('image: ', imagesWithBinary);
    res.status(200).json(imagesWithBinary);
  } catch (error) {
    console.error('Erro ao buscar imagens:', error);
    res.status(500).json({ error: 'Erro interno ao buscar imagens.' });
  }
});




export default router
