import React, {useState, useEffect, useContext} from 'react';
import {PaymentRequestButtonElement, useStripe} from '@stripe/react-stripe-js';
import { CartContext } from '../context/CartContext';

const StripeButton = () => {
  const stripe = useStripe();

  const cart = useContext(CartContext);

  const [paymentRequest, setPaymentRequest] = useState<any>(null);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'DE',
        currency: 'eur',
        total: {
          label: 'Alabarra Order',
          amount: cart.getCartTotal(),
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      // Check the availability of the Payment Request API.
      pr.canMakePayment().then((result: any) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe]);

  if (paymentRequest) {
    return <PaymentRequestButtonElement options={{paymentRequest}} />
  }

  // Use a traditional checkout form.
  return (<>No digital payment available</>);
}

export default StripeButton;