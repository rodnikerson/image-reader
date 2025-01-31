import { Request, Response } from 'express'
import { FileService, GeminiService, MeasureService } from '../services'

const measureService = new MeasureService()
const geminiService = new GeminiService()
const fileService = new FileService()

export class MeasureController {
  async createMeasure(req: Request, res: Response): Promise<void> {
    try {
      const { image, customer_code, measure_datetime, measure_type } = req.body

      const isDuplicate = await measureService.checkDuplicateMeasure(
        customer_code,
        measure_datetime,
        measure_type
      )
      if (isDuplicate) {
        res.status(409).json({
          error_code: 'DOUBLE_REPORT',
          error_description: 'Leitura do mês já realizada',
        })
        return
      }

      const filename = 'b64DecodedImage.jpg'
      const filePath = await fileService.saveBase64Image(image, filename)

      const description = `What is the ${measure_type} measurement value shown in the image? Answer objectively, providing only the value in number(s).`
      const { value, image_url } = await geminiService.processImage(
        filePath,
        'image/jpeg',
        description
      )

      const measure = {
        customer_code,
        measure_type,
        measure_datetime,
        measure_value: parseInt(value),
        has_confirmed: false,
        image_url,
      }

      const [{ id: measureId }] = await measureService.createMeasure(measure)

      await fileService.deleteFile(filePath)

      res.status(200).json({
        image_url,
        measure_value: measure.measure_value,
        measure_uuid: measureId,
      })
    } catch (error) {
      res.status(500).json({ error })
    }
  }

  async updateMeasure(req: Request, res: Response): Promise<void> {
    try {
      const { measure_uuid, confirmed_value } = req.body

      const measure = await measureService.getMeasureById(measure_uuid)
      if (!measure) {
        res.status(404).json({
          error_code: 'MEASURE_NOT_FOUND',
          error_description: 'Leitura não encontrada.',
        })
        return
      }

      if (measure.has_confirmed) {
        res.status(409).json({
          error_code: 'CONFIRMATION_DUPLICATE',
          error_description: 'Leitura do mês já realizada.',
        })
        return
      }

      await measureService.updateMeasureValue(measure_uuid, confirmed_value)

      res.status(200).json({ success: true })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar a leitura.' })
    }
  }

  async getMeasures(req: Request, res: Response): Promise<void> {
    try {
      const customer_code = req.params.customer_code
      const measure_type = req.query.measure_type as string | undefined

      const measures = await measureService.getMeasuresByCustomerCode(
        customer_code,
        measure_type?.toUpperCase()
      )

      if (measures.length === 0) {
        res.status(404).json({
          error_code: 'MEASURES_NOT_FOUND',
          error_description: 'Nenhuma leitura encontrada',
        })
        return
      }

      res.status(200).json({
        customer_code,
        measures: measures.map((measure) => ({
          measure_uuid: measure.id,
          measure_datetime: measure.measure_datetime,
          measure_type: measure.measure_type,
          has_confirmed: measure.has_confirmed,
          image_url: measure.image_url,
        })),
      })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao capturar a(s) leitura(s).' })
    }
  }
}
