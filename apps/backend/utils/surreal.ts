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

    /***********************************
     * FIRST SET UP THE USERS DATABASE *
     ***********************************/

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
    // now our printQueue stores objects so we create a new field for the objects
    await db.query('DEFINE FIELD printQueue.* ON user TYPE object')

    // now we set up the schema for the printQueue array
    await db.query('DEFINE FIELD printQueue.*.stlName ON user TYPE string')
    await db.query('DEFINE FIELD printQueue.*.fileName ON user TYPE string')
    await db.query('DEFINE FIELD printQueue.*.status ON user TYPE string')
    await db.query('DEFINE FIELD printQueue.*.uploadTime ON user TYPE datetime')
    await db.query('DEFINE FIELD printQueue.*.material ON user TYPE string')
    await db.query(
      'DEFINE FIELD printQueue.*.infill ON user TYPE number ASSERT $value >= 0 AND $value <= 100'
    )
    await db.query('DEFINE FIELD printHistory ON user TYPE array')
    await db.query(
      'DEFINE FIELD valid ON user TYPE bool PERMISSIONS FOR select WHERE id = $auth.id FOR update, create, delete NONE'
    )

    // make sure emails are unique
    await db.query('DEFINE INDEX email ON TABLE user COLUMNS email UNIQUE')

    // now we need to define a scope for signing up users
    await db.query(
      'DEFINE SCOPE allusers SESSION 14d SIGNUP (CREATE user SET email = $email, pass = crypto::argon2::generate($pass), valid = false, admin = false, printQueue = [], printHistory = []) SIGNIN (SELECT * FROM user WHERE email = $email AND crypto::argon2::compare(pass, $pass))'
    )

    /**********************************************************************************
     *            NEXT WE CREATE A NEW DATABASE FOR STORING SIGN UP KEYS,             *
     * WHEN A NEW USER SIGNS UP THEY WILL NEED TO HAVE A KEY THAT IS IN THIS DATABASE *
     **********************************************************************************/

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

    /*********************************************************************************
     *           CREATE A NEW DATABASE FOR STORING 3D PRINTER INFORMATION.           *
     * THIS WILL HOLD THE PRINTERS IP ADDRESS, NAME, API KEY, AND OTHER INFORMATION. *
     *********************************************************************************/

    await db.use({
      ns: 'PrintFarm',
      db: 'printers',
    })

    // define printer table
    await db.query('DEFINE TABLE printer SCHEMAFULL')
    // we will create the fields for the printer table
    await db.query('DEFINE FIELD name ON printer TYPE string')
    await db.query('DEFINE FIELD ip ON printer TYPE string')
    await db.query('DEFINE FIELD apiKey ON printer TYPE string')
    await db.query('DEFINE FIELD printerInfo ON printer FLEXIBLE TYPE object')

    // now we create a new database for storing print jobs, this database will aggregate all the print jobs from all the users and store them in one place
    await db.use({
      ns: 'PrintFarm',
      db: 'printJobs',
    })

    // define printJobs table
    await db.query('DEFINE TABLE printJob SCHEMAFULL')
    // we will create the fields for the printJob table
    await db.query('DEFINE FIELD stlName ON printJob TYPE string')
    await db.query('DEFINE FIELD fileName ON printJob TYPE string')
    await db.query('DEFINE FIELD status ON printJob TYPE string')
    await db.query('DEFINE FIELD email ON printJob TYPE string')
    await db.query('DEFINE FIELD time ON printJob TYPE datetime')

    console.log('Database authenticated!')
  } catch (err) {
    console.error(err)
  }
}
export default db
