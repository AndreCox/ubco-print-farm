import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { motion, AnimatePresence } from 'framer-motion'

import {
  Button,
  Card,
  CardBody,
  Navbar,
  Slider,
} from '@material-tailwind/react'
import image from './../assets/images/image.jpg'
import { useState } from 'react'
import messages from '../helpers/loadingMessages'

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
    <div className="overflow-x-clip">
      <Head>
        <title>UBCO Makerspace Print Farm</title>
        <meta name="description" content="Generated with next-template" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar className="fixed z-50 flex flex-row px-4 min-w-full py-2">
        <h1 className="text-black text-2xl">Dashboard</h1>
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
      <div className="h-14 w-screen"></div>
      <main className="min-h-screen p-4 items-center text-4xl">
        <div className="flex flex-row space-x-4 ">
          <div className="grid grid-flow-row-dense grid-rows-3 gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4  w-full">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="w-fit">
                  <CardBody>
                    <h2 className="text-2xl">Printer {i + 1}</h2>
                    <img
                      src={`http://localhost:8080/video`}
                      width={400}
                      height={400}
                      className="rounded-lg"
                    />
                  </CardBody>
                </Card>
              ))}
          </div>
        </div>
      </main>
    </div>
  )
}
