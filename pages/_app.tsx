import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { CssBaseline } from '@mui/material'
import { CartProvider } from '../context/CartContext'
import firestore from '../lib/firestore'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Layout from '../layout/Layout'
import { UserContext, UserProvider } from '../context/UserContext'
import { useContext } from 'react'


// Call firestore to init it;
firestore;

const stripePromise = loadStripe('pk_test_51Jsny8HtcjByDkQ7PNk4TmPT4jfWZExCs4pAOuUrdqkaMIr3DP0NAOMtk8ku4K08ODJyXN7qP4fMl2nojYr8MrCb00EC83upJt')

function MyApp({ Component, pageProps }: AppProps) {

	// Initialize user
	const user = useContext(UserContext).getUser();

  return (
    <>
		<CssBaseline />
		<UserProvider>
			<CartProvider>
				<Elements stripe={stripePromise}>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</Elements>
			</CartProvider>
		</UserProvider>
    </>
  )
}

export default MyApp
