import { Button, Card, Navbar, Typography } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { IoMdHome } from 'react-icons/io'
import { LuCameraOff } from 'react-icons/lu'
import PageContainer from '../components/PageContainer'
import { Footer } from '../components/Footer'

async function getPrinters(setPrinters) {
  const res = await fetch('http://localhost:8080/printers', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  setPrinters(data)
}

const Overview = () => {
  const [printers, setPrinters] = useState([])
  useEffect(() => {
    getPrinters(setPrinters)

    const interval = setInterval(() => {
      getPrinters(setPrinters)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <PageContainer>
      <Navbar className="z-50 flex flex-row px-4 min-w-full py-2">
        <div className="flex flex-row justify-center gap-4">
          <Button
            className="py-1 px-2"
            variant="outlined"
            onClick={() => {
              window.location.href = '/'
            }}
          >
            <IoMdHome className="text-xl" />
          </Button>
          <h1 className="text-black text-2xl">Overview</h1>
        </div>
        <div className="flex flex-row justify-end w-full">
          <Button
            onClick={() => {
              window.location.href = '/printfarm/userdash'
            }}
          >
            User Dashboard
          </Button>
        </div>
      </Navbar>
      <div className="pt-4 px-4">
        <div className="grid grid-cols-3 gap-4">
          {printers.map((printer) => (
            <Card key={printer.id} className="flex flex-col">
              <Typography
                color="blue"
                variant="h4"
                className="text-center pt-4"
              >
                {printer.name}
              </Typography>
              <hr className="my-2" />
              <div className="rounded-xl overflow-clip m-2">
                {printer.printerInfo.state.text !== 'Not Found' ? (
                  <img
                    className=""
                    src={`http://localhost:8080/video/${printer.id}`}
                  />
                ) : (
                  <div className="flex flex-row justify-center">
                    <div className="flex flex-col space-y-4">
                      <Typography variant="h5" color="blue-gray">
                        Camera Offline
                      </Typography>
                      <LuCameraOff className="text-9xl" />
                    </div>
                  </div>
                )}
              </div>
              {printer.printerInfo.state.text !== 'Not Found' && (
                <>
                  <hr className="my-2" />
                  <div className="flex flex-row justify-center">
                    <Typography variant="h5" color="blue-gray">
                      Temperature
                    </Typography>
                  </div>
                  <div className="flex flex-row justify-evenly text-center">
                    <div className="flex flex-col">
                      <Typography>Bed</Typography>
                      <Typography variant="" color="blue-gray">
                        {printer.printerInfo.temps.bed.actual}°C
                      </Typography>
                    </div>
                    <div className="flex flex-col text-center">
                      <Typography>Hotend</Typography>
                      <Typography color="blue-gray">
                        {printer.printerInfo.temps.tool0.actual}°C
                      </Typography>
                    </div>
                  </div>
                </>
              )}
              <hr className="my-2" />
              <div className="flex flex-row justify-center">
                <Typography variant="h5" color="blue-gray">
                  Status
                </Typography>
              </div>
              <div className="flex flex-row justify-evenly text-center mb-2">
                <div className="flex flex-col">
                  <Typography color="blue-gray">
                    {printer.printerInfo.state.text}
                  </Typography>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </PageContainer>
  )
}

export default Overview
