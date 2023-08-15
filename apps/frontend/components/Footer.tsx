import { Navbar, Typography } from '@material-tailwind/react'
import React from 'react'
export function Footer({}) {
  return (
    <footer className="flex flex-row justify-center items-center w-full h-24 mt-auto pt-12">
      <Navbar className="w-full">
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-col justify-center h-full">
            <div className="flex flex-row justify-center">
              <div className="flex flex-row justify-center w-auto">
                <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-center max-w-fit justify-items-center">
                  <Typography variant="h6" color="blue-gray">
                    UBCO Makerspace Print Farm
                  </Typography>
                  <div className="max-w-fit">
                    <Typography variant="h6" color="blue-gray">
                      © {new Date().getFullYear()}
                    </Typography>
                  </div>
                  <div className="flex flex-row gap-1 lg:col-span-1 sm:col-span-2 col-span-1 justify-center">
                    <Typography variant="h6" color="blue-gray">
                      Designed and built by{' '}
                    </Typography>
                    <a
                      href="https://github.com/AndreCox"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Typography
                        variant="h6"
                        color="blue"
                        className="underline hover:drop-shadow-md transition-all duration-300"
                      >
                        Andre Cox
                      </Typography>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Navbar>
    </footer>
  )
}
