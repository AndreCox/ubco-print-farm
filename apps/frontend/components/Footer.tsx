import { Typography } from '@material-tailwind/react'
import React from 'react'
export function Footer({}) {
  return (
    <footer className="flex flex-row justify-center items-center w-full h-24 border-t mt-auto">
      <div className="flex flex-row justify-center w-fit gap-6">
        <Typography variant="h6" color="blue-gray">
          UBCO Makerspace Print Farm
        </Typography>
        <Typography variant="h6" color="blue-gray">
          © {new Date().getFullYear()}
        </Typography>
        <div className="flex flex-row gap-1">
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
    </footer>
  )
}
