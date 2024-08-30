import { existsSync } from 'fs'
import path from 'path'
import db from './index'

const initDatabase = async () => {
  const dbFilePath = path.resolve('./database.sqlite')

  if (!existsSync(dbFilePath)) {
    console.log('Creating database...')

    await db.schema.createTable('measures', (table) => {
      table.uuid('id').primary()
      table.string('customer_code').notNullable()
      table.enu('measure_type', ['WATER', 'GAS']).notNullable()
      table.timestamp('measure_datetime').defaultTo(db.fn.now())
      table.integer('measure_value')
      table.boolean('has_confirmed').defaultTo(false)
      table.string('image_url')
      table.timestamps(true, true)
    })
  } else {
    console.log('Database already exists. Skipping creation.')
  }
}

export default initDatabase
