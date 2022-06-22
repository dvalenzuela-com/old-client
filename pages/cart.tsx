import type { NextPage } from 'next'

import Navbar from '../components/Navbar'

import { useCollectionData } from "react-firebase-hooks/firestore";

import { AlabarraProduct } from 'alabarra-types';
import { Autocomplete, Button, Container, FormLabel, Grid, List, ListItem, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import CartContent from '../components/CartContent';
import { useContext, useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { allProductsQuery, getAllTableIds } from '../lib/firestore';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeButton from '../components/StripeButton';
import { CartContext } from '../context/CartContext';

const stripePromise = loadStripe('pk_test_51Jsny8HtcjByDkQ7PNk4TmPT4jfWZExCs4pAOuUrdqkaMIr3DP0NAOMtk8ku4K08ODJyXN7qP4fMl2nojYr8MrCb00EC83upJt')

const Cart: NextPage = () => {

	const cart = useContext(CartContext);

	
	const [tables, setTables] = useState<String[]>([]);
	const [paymentType, setPaymentType] = useState<string>('');
	const [clientSecret, setClientSecret] = useState<string>('');
  	// Fetch all orders
	const [products, productsLoading, productsError, productsSnapshot] = useCollectionData<AlabarraProduct>(allProductsQuery, {
		snapshotListenOptions: { includeMetadataChanges: true }
	});


	useEffect( () => {
	// Fetch all available tables
		(async () => {
			setTables(await getAllTableIds());
		})()
	}, [])

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		console.log("handleChange: " + event.target.value);
        setPaymentType(event.target.value);

		if(event.target.value == 'digital') {
			console.log("calling promise");
			cart.createOrderWithDigitalPayment()
				.then((result: any) => {
					console.log("first then");
					console.log(result);
					const orderId = result.result.order_id;
					console.log("received orderId");
					return cart.createStripePaymentIntent(orderId);
				})
				.then((result: any) => {
					console.log("second then");
					console.log(result);
					const receivedClientSecret = result.result.payment_intent_client_secret;
					console.log(receivedClientSecret);
					setClientSecret(receivedClientSecret);
				})
				.catch(error => {
					console.log("Catch block")
					console.log(error);
				})
		}
    }

	const handlePaymentError = (error: any) => {
		console.log("payment error");
		console.log(error);
	}

	const hanldePaymentSuccess = () => {
		console.log("payment success");
	}

  return (
    <>

        <Navbar />
		<Elements stripe={stripePromise}>
			<Container>
				<h1>Checkout</h1>

				<Grid container spacing={5} direction='row' justifyContent='flex-start' alignItems='stretch'>

					<Grid item xs={12} sm={6} md={6} lg={6}>
						<h2>Order summary</h2>
						<CartContent />
					</Grid>

					<Grid item xs={12} sm={6} md={6} lg={6}>
						
						<h2>Select payment method</h2>
						<RadioGroup value={paymentType}>
							<List>
								<ListItem>
									<Radio value='presential' onChange={handleChange}/>
										<Typography><Box display='inline' fontWeight='bold' component='span'>Presential payment</Box>: A waiter will come to your table to collect payment</Typography>
								</ListItem>
								<ListItem>
									<Radio value='digital' onChange={handleChange} />
									<FormLabel><Box display='inline' fontWeight='bold' component='span'>Digital payment</Box>: Pay from the comfort of your phone and get your order sooner</FormLabel>
								</ListItem>
							</List>
						</RadioGroup>

						<h2>Select your table</h2>
						<Autocomplete
							disablePortal
							id="select-table"
							options={tables}
							
							renderInput={(params) => <TextField {...params} label="Select your table" variant="standard"/>}
						/>
						<h2>Your name</h2>
						<TextField></TextField>

						{paymentType != '' &&
							<>
								<h2>Order</h2>
								{ paymentType == "presential" &&
									<Button onClick={() => {cart.createOrderWithManualPayment()}}>Order now</Button>
								}
								{ paymentType == "digital" &&
									<StripeButton amount={cart.getCartTotal()} clientSecret={clientSecret} onPaymentError={handlePaymentError} onPaymentSuccess={hanldePaymentSuccess} />
								}
							</>
						}
					</Grid>
				</Grid>
			</Container>
		</Elements>
    </>
  )
}

export default Cart
