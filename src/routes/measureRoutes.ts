import { Router } from 'express'
import { MeasureController } from '../controllers/measureController'
import { validateMeasureData } from '../middlewares/validateMeasureData'
import { validateConfirmData } from '../middlewares/validateConfirmData'

const router = Router()
const measureController = new MeasureController()

router.post('/upload', validateMeasureData, measureController.createMeasure)
router.patch('/confirm', validateConfirmData, measureController.updateMeasure)
router.get('/:customer_code/list', measureController.getMeasures)

export default router
