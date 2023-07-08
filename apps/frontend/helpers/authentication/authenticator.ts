import { env } from 'process'
import { database } from '../../surreal/surreal'

class Authenticator {
  userID: string | undefined
  admin: boolean | undefined

  constructor() {
    this.userID = undefined
    this.admin = undefined
  }

  checkAuth = async () => {
    // check if auth is valid
    // first we will check if we have our jwt in the local storage

    const jwt = localStorage.getItem('token')
    // console.log('jwt:', jwt)
    if (!jwt) {
      // console.log('No jwt found')
      return false
    }

    // now we will check if the jwt is valid
    try {
      const auth = await database.db.authenticate(jwt)
      //console.log('auth:', auth)
      if (auth === undefined) {
        //console.log('User is authenticated')
        // get user id from jwt
        this.userID = this.decodeJwt(jwt).ID
        console.log('jwt:', jwt)

        // check if user is admin
        const admin = await database.db.query('SELECT admin FROM $userID', {
          userID: this.userID,
        })
        this.admin = admin[0].result[0].admin

        return true
      }
    } catch (err) {
      // console.log('Error authenticating user:', err)
      return false
    }
    // console.log('User is not authenticated')
    return false
  }

  saveAuth = (token: string) => {
    localStorage.setItem('token', token)
  }

  decodeJwt = (token: string) => {
    var base64Url = token.split('.')[1]
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )

    return JSON.parse(jsonPayload)
  }
}

export const authenticator = new Authenticator()
