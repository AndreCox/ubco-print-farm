import express, { Express, Request, Response } from 'express'
import db, { initDB } from './utils/surreal'
import { json } from 'stream/consumers'
import bodyParser from 'body-parser'

initDB()

const port = 8080
const app: Express = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

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
