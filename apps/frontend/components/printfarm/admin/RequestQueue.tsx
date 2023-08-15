import { Button, Card, Typography } from '@material-tailwind/react'
import { useEffect, useState } from 'react'

const updateIncomingRequests = (setIncomingRequests) => {
  fetch('/api/admin/retrievePrintQueue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jwt: localStorage.getItem('token') }),
  })
    .then((res) => {
      res.json().then((res) => {
        console.log(res)
        setIncomingRequests(res)
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

const RequestQueue = () => {
  const [incomingRequests, setIncomingRequests] = useState([] as any)

  useEffect(() => {
    updateIncomingRequests(setIncomingRequests)
  }, [])

  return (
    <div>
      <Card className="h-full">
        <Typography variant="h4" color="blue" className="text-center mt-4">
          Incomming Requests
        </Typography>
        <hr className="mb-4" />
        <div className="flex flex-col space-y-4 px-4 pb-4 h-full">
          {
            // if there are no incoming requests, display a message
            incomingRequests.length === 0 && (
              <div className="flex flex-col justify-center my-4 h-full mb-12">
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="text-center"
                >
                  No Incoming Requests
                </Typography>
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="text-center"
                >
                  When a user uploads a file, it will appear here
                </Typography>
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="text-center"
                >
                  You can then handle the request from here
                </Typography>
              </div>
            )
          }
          {incomingRequests.map((request, index) => {
            return (
              <div className="flex flex-col justify-center border rounded-md p-2 shadow-sm">
                <div className="">
                  <div className="flex flex-row justify-between">
                    <div className="w-full text-center">
                      <Typography color="blue-gray">File Name</Typography>
                    </div>
                    <div className="w-full text-center">
                      <Typography color="blue-gray">Email</Typography>
                    </div>
                    <div className="w-full text-center">
                      <Typography color="blue-gray">Time Uploaded</Typography>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-between">
                  <div className="w-full text-center">{request.fileName}</div>
                  <div className="w-full text-center">{request.email}</div>
                  <div className="w-full text-center">
                    {new Date(request.uploadTime).toLocaleString()}
                  </div>
                </div>
                <hr className="mb-2 mt-2" />
                <div className="flex flex-row justify-between">
                  <div className="w-full text-center">
                    <Typography color="blue-gray">Infill Percentage</Typography>
                    <div>{request.infill}%</div>
                  </div>
                  <div className="w-full text-center">
                    <Typography color="blue-gray">Material</Typography>
                    <div>{request.material}</div>
                  </div>
                </div>
                <hr className="mb-4 mt-2" />
                <div className="flex flex-col justify-center space-y-2">
                  <div className="flex flex-row justify-start w-full">
                    <Button
                      onClick={() => {
                        fetch('http://localhost:8080/admin/downloadStl', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            jwt: localStorage.getItem('token'),
                            fileName: request.fileName,
                            stlName: request.stlName,
                          }),
                        }).then((res) => {
                          res.blob().then((blob) => {
                            const url = window.URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = request.fileName
                            a.click()
                          })
                        })
                      }}
                    >
                      Download For Slicing
                    </Button>
                  </div>
                  <input
                    name="file"
                    className="block border rounded-md w-full text-sm text-gray-500
                                          file:mr-4 file:py-2 file:px-4
                                          file:rounded-md file:border-0
                                          file:text-sm file:font-semibold
                                          file:bg-blue-500 file:text-white
                                          file:hover:shadow-blue-500/40
                                          file:shadow
                                          file:hover:shadow-lg
                                          hover:file:bg-blue-600 border-blue-gray-200"
                    type="file"
                    accept=".gcode"
                    onChange={(e) => {}}
                  />
                  <hr className="mb-4" />
                  <div className="flex flex-row justify-start">
                    <Button variant="outlined">Upload Gcode</Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

export default RequestQueue
