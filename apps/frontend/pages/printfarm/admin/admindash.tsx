import {
  Button,
  Card,
  Navbar,
  Option,
  Select,
  Typography,
} from '@material-tailwind/react'
import messages from '../../../helpers/loadingMessages'
import { database } from '../../../surreal/surreal'
import AdminGuard from '../../../components/guards/AdminGuard'
import { authenticator } from '../../../helpers/authentication/authenticator'
import { useEffect, useState } from 'react'
import { IoMdSettings } from 'react-icons/io'
import { Footer } from '../../../components/Footer'
import PageContainer from '../../../components/PageContainer'
import { stringify } from 'querystring'

// get static props
export const getStaticProps = () => {
  return {
    props: {
      loadingMessage: messages[Math.floor(Math.random() * messages.length)],
    },
  }
}

const updateKeys = (setKeys) => {
  fetch('/api/admin/getKeys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jwt: localStorage.getItem('token') }),
  })
    .then((res) => {
      res.json().then((res) => {
        setKeys(res)
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

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

const AdminDash = ({ loadingMessage }) => {
  const [keys, setKeys] = useState([] as any)
  const [incomingRequests, setIncomingRequests] = useState([] as any)

  useEffect(() => {
    updateKeys(setKeys)
    updateIncomingRequests(setIncomingRequests)
  }, [])

  useEffect(() => {
    // get everyone's print queue
    database.db.use({ ns: 'PrintFarm', db: 'users' }).then((res) => {
      database.db.query('SELECT printQueue FROM user').then((res) => {
        console.log(res)
      })
    })
  })

  return (
    <AdminGuard loadingMessage={loadingMessage}>
      <PageContainer>
        <Navbar className="w-screen p-2 lg:px-4 max-w-full">
          <div className="flex place-items-start justify-evenly text-blue-gray-900 m-0">
            <div className="w-full">
              <Typography variant="h4" color="blue-gray">
                Admin Dashboard
              </Typography>
            </div>
            <div className="flex flex-row justify-end w-full space-x-4">
              <Button
                className="p-0"
                variant="outlined"
                onClick={() => {
                  window.location.href = '/printfarm/admin/adminsettings'
                }}
              >
                <IoMdSettings className="text-3xl" />
              </Button>
              <Button
                className="px-2 py-2 m-0"
                color="blue"
                onClick={() => {
                  window.location.href = '/printfarm/userdash'
                }}
              >
                User Dashboard
              </Button>
              <Button
                className="px-2 py-2 m-0"
                color="blue"
                variant="outlined"
                onClick={() => {
                  database.db.invalidate()
                  localStorage.removeItem('token')
                  window.location.href = '/'
                }}
              >
                SignOut
              </Button>
            </div>
          </div>
        </Navbar>
        <div className="grid grid-cols-2 p-2 gap-2 bg-blue-gray-50">
          <div className="h-full">
            <Card className="h-full">
              <Typography
                variant="h4"
                color="blue"
                className="text-center mt-4"
              >
                Key Management
              </Typography>
              <hr className="mb-4" />
              <div className="flex flex-col space-y-4 px-4 pb-4">
                {
                  // if there are no keys, display a message
                  keys.length === 0 && (
                    <div className="flex flex-col justify-center my-4">
                      <Typography
                        variant="h5"
                        color="blue-gray"
                        className="text-center"
                      >
                        No Keys
                      </Typography>
                      <Typography
                        variant="h6"
                        color="blue-gray"
                        className="text-center"
                      >
                        Create a key to allow a user to signup
                      </Typography>
                    </div>
                  )
                }
                {keys.map((key, index) => {
                  return (
                    <div
                      className="flex flex-row justify-between border rounded-md p-2 shadow"
                      key={index}
                    >
                      <div className="p-1 bg-blue-gray-50 shadow-inner rounded text-center">
                        <div className="flex flex-row justify-center">
                          {
                            // map through the key letters to display them and we can underline each letter
                            key.key.split('').map((letter, index) => {
                              return (
                                <div key={index}>
                                  <div className="w-1.5"></div>
                                  <Typography
                                    variant="h5"
                                    className="underline"
                                    key={index}
                                  >
                                    {letter}
                                  </Typography>
                                  <div className="w-1.5"></div>
                                </div>
                              )
                            })
                          }
                        </div>
                      </div>
                      <div className="flex flex-col justify-center drop-shadow-sm hover:drop-shadow-lg transition-all">
                        <button
                          onClick={
                            // delete the key
                            () => {
                              fetch('/api/admin/deleteKey', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  jwt: localStorage.getItem('token'),
                                  key: key.key,
                                }),
                              })
                                .then((res) => {
                                  res.text().then((res) => {
                                    updateKeys(setKeys)
                                  })
                                })
                                .catch((err) => {
                                  console.log(err)
                                })
                            }
                          }
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  )
                })}
                <div className="flex flex-row justify-center">
                  <Button
                    onClick={() => {
                      fetch('/api/admin/createKey', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          jwt: localStorage.getItem('token'),
                        }),
                      })
                        .then((res) => {
                          res.text().then((res) => {
                            updateKeys(setKeys)
                          })
                        })
                        .catch((err) => {
                          console.log(err)
                        })
                    }}
                  >
                    Create Signup Key
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          <div>
            <Card className="h-full">
              <Typography
                variant="h4"
                color="blue"
                className="text-center mt-4"
              >
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
                            <Typography color="blue-gray">
                              Time Uploaded
                            </Typography>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between">
                        <div className="w-full text-center">
                          {request.fileName}
                        </div>
                        <div className="w-full text-center">
                          {request.email}
                        </div>
                        <div className="w-full text-center">
                          {new Date(request.uploadTime).toLocaleString()}
                        </div>
                      </div>
                      <hr className="mb-2 mt-2" />
                      <div className="flex flex-row justify-between">
                        <div className="w-full text-center">
                          <Typography color="blue-gray">
                            Infill Percentage
                          </Typography>
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
                                headers: { 'Content-Type': 'application/json' },
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
        </div>
        <Footer />
      </PageContainer>
    </AdminGuard>
  )
}

export default AdminDash
