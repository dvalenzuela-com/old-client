import type { GetServerSideProps, NextPage } from 'next'
import { Autocomplete, Container, Grid, LinearProgress, List, ListItem, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import CartContent from '@Components/CartContent';
import { useContext, useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { getAllBusinessIds, getAllTableIds, getBusinessConfig } from '@Lib/firestore';
import StripeButton from '@Components/StripeButton';
import { CartContext } from '@Context/CartContext';
import { useStripe } from '@stripe/react-stripe-js';
import { useSnackbar } from "notistack";
import { useRouter } from 'next/router';
import LoadingButton from '@Components/LoadingButton';
import { useTranslation } from 'react-i18next';
import Layout from 'layout/Layout';
import { ABBusinessConfig } from '@dvalenzuela-com/alabarra-types';

const Cart: NextPage<{businessConfig: ABBusinessConfig}> = ({businessConfig}) => {

	const { t } = useTranslation();

	const router = useRouter();
	const businessId = router.query['business-id'] as string;

	const {enqueueSnackbar} = useSnackbar();
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
		console.log(businessId);
		setSelectedTable(cart.getSelectedTableId());
		// Fetch all available tables
		(async () => {
			const fetchedTables = await getAllTableIds(businessId);
			console.log(fetchedTables);
			setTables(fetchedTables);
		})()
	}, [businessId]);

	// use a dummy payment intent to see if a payment can be made
	useEffect(() => {
		if (stripe) {
			const pr = stripe.paymentRequest({
				country: businessConfig.country,
				currency: businessConfig.currency.toLowerCase(),
				total: {
					label: t('StripeButton.Order.Label'),
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
				cart.createOrderWithDigitalPayment(businessId, selectedTable, customerName?.trim(), generalNote)
					.then((orderId: any) => {
						return cart.createStripePaymentIntent(businessId, orderId);
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
			cart.createOrderWithManualPayment(businessId, selectedTable, customerName?.trim(), generalNote)
				.then(data => {
					setWaitingForManualOrder(false);
					// Clear cart, send the user to the index page and show a success message
					cart.clearCart();
					router.push(`/${businessId}`);
					enqueueSnackbar(t('Cart.Snackbar.ManualOrderPlaced'), {variant: 'success'});
				})
				.catch(error => {
					setWaitingForManualOrder(false);
					enqueueSnackbar(t('Cart.Snackbar.OrderError'), {variant: 'error'});
					console.log(error);
				})
		}
	}

	const handleDigitalPaymentError = (error: any) => {
		enqueueSnackbar(t('Cart.Snackbar.OrderError'), {variant: 'error'});
		console.log(error);
	}

	const hanldeDigitalPaymentSuccess = () => {
		cart.clearCart();
		router.push(`/${businessId}`);
		enqueueSnackbar(t('Cart.Snackbar.DigitalOrderPlaced'), {variant: 'success'});
	
	}


  return (
	<Layout businessConfig={businessConfig}>
		<Container>
			<h1>{t('Cart.Title')}</h1>

			{cart.getNumberOfItems() == 0 && <h2>{t('Cart.CartEmpty.Title')}</h2>}

			{cart.getNumberOfItems() != 0 &&

				<Grid container spacing={5} direction='row' justifyContent='flex-start' alignItems='stretch'>

					<Grid item xs={12} sm={6} md={6} lg={6}>
						<h2>{t('Cart.OrderSummary.Title')}</h2>
						<CartContent />
					</Grid>

					<Grid item xs={12} sm={6} md={6} lg={6}>

						<h2>{t('Cart.SelectTable.Title')}</h2>
						<Autocomplete
							disablePortal
							id="select-table"
							options={tables}
							value={selectedTable}
							onChange={handleTableSelection}
							renderInput={(params) => <TextField {...params} label={t('Cart.SelectTable.Placeholder')} variant="standard"/>}
						/>
						<h2>{t('Cart.Username.Title')}</h2>
						<TextField value={customerName} placeholder={t('Cart.Username.Placeholder')} onChange={(e) => {setCustomerName(e.target.value)}} fullWidth></TextField>
						<h2>{t('Cart.GeneralNote.Title')}</h2>
						<TextField value={generalNote} placeholder={t('Cart.GeneralNote.Placeholder')} onChange={(e) => {setGeneralNote(e.target.value)}} fullWidth multiline></TextField>
						<h2>{t('Cart.PaymentMethod.Title')}</h2>
						<RadioGroup value={paymentType}>
							<List>
								<ListItem disablePadding={true}>
									<Radio value='presential' onChange={handleSelectPaymentType} />
										<Typography><Box display='inline' fontWeight='bold' component='span'>{t('Cart.PaymentMethod.Presential.Title')}</Box>{t('Cart.PaymentMethod.Presential.Subtitle')}</Typography>
								</ListItem>
								{canMakeDigitalPayments &&
									<ListItem disablePadding={true}>
										<Radio value='digital' onChange={handleSelectPaymentType} disabled={!canMakeDigitalPayments} />
										<Typography><Box display='inline' fontWeight='bold' component='span'>{t('Cart.PaymentMethod.Digital.Title')}</Box>{t('Cart.PaymentMethod.Digital.Subtitle')}</Typography>
									</ListItem>
								}

							</List>
						</RadioGroup>
						{paymentType != '' &&
							<>
								<h2>{t('Cart.Order.Title')}</h2>
								{ paymentType == "presential" &&
									<LoadingButton onClick={handleManualOrder} disabled={!(selectedTable && customerName && customerName.trim().length > 0)} title={t('Cart.Order.PresentialPaymentButton')} loading={waitingForManualOrder} fullWidth/>
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
	</Layout>
  )
}

export default Cart

export const getServerSideProps: GetServerSideProps = async (context) => {
	
    const businessId = context.query['business-id'] as string;
	
	// Redirect wrong business Ids to main page
	const businessesIds = await getAllBusinessIds();
    if (businessId && !businessesIds.includes(businessId)) {
        return {
            redirect: {
                permanent: true,
                destination: "/"
            },
            props: {}
        }
    }

	// Fetch data about the business
	/*
	context.res.setHeader(
		'Cache-Control',
		'public, s-maxage=300'
	);
	*/

	const businessConfig = await getBusinessConfig(businessId);
	
	return {
        props: {
			businessConfig: businessConfig
		}
    }
}
