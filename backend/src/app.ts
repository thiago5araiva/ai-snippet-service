import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import snippetsRoutes from './routes/snippets.routes'

dotenv.config()

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use('/', snippetsRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

export default app
