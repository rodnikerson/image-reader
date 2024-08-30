import db from '../database'

export type Measure = {
  id?: string
  customer_code: string
  measure_type: 'WATER' | 'GAS'
  measure_datetime: string
  measure_value: number
  has_confirmed: boolean
  image_url: string
}

export class MeasureModel {
  async create(measure: Measure): Promise<{ id: string }[]> {
    return db('measures').insert(measure).returning('id')
  }
}
