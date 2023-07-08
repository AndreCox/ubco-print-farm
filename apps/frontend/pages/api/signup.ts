// nextjs signup api route

import { NextApiRequest, NextApiResponse } from 'next'
import { Surreal } from 'surrealdb.js'

const signup = async (req: NextApiRequest, res: NextApiResponse) => {
  // get email and password and key from request body
  const { email, pass, key } = req.body

  // check if the required fields are present
  if (!email || !pass || !key) {
    res.status(400).send('Missing required fields')
    return
  }

  // check if key is valid should be 6 numbers long
  if (key.length !== 6) {
    res.status(400).send('Invalid key format')
    return
  }

  // now we authenticate to the database as root to check if the key is valid

  // check if key is valid
  // if key is valid then sign up user
  const db = new Surreal(process.env.NEXT_PUBLIC_SURREAL_DB_HOST)
  const auth_db = new Surreal(process.env.NEXT_PUBLIC_SURREAL_DB_HOST)
  await db.signin({
    user: process.env.SURREAL_DB_USER,
    pass: process.env.SURREAL_DB_PASSWORD,
  })

  // now we query the signup database to see if the key is valid
  await db.use({
    ns: 'PrintFarm',
    db: 'keys',
  })

  // check if key is valid
  const keyValid = await db.query('SELECT * FROM key WHERE key = $key', {
    key,
  })

  // now we check if the result is empty
  // @ts-ignore
  if (keyValid[0].result.length === 0) {
    console.log('Key is invalid')
    res.status(400).send('Invalid key')
    return
  }

  // now we confirm that the key is valid we can sign up the user
  const jwt = await auth_db
    .signup({
      NS: 'PrintFarm',
      DB: 'users',
      SC: 'allusers',

      email: email,
      pass: pass,
    })
    .catch((err) => {
      console.log('Error signing up user:', err)
      res.status(400).send('Error signing up user')
    })

  // now we check if the jwt is valid
  if (!jwt) {
    console.log('jwt is undefined')
    return
  }

  // now we confirm that the user was signed up successfully we can delete the key from the signup database
  console.log('Deleting key')
  await db.query('DELETE key WHERE key = $key', { key })

  // since the user used the correct way to sign up we can now set the valid property to true, this means even if someone creates a user without a key they will not be able to do anything with it
  console.log('Setting valid to true')
  await db.use({
    ns: 'PrintFarm',
    db: 'users',
  })
  await db.query('UPDATE user SET valid = true WHERE email = $email', {
    email,
  })

  res.send({
    token: jwt,
  })
}

export default signup
