import express from 'express'
import cors from 'cors'

import categoryRoutes from './routes/category.js'
import dishRoutes from './routes/dishes.js'

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

app.use('/api', categoryRoutes)
app.use('/api', dishRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
