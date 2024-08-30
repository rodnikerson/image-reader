import { fileManager, model } from '../config/geminiClient'

export class GeminiService {
  async processImage(
    filePath: string,
    mimeType: string,
    description: string
  ): Promise<{ value: string; image_url: string }> {
    try {
      const uploadResponse = await fileManager.uploadFile(filePath, {
        mimeType,
        displayName: description,
      })

      const getResponse = await fileManager.getFile(uploadResponse.file.name)

      const result = await model.generateContent([
        {
          fileData: {
            mimeType: uploadResponse.file.mimeType,
            fileUri: uploadResponse.file.uri,
          },
        },
        { text: description },
      ])

      return { value: result.response.text(), image_url: getResponse.uri }
    } catch (error) {
      console.error('Error processing image with Gemini:', error)
      throw new Error('Failed to process image with Gemini')
    }
  }
}
