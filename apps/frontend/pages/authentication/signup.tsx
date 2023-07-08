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
import { database } from '../../surreal/surreal'
import { useEffect, useState } from 'react'
import { set } from 'mobx'
import { authenticator } from '../../helpers/authentication/authenticator'

interface SignupProps {}

const Signup = () => {
  const [email, setEmail] = useState('')
  const [key, setKey] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [signUpError, setSignUpError] = useState(false)
  const [signUpErrorText, setSignUpErrorText] = useState('')

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
      <Navbar color="white" className=" w-full m-0 max-w-full py-2 px-4">
        <div className="flex flex-row justify-between w-full opacity-100">
          <Button
            variant="outlined"
            onClick={() => (window.location.href = '/')}
          >
            Home
          </Button>
        </div>
      </Navbar>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col space-y-16">
          <h1 className="text-4xl mb-4 text-white drop-shadow-2xl font-bold text-center">
            UBCO Makerspace Print Farm
          </h1>
          <div className="flex flex-row justify-center">
            <Card className="lg:w-fit w-full">
              <CardBody className="flex flex-col space-y-4 text-center w-full">
                <h1 className="text-2xl mb-2">Sign Up</h1>
                <div className="flex md:flex-row flex-col md:space-x-4 space-y-4 md:space-y-0">
                  <Input
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    label="Key"
                    value={key}
                    onChange={(e) => {
                      if (
                        e.target.value.length <= 6 &&
                        !isNaN(Number(e.target.value))
                      ) {
                        setKey(e.target.value)
                      }
                    }}
                  />
                </div>
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  success={password === confirmPassword && password !== ''}
                />
                <Input
                  label="Confirm Password"
                  error={password !== confirmPassword}
                  success={password === confirmPassword && password !== ''}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  color="blue"
                  disabled={
                    email === '' ||
                    password === '' ||
                    confirmPassword === '' ||
                    key === '' ||
                    password !== confirmPassword ||
                    key.length !== 6
                  }
                  onClick={async () => {
                    setSignUpError(false)
                    // now we make a request to /api/signup to create the user
                    fetch('/api/signup', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        email: email,
                        key: key,
                        pass: password,
                      }),
                    })
                      .then((res) => {
                        if (res.status === 200) {
                          res.json().then((json) => {
                            console.log(json.token)
                            authenticator.saveAuth(json.token)
                            window.location.href = '/printfarm/userdash'
                          })
                        }
                        if (res.status === 400) {
                          res.text().then((text) => {
                            setSignUpErrorText(text)
                          })
                          setSignUpError(true)
                        }
                      })
                      .catch((err) => {
                        setSignUpErrorText(
                          'There was an error contacting the authentication server'
                        )
                        setSignUpError(true)
                      })
                  }}
                >
                  Sign Up
                </Button>
                {signUpError && (
                  <a className="text-red-500">{signUpErrorText}</a>
                )}
                <Link href="/authentication/login" className="">
                  <div className="flex flex-col">
                    <div>Already have an account?</div>
                    <div className="text-blue-500 cursor-pointer">Login</div>
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

export default Signup
