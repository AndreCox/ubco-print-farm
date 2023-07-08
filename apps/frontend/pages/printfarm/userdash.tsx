import { PrintQueue } from '../../components/printfarm/PrintQueue'
import {
  Button,
  Card,
  Input,
  Select,
  Slider,
  Typography,
  Option,
  Spinner,
} from '@material-tailwind/react'
import RouteGuard from '../../components/guards/RouteGuard'
import messages from '../../helpers/loadingMessages'
import { database } from '../../surreal/surreal'
import { Navbar } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { authenticator } from '../../helpers/authentication/authenticator'
import StlRenderer from '../../components/StlRenderer'
import { set, useForm } from 'react-hook-form'
import { clear } from 'console'

// get static props
export const getStaticProps = () => {
  return {
    props: {
      loadingMessage: messages[Math.floor(Math.random() * messages.length)],
    },
  }
}

const UserDash = ({ loadingMessage }) => {
  const [userData, setUserData] = useState({} as any)
  const [stlFile, setStlFile] = useState('' as any)
  const [uploadedFile, setUploadedFile] = useState({} as any)
  const [fileData, setFileData] = useState({} as any)
  const [infill, setInfill] = useState(15)
  const [material, setMaterial] = useState('PLA')

  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  useEffect(() => {
    database.db
      .use({
        ns: 'PrintFarm',
        db: 'users',
      })
      .then((res) => {
        database.db.select('user').then((res) => {
          setUserData(res)
        })
      })
  }, [])

  return (
    <RouteGuard loadingMessage={loadingMessage}>
      <div className="w-screen">
        <Navbar className="w-screen p-2 lg:px-4 max-w-full">
          <div className="flex place-items-start justify-evenly text-blue-gray-900 m-0">
            <div className="w-full">
              <Typography variant="h4" color="blue-gray">
                User Dashboard
              </Typography>
            </div>
            <div className="flex flex-row justify-end w-full space-x-4">
              {authenticator.admin && (
                <Button
                  className="px-2 py-2 m-0"
                  color="blue"
                  onClick={() => {
                    window.location.href = '/printfarm/admindash'
                  }}
                >
                  Admin Dashboard
                </Button>
              )}
              <Button
                className="px-2 py-2 m-0
                        "
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
      </div>
      <div>
        <div className="grid lg:grid-cols-2 grid-cols-1 p-2 gap-2 bg-blue-gray-50">
          <div className="">
            <Card>
              <Typography
                variant="h4"
                color="blue"
                className="text-center mt-4"
              >
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
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="text-center"
                >
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
                  <Typography
                    color="blue-gray"
                    className="text-center mt-4 mb-2"
                  >
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
                        setUploadSuccess(false)
                        // we need to create the form data that will be sent to the server
                        // this is a multipart form data that will contain the stl file jwt and file name
                        const formData = new FormData()
                        formData.append('stl', uploadedFile)
                        formData.append('jwt', localStorage.getItem('token'))
                        formData.append('fileName', uploadedFile.name)

                        // we need to send the request to the server
                        fetch('http://localhost:8080/upload', {
                          method: 'POST',
                          body: formData,
                        })
                          .then((res) => {
                            setUploading(false)
                            // check if the response was ok
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
          </div>
          <div className="">
            <PrintQueue />
          </div>
        </div>
      </div>
    </RouteGuard>
  )
}

export default UserDash
