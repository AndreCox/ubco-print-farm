import { NextApiRequest, NextApiResponse } from 'next'
import { Surreal } from 'surrealdb.js'

const createKey = async (req: NextApiRequest, res: NextApiResponse) => {
  // first only allow admins to access this endpoint
  const { jwt } = req.body
  if (!jwt) {
    return res.status(400).send('Missing fields')
  }

  const decodedJwt = decodeJwt(jwt)
  if (!decodedJwt.ID) {
    return res.status(400).send('Invalid Token')
  }

  // now check if the token is still valid by signing in
  const tempDB = new Surreal(process.env.NEXT_PUBLIC_SURREAL_DB_HOST)
  await tempDB.use({ ns: 'PrintFarm', db: 'users' })

  try {
    await tempDB.authenticate(jwt)
  } catch (err) {
    return res.status(401).send('Unauthorized')
  }

  // Create a new instance of SurrealDB
  const db = new Surreal(process.env.NEXT_PUBLIC_SURREAL_DB_HOST)
  // Authenticate to SurrealDB
  await db.signin({
    user: process.env.SURREAL_DB_USER,
    pass: process.env.SURREAL_DB_PASSWORD,
  })

  await db.use({ ns: 'PrintFarm', db: 'users' })

  const user = await db.query('SELECT * FROM $userID', {
    userID: decodedJwt.ID,
  })

  if (!user[0].result[0].admin) {
    return res.status(401).send('Unauthorized')
  }

  // now we know the user is an admin, we can create a new key
  await db.use({ ns: 'PrintFarm', db: 'keys' })

  //first we want to avoid duplicate keys when generating a new one
  const keys = await db.query('SELECT key FROM key')

  // generate a new key of 6 numbers between 000000 and 999999
  let newKey = generate(6)
  while (true) {
    // @ts-ignore
    if (!keys[0].result.includes(newKey)) {
      break
    }
    newKey = generate(6)
  }

  await db.query('CREATE key SET key = $key', {
    key: newKey,
  })

  res.status(200).send('Key created')
}

const decodeJwt = (token: string) => {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}

function generate(n) {
  var add = 1,
    max = 12 - add // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

  if (n > max) {
    return generate(max) + generate(n - max)
  }

  max = Math.pow(10, n + add)
  var min = max / 10 // Math.pow(10, n) basically
  var number = Math.floor(Math.random() * (max - min + 1)) + min

  return ('' + number).substring(add)
}

export default createKey
