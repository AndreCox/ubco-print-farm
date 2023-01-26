import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

import { Card, CardBody } from '@material-tailwind/react'
import image from './../assets/images/image.jpg'

export default function Home() {
  return (
    <div className="p-[0 2rem]">
      <Head>
        <title>Next Template</title>
        <meta name="description" content="Generated with next-template" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen p-4 items-center text-4xl">
        <h1>Dashboard</h1>
        <div className="flex flex-row">
          <div className="grid grid-flow-row-dense grid-rows-3 gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4  w-full">
            {Array(9)
              .fill(0)
              .map((_, i) => (
                <Card
                  onResize={undefined}
                  onResizeCapture={undefined}
                  className="w-fit"
                >
                  <CardBody onResize={undefined} onResizeCapture={undefined}>
                    <h2 className="text-2xl">Card Title</h2>
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
          <div className="bg-gray-500 w-52">
            <h1>Side Bar</h1>
          </div>
        </div>
      </main>
    </div>
  )
}
