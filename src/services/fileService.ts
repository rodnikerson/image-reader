import fs from 'fs/promises'
import path from 'path'

export class FileService {
  async saveBase64Image(
    base64String: string,
    filename: string
  ): Promise<string> {
    const filePath = path.resolve('./src/imgs', filename)
    const buffer = Buffer.from(base64String, 'base64')
    await fs.writeFile(filePath, buffer)
    return filePath
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath)
    } catch (error) {
      console.error(`Failed to delete file: ${filePath}`, error)
    }
  }
}
