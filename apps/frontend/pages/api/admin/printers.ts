import { NextApiRequest, NextApiResponse } from 'next'
import { Surreal } from 'surrealdb.js'

const printers = async (req: NextApiRequest, res: NextApiResponse) => {
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

  // now we know the user is an admin, we can update the printer
  // we want to check whether the user wants to create, update or delete a printer
  // get whether it is a create, update or delete request
  if (req.method == 'POST') {
    // we want to return a list of all printers
    await db.use({ ns: 'PrintFarm', db: 'printers' })
    const printers = await db.query('SELECT * FROM printer')
    return res.status(200).send(printers[0].result)
  }

  if (req.method == 'PUT') {
    // create a new printer
    // initialize to empty values
    await db.use({ ns: 'PrintFarm', db: 'printers' })
    await db.query('CREATE printer SET name = $name, ip = $ip, apiKey = $key', {
      name: '',
      ip: '',
      key: '',
    })
    return res.status(200).send('Printer created')
  }

  if (req.method == 'PATCH') {
    // update a printer
    // first check if the required fields are present
    const { name, ip, key, id } = req.body
    if (!id) {
      return res.status(400).send('Missing fields')
    }

    // now check if the printer already exists
    await db.use({ ns: 'PrintFarm', db: 'printers' })
    const printer = await db.query('SELECT * FROM $id', { id })
    // @ts-expect-error
    if (printer[0].result.length == 0) {
      return res.status(400).send('Printer does not exist')
    }

    // we only want to update the fields that are present
    if (name) {
      await db.query('UPDATE $id SET name=$name', { id, name })
    }

    if (ip) {
      await db.query('UPDATE $id SET ip=$ip', { id, ip })
    }

    if (key) {
      await db.query('UPDATE $id SET apiKey=$key', { id, key })
    }

    return res.status(200).send('Printer updated')
  }

  if (req.method == 'DELETE') {
    // delete a printer
    const { id } = req.body
    if (!id) {
      return res.status(400).send('Missing fields')
    }

    // now check if the printer already exists
    await db.use({ ns: 'PrintFarm', db: 'printers' })
    const printer = await db.query('SELECT $id FROM printer', { id })
    // @ts-expect-error
    if (printer[0].result.length == 0) {
      return res.status(400).send('Printer does not exist')
    }

    // now we can delete the printer
    await db.query('DELETE $id', { id })
    return res.status(200).send('Printer deleted')
  }
}

const decodeJwt = (token: string) => {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}

export default printers
