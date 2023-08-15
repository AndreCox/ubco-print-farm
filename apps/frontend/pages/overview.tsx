import { Button, Card, Navbar, Typography } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { IoMdHome } from 'react-icons/io'
import PageContainer from '../components/PageContainer'
import { Footer } from '../components/Footer'
import PrinterInfoCard from '../components/PrinterInfoCard'

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
            <PrinterInfoCard printer={printer} />
          ))}
        </div>
      </div>
      <Footer />
    </PageContainer>
  )
}

export default Overview
