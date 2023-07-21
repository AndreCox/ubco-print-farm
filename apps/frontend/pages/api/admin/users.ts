import { NextApiRequest, NextApiResponse } from 'next'
import { Surreal } from 'surrealdb.js'

const users = async (req: NextApiRequest, res: NextApiResponse) => {
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

  const user = await db.query('SELECT * FROM $id', {
    id: decodedJwt.ID,
  })

  if (!user[0].result[0].admin) {
    return res.status(401).send('Unauthorized')
  }

  // now we know the user is an admin, we can check what they want to do
  // we want to check whether the user wants to create, update or delete a user
  // get whether it is a update or delete request

  if (req.method == 'POST') {
    // we want to return a list of all users
    await db.use({ ns: 'PrintFarm', db: 'users' })
    const users = await db.query('SELECT admin, email, id FROM user')
    return res.status(200).send(users[0].result)
  }

  if (req.method == 'PATCH') {
    // update a user (make admin or not)
    const { id, admin } = req.body
    if (!id || admin == undefined) {
      console.log(req.body)
      return res.status(400).send('Missing fields')
    }
    console.log(id, admin)

    await db.use({ ns: 'PrintFarm', db: 'users' })
    await db.query('UPDATE $id set admin=$admin', {
      admin,
      id,
    })

    return res.status(200).send('User updated')
  }

  if (req.method == 'DELETE') {
    // delete a user
    const { id } = req.body
    if (!id) {
      return res.status(400).send('Missing fields')
    }

    await db.use({ ns: 'PrintFarm', db: 'users' })
    await db.query('DELETE FROM user WHERE id = $id', {
      id,
    })
    return res.status(200).send('User deleted')
  }
}

const decodeJwt = (token: string) => {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}

export default users
