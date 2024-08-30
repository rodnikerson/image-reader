import { Router, Request, Response } from 'express'
import { GeminiService } from '../services/geminiService'

const router = Router()
const geminiService = new GeminiService()

router.get('/call-gemini', async (req: Request, res: Response) => {
  try {
    const filePath = './public/images/jetpack.jpg'
    const mimeType = 'image/jpeg'
    const description = 'Describe how this product might be manufactured.'

    const result = await geminiService.processImage(
      filePath,
      mimeType,
      description
    )

    res.status(200).json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to call Gemini API' })
  }
})

export default router
