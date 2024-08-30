import express, { Request, Response, NextFunction } from 'express'
import { GoogleAIFileManager } from '@google/generative-ai/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

async function callGemini() {
  const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!)
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  })

  try {
    const uploadResponse = await fileManager.uploadFile(
      './public/images/jetpack.jpg',
      {
        mimeType: 'image/jpeg',
        displayName: 'Jetpack drawing',
      }
    )

    console.log(
      `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`
    )

    const getResponse = await fileManager.getFile(uploadResponse.file.name)

    console.log(
      `Retrieved file ${getResponse.displayName} as ${getResponse.uri}`
    )

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      { text: 'Describe how this product might be manufactured.' },
    ])

    console.log(`This is the result.response.text(): ${result.response.text()}`)

    const path = './public/images/jetpack.jpg'
    const mimeType = 'image/jpeg'

    function fileToGenerativePart(path: string, mimeType: string) {
      return {
        inlineData: {
          data: Buffer.from(fs.readFileSync(path)).toString('base64'),
          mimeType,
        },
      }
    }

    const file1 = fileToGenerativePart(path, mimeType)

    console.log(`This is the file1: ${file1}`)

    return result
  } catch (error) {
    console.error(`There was an error: ${error}`)
    throw error
  }
}

app.get('/call-gemini', async (req: Request, res: Response) => {
  try {
    const result = await callGemini()
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to call Gemini API' })
  }
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err.message })
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
