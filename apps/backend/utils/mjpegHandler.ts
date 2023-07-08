import url from 'url'
import http, { ServerResponse } from 'http'

function extractBoundary(contentType: any) {
  contentType = contentType.replace(/\s+/g, '')

  var startIndex = contentType.indexOf('boundary=')
  var endIndex = contentType.indexOf(';', startIndex)
  if (endIndex == -1) {
    //boundary is the last option
    // some servers, like mjpeg-streamer puts a '\r' character at the end of each line.
    if ((endIndex = contentType.indexOf('\r', startIndex)) == -1) {
      endIndex = contentType.length
    }
  }
  return contentType
    .substring(startIndex + 9, endIndex)
    .replace(/"/gi, '')
    .replace(/^\-\-/gi, '')
}

class MjpegProxy {
  mjpegOptions: any = null

  audienceResponses: http.ServerResponse[] = []
  newAudienceResponses: http.ServerResponse[] = []

  boundary: any = null
  globalMjpegResponse: any = null
  mjpegRequest: any = null

  constructor(mjpegUrl: string) {
    this.mjpegOptions = new URL(mjpegUrl)
  }

  proxyRequest = function (
    this: MjpegProxy,
    req: http.ClientRequest,
    res: http.ServerResponse
  ) {
    if (res.socket == null) {
      return
    }

    // There is already another client consuming the MJPEG response
    if (this.mjpegRequest != null) {
      this.newClient(req, res)
    } else {
      this.mjpegRequest = http.request(this.mjpegOptions, (mjpegResponse) => {
        this.globalMjpegResponse = mjpegResponse
        this.boundary = extractBoundary(mjpegResponse.headers['content-type'])

        this.newClient(req, res)

        let lastByte1: any = null
        let lastByte2: any = null

        mjpegResponse.on('data', (chunk) => {
          let buff = Buffer.from(chunk)
          if (lastByte1 != null && lastByte2 != null) {
            let oldHeader = '--' + this.boundary

            let p = buff.indexOf(oldHeader)
            if (
              (p == 0 && !(lastByte2 == 0x0d && lastByte1 == 0x0a)) ||
              (p > 1 && !(chunk[p - 2] == 0x0d && chunk[p - 1] == 0x0a))
            ) {
              let b1 = chunk.slice(0, p)
              let b2 = Buffer.from('\r\n--' + this.boundary)
              let b3 = chunk.slice(p + oldHeader.length)

              chunk = Buffer.concat([b1, b2, b3])
            }
          }

          lastByte1 = buff[buff.length - 1]
          lastByte2 = buff[buff.length - 2]

          for (var i = this.audienceResponses.length; i--; ) {
            var res = this.audienceResponses[i]

            // First time we push data... lets start at a boundary
            if (this.newAudienceResponses.indexOf(res) >= 0) {
              var p = buff.indexOf('--' + this.boundary)
              if (p >= 0) {
                res.write(chunk.slice(p))
                this.newAudienceResponses.splice(
                  this.newAudienceResponses.indexOf(res),
                  1
                ) // remove from new
              }
            } else {
              res.write(chunk)
            }
          }
        })
        mjpegResponse.on('end', () => {
          for (let i = this.audienceResponses.length; i--; ) {
            let res = this.audienceResponses[i]
            res.end()
          }
        })
        mjpegResponse.on('close', () => {
          // console.log('close')
        })
      })
      this.mjpegRequest.on('error', (e: any) => {
        console.log('problem with request: ' + e.message)
      })
      this.mjpegRequest.end()
    }
  }

  newClient = function (
    this: MjpegProxy,
    req: http.ClientRequest,
    res: http.ServerResponse
  ) {
    res.writeHead(200, {
      Expires: 'Mon, 01 Jul 1980 00:00:00 GMT',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      'Content-Type': 'multipart/x-mixed-replace;boundary=' + this.boundary,
    })

    this.audienceResponses.push(res)
    this.newAudienceResponses.push(res)

    // @ts-ignore
    res.socket.on('close', () => {
      this.audienceResponses.splice(this.audienceResponses.indexOf(res), 1)
      if (this.audienceResponses.indexOf(res) >= 0) {
        this.newAudienceResponses.splice(
          this.newAudienceResponses.indexOf(res),
          1
        )
      }

      if (this.audienceResponses.length == 0) {
        this.mjpegRequest = null
        if (this.globalMjpegResponse) {
          this.globalMjpegResponse.destroy()
          this.globalMjpegResponse = null
        }
      }
    })
  }
}

export default MjpegProxy
