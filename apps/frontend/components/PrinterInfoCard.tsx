import { Card, Typography } from '@material-tailwind/react'
import { LuCameraOff } from 'react-icons/lu'

interface PrinterInfoCardProps {
  printer: {
    id: string
    name: string
    printerInfo: {
      state: {
        text: string
      }
      temps: {
        bed: {
          actual: number
        }
        tool0: {
          actual: number
        }
      }
    }
  }
}

const PrinterInfoCard = ({ printer }: PrinterInfoCardProps) => {
  return (
    <Card key={printer.id} className="flex flex-col">
      <Typography color="blue" variant="h4" className="text-center pt-4">
        {printer.name}
      </Typography>
      <hr className="my-2" />
      <div className="rounded-xl overflow-clip m-2">
        {printer.printerInfo.state.text !== 'Not Found' ? (
          // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
          <img className="" src={`http://localhost:8080/video/${printer.id}`} />
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
  )
}

export default PrinterInfoCard
