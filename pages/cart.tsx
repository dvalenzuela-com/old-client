import type { NextPage } from 'next'
import { Autocomplete, Container, Grid, LinearProgress, List, ListItem, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import CartContent from '@Components/CartContent';
import { useContext, useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { getAllTableIds } from '@Lib/firestore';
import StripeButton from '@Components/StripeButton';
import { CartContext } from '@Context/CartContext';
import { useStripe } from '@stripe/react-stripe-js';
import { useSnackbar } from "notistack";
import { useRouter } from 'next/router';
import LoadingButton from '@Components/LoadingButton';

const Cart: NextPage = () => {

	const {enqueueSnackbar} = useSnackbar();
	const router = useRouter();
	const cart = useContext(CartContext);
	const stripe = useStripe();

	const [tables, setTables] = useState<string[]>([]);
	const [selectedTable, setSelectedTable] = useState<string | null>(null);
	const [customerName, setCustomerName] = useState<string | undefined>(undefined);
	const [generalNote, setGeneralNote] = useState<string | undefined>(undefined);
	const [paymentType, setPaymentType] = useState<string>('');
	const [clientSecret, setClientSecret] = useState<string>('');
	const [canMakeDigitalPayments, setCanMakeDigitalPayments] = useState<boolean>(false);
	const [waitingForManualOrder, setWaitingForManualOrder] = useState<boolean>(false);

	useEffect( () => {
	// Fetch all available tables
		(async () => {
			setTables(await getAllTableIds());
		})()
	}, []);

	// use a dummy payment intent to see if a payment can be made
	useEffect(() => {
		if (stripe) {
			const pr = stripe.paymentRequest({
				country: 'DE',
				currency: 'clp',
				total: {
					label: 'Alabarra Order',
					amount: cart.getCartTotal(),
				},
				requestPayerName: true,
				requestPayerEmail: true,
			});

			pr.canMakePayment().then((result: any) => {
				if (result) {
					setCanMakeDigitalPayments(true);
				}
			});
		}
	}, [stripe]);



	const handleTableSelection = (event: any, newValue: string | null) => {
		setSelectedTable(newValue);
	}

	const handleSelectPaymentType = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentType(event.target.value);

		if(event.target.value == 'digital') {
			if (selectedTable) {
				cart.createOrderWithDigitalPayment(selectedTable, customerName?.trim(), generalNote)
					.then((orderId: any) => {
						return cart.createStripePaymentIntent(orderId);
					})
					.then((clientSecret: any) => {
						setClientSecret(clientSecret);
					})
					.catch(error => {
						console.log("Catch block")
						console.log(error);
					})
			}
		}
    }

	const handleManualOrder = () => {
		if (selectedTable) {
			setWaitingForManualOrder(true);
			cart.createOrderWithManualPayment(selectedTable, customerName?.trim(), generalNote)
				.then(data => {
					setWaitingForManualOrder(false);
					// Clear cart, send the user to the index page and show a success message
					cart.clearCart();
					router.push("/");
					enqueueSnackbar(`Your order has been placed. A waiter will collect payment from you shortly.`, {variant: 'success'});
				})
				.catch(error => {
					setWaitingForManualOrder(false);
					enqueueSnackbar(`Error with your order. Please try again.`, {variant: 'error'});
					console.log(error);
				})
		}
	}

	const handleDigitalPaymentError = (error: any) => {
		enqueueSnackbar(`Error with your order. Please try again.`, {variant: 'error'});
		console.log(error);
	}

	const hanldeDigitalPaymentSuccess = () => {
		cart.clearCart();
		router.push("/");
		enqueueSnackbar(`Your order has been placed and paid. We'll bring it as soon as possible!`, {variant: 'success'});
	
	}


  return (
	<Container>
		<h1>Checkout</h1>

		{cart.getNumberOfItems() == 0 && <h2>No products on the cart</h2>}

		{cart.getNumberOfItems() != 0 &&

			<Grid container spacing={5} direction='row' justifyContent='flex-start' alignItems='stretch'>

				<Grid item xs={12} sm={6} md={6} lg={6}>
					<h2>Order summary</h2>
					<CartContent />
				</Grid>

				<Grid item xs={12} sm={6} md={6} lg={6}>

					<h2>Select your table</h2>
					<Autocomplete
						disablePortal
						id="select-table"
						options={tables}
						value={selectedTable}
						onChange={handleTableSelection}
						renderInput={(params) => <TextField {...params} label="Select your table" variant="standard"/>}
					/>
					<h2>Your name</h2>
					<TextField value={customerName} placeholder='How should we call you at the table?' onChange={(e) => {setCustomerName(e.target.value)}} fullWidth></TextField>
					<h2>General note</h2>
					<TextField value={generalNote} placeholder='Any comments for your order?' onChange={(e) => {setGeneralNote(e.target.value)}} fullWidth multiline></TextField>
					<h2>Select payment method</h2>
					<RadioGroup value={paymentType}>
						<List>
							<ListItem>
								<Radio value='presential' onChange={handleSelectPaymentType}/>
									<Typography><Box display='inline' fontWeight='bold' component='span'>Presential payment</Box>: A waiter will come to your table to collect payment</Typography>
							</ListItem>
							{canMakeDigitalPayments &&
								<ListItem>
									<Radio value='digital' onChange={handleSelectPaymentType} disabled={!canMakeDigitalPayments} />
									<Typography><Box display='inline' fontWeight='bold' component='span'>Digital payment</Box>: Pay from the comfort of your phone and get your order sooner</Typography>
								</ListItem>
							}

						</List>
					</RadioGroup>
					{paymentType != '' &&
						<>
							<h2>Order</h2>
							{ paymentType == "presential" &&
								<LoadingButton onClick={handleManualOrder} disabled={!(selectedTable && customerName && customerName.trim().length > 0)} title={'Order now'} loading={waitingForManualOrder} fullWidth/>
							}
							{ paymentType == "digital" && clientSecret == '' &&
								<LinearProgress />
							}
							{ paymentType == "digital" && clientSecret != '' && 
							// TODO: disable when no table is selected
								<StripeButton amount={cart.getCartTotal()} clientSecret={clientSecret} onPaymentError={handleDigitalPaymentError} onPaymentSuccess={hanldeDigitalPaymentSuccess} />
							}
						</>
					}
				</Grid>
			</Grid>
		}
	</Container>
  )
}

export default Cart
