import { Button, Input, Spinner } from '@material-tailwind/react'
import React from 'react'

const connectionSwitch = (connectionStatus) => {
  switch (connectionStatus) {
    case 0:
      return 'Check Connection'
    case 1:
      return (
        <Spinner className="h-6 w-6 p-0 m-0" color="blue">
          Connecting...
        </Spinner>
      )
    case 2:
      return 'Connected'
    case 3:
      return 'Error Connecting'
    case 4:
      return 'Backend Error'
  }
}

export function PrinterSettings({ updatePrinters, setPrinters, printer }) {
  // 0 not connected
  // 1 connecting
  // 2 connected
  // 3 error
  const [connectionStatus, setConnectionStatus] = React.useState(0)

  return (
    <div className="flex flex-col space-y-4 border shadow-sm rounded-md p-2">
      <div className="flex flex-row justify-between">
        <div className="max-w-fit">
          <Input
            label="Printer Name"
            defaultValue={printer.name}
            onChange={(e) => {
              fetch('/api/admin/printers', {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  jwt: localStorage.getItem('token'),
                  id: printer.id,
                  name: e.target.value,
                }),
              }).then((res) => {
                res.text().then((data) => {
                  updatePrinters(setPrinters)
                })
              })
            }}
          />
        </div>
        <button
          className="p-2 drop-shadow-sm hover:drop-shadow-md transition-all"
          onClick={() => {
            fetch('/api/admin/printers', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                jwt: localStorage.getItem('token'),
                id: printer.id,
              }),
            }).then((res) => {
              res.text().then((data) => {
                updatePrinters(setPrinters)
              })
            })
          }}
        >
          ❌
        </button>
      </div>
      <div className="flex flex-row justify-between">
        <div className="max-w-fit">
          <Input
            label="IP Address"
            defaultValue={printer.ip}
            onChange={(e) => {
              setConnectionStatus(0)
              fetch('/api/admin/printers', {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  jwt: localStorage.getItem('token'),
                  id: printer.id,
                  ip: e.target.value,
                }),
              }).then((res) => {})
            }}
          />
        </div>
        <div>
          <Button
            variant="outlined"
            className={`transition-all duration-300 ${
              connectionStatus === 1 ? 'p-2' : ''
            } `}
            color={
              connectionStatus === 2
                ? 'green'
                : connectionStatus === 3
                ? 'red'
                : 'blue'
            }
            onClick={() => {
              setConnectionStatus(1)
              fetch('http://localhost:8080/admin/testConnection', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  jwt: localStorage.getItem('token'),
                  id: printer.id,
                }),
              })
                .then((res) => {
                  if (res.status == 200) {
                    setConnectionStatus(2)
                  } else {
                    setConnectionStatus(3)
                  }
                })
                .catch((err) => {
                  setConnectionStatus(4)
                })
            }}
          >
            {connectionSwitch(connectionStatus)}
          </Button>
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <Input
          label="API Key"
          defaultValue={printer.apiKey}
          onChange={(e) => {
            setConnectionStatus(0)
            fetch('/api/admin/printers', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                jwt: localStorage.getItem('token'),
                id: printer.id,
                key: e.target.value,
              }),
            }).then((res) => {
              res.text().then((data) => {
                updatePrinters(setPrinters)
              })
            })
          }}
        />
      </div>
    </div>
  )
}
