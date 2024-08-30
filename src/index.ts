import app from './app'
import initDatabase from './database/init-database'

const PORT = process.env.PORT || 8080

const startServer = async () => {
  await initDatabase()

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

startServer()
