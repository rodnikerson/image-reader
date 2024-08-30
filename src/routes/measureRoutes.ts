import { Router } from 'express'
import { MeasureController } from '../controllers/measureController'
import { validateMeasureData } from '../middlewares/validateMeasureData'

const router = Router()
const measureController = new MeasureController()

router.post('/upload', validateMeasureData, measureController.createMeasure)
router.patch('/confirm', measureController.updateMeasure)

export default router
