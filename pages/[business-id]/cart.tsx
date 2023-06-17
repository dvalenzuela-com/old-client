import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Container, Grid } from '@mui/material';
import CartContent from '@Components/Cart/CartContent';
import { useEffect, useState } from 'react';
import { getAllBusinessIds, getAllTables, getBusinessConfig } from '@Lib/firestore';
import { useCart } from '@Context/CartContext';
import { useStripe } from '@stripe/react-stripe-js';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import Layout from 'layout/Layout';
import { ABBusinessConfig, ABTable } from '@Alabarra/alabarra-types';
import { PaymentTypes } from '@Components/PaymentTypeSelection';
import CartDetails from '@Components/Cart/CartDetails';
import { CanMakePaymentResult, StripeError } from '@stripe/stripe-js';
import { useStoreOpen } from '@Lib/useStoreOpen';
import CartPaymentSection from '@Components/Cart/CartPaymentSection';
import TipSelection from '@Components/Cart/TipSelection';
import { Stack } from '@mui/system';
//const fs = require('fs');

// import { dummyAllTables } from '@Lib/offlineTesting/dummyAllTables';
// import { dummyBusinessConfig } from '@Lib/offlineTesting/dummyBusinessConfig';

type CartProps = {
  businessConfig: ABBusinessConfig;
  tables: ABTable[];
};

const Cart: NextPage<CartProps> = ({ businessConfig, tables }) => {
  const { t } = useTranslation();

  const router = useRouter();
  const businessId = router.query['business-id'] as string;

  const { enqueueSnackbar } = useSnackbar();
  const cart = useCart();
  const stripe = useStripe();
  const storeOpen = useStoreOpen(businessConfig);

  const [selectedTable, setSelectedTable] = useState<ABTable | null>(null);
  const [customerName, setCustomerName] = useState<string>('');
  const [generalNote, setGeneralNote] = useState<string>('');
  const [paymentType, setPaymentType] = useState<PaymentTypes | ''>('');
  const [canPayWithStripe, setCanPayWithStripe] = useState<boolean>(false);
  const [waitingForManualOrder, setWaitingForManualOrder] = useState<boolean>(false);

  // Pre-select table if the user scanned a specific qr
  useEffect(() => {
    if (!cart) return;
    if (!tables) return;

    const selectedTable = tables.find((obj) => obj.id === cart.getSelectedTableId());
    if (selectedTable) {
      setSelectedTable(selectedTable);
    }
  }, [cart, tables]);

  // use a dummy payment intent to see if a payment can be made
  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: businessConfig.country,
        currency: businessConfig.currency.toLowerCase(),
        total: {
          label: t('StripeButton.Order.Label'),
          amount: cart.billTotalWithTip,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then((result: CanMakePaymentResult | null) => {
        if (result) {
          setCanPayWithStripe(true);
        }
      });
    }
  }, [businessConfig.country, businessConfig.currency, cart.billTotalWithTip, stripe, t]);

  const handleManualOrder = async () => {
    if (selectedTable) {
      setWaitingForManualOrder(true);
      try {
        const data = await cart.createOrderWithManualPayment(
          businessId,
          selectedTable.table_name,
          customerName.trim(),
          generalNote
        );
        setWaitingForManualOrder(false);
        // Clear cart, send the user to the index page and show a success message
        cart.clearCart();
        router.push(`/${businessId}`);
        enqueueSnackbar(t('Cart.Snackbar.ManualOrderPlaced'), { variant: 'success' });
      } catch (error) {
        setWaitingForManualOrder(false);
        enqueueSnackbar(t('Cart.Snackbar.OrderError'), { variant: 'error' });
        console.log(error);
      }
    }
  };

  const handleDigitalPaymentError = (error: StripeError) => {
    enqueueSnackbar(t('Cart.Snackbar.OrderError'), { variant: 'error' });
    console.log(error);
  };

  const hanldeDigitalPaymentSuccess = () => {
    cart.clearCart();
    router.push(`/${businessId}`);
    enqueueSnackbar(t('Cart.Snackbar.DigitalOrderPlaced'), { variant: 'success' });
  };

  return (
    <Layout businessConfig={businessConfig}>
      <Container>
        <h1>{t('Cart.Title')}</h1>

        {cart.numberOfItems == 0 && <h2>{t('Cart.CartEmpty.Title')}</h2>}
        {cart.numberOfItems != 0 && (
          <Grid
            container
            spacing={5}
            direction='row'
            justifyContent='flex-start'
            alignItems='stretch'
          >
            <Grid item xs={12} sm={6}>
              <h2>{t('Cart.OrderSummary.Title')}</h2>
              <Stack>
                <CartContent />
                <TipSelection />
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CartDetails
                storeOpen={storeOpen}
                tables={tables}
                selectedTable={selectedTable}
                customerName={customerName}
                generalNote={generalNote}
                paymentType={paymentType}
                canPayWithStripe={canPayWithStripe}
                onTableSelection={setSelectedTable}
                onCustomerNameChange={setCustomerName}
                onGeneralNoteChange={setGeneralNote}
                onChangePaymentType={setPaymentType}
              />

              <CartPaymentSection
                paymentType={paymentType}
                selectedTable={selectedTable}
                customerName={customerName}
                generalNote={generalNote}
                amount={cart.billTotalWithTip}
                storeOpen={storeOpen}
                waitingForManualOrder={waitingForManualOrder}
                onCreateManualOrder={handleManualOrder}
                onDigitalPaymentSuccess={hanldeDigitalPaymentSuccess}
                onDigitalPaymentError={handleDigitalPaymentError}
              />
            </Grid>
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default Cart;

/**
 * STATIC SITE GENERATION
 */

// Statically generate all product pages for all existing businessess
export const getStaticPaths: GetStaticPaths = async () => {
  const businessesIds = await getAllBusinessIds();

  const paths = businessesIds.map((businessId) => {
    return {
      params: { 'business-id': businessId },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
};

// statically generate pages
export const getStaticProps: GetStaticProps = async (context) => {
  const businessId = (context.params as any)['business-id'] as string;
  const businessesIds = await getAllBusinessIds();

  if (businessId && !businessesIds.includes(businessId)) {
    return {
      redirect: {
        permanent: true,
        destination: '/',
      },
      props: {},
    };
  }

  const businessConfig = await getBusinessConfig(businessId);
  const tables = await getAllTables(businessId);

  //fs.writeFileSync("./tables.json", JSON.stringify(tables, null, 4));

  // const businessConfig = dummyBusinessConfig;
  // const tables = dummyAllTables;

  return {
    props: {
      businessConfig: businessConfig,
      tables: JSON.parse(JSON.stringify(tables)),
    },
  };
};
