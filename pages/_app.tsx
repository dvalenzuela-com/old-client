import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { CssBaseline } from '@mui/material'
import { CartProvider } from '@Context/CartContext'
import firestore from '../lib/firestore'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { UserContext, UserProvider } from '@Context/UserContext'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import { SnackbarProvider } from 'notistack'
import './../i18n';


// Call firestore to init it;
firestore;

//const stripePromise = loadStripe('pk_test_51Jsny8HtcjByDkQ7PNk4TmPT4jfWZExCs4pAOuUrdqkaMIr3DP0NAOMtk8ku4K08ODJyXN7qP4fMl2nojYr8MrCb00EC83upJt')

function MyApp({ Component, pageProps }: AppProps) {

	// Initialize user
	const user = useContext(UserContext).getUser();

	const router = useRouter();
	const businessId = router.query['business-id'] as string;

	// import i18n (needs to be bundled ;))
  return (
    <>
		<CssBaseline />
		<UserProvider>
			<CartProvider businessId={businessId}>
				<Elements stripe={null}>
						<SnackbarProvider>
							<Component {...pageProps} />
						</SnackbarProvider> 
				</Elements>
			</CartProvider>
		</UserProvider>
    </>
  )
}

export default MyApp
