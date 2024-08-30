import { Request, Response, NextFunction } from 'express'

export const validateConfirmData = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { measure_uuid, confirmed_value } = req.body

  if (typeof measure_uuid !== 'string' || typeof confirmed_value !== 'number') {
    res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description:
        'Os parâmetros "measure_uuid" devem ser uma string e "confirmed_value" deve ser um número.',
    })
    return
  }

  next()
}
