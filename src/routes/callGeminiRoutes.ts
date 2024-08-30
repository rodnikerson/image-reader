import { Router, Request, Response } from 'express'
import { fileManager, model } from '../config/geminiClient'
import fs from 'fs'

const router = Router()

async function callGemini() {
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

router.get('/call-gemini', async (req: Request, res: Response) => {
  try {
    const result = await callGemini()
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to call Gemini API' })
  }
})

export default router
