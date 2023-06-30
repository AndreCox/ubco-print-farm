import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
} from '@material-tailwind/react'
import Image from 'next/image'
import Link from 'next/link'

import background from './../../assets/images/farm.jpg'

interface SignupProps {}

const Signup = () => {
  return (
    <div className="w-screen h-screen ">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Card className="" onResize={undefined} onResizeCapture={undefined}>
          <CardBody
            className="flex flex-col space-y-4 text-center w-full"
            onResize={undefined}
            onResizeCapture={undefined}
          >
            <h1 className="text-2xl mb-2">Sign Up</h1>
            <div className="flex md:flex-row flex-col md:space-x-4 space-y-4 md:space-y-0">
              <Input
                label="Username"
                onResize={undefined}
                onResizeCapture={undefined}
              />
              <Input
                label="Email"
                onResize={undefined}
                onResizeCapture={undefined}
              />
            </div>
            <Input
              label="Password"
              onResize={undefined}
              onResizeCapture={undefined}
            />
            <Input
              label="Confirm Password"
              onResize={undefined}
              onResizeCapture={undefined}
            />
            <Input
              label="Key"
              onResize={undefined}
              onResizeCapture={undefined}
            />
            <a>You can get a key from the Ubco Makerspace</a>
            <Button
              color="blue"
              onResize={undefined}
              onResizeCapture={undefined}
            >
              Sign Up
            </Button>
            <Link href="/authentication/login" className="">
              <div className="flex flex-col">
                <div>Already have an account?</div>
                <div className="text-blue-500 cursor-pointer">Login</div>
              </div>
            </Link>
          </CardBody>
        </Card>
      </div>
      <div className="absolute top-0 left-0 -z-50 overflow-clip">
        <Image
          src={background}
          className="object-cover w-screen h-screen blur-sm scale-110"
          alt={''}
        />
      </div>
    </div>
  )
}

export default Signup
