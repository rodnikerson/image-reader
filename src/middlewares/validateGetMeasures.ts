import { Request, Response, NextFunction } from 'express'

export const validateGetMeasures = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const measure_type = req.query.measure_type as string | undefined

  if (measure_type && !['WATER', 'GAS'].includes(measure_type.toUpperCase())) {
    res.status(400).json({
      error_code: 'INVALID_TYPE',
      error_description: 'Tipo de medição não permitida',
    })
    return
  }

  next()
}
