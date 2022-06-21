import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { CssBaseline } from '@mui/material'
import { CartContext, CartProvider } from '../context/CartContext'



function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
		<CssBaseline />
		<CartProvider>
			<Component {...pageProps} />
      	</CartProvider>
    </>
  )
}

export default MyApp
