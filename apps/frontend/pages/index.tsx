import { Footer } from '../components/Footer'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { motion, AnimatePresence } from 'framer-motion'

import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineIcon,
  TimelineHeader,
} from '@material-tailwind/react'

import {
  Button,
  Card,
  CardBody,
  Navbar,
  Slider,
  Typography,
} from '@material-tailwind/react'
import farm from '../assets/images/farm.jpg'
import { useState } from 'react'
import messages from '../helpers/loadingMessages'

import { IoMdKey, IoMdCloudUpload, IoMdCheckboxOutline } from 'react-icons/io'
import { MdQueue, MdHandshake } from 'react-icons/md'
import PageContainer from '../components/PageContainer'

// get static props
export const getStaticProps = () => {
  return {
    props: {
      loadingMessage: messages[Math.floor(Math.random() * messages.length)],
    },
  }
}

export default function Home({ loadingMessage }) {
  const [open, setOpen] = useState(false)

  return (
    <PageContainer>
      <Head>
        <title>UBCO Makerspace Print Farm</title>
        <meta name="description" content="Generated with next-template" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar className="fixed top-0 left-0 z-50 flex flex-row px-4 min-w-full py-2">
        <h1 className="text-black text-2xl">Home</h1>
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
      <main className="items-center text-4xl">
        <div
          className="h-full"
          style={{
            backgroundImage: `url(${farm.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="flex flex-row justify-center text-center pt-72 pb-48 mb-12 backdrop-blur-lg backdrop-brightness-50">
            <div className="flex flex-col py-4">
              <Typography variant="h1" color="blue" className="mb-4">
                UBCO Makerspace Print Farm
              </Typography>
              <Typography variant="h3" className="text-gray-50">
                View, request, and manage prints from the UBCO Makerspace Print
                Farm
              </Typography>
              <Typography variant="h5" className="text-gray-50">
                To get started, visit the UBCO makerspace to get an account
              </Typography>

              <div className="flex flex-row justify-center gap-4 mt-4">
                <Button
                  variant="outlined"
                  onClick={() => {
                    window.location.href = '/overview'
                  }}
                >
                  Overview
                </Button>
                <Button
                  onClick={() => {
                    window.location.href = '/printfarm/userdash'
                  }}
                >
                  User Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-center text-center mb-8">
          <div className="flex flex-col justify-center">
            <Typography variant="h3" color="blue-gray">
              Find out how it works
            </Typography>
            <Typography variant="h5" color="blue-gray">
              The service is simple to use, and only requires a few steps to get
              started.
            </Typography>
          </div>
        </div>

        <div className="flex flex-row justify-center">
          <div className="w-[25rem]">
            <Timeline>
              <TimelineItem className="h-28">
                <TimelineConnector className="!w-[78px]" />
                <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
                  <TimelineIcon className="p-3" variant="ghost">
                    <IoMdKey className="text-2xl" />
                  </TimelineIcon>
                  <div className="flex flex-col gap-1">
                    <Typography variant="h6" color="blue-gray">
                      Visit the UBCO Makerspace to get a sign up key to create
                      your account
                    </Typography>
                  </div>
                </TimelineHeader>
              </TimelineItem>
              <TimelineItem className="h-28">
                <TimelineConnector className="!w-[78px]" />
                <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
                  <TimelineIcon className="p-3" variant="ghost" color="orange">
                    <IoMdCloudUpload className="text-2xl" />
                  </TimelineIcon>
                  <div className="flex flex-col gap-1">
                    <Typography variant="h6" color="blue-gray">
                      Upload your STL file to the print farm and select your
                      print settings
                    </Typography>
                  </div>
                </TimelineHeader>
              </TimelineItem>
              <TimelineItem className="h-28">
                <TimelineConnector className="!w-[78px]" />
                <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
                  <TimelineIcon className="p-3" variant="ghost" color="red">
                    <IoMdCheckboxOutline className="text-2xl" />
                  </TimelineIcon>
                  <div className="flex flex-col gap-1">
                    <Typography variant="h6" color="blue-gray">
                      A print farm operator will review your print and approve
                      it for printing.
                    </Typography>
                  </div>
                </TimelineHeader>
              </TimelineItem>
              <TimelineItem className="h-28">
                <TimelineConnector className="!w-[78px]" />
                <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
                  <TimelineIcon className="p-3" variant="ghost" color="orange">
                    <MdQueue className="text-2xl" />
                  </TimelineIcon>
                  <div className="flex flex-col gap-1">
                    <Typography variant="h6" color="blue-gray">
                      Your print is added to the print queue it will be printed
                      as soon as possible.
                    </Typography>
                  </div>
                </TimelineHeader>
              </TimelineItem>
              <TimelineItem className="h-28">
                <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
                  <TimelineIcon className="p-3" variant="ghost" color="blue">
                    <MdHandshake className="text-2xl" />
                  </TimelineIcon>
                  <div className="flex flex-col gap-1">
                    <Typography variant="h6" color="blue-gray">
                      Once your print is complete, you can pick it up from the
                      UBCO Makerspace
                    </Typography>
                  </div>
                </TimelineHeader>
              </TimelineItem>
            </Timeline>
          </div>
        </div>
        <div className="mt-12">
          <Typography variant="h3" color="blue-gray" className="text-center">
            About
          </Typography>

          <div className="flex flex-row justify-center">
            <div className="w-[50rem]">
              <Typography variant="paragraph" className="text-left">
                This service is still in development, there may be bugs. If you
                find any bugs, your feedback is appreciated. You can report bugs
                at the Github repository for this project. This project is open
                source, and you can find the source code at the Github
                repository for this project. This project is also fully
                documented, and you can find the wiki for this project in the
                Github repository as well the documentation is also hosted on a
                searchable website at the link below.
              </Typography>
            </div>
          </div>

          <div className="flex flex-row justify-center mt-8">
            <div className="flex flex-row justify-between gap-4">
              <Button
                variant="filled"
                onClick={() => {
                  // open the github repo issues page
                  window.open(
                    'https://github.com/AndreCox/ubco-print-farm/issues'
                  )
                }}
              >
                Bug Report
              </Button>
              <Button
                variant="filled"
                onClick={() => {
                  // open the documentation page
                  window.open('https://andrecox.github.io/ubco-print-farm/#/')
                }}
              >
                Documentation
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  // open the github repo
                  window.open('https://github.com/AndreCox/ubco-print-farm')
                }}
              >
                Github Repository
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </PageContainer>
  )
}
