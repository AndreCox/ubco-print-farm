import {
  Button,
  Card,
  Input,
  Select,
  Typography,
  Option,
  Slider,
  Spinner,
} from '@material-tailwind/react'
import { useState } from 'react'
import StlRenderer from './StlRenderer'

export function UploadPrint() {
  // params for the print
  const [stlFile, setStlFile] = useState('' as any)
  const [infill, setInfill] = useState(15 as number)
  const [material, setMaterial] = useState('PLA')

  // params for the upload
  const [uploadedFile, setUploadedFile] = useState({} as any)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  return (
    <Card>
      <Typography variant="h4" color="blue" className="text-center mt-4">
        Upload Print
      </Typography>
      <hr className="mb-4" />
      <div className="flex flex-col px-2 mb-4">
        <input
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
          accept=".stl"
          onChange={(e) => {
            // create a url for the file
            const url = URL.createObjectURL(e.target.files[0])
            setStlFile(url)
            setUploadedFile(e.target.files[0])
          }}
        />
      </div>
      <div className="rounded-lg overflow-clip">
        <StlRenderer stlFile={stlFile} />
      </div>
      <div className="flex flex-col mt-4">
        <Typography variant="h6" color="blue-gray" className="text-center">
          Print Settings
        </Typography>
        <hr className="mb-4" />
        <Typography color="blue-gray" className="text-center mb-2">
          Infill % Default (15%)
        </Typography>
        <div className="flex flex-row w-full px-2 space-x-4">
          <div className="flex flex-col justify-center w-full">
            <div>
              <Slider
                className="w-full min-w-max"
                min={0}
                max={100}
                step={1}
                value={infill}
                onChange={(e) => {
                  setInfill(Number(e.target.value))
                }}
              />
            </div>
          </div>
          <div className="w-auto">
            <Input
              type="number"
              max={100}
              min={0}
              placeholder="15"
              shrink={true}
              label="Infill %"
              value={infill}
              onChange={(e) => {
                setInfill(Number(e.target.value))
              }}
            />
          </div>
        </div>
        <div className="mx-2">
          <Typography color="blue-gray" className="text-center mt-4 mb-2">
            Material Default (PLA)
          </Typography>
          <Select
            color="blue"
            label="Material"
            value={material}
            onChange={(e) => {
              setMaterial(e)
            }}
          >
            <Option color="blue" value="PLA">
              PLA
            </Option>
            <Option color="blue" value="PETG">
              PETG
            </Option>
            <Option color="blue" value="TPU">
              TPU
            </Option>
          </Select>
          <hr className="mt-4" />
          <div className="flex flex-row justify-center mt-8 mb-4">
            <Button
              disabled={uploading}
              className=""
              onClick={async () => {
                setUploading(true)
                setUploadError(false)
                setUploadSuccess(false) // we need to create the form data that will be sent to the server
                // this is a multipart form data that will contain the stl file jwt and file name

                const formData = new FormData()
                formData.append('stl', uploadedFile)
                formData.append('jwt', localStorage.getItem('token'))
                formData.append('fileName', uploadedFile.name)
                formData.append('infill', infill.toString())
                formData.append('material', material) // we need to send the request to the server

                fetch('http://localhost:8080/upload', {
                  method: 'POST',
                  body: formData,
                })
                  .then((res) => {
                    res.text().then((text) => {
                      console.log(text)
                    })
                    setUploading(false) // check if the response was ok

                    if (res.ok) {
                      setUploadSuccess(true)
                    } else {
                      setUploadError(true)
                    }
                  })
                  .catch((err) => {
                    setUploading(false)
                    setUploadError(true)
                  })
              }}
            >
              {uploading && <Spinner color="blue" />}
              {!uploading && <>Upload Print</>}
            </Button>
          </div>
          <div className="text-red-500 text-center mb-4">
            {uploadError && (
              <>There was a problem with your upload please try again</>
            )}
          </div>
          <div className="text-green-500 text-center mb-4">
            {uploadSuccess && <>Your file was uploaded successfully!</>}
          </div>
        </div>
      </div>
    </Card>
  )
}
