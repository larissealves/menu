import express from 'express'
import cors from 'cors'

import path from 'path';
import { fileURLToPath } from 'url';

import categoryRoutes from './routes/category.js'
import dishRoutes from './routes/dishes.js'
import ingredientRoutes from './routes/ingredients.js'
import tagRoutes from './routes/tag.js'
import imageRoutes from './routes/images.js'

const app = express()
const PORT = 5000

// setup para __dirname com ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors())
app.use(express.json())

// Servir imagens da pasta uploads (se ainda usar isso)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Suas rotas de API
app.use('/api', categoryRoutes)
app.use('/api', dishRoutes)
app.use('/api', ingredientRoutes)
app.use('/api', tagRoutes)
app.use('/api', imageRoutes)

// Serve arquivos da build do React
//app.use(express.static(path.join(__dirname, '..', 'dist')));

// Fallback: envia index.html para rotas desconhecidas (SPA)
//app.get('/{*any}', (req, res) => {
// res.sendFile(path.join(__dirname, '..', 'dist', '../client/index.html'));
//});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
