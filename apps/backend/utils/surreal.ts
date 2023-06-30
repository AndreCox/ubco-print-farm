import Surreal from 'surrealdb.js'
import { config } from 'dotenv'
config()
const {
  SURREAL_DB_HOST: db_url,
  SURREAL_DB_USER: db_user,
  SURREAL_DB_PASSWORD: db_pass,
} = process.env

const db = new Surreal(db_url)

export async function initDB() {
  try {
    console.log('Initializing database...')
    // @ts-ignore
    await db.signin({
      user: db_user,
      pass: db_pass,
    })

    // first set up schemafull users database
    await db.use({
      ns: 'PrintFarm',
      db: 'users',
    })
    // define user table
    await db.query(
      'DEFINE TABLE user SCHEMAFULL PERMISSIONS FOR select, update WHERE id = $auth.id FOR create, delete NONE'
    )
    await db.query(
      'DEFINE FIELD email ON user TYPE string ASSERT is::email($value)'
    )
    await db.query('DEFINE FIELD pass ON user TYPE string')
    await db.query('DEFINE FIELD admin ON user TYPE bool')
    await db.query('DEFINE FIELD printQueue ON user TYPE array')
    await db.query('DEFINE FIELD printHistory ON user TYPE array')

    // make sure emails are unique
    await db.query('DEFINE INDEX email ON TABLE user COLUMNS email UNIQUE')

    await db.query(
      'DEFINE SCOPE allusers SESSION 14d  SIGNUP (CREATE user SET email = $email , pass=crypto::argon2::generate($pass), admin=false, printQueue=[], printHistory=[] AND 7 == 2) SIGNIN ( SELECT * FROM user WHERE email = $email AND crypto::argon2::compare(pass, $pass) )'
    )

    // now we set up a new database for storing sign up keys, these are one time use keys that are used to sign up new users
    await db.use({
      ns: 'PrintFarm',
      db: 'signup',
    })

    // define signup table
    await db.query('DEFINE TABLE signup SCHEMAFULL')
    await db.query('DEFINE FIELD key ON signup TYPE string')

    // make sure keys are unique
    await db.query('DEFINE INDEX key ON TABLE signup COLUMNS key UNIQUE')

    console.log('Database authenticated!')
  } catch (err) {
    console.error(err)
  }
}
export default db
