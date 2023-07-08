import { NextApiRequest, NextApiResponse } from 'next'
import { Surreal } from 'surrealdb.js'

const deleteKey = async (req: NextApiRequest, res: NextApiResponse) => {
  // first only allow admins to access this endpoint
  const { jwt, key } = req.body
  if (!jwt || !key) {
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

  // now we know the user is an admin, we can delete the key
  await db.use({ ns: 'PrintFarm', db: 'keys' })

  await db.query('DELETE FROM key WHERE key = $key', {
    key: key,
  })

  res.status(200).send('Key deleted')
}

const decodeJwt = (token: string) => {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}

export default deleteKey
