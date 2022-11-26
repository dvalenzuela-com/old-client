import type { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { Autocomplete, Container, Grid, LinearProgress, TextField } from '@mui/material';
import CartContent from '@Components/CartContent';
import { useContext, useEffect, useState } from 'react';
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
import PaymentTypeSelection, { PaymentTypes } from '@Components/PaymentTypeSelection';
import { isStoreOpen } from '@Lib/helper';

const Cart: NextPage<{businessConfig: ABBusinessConfig, tables: string[]}> = ({businessConfig, tables}) => {

	const { t } = useTranslation();

	const router = useRouter();
	const businessId = router.query['business-id'] as string;

	const {enqueueSnackbar} = useSnackbar();
	const cart = useContext(CartContext);
	const stripe = useStripe();

	const [selectedTable, setSelectedTable] = useState<string | null>(null);
	const [customerName, setCustomerName] = useState<string>('');
	const [generalNote, setGeneralNote] = useState<string>('');
	const [paymentType, setPaymentType] = useState<string>('');
	const [clientSecret, setClientSecret] = useState<string>('');
	const [canMakeDigitalPayments, setCanMakeDigitalPayments] = useState<boolean>(false);
	const [waitingForManualOrder, setWaitingForManualOrder] = useState<boolean>(false);

	useEffect(() => {
		setSelectedTable(cart.getSelectedTableId());
	}, []);

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

	const handleSelectPaymentType = async (selectedPaymentType: PaymentTypes) => {
        setPaymentType(selectedPaymentType);

		if(selectedPaymentType == 'digital') {
			if (selectedTable) {
				try {
					const orderId = await cart.createOrderWithDigitalPayment(businessId, selectedTable, customerName.trim(), generalNote);
					const clientSecret = await cart.createStripePaymentIntent(businessId, orderId);
					setClientSecret(clientSecret);
				} catch (error) {
					console.log("Catch block")
					console.log(error);
				}
			}
		}
    }

	const handleManualOrder = () => {
		if (selectedTable) {
			setWaitingForManualOrder(true);
			try {
				const data = cart.createOrderWithManualPayment(businessId, selectedTable, customerName.trim(), generalNote);
				setWaitingForManualOrder(false);
				// Clear cart, send the user to the index page and show a success message
				cart.clearCart();
				router.push(`/${businessId}`);
				enqueueSnackbar(t('Cart.Snackbar.ManualOrderPlaced'), {variant: 'success'});
			} catch (error) {
				setWaitingForManualOrder(false);
				enqueueSnackbar(t('Cart.Snackbar.OrderError'), {variant: 'error'});
				console.log(error);
			}
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

						<Grid item xs={12} sm={6}>
							<h2>{t('Cart.OrderSummary.Title')}</h2>
							<CartContent />
						</Grid>

						<Grid item xs={12} sm={6}>
							<h2>{t('Cart.SelectTable.Title')}</h2>
							<Autocomplete
								disablePortal
								id="select-table"
								options={tables}
								value={selectedTable}
								onChange={handleTableSelection}
								renderInput={(params) => <TextField {...params} label={t('Cart.SelectTable.Placeholder')} variant="standard" />}
							/>
							<h2>{t('Cart.Username.Title')}</h2>
							<TextField
								value={customerName} 
								placeholder={t('Cart.Username.Placeholder')}
								onChange={(e) => {setCustomerName(e.target.value)}}
								fullWidth />
							<h2>{t('Cart.GeneralNote.Title')}</h2>
							<TextField
								value={generalNote}
								placeholder={t('Cart.GeneralNote.Placeholder')}
								onChange={(e) => {setGeneralNote(e.target.value)}}
								multiline
								fullWidth />
							<h2>{t('Cart.PaymentMethod.Title')}</h2>
							<PaymentTypeSelection
								selectedPaymentType={paymentType as PaymentTypes}
								canMakeDigitalPayments={canMakeDigitalPayments}
								onChange={handleSelectPaymentType}
								disabled={!isStoreOpen(businessConfig)} />
							{paymentType != '' &&
								<>
									<h2>{t('Cart.Order.Title')}</h2>
									{ paymentType == "presential" &&
										<LoadingButton
											onClick={handleManualOrder}
											disabled={!(selectedTable && customerName.trim().length > 0 && isStoreOpen(businessConfig))}
											title={t('Cart.Order.PresentialPaymentButton')}
											loading={waitingForManualOrder}
											fullWidth/>
									}
									{ paymentType == "digital" && clientSecret == '' &&
										<LinearProgress />
									}
									{ paymentType == "digital" && clientSecret != '' && 
									// TODO: disable when no table is selected
									// TODO: disable when store closed
										<StripeButton
											amount={cart.getCartTotal()}
											clientSecret={clientSecret}
											onPaymentError={handleDigitalPaymentError}
											onPaymentSuccess={hanldeDigitalPaymentSuccess} />
									}
								</>
							}
						</Grid>
					</Grid>
				}
			</Container>
		</Layout>
	);
}

export default Cart;

/**
 * STATIC SITE GENERATION 
 */

// Statically generate all product pages for all existing businessess
// TODO: Add revalidate when creating a new business and/or when changing products
export const getStaticPaths: GetStaticPaths = async () => {
	
	const businessesIds = await getAllBusinessIds();

	const paths = businessesIds.map(businessId => {
		return {
			params: {'business-id': businessId}
		}
	});

	return {
		paths,
		fallback: 'blocking'
	}
}

// statically generate pages
export const getStaticProps: GetStaticProps = async (context) => {
	
    const businessId = (context.params as any)['business-id'] as string;
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

	const businessConfig = await getBusinessConfig(businessId);
	const tables = await getAllTableIds(businessId);
	console.log(businessConfig);

	return {
        props: {
			businessConfig: businessConfig,
			tables: tables
		}
    }
}

/**
 * SERVER SIDE RENDERING 
 */

// export const getServerSideProps: GetServerSideProps = async (context) => {
	
//     const businessId = context.query['business-id'] as string;
	
// 	// Redirect wrong business Ids to main page
// 	const businessesIds = await getAllBusinessIds();
//     if (businessId && !businessesIds.includes(businessId)) {
//         return {
//             redirect: {
//                 permanent: true,
//                 destination: "/"
//             },
//             props: {}
//         }
//     }

// 	// Fetch data about the business
// 	/*
// 	context.res.setHeader(
// 		'Cache-Control',
// 		'public, s-maxage=300'
// 	);
// 	*/

// 	const businessConfig = await getBusinessConfig(businessId);
// 	const tables = await getAllTableIds(businessId);

// 	return {
//         props: {
// 			businessConfig: businessConfig,
// 			tables: tables
// 		}
//     }
// }
