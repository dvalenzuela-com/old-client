import React, {useState, useEffect, useContext} from 'react';
import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { BusinessConfigContext } from '@Context/BusinessConfigContext';

interface StripeButtonProps {
    amount: number;
    clientSecret: string;
    onPaymentError: (error: any) => void;
    onPaymentSuccess: () => void;
    disabled?: boolean;
}
const StripeButton = (props: StripeButtonProps) => {
  const stripe = useStripe();
  const { t } = useTranslation();

  const businessConfig = useContext(BusinessConfigContext);

  const router = useRouter();
  const businessId = router.query['business-id'] as string;

  const [paymentRequest, setPaymentRequest] = useState<any>(null);

  useEffect(() => {
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
        pr.canMakePayment().then((result: any) => {
            if (result) {
                setPaymentRequest(pr);
            }
        });

        pr.on('paymentmethod', async (ev) => {
            // Confirm the PaymentIntent without handling potential next actions (yet).
            const {paymentIntent, error: confirmError} = await stripe.confirmCardPayment(
                props.clientSecret,
                {payment_method: ev.paymentMethod.id},
                {handleActions: false}
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
                // Check if the PaymentIntent requires any actions and if so let Stripe.js
                // handle the flow. If using an API version older than "2019-02-11"
                // instead check for: `paymentIntent.status === "requires_source_action"`.
                if (paymentIntent.status === "requires_action") {
                // Let Stripe.js handle the rest of the payment flow.
                    const {error} = await stripe.confirmCardPayment(props.clientSecret);
                    if (error) {
                        // The payment failed -- ask your customer for a new payment method.
                        props.onPaymentError(error);
                    } else {
                        // The payment has succeeded.
                        props.onPaymentSuccess();
                    }
                } else {
                    // The payment has succeeded.
                    props.onPaymentSuccess();
                }
            }
        });
    }
  }, [stripe]);

  const castedPaymentRequest = paymentRequest as PaymentRequest;

 
    if (paymentRequest) {
        return <PaymentRequestButtonElement options={{paymentRequest, style: {paymentRequestButton: {type: 'check-out'}}}} />
    }

    // Use a traditional checkout form.
    return (<>{t('StripeButton.NotAvailable')}</>);
}

export default StripeButton;