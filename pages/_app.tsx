import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { CssBaseline } from '@mui/material'
import { CartProvider } from '@Context/CartContext'
import firestore from '../lib/firestore'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { UserProvider, useUser } from '@Context/UserContext'
import { useRouter } from 'next/router'
import { SnackbarProvider } from 'notistack'
import './../i18n';


// Call firestore to init it;
firestore;

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY ?? "")

function MyApp({ Component, pageProps }: AppProps) {

	// Initialize user
	const user = useUser().getUser();

	const router = useRouter();
	const businessId = router.query['business-id'] as string;

	// import i18n (needs to be bundled ;))
  return (
    <>
		<CssBaseline />
		<UserProvider>
			<CartProvider businessId={businessId}>
				<Elements stripe={stripePromise}>
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
