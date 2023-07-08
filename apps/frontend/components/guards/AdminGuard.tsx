import { ReactNode, useEffect, useState } from 'react'
import { authenticator } from '../../helpers/authentication/authenticator'
import { redirect } from 'next/dist/server/api-utils'
import Loading from '../Loader'
import loadingMessages from '../../helpers/loadingMessages'

type RouteGuardProps = {
  children: ReactNode
  loadingMessage: string
}

const AdminGuard = ({ children, loadingMessage }: RouteGuardProps) => {
  const [auth, setAuth] = useState(false)

  useEffect(() => {
    authenticator.checkAuth().then((res) => {
      if (res) {
        // next we need to check if the user is an admin
        if (authenticator.admin) {
          setAuth(true)
          //console.log('authed')
          return
        } else {
          window.location.href = '/printfarm/userdash'
          return
        }
      } else {
        //console.log('redirecting to login')
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

export default AdminGuard
