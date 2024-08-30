import { Request, Response, NextFunction } from 'express'

export const validateMeasureData = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { image, customer_code, measure_datetime, measure_type } = req.body

  if (
    typeof image !== 'string' ||
    typeof customer_code !== 'string' ||
    typeof measure_datetime !== 'string' ||
    !['WATER', 'GAS'].includes(measure_type)
  ) {
    res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description:
        'Todos os campos devem ser do tipo correto: image (base64), customer_code (string), measure_datetime (datetime), measure_type (WATER/GAS)',
    })
    return
  }

  const isValidBase64 = (str: string): boolean => {
    try {
      return Buffer.from(str, 'base64').toString('base64') === str
    } catch (err) {
      return false
    }
  }

  if (!isValidBase64(image)) {
    res.status(400).json({
      error_code: 'INVALID_IMAGE',
      error_description: 'A imagem deve estar em formato base64 válido',
    })
    return
  }

  next()
}
