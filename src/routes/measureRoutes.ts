import { Router } from 'express'
import { MeasureController } from '../controllers/measureController'
import {
  validateConfirmData,
  validateGetMeasures,
  validateMeasureData,
} from '../middlewares'

const router = Router()
const measureController = new MeasureController()

router.post('/upload', validateMeasureData, measureController.createMeasure)
router.patch('/confirm', validateConfirmData, measureController.updateMeasure)
router.get(
  '/:customer_code/list',
  validateGetMeasures,
  measureController.getMeasures
)

export default router
