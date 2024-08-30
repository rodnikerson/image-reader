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

  async findByCustomerCode(customer_code: string): Promise<Measure[]> {
    return db('measures').where({ customer_code })
  }

  async findByCustomerCodeAndType(
    customer_code: string,
    measure_type: string
  ): Promise<Measure[]> {
    return db('measures').where({ customer_code }).andWhere({ measure_type })
  }

  async findById(measure_uuid: string): Promise<Measure | null> {
    return db('measures').where({ id: measure_uuid }).first()
  }

  async updateValue(
    measure_uuid: string,
    confirmed_value: number
  ): Promise<void> {
    await db('measures').where({ id: measure_uuid }).update({
      measure_value: confirmed_value,
      has_confirmed: true,
    })
  }
}
