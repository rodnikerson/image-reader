import { v4 as uuidv4 } from 'uuid'
import { MeasureModel, Measure } from '../models/Measure'

export class MeasureService {
  private measureModel: MeasureModel

  constructor() {
    this.measureModel = new MeasureModel()
  }

  async createMeasure(measure: Measure): Promise<{ id: string }[]> {
    measure.id = uuidv4()
    return await this.measureModel.create(measure)
  }

  async getMeasuresByCustomerCode(
    customer_code: string,
    measure_type?: string
  ): Promise<Measure[]> {
    if (measure_type) {
      return await this.measureModel.findByCustomerCodeAndType(
        customer_code,
        measure_type
      )
    } else {
      return await this.measureModel.findByCustomerCode(customer_code)
    }
  }

  async checkDuplicateMeasure(
    customer_code: string,
    measure_datetime: Date,
    measure_type: string
  ): Promise<boolean> {
    const existingMeasures = await this.getMeasuresByCustomerCode(
      customer_code,
      measure_type
    )

    const measureMonth = new Date(measure_datetime).getMonth()
    const measureYear = new Date(measure_datetime).getFullYear()

    const duplicateMeasure = existingMeasures.find(
      (measure) =>
        new Date(measure.measure_datetime).getMonth() === measureMonth &&
        new Date(measure.measure_datetime).getFullYear() === measureYear
    )

    return !!duplicateMeasure
  }

  async getMeasureById(measure_uuid: string): Promise<Measure | null> {
    return await this.measureModel.findById(measure_uuid)
  }

  async updateMeasureValue(
    measure_uuid: string,
    confirmed_value: number
  ): Promise<void> {
    await this.measureModel.updateValue(measure_uuid, confirmed_value)
  }
}
