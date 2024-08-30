import { Router } from 'express'
import { MeasureController } from '../controllers/measureController'

const router = Router()
const measureController = new MeasureController()

router.post('/upload', measureController.createMeasure)

export default router
