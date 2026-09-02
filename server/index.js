import express from 'express'
import cors from 'cors'

import categoryRoutes from './routes/category.js'
import dishRoutes from './routes/dishes.js'
import ingredientRoutes from './routes/ingredients.js'
import tagRoutes from './routes/tag.js'
import imageRoutes from './routes/images.js'

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())


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

app.use(requireAuth, (req, res, next) => {
  app.use('/api', categoryRoutes)
  app.use('/api', dishRoutes)
  app.use('/api', ingredientRoutes)
  app.use('/api', tagRoutes)
  app.use('/api', imageRoutes)
  console.log(`Request received: ${req.method} to ${req.url}`);
  next(); // Moves to the next function in line
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
