import express, { Express, Request, Response } from 'express'
import db, { initDB } from './utils/surreal.js'
import bodyParser from 'body-parser'
import { request } from 'http'
import { minioClient, setupMinio } from './utils/minio.js'

import MjpegProxy from './utils/mjpegHandler.js'
import { Surreal } from 'surrealdb.js'
import fileUpload from 'express-fileupload'
import md5 from 'md5'
import decodeJwt from './utils/jwtParser.js'
import testOctoConnection from './utils/octoprint/testOctoConnection.js'
import PrinterHandler from './utils/octoprint/printerHandler.js'

await initDB()
setupMinio()

const port = 8080
const app: Express = express()

const printerHandler = new PrinterHandler()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
)
app.use(function (req, res, next) {
  res.header('X-Frame-Options', 'SAMEORIGIN')
  // @ts-ignore
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
  )
  next()
})

type OctoInstance = {
  ip: string
  apiKey: string
}

const getOctoPrintCreds = async (octoInstances: OctoInstance) => {
  const { ip, apiKey } = octoInstances
  // post request to octoprint
  const formdata = new URLSearchParams()
  formdata.set('passive', '1')

  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Api-Key': apiKey,
    },
    body: formdata,
  }

  const response = await fetch(`http://192.168.1.49/api/login`, options)
  const data = await response.json()
  return {
    username: data.name,
    session: data.session,
  }
}

app.get('/video/:id', async (req, res) => {
  console.log('GET /video')

  // get the printer id
  const printerId = req.params.id

  // get the printers ip from the database
  await db.use({ ns: 'PrintFarm', db: 'printers' })

  const ip = await db.query('SELECT ip FROM $printerID', {
    printerID: printerId,
  })

  console.log(ip[0].result)
  try {
    new MjpegProxy(
      // @ts-ignore
      `http://${ip[0].result[0].ip}/webcam/?action=stream`
    ).proxyRequest(
      // @ts-ignore
      req,
      res
    )
  } catch (err) {
    return res.status(500).send('Internal Server Error')
  }
})

app.get('/printers', async (req, res) => {
  console.log('GET /printers')

  await db.use({ ns: 'PrintFarm', db: 'printers' })

  try {
    const printers = await db.query('SELECT id, name, printerInfo FROM printer')

    return res.status(200).send(printers[0].result)
  } catch (err) {
    return res.status(500).send('Internal Server Error')
  }
})

app.post('/admin/downloadStl', async (req: Request, res: Response) => {
  console.log('POST /admin/downloadStl')

  // first check if all the fields are present
  const { stlName, fileName, jwt } = req.body

  if (!stlName || !jwt || !fileName) {
    return res.status(400).send('Missing fields')
  }

  // next we need to check if the user is authenticated
  const tempDB = new Surreal(process.env.NEXT_PUBLIC_SURREAL_DB_HOST)
  await tempDB.use({ ns: 'PrintFarm', db: 'users' })

  try {
    await tempDB.authenticate(jwt)
  } catch (err) {
    return res.status(401).send('Unauthorized')
  }

  // now we'll check if the user is an admin
  const decodedJwt = decodeJwt(jwt)
  if (!decodedJwt) {
    return res.status(401).send('Unauthorized')
  }

  let userId = decodedJwt.ID

  const admin = await tempDB.query('SELECT admin FROM $userID', {
    userID: userId,
  })

  // @ts-expect-error
  if (!admin[0].result[0].admin) {
    return res.status(401).send('Unauthorized')
  }

  // now we know the user is an admin, we will download the file from minio
  const file = await minioClient.getObject('printfarm', stlName)

  // now we will send the file as a response
  res.setHeader('Content-disposition', 'attachment; filename=' + fileName)
  res.setHeader('Content-type', 'application/octet-stream')
  file.pipe(res)

  return res.status(200)
})

app.post('/admin/testConnection', async (req: Request, res: Response) => {
  console.log('POST /admin/testConnection')

  // first check if all the fields are present
  const { jwt, id } = req.body

  if (!jwt || !id) {
    return res.status(400).send('Missing fields')
  }

  // next we need to check if the user is authenticated
  const tempDB = new Surreal(process.env.NEXT_PUBLIC_SURREAL_DB_HOST)
  await tempDB.use({ ns: 'PrintFarm', db: 'users' })

  try {
    await tempDB.authenticate(jwt)
  } catch (err) {
    return res.status(401).send('Unauthorized')
  }

  // now we'll check if the user is an admin
  const decodedJwt = decodeJwt(jwt)
  if (!decodedJwt) {
    return res.status(401).send('Unauthorized')
  }

  let userId = decodedJwt.ID

  const admin = await tempDB.query('SELECT admin FROM $userID', {
    userID: userId,
  })

  // @ts-expect-error
  if (!admin[0].result[0].admin) {
    return res.status(401).send('Unauthorized')
  }

  // now we know the user is an admin, we will test the connection for the printer id

  await db.use({ ns: 'PrintFarm', db: 'printers' })

  const printers = await db.query('SELECT apiKey, ip FROM $id', { id: id })

  // @ts-expect-error
  if (printers[0].result.length === 0) {
    return res.status(400).send('Printer not found')
  }

  // @ts-expect-error
  const printer = printers[0].result[0]

  // now we will test the connection
  const connection = await testOctoConnection(printer)

  if (!connection) {
    return res.status(400).send('Connection failed')
  }

  return res.status(200).send('Connection successful')
})

app.post('/admin/upload', async (req: Request, res: Response) => {
  console.log('POST /admin/upload')
  // this endpoint will be used when an admin uploads a sliced file to the server
  // we will take in the userPrintQueueID which will be used to find file info in the db

  const { jwt, userPrintQueueID, printQueueIndex } = req.body
  if (!jwt || !userPrintQueueID || !printQueueIndex) {
    return res.status(400).send('Missing fields')
  }

  // next we need to check if the user is authenticated
  const tempDB = new Surreal(process.env.NEXT_PUBLIC_SURREAL_DB_HOST)
  await tempDB.use({ ns: 'PrintFarm', db: 'users' })

  try {
    await tempDB.authenticate(jwt)
  } catch (err) {
    return res.status(401).send('Unauthorized')
  }

  // now we'll check if the user is an admin
  const decodedJwt = decodeJwt(jwt)
  if (!decodedJwt) {
    return res.status(401).send('Unauthorized')
  }

  let userId = decodedJwt.ID

  const admin = await tempDB.query('SELECT admin FROM $userID', {
    userID: userId,
  })
  // @ts-expect-error
  if (!admin[0].result[0].admin) {
    return res.status(401).send('Unauthorized')
  }

  // now we know the user is an admin, we will get the print info from the db
  await db.use({ ns: 'PrintFarm', db: 'printers' })
  let printInfo = await db.query('SELECT * FROM $id', { id: userPrintQueueID })

  // @ts-expect-error
  if (printInfo[0].result.length === 0) {
    return res.status(400).send('Print not found')
  }

  // upload the file and check if it is a gcode file
  // make sure that gcode exists on the files object
  if (!req.files) {
    return res.status(400).send('No file uploaded')
  }
  if (!req.files.gcode) {
    return res.status(400).send('No file uploaded')
  }

  // @ts-expect-error
  const hash = md5(req.files.gcode.data)
  // @ts-expect-error
  const fileName = req.files.gcode.name
  // now we have the file hash, we want to construct the stl file name
  // this will be the gcode name with the hash appended to it and the .stl extension
  let fileNamePrefix = fileName.replace('.gcode', '')
  fileNamePrefix = fileNamePrefix.replace('.GCODE', '')
  fileNamePrefix = fileNamePrefix.replace('.Gcode', '')
  fileNamePrefix = fileNamePrefix.replace('.gco', '')
  fileNamePrefix = fileNamePrefix.replace('.GCO', '')

  const gcodeName = fileNamePrefix + '_' + hash + '.gcode'

  // now we will modify the print info in the db
  await db.use({ ns: 'PrintFarm', db: 'users' })

  // now we will upload the file to minio
  const file = req.files.gcode

  minioClient.putObject(
    'printfarm',
    gcodeName,
    // @ts-expect-error
    file.data,
    function (err, etag) {
      if (err) {
        console.log(err)
        return res.status(500).send('Internal server error')
      } else {
        return res.status(200).send('File uploaded')
      }
    }
  )
})

app.post('/upload', async (req: Request, res: Response) => {
  console.log('POST /upload')
  // when a file is uploaded, we will store the file name in the db
  // we also need to check if the file is allowed to be uploaded by the user

  // the request will contain the file name, the user id, and the file itself
  // we will need to check if the user is allowed to upload the file

  // first check if all the fields are present
  console.log(req.body)

  const { fileName, jwt, infill, material } = req.body
  console.log(fileName, jwt)
  if (!fileName || !jwt || !infill || !material) {
    console.log('Missing fields')
    return res.status(400).send('Missing fields')
  }

  console.log(fileName, jwt)
  const tempDB = new Surreal(process.env.NEXT_PUBLIC_SURREAL_DB_HOST)
  await tempDB.use({ ns: 'PrintFarm', db: 'users' })

  try {
    await tempDB.authenticate(jwt)
  } catch (err) {
    return res.status(401).send('Unauthorized')
  }

  // lets decode the jwt to get the user id
  const decodedJwt = decodeJwt(jwt)
  if (!decodedJwt) {
    return res.status(401).send('Unauthorized')
  }

  let userId = decodedJwt.ID

  // now we know the user is authenticated we need to check if the user is valid
  const valid = await tempDB.query('SELECT valid FROM $userID', {
    userID: userId,
  })
  console.log(valid)

  // @ts-expect-error
  if (!valid[0].result[0].valid) {
    return res.status(401).send('Unauthorized')
  }

  // now we know the user is valid, we will upload the file and check if it is a stl file
  // check if file exists
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.')
  }

  // we want to create a hash of the file and store it in the db
  // we will use the hash to check if the file exists in the db
  // we will use md5 for the hash as it is fast and there is no need for security

  // @ts-expect-error
  const hash = md5(req.files.stl.data)

  // incase 2 users upload the same file, we will append the user id to the start of the hash
  // this will make the hash unique to the user
  // however this is inefficient as the same file will be stored twice
  // we could store the file once and then store the hash in the users db
  // if a user deletes the file, we will check if the hash is used by any other users
  // if it is not, we will delete the file from minio
  // however this will require a lot of work and is not needed for the MVP maybe in the future

  // we will remove the user: prefix from the user id
  userId = userId.replace('user:', '')

  // the last thing we will do is put the name of the file and prefix that

  let fileNamePrefix = fileName.replace('.stl', '')
  fileNamePrefix = fileNamePrefix.replace('.STL', '')

  const stlName = fileNamePrefix + '_' + userId + hash + '.stl'

  // we will write the metadata to the db first, this is stored in the users db under the printQueue array in the user table row
  // we will store the stlName, and the fileName
  // we will also store the status of the print, this will be used to check if the print is complete or not

  await tempDB.use({ ns: 'PrintFarm', db: 'users' })
  // use array::append function to add the file data to the printQueue array
  await tempDB.query('UPDATE user SET printQueue += $printQueue', {
    printQueue: {
      stlName: stlName,
      fileName: fileName,
      status: 'queued',
      uploadTime: Date.now(),
      infill: infill,
      material: material,
    },
  })

  // now we have the file, we can upload it to minio
  const file = req.files.stl
  // @ts-expect-error
  minioClient.putObject('printfarm', stlName, file.data, function (err, etag) {
    if (err) {
      console.log(err)
      return res.status(500).send('Error uploading file')
    }
    return res.status(200).send('File uploaded')
  })
})

app.get('/', async (req: Request, res: Response) => {
  console.log('GET /')
  const creds = await getOctoPrintCreds({
    ip: '192.168.1.49',
    apiKey: 'D3C8BEE70F1740CAA6635332922E39BA',
  })
  res.send(creds)
})

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`)
})
