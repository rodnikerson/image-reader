import express, { Request, Response, NextFunction } from 'express'
import callGeminiRoutes from './routes/callGeminiRoutes'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', callGeminiRoutes)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err.message })
})

export default app
