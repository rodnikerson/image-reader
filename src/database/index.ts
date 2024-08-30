import knex, { Knex } from 'knex'
import path from 'path'

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: path.resolve('./database.sqlite'),
  },
  useNullAsDefault: false,
}

const db = knex(config)

console.log('DB connection status: OK!')

export default db
