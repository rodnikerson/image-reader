import express, { Request, Response, NextFunction } from 'express'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err })
})

const PORT = process.env.PORT || 9000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
