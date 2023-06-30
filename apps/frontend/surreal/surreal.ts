import surreal from 'surrealdb.js'
import { config } from 'dotenv'
config()
// get db url from env
const { SURREAL_DB_HOST: db_url } = process.env

const db = new surreal('http://localhost:8080')
export default db
