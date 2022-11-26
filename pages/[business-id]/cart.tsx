import type { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { Container, Grid } from '@mui/material';
import CartContent from '@Components/Cart/CartContent';
import { useContext, useEffect, useState } from 'react';
import { getAllBusinessIds, getAllTableIds, getBusinessConfig } from '@Lib/firestore';
import { CartContext } from '@Context/CartContext';
import { useStripe } from '@stripe/react-stripe-js';
import { useSnackbar } from "notistack";
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import Layout from 'layout/Layout';
import { ABBusinessConfig } from '@dvalenzuela-com/alabarra-types';
import { PaymentTypes } from '@Components/PaymentTypeSelection';
import CartDetails from '@Components/Cart/CartDetails';
// import { dummyAllTables } from '@Lib/offlineTesting/dummyAllTables';
// import { dummyBusinessConfig } from '@Lib/offlineTesting/dummyBusinessConfig';

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
	const [paymentType, setPaymentType] = useState<PaymentTypes | ''>('');
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
							<CartDetails
								businessConfig={businessConfig} 
								tableIds={tables}
								selectedTable={selectedTable}
								customerName={customerName}
								generalNote={generalNote}
								paymentType={paymentType}
								canMakeDigitalPayments={canMakeDigitalPayments}
								clientSecret={clientSecret}
								waitingForManualOrder={waitingForManualOrder}
								onTableSelection={setSelectedTable}
								onCustomerNameChange={setCustomerName}
								onGeneralNoteChange={setGeneralNote}
								onChangePaymentType={handleSelectPaymentType}
								onCreateManualOder={handleManualOrder}
								onDigitalPaymentError={handleDigitalPaymentError}
								onDigitalPaymentSuccess={hanldeDigitalPaymentSuccess} />
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

	// const businessConfig = dummyBusinessConfig;
	// const tables = dummyAllTables;

	return {
        props: {
			businessConfig: businessConfig,
			tables: tables
		}
    }
}
