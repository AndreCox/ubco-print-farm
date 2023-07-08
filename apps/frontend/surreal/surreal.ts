import surreal from 'surrealdb.js'
import { config } from 'dotenv'
config()
// get db url from env
const db_url = process.env.NEXT_PUBLIC_SURREAL_DB_HOST

console.log('db_url:', db_url)

// create a object that will be used to hold the db so we can import it into other files

class Database {
  db: surreal

  constructor() {
    this.db = new surreal(db_url)
  }
}

export const database = new Database()
