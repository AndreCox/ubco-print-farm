import { ReactNode, useEffect, useState } from 'react'
import { authenticator } from '../../helpers/authentication/authenticator'
import { redirect } from 'next/dist/server/api-utils'
import Loading from '../Loader'
import loadingMessages from '../../helpers/loadingMessages'

type RouteGuardProps = {
  children: ReactNode
  loadingMessage: string
}

const RouteGuard = ({ children, loadingMessage }: RouteGuardProps) => {
  const [auth, setAuth] = useState(false)

  useEffect(() => {
    authenticator.checkAuth().then((res) => {
      if (res) {
        console.log('authenticator admin status:', authenticator.admin)

        setAuth(true)
        //console.log('authed')
        return
      } else {
        //console.log('redirecting to login')
        console.log('authenticator admin status:', authenticator.admin)
        window.location.href = '/authentication/login'
        return
      }
    })
  }, [])

  if (!auth) {
    return <Loading loadingMessage={loadingMessage} />
  }

  return <>{children}</>
}

export default RouteGuard
