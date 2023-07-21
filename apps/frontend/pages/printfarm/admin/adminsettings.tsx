import { PrinterSettings } from './../../../components/printfarm/admin/adminSettings/PrinterSettings'
import {
  Button,
  Card,
  Input,
  Navbar,
  Switch,
  Typography,
} from '@material-tailwind/react'
import AdminGuard from '../../../components/guards/AdminGuard'
import messages from '../../../helpers/loadingMessages'
import { useEffect, useState } from 'react'
import { Footer } from '../../../components/Footer'
import { database } from '../../../surreal/surreal'
import PageContainer from '../../../components/PageContainer'

// get static props
export const getStaticProps = () => {
  return {
    props: {
      loadingMessage: messages[Math.floor(Math.random() * messages.length)],
    },
  }
}

const updateUsers = (setUsers) => {
  fetch('/api/admin/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jwt: localStorage.getItem('token'),
    }),
  })
    .then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setUsers(data)
        })
      }
    })
    .catch((err) => {
      err.text().then((data) => {
        console.log(data)
      })
    })
}

const updatePrinters = (setPrinters) => {
  fetch('/api/admin/printers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jwt: localStorage.getItem('token'),
    }),
  })
    .then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setPrinters(data)
        })
      }
    })
    .catch((err) => {
      err.text().then((data) => {
        console.log(data)
      })
    })
}

const AdminSettings = ({ loadingMessage }) => {
  const [printers, setPrinters] = useState([] as any)
  const [users, setUsers] = useState([] as any)

  useEffect(() => {
    updatePrinters(setPrinters)
    updateUsers(setUsers)
  }, [])

  return (
    <AdminGuard loadingMessage={loadingMessage}>
      <PageContainer>
        <div>
          <Navbar className="w-screen p-2 lg:px-4 max-w-full">
            <div className="flex place-items-start justify-evenly text-blue-gray-900 m-0">
              <div className="w-full">
                <Typography variant="h4" color="blue-gray">
                  Admin Settings
                </Typography>
              </div>
              <div className="flex flex-row justify-end w-full space-x-4">
                <Button
                  className="px-2 py-2 m-0"
                  color="blue"
                  onClick={() => {
                    window.location.href = '/printfarm/admin/admindash'
                  }}
                >
                  Admin Dashboard
                </Button>
              </div>
            </div>
          </Navbar>
          <div className="p-2">
            <div className="grid grid-cols-2 gap-2">
              <Card>
                <Typography
                  variant="h4"
                  color="blue"
                  className="text-center mt-4"
                >
                  Printer Setup
                </Typography>
                <div className="p-2">
                  <Typography variant="paragraph">
                    To add a printer, you will need to know the IP address of
                    the raspberry pi, and the Octoprint Application API key.
                    Please note that the global API key will not work, you must
                    generate a Application API key.
                  </Typography>
                </div>
                <hr className="mb-4" />
                <div className="flex flex-col space-y-4 px-2 mb-4">
                  {printers.length === 0 && (
                    <Typography variant="h6" className="my-4 text-center">
                      No printers have been added yet.
                    </Typography>
                  )}
                  {printers.map((printer) => {
                    console.log(printers)
                    return (
                      <PrinterSettings
                        updatePrinters={updatePrinters}
                        setPrinters={setPrinters}
                        printer={printer}
                        key={printer.id}
                      />
                    )
                  })}
                </div>
                <div className="flex flex-row justify-center mb-4 space-x-2">
                  <Button
                    onClick={() => {
                      fetch('/api/admin/printers', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          jwt: localStorage.getItem('token'),
                          name: 'New Printer',
                          ip: '192.168.1.1',
                          key: 'apikey',
                        }),
                      })
                        .then((res) => {
                          if (res.status === 200) {
                            res.text().then((data) => {
                              updatePrinters(setPrinters)
                            })
                          } else {
                            res.text().then((data) => {
                              console.log(data)
                            })
                          }
                        })
                        .catch((err) => {
                          err.text().then((data) => {
                            console.log(data)
                          })
                        })
                    }}
                  >
                    Add Printer
                  </Button>
                </div>
              </Card>
              <Card>
                <Typography
                  variant="h4"
                  color="blue"
                  className="text-center mt-4"
                >
                  User Management
                </Typography>
                <div className="p-2">
                  <Typography variant="paragraph">
                    See edit and remove all users, you can also promote them to
                    admin.
                  </Typography>
                  <hr className="mb-4" />
                </div>
                <div className="flex flex-col space-y-4 px-2 mb-4">
                  {users.length === 0 && (
                    <Typography variant="h6" className="my-4 text-center">
                      No users have been added yet.
                      <br />
                      How are you seeing this lol?
                      <br />
                      Something must have gone horribly wrong.
                    </Typography>
                  )}
                  {users.map((user) => {
                    return (
                      <div
                        key={user.id}
                        className="flex flex-row justify-between items-center border rounded-md shadow-sm p-2"
                      >
                        <div className="w-full">
                          <Typography>{user.email}</Typography>
                        </div>
                        <div className="flex flex-row justify-center gap-4 w-full">
                          <Typography color="blue">Admin</Typography>
                          <Switch
                            id={user.id}
                            defaultChecked={user.admin}
                            onChange={(e) => {
                              console.log(e.target.checked)
                              fetch('/api/admin/users', {
                                method: 'PATCH',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  jwt: localStorage.getItem('token'),
                                  id: user.id,
                                  admin: e.target.checked,
                                }),
                              })
                                .then((res) => {
                                  if (res.status === 200) {
                                    res.text().then((data) => {
                                      updateUsers(setUsers)
                                    })
                                  } else {
                                    res.text().then((data) => {
                                      console.log(data)
                                    })
                                  }
                                })
                                .catch((err) => {
                                  err.text().then((data) => {
                                    console.log(data)
                                  })
                                })
                            }}
                          />
                        </div>
                        <div className="flex flex-row justify-end w-full">
                          <button
                            onClick={() => {
                              fetch('/api/admin/users', {
                                method: 'DELETE',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  jwt: localStorage.getItem('token'),
                                  id: user.id,
                                }),
                              })
                                .then((res) => {
                                  if (res.status === 200) {
                                    res.text().then((data) => {
                                      updateUsers(setUsers)
                                    })
                                  } else {
                                    res.text().then((data) => {
                                      console.log(data)
                                    })
                                  }
                                })
                                .catch((err) => {
                                  err.text().then((data) => {
                                    console.log(data)
                                  })
                                })
                            }}
                          >
                            ❌
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </PageContainer>
    </AdminGuard>
  )
}

export default AdminSettings
