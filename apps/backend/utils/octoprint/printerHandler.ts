import db from '../surreal.js'
import { WebSocket } from 'ws'

type Printer = {
  id: string
  name: string
  ip: string
  apiKey: string
  lastUpdated: Date
}

class PrinterHandler {
  printerArray: Array<Printer> = []

  constructor() {
    console.log('printer handler started')
    this.initialize()
  }

  async initialize() {
    await this.getPrinters()
    this.subscribeToPrinters()
    this.printerPoll()
    this.websocketPoll()
  }

  subscribeToPrinters() {
    // this will log into the octoprint rest api and subscribe to the socket api
    // this will allow us to get live updates from the printer

    if (this.printerArray.length === 0) {
      console.log('no printers to subscribe to')
      return
    }

    console.log('subscribing to printers')
    this.printerArray.forEach(async (printer, i) => {
      if (!printer.ip || !printer.apiKey) {
        // console.log('missing ip or api key')
      } else {
        // console.log('checking if printer is online')
        // console.log(printer.lastUpdated)
        // if the printer was never updated or the last update was more than 30 seconds ago
        if (!printer.lastUpdated) {
          //   console.log('printer was never connected')
          let online = await this.checkOnline(printer)
          if (online) {
            this.websocketSubscribe(printer, i)
          } else {
            // update the database to show the printer is not found
            await db.use({ ns: 'PrintFarm', db: 'printers' })
            await db.query('UPDATE $printerID SET printerInfo = $printerInfo', {
              printerID: printer.id,
              printerInfo: {
                state: {
                  text: 'Not Found',
                },
                temps: {
                  tool0: {
                    actual: NaN,
                  },
                  bed: {
                    actual: NaN,
                  },
                },
              },
            })
          }
        } else if (new Date().getTime() - printer.lastUpdated > 30000) {
          //   console.log('printer is offline')
          //   console.log('trying to reconnect')
          this.websocketSubscribe(printer, i)
        } else {
          //   console.log('printer is online')
        }
      }
    })
  }

  async checkOnline(printer: Printer): Promise<boolean> {
    // do a rest api call to see if the printer is online
    const { ip, apiKey } = printer

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

    try {
      const response = await fetch(`http://${ip}/api/login`, options)
      const data = await response.json()
      // now we check if name and session are in the response
      if (data.name && data.session) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }

  async websocketSubscribe(printer: Printer, index: number) {
    // this will subscribe to the websocket api of the printer
    const { ip, apiKey } = printer

    // first we need to login to the rest api
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

    const response = await fetch(`http://${ip}/api/login`, options)

    const data = await response.json()
    const { name, session } = data

    // now we need to subscribe to the websocket api
    const ws = new WebSocket(`ws://${ip}/sockjs/websocket`)
    ws.on('open', () => {
      ws.send(
        JSON.stringify({
          auth: `${name}:${session}`,
        })
      )
    })

    ws.on('message', (data) => {
      // convert the buffer to json
      // update the last updated time
      const jsonData = JSON.parse(data.toString())
      // first we'll check if the printer exists in the printer array

      if (this.printerArray[index]?.id !== printer.id) {
        // if the printer does not exist here then we will destroy the websocket
        ws.close()
      }

      try {
        this.writePrinterData(printer, jsonData, index)
      } catch (err) {
        console.log(err)
      }
    })
  }

  async writePrinterData(printer: Printer, data: any, index: number) {
    // first we check if the printer exists in the printer array
    if (this.printerArray[index]?.id !== printer.id) {
      // if the printer does not exist here then we will exit the function
      return
    }

    // this will write the printer data to the db
    await db.use({ ns: 'PrintFarm', db: 'printers' })
    // first we extract the necessary data from the websocket data
    const toolTemp = data?.current?.temps[0]?.tool0?.actual
    const bedTemp = data?.current?.temps[0]?.bed?.actual

    // next we get the status of the printer
    const state = data?.current?.state
    const job = data?.current?.job
    const progress = data?.current?.progress

    // update the last updated time
    this.printerArray[index].lastUpdated = new Date()
    // now depending on what data we have we will write to the db
    if (toolTemp && bedTemp && state) {
      await db.use({ ns: 'PrintFarm', db: 'printers' })
      // first check if the printer exists in the db
      const printerID = printer.id
      const printerExists = await db.query('SELECT id FROM $printerID ', {
        printerID: printer.id,
      })
      // @ts-expect-error
      if (printerExists[0].result.length === 0) {
        // if the printer does not exist in the db we wont write to it
        this.getPrinters()
        return
      }
      console.log('writing to db')
      await db.query('UPDATE $printerID SET printerInfo = $printerInfo', {
        printerID: printer.id,
        printerInfo: {
          temps: {
            tool0: {
              actual: toolTemp,
            },
            bed: {
              actual: bedTemp,
            },
          },
          state,
          job,
          progress,
        },
      }) //
    } else if (state?.text === 'Offline') {
      await db.use({ ns: 'PrintFarm', db: 'printers' })

      const printerID = printer.id
      const printerExists = await db.query('SELECT id FROM $printerID ', {
        printerID: printer.id,
      })
      // @ts-expect-error
      if (printerExists[0].result.length === 0) {
        // if the printer does not exist in the db we wont write to it
        this.getPrinters()
        return
      }
      console.log('writing to db')
      await db.query('UPDATE $printerID SET printerInfo = $printerInfo', {
        printerID: printer.id,
        printerInfo: {
          temps: {
            tool0: {
              actual: 0,
            },
            bed: {
              actual: 0,
            },
          },
          state,
        },
      }) //
    }
  }

  async getPrinters() {
    await db.use({ ns: 'PrintFarm', db: 'printers' })
    const printers = await db.query('SELECT name, id, apiKey, ip FROM printer')
    // @ts-expect-error
    this.printerArray = printers[0].result
  }

  async websocketPoll() {
    // this will try to update the websocket connection every 30 seconds if there is no connection
    setInterval(async () => {
      await this.subscribeToPrinters()
    }, 30000)
  }

  async printerPoll() {
    // this will try to update the printer array every 30 seconds
    setInterval(async () => {
      await this.getPrinters()
    }, 30000)
  }
}

export default PrinterHandler
