import express from 'express'
import cors from 'cors'

//import path from 'path';
//import { fileURLToPath } from 'url';
//import { dirname } from 'path';

import categoryRoutes from './routes/category.js'
import dishRoutes from './routes/dishes.js'
import ingredientRoutes from './routes/ingredients.js'
import tagRoutes from './routes/tag.js'
import imageRoutes from './routes/images.js'

const app = express()
const PORT = 5000

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);


app.use(cors())
app.use(express.json())

app.use('/api', categoryRoutes)
app.use('/api', dishRoutes)
app.use('/api', ingredientRoutes)
app.use('/api', tagRoutes)
app.use('/api', imageRoutes)

// Servir imagens estaticamente
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
