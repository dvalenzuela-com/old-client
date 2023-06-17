import { useBusinessConfig } from '@Context/BusinessConfigContext';
import { LinearProgress } from '@mui/material';
import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';
import { CanMakePaymentResult, PaymentRequest, StripeError } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type PaymentButtonStripeProps = {
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: StripeError) => void;
};

const PaymentButtonStripe = (props: PaymentButtonStripeProps) => {
  const stripe = useStripe();
  const { t } = useTranslation();

  const businessConfig = useBusinessConfig();

  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | undefined>(undefined);

  useEffect(() => {
    if (stripe && props.amount && props.clientSecret) {
      createStripePaymentRequest();
    }
  }, [stripe, props.amount, props.clientSecret]);

  const createStripePaymentRequest = () => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: businessConfig.country,
        currency: businessConfig.currency.toLowerCase(),
        total: {
          label: t('StripeButton.Order.Label'),
          amount: props.amount,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      // Check the availability of the Payment Request API.
      pr.canMakePayment().then((result: CanMakePaymentResult | null) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });

      pr.on('paymentmethod', async (ev) => {
        // Confirm the PaymentIntent without handling potential next actions (yet).
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
          props.clientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false }
        );

        if (confirmError) {
          // Report to the browser that the payment failed, prompting it to
          // re-show the payment interface, or show an error message and close
          // the payment interface.
          ev.complete('fail');
        } else {
          // Report to the browser that the confirmation was successful, prompting
          // it to close the browser payment method collection interface.
          ev.complete('success');
          // Check if the PaymentIntent requires any actions and if so let Stripe.js handle the flow
          if (paymentIntent.status === 'requires_action') {
            // Let Stripe.js handle the rest of the payment flow.
            const { error } = await stripe.confirmCardPayment(props.clientSecret);
            if (error) {
              // The payment failed -- ask your customer for a new payment method.
              props.onError(error);
            } else {
              // The payment has succeeded.
              props.onSuccess();
            }
          } else {
            // The payment has succeeded.
            props.onSuccess();
          }
        }
      });
    }
  };

  if (props.clientSecret != '' && paymentRequest) {
    return (
      <PaymentRequestButtonElement
        options={{ paymentRequest, style: { paymentRequestButton: { type: 'check-out' } } }}
      />
    );
  }

  return <LinearProgress />;
  // TODO: Add fallback when there is no answer
};

export default PaymentButtonStripe;
