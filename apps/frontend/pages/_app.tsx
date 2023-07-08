import '../styles/globals.css'
import { ThemeProvider } from '@material-tailwind/react'
import { authenticator } from '../helpers/authentication/authenticator'
import { store } from '../stores/Store'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
