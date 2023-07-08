import Surreal from 'surrealdb.js'
import { config } from 'dotenv'
config()
const {
  NEXT_PUBLIC_SURREAL_DB_HOST: db_url,
  SURREAL_DB_USER: db_user,
  SURREAL_DB_PASSWORD: db_pass,
} = process.env

const db = new Surreal(db_url)

export async function initDB() {
  try {
    console.log('Initializing database...')
    console.log('db_url:', db_url)

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
      'DEFINE TABLE user SCHEMAFULL PERMISSIONS FOR select, update WHERE id = $auth.id AND valid = true FOR create, delete NONE'
    )
    await db.query(
      'DEFINE FIELD email ON user TYPE string ASSERT is::email($value)'
    )
    await db.query('DEFINE FIELD name ON user TYPE string')
    await db.query('DEFINE FIELD pass ON user TYPE string')
    await db.query(
      'DEFINE FIELD admin ON user TYPE bool PERMISSIONS FOR select WHERE admin = true OR id = $auth.id FOR update WHERE admin = true FOR create, delete NONE'
    )
    await db.query(
      'DEFINE FIELD printQueue ON user TYPE array PERMISSIONS FOR select, update WHERE id = $auth.id AND valid = true FOR create, delete NONE'
    )
    // now we set up the schema for the printQueue array
    await db.query('DEFINE FIELD printQueue.stlName ON user TYPE string')
    await db.query('DEFINE FIELD printQueue.fileName ON user TYPE string')
    await db.query('DEFINE FIELD printQueue.status ON user TYPE string')

    await db.query('DEFINE FIELD printHistory ON user TYPE array')
    await db.query(
      'DEFINE FIELD valid ON user TYPE bool PERMISSIONS FOR select WHERE id = $auth.id FOR update, create, delete NONE'
    )

    // make sure emails are unique
    await db.query('DEFINE INDEX email ON TABLE user COLUMNS email UNIQUE')

    // now during sign up we want to make a key property that is 6 numbers long
    // this will be compared to the keys in the signup database
    // if the key is found in the signup database then the user is allowed to sign up
    // otherwise the user is not allowed to sign up
    // this is to prevent random people from signing up
    // after the user signs up we will delete the key from the signup database

    await db.query('DEFINE FIELD key ON user TYPE string')
    // the keys don't need to be unique

    // now we need to define a scope for signing up users
    await db.query(
      'DEFINE SCOPE allusers SESSION 14d SIGNUP (CREATE user SET email = $email, pass = crypto::argon2::generate($pass), valid = false, admin = false, printQueue = [], printHistory = []) SIGNIN (SELECT * FROM user WHERE email = $email AND crypto::argon2::compare(pass, $pass))'
    )

    //CREATE user SET email = $email , pass=crypto::argon2::generate($pass), admin=false, printQueue=[], printHistory=[]

    // await db.query(
    //  'DEFINE SCOPE allusers SESSION 14d  SIGNUP (CREATE) SIGNIN (SELECT * FROM user WHERE email = $email AND crypto::argon2::compare(pass, $pass))'
    //)
    //
    // now we set up a new database for storing sign up keys, these are one time use keys that are used to sign up new users
    await db.use({
      ns: 'PrintFarm',
      db: 'keys',
    })

    // define signup table
    await db.query('DEFINE TABLE key SCHEMAFULL')
    // allow the users database to access the keys database by scoping the keys database to the users database
    await db.query('DEFINE SCOPE allusers SESSION 14d')

    await db.query(
      'DEFINE FIELD key ON key TYPE string PERMISSIONS FOR select, update, create, delete WHERE admin = true AND valid = true'
    )

    // make sure keys are unique
    await db.query('DEFINE INDEX key ON TABLE key COLUMNS key UNIQUE')

    console.log('Database authenticated!')
  } catch (err) {
    console.error(err)
  }
}
export default db
