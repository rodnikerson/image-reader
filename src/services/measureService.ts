import { v4 as uuidv4 } from 'uuid'
import db from '../database'

export class MeasureService {
  async createMeasure(measure: any): Promise<{ id: string }[]> {
    measure.id = uuidv4()
    return await db('measures').insert(measure).returning('id')
  }

  async getMeasuresByCustomerCode(
    customer_code: string,
    measure_type?: string
  ): Promise<any[]> {
    const query = db('measures').where('customer_code', customer_code)
    if (measure_type) {
      query.andWhere('measure_type', measure_type)
    }
    return await query.select()
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
}
