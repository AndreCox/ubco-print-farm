import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Navbar,
} from '@material-tailwind/react'
import Image from 'next/image'
import Link from 'next/link'

import background from './../../assets/images/farm.jpg'

import { useEffect, useState } from 'react'
import { authenticator } from '../../helpers/authentication/authenticator'
import { database } from '../../surreal/surreal'

interface LoginProps {}

const Login = () => {
  const [loginError, setLoginError] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    console.log('checking auth')
    authenticator.checkAuth().then((res) => {
      if (res) {
        window.location.href = '/printfarm/userdash'
      }
    })
  }, [])

  return (
    <div className="w-screen h-screen ">
      <Navbar color="white" className=" w-full m-0 max-w-full py-2 px-4 ">
        <div className="flex flex-row justify-between w-full opacity-100">
          <Button
            variant="outlined"
            onClick={() => (window.location.href = '/')}
          >
            Home
          </Button>
        </div>
      </Navbar>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ">
        <div className="flex flex-col space-y-16">
          <h1 className="text-4xl mb-4 text-white drop-shadow-2xl font-bold text-center">
            UBCO Makerspace Print Farm
          </h1>
          <div className="flex flex-row justify-center">
            <Card className="lg:w-fit w-full " shadow={true}>
              <CardBody className="flex flex-col space-y-4 text-center w-full">
                <h1 className="text-2xl mb-2">Login</h1>
                <Input
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                />
                <Button
                  color="blue"
                  onClick={async () => {
                    setLoginError(false)
                    database.db
                      .signin({
                        NS: 'PrintFarm',
                        DB: 'users',
                        SC: 'allusers',

                        email: email,
                        pass: password,
                      })
                      .then((res) => {
                        authenticator.saveAuth(res)
                        window.location.href = '/printfarm/userdash'
                      })
                      .catch((err) => {
                        setLoginError(true)
                      })
                  }}
                >
                  Login
                </Button>
                {/* Error message box */}
                {loginError && (
                  <div className="text-red-500">
                    There was a problem authenticating
                  </div>
                )}
                <Link href="/authentication/signup" className="">
                  <div className="flex flex-col">
                    <div>Don&apos;t have an account?</div>
                    <div className="text-blue-500 cursor-pointer">Sign up</div>
                  </div>
                </Link>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 -z-50 overflow-clip">
        <Image
          alt=""
          src={background}
          className="object-cover w-screen h-screen blur-sm scale-110 brightness-50"
        />
      </div>
    </div>
  )
}

export default Login
