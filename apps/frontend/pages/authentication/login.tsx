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

interface LoginProps {}

const Login = () => {
  return (
    <div className="w-screen h-screen ">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Card className="" onResize={undefined} onResizeCapture={undefined}>
          <CardBody
            className="flex flex-col space-y-4 text-center w-full"
            onResize={undefined}
            onResizeCapture={undefined}
          >
            <h1 className="text-2xl mb-2">Login</h1>
            <Input
              label="Username or Email"
              onResize={undefined}
              onResizeCapture={undefined}
            />
            <Input
              label="Password"
              onResize={undefined}
              onResizeCapture={undefined}
            />
            <Button
              color="blue"
              onResize={undefined}
              onResizeCapture={undefined}
            >
              Login
            </Button>
            <Link href="/authentication/signup" className="">
              <div className="flex flex-col">
                <div>Don&apos;t have an account?</div>
                <div className="text-blue-500 cursor-pointer">Sign up</div>
              </div>
            </Link>
          </CardBody>
        </Card>
      </div>
      <div className="absolute top-0 left-0 -z-50 overflow-clip">
        <Image
          alt=""
          src={background}
          className="object-cover w-screen h-screen blur-sm scale-110"
        />
      </div>
    </div>
  )
}

export default Login
