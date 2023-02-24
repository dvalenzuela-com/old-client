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
import { hotjar } from 'react-hotjar'
import { useEffect } from 'react'


// Call firestore to init it;
firestore;

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "")

function MyApp({ Component, pageProps }: AppProps) {

	// Initialize user
	const user = useUser();

	const router = useRouter();
	const businessId = router.query['business-id'] as string;

	// Initialize Hotjar
	useEffect(() => {
		hotjar.initialize(Number(process.env.NEXT_PUBLIC_HJID), Number(process.env.NEXT_PUBLIC_HJSV))
	}, []);

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
