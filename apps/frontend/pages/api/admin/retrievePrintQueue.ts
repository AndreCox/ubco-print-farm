import { NextApiRequest, NextApiResponse } from 'next'
import { Surreal } from 'surrealdb.js'

const retreivePrintQueue = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
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

  // now we know the user is an admin, we can return the print queue for all users
  await db.use({ ns: 'PrintFarm', db: 'users' })

  // we need to get the print queue for each user and there emails so we can see who uploaded the file
  // we also want to extract the print queue arrays from the objects to make one big array of print queues
  // we will also add the email to each print queue object

  const printQueuesAndEmails = await db.query(
    'SELECT printQueue, email FROM user'
  )

  // we have an Array that looks like this [{email: 'email', printQueue: [{printQueueObject}]}]
  // we want to make it look like this [printQueueObject with email property added]

  // we will use a reduce function to do this
  //@ts-expect-error
  const printQueue = printQueuesAndEmails[0].result.reduce((acc, curr) => {
    // we will loop through each print queue and add the email to each object
    curr.printQueue.forEach((printQueueObject) => {
      printQueueObject.email = curr.email
      acc.push(printQueueObject)
    })
    return acc
  }, [])

  // now the last thing we do is sort based on the uploadTime property
  printQueue.sort((a, b) => {
    return Date.parse(a.uploadTime) - Date.parse(b.uploadTime)
  })

  res.status(200).send(printQueue)
}

const decodeJwt = (token: string) => {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}

export default retreivePrintQueue
