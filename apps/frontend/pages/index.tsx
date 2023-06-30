import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { motion, AnimatePresence } from 'framer-motion'

import { Card, CardBody, Navbar } from '@material-tailwind/react'
import image from './../assets/images/image.jpg'
import { useState } from 'react'

export default function Home() {
  const [open, setOpen] = useState(false)

  return (
    <div className="overflow-x-clip">
      <Head>
        <title>UBCO Makerspace Print Farm</title>
        <meta name="description" content="Generated with next-template" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar
        className="fixed z-50 flex flex-row px-4 min-w-full py-2"
        onResize={undefined}
        onResizeCapture={undefined}
      >
        <h1 className="text-black text-2xl">Dashboard</h1>
        <div
          className={`relative place-self-center w-8 h-6 group ml-auto ${
            open ? 'is-open' : ''
          }`}
          onClick={() => setOpen(!open)}
        >
          <div className="transition-all absolute w-8 h-1 bg-black rounded-full group-[.is-open]:rotate-45 top-0 group-[.is-open]:top-1/2 group-[.is-open]:-translate-y-1/2 "></div>
          <div className="absolute w-8 left-1/2 -translate-x-1/2 h-1 bg-black rounded-full top-1/2 -translate-y-1/2 group-[.is-open]:opacity-0  group-[.is-open]:w-1 transition-all duration-200"></div>
          <div className="transition-all absolute w-8 h-1 bg-black rounded-full bottom-0  group-[.is-open]:-rotate-45 group-[.is-open]:bottom-1/2 group-[.is-open]:translate-y-1/2"></div>
        </div>
      </Navbar>
      <div className="h-14 w-screen"></div>
      <main className="min-h-screen p-4 items-center text-4xl">
        <div className="flex flex-row space-x-4 ">
          <div className="grid grid-flow-row-dense grid-rows-3 gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4  w-full">
            {Array(9)
              .fill(0)
              .map((_, i) => (
                <Card
                  key={i}
                  onResize={undefined}
                  onResizeCapture={undefined}
                  className="w-fit"
                >
                  <CardBody onResize={undefined} onResizeCapture={undefined}>
                    <h2 className="text-2xl">Printer {i + 1}</h2>
                    <Image
                      src={image}
                      alt=""
                      width={400}
                      height={400}
                      className="rounded-lg"
                    />
                  </CardBody>
                </Card>
              ))}
          </div>
          <AnimatePresence>
            {open && (
              <motion.div
                className="sm:block hidden shadow bg-white rounded-xl w-52 fixed right-0 top-0 h-screen pt-14"
                transition={{ ease: 'easeInOut' }}
                initial={{ x: 175, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 175, opacity: 0 }}
              >
                <h1>Side Bar</h1>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {open && (
              <motion.div
                className="sm:hidden block shadow px-4 bg-white rounded-xl w-full fixed left-0 top-0 h-3/4 pt-14"
                transition={{ ease: 'easeInOut' }}
                initial={{ y: '-100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                style={{ marginLeft: 0 }}
              >
                <div className="relative h-3/4">
                  <h1>Print Queue</h1>
                  <hr className="mt-2" />
                  <div className="overflow-y-scroll relative h-[90%]">
                    <ul className="pt-4 space-y-2">
                      {Array(13)
                        .fill(0)
                        .map((_, i) => (
                          <li
                            className="text-lg border rounded-lg bg-white shadow p-2"
                            key={i}
                          >
                            Object {i + 1}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
