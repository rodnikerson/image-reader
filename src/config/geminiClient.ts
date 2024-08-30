import dotenv from 'dotenv'
import { GoogleAIFileManager } from '@google/generative-ai/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
})

export { fileManager, model }
