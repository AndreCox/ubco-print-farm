import { UploadPrint } from '../../components/printfarm/UploadPrint'
import PrintQueue from '../../components/printfarm/PrintQueue'
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
import StlRenderer from '../../components/printfarm/StlRenderer'
import { IoMdHome } from 'react-icons/io'
import { Footer } from '../../components/Footer'
import PageContainer from '../../components/PageContainer'
import AdminDashButton from '../../components/printfarm/AdminDashButton'

// get static props
export const getStaticProps = () => {
  return {
    props: {
      loadingMessage: messages[Math.floor(Math.random() * messages.length)],
    },
  }
}

const UserDash = ({ loadingMessage }) => {
  return (
    <RouteGuard loadingMessage={loadingMessage}>
      <PageContainer>
        <div className="">
          <Navbar className="p-2 lg:px-4 max-w-full">
            <div className="flex place-items-start justify-evenly text-blue-gray-900 m-0">
              <div className="w-full">
                <div className="flex flex-row justify-start gap-4">
                  <Button
                    className="py-1 px-2"
                    variant="outlined"
                    onClick={() => {
                      window.location.href = '/'
                    }}
                  >
                    <IoMdHome className="text-xl" />
                  </Button>
                  <Typography variant="h4" color="blue-gray">
                    User Dashboard
                  </Typography>
                </div>
              </div>
              <div className="flex flex-row justify-end w-full space-x-4">
                <AdminDashButton />
                <Button
                  onClick={() => {
                    window.location.href = '/overview'
                  }}
                >
                  Overview
                </Button>
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
              <UploadPrint />
            </div>
            <div className="">
              <PrintQueue />
            </div>
          </div>
        </div>
        <Footer />
      </PageContainer>
    </RouteGuard>
  )
}

export default UserDash
