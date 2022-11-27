import LoadingButton from "@Components/LoadingButton";
import { PaymentTypes } from "@Components/PaymentTypeSelection";
import { CartContext } from "@Context/CartContext";
import { StripeError } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PaymentButtonStripe from "./PaymentButtonStripe";
import debounce from 'lodash.debounce';

type CartPaymentSectionProps = {
    paymentType: PaymentTypes | '';
    selectedTable: string | null;
    customerName: string;
    storeOpen: boolean;

    amount: number;
    generalNote: string;

    waitingForManualOrder: boolean;
    
    onCreateManualOrder: () => void;
    onDigitalPaymentSuccess: () => void;
    onDigitalPaymentError: (error: StripeError) => void;
}

const CartPaymentSection = (props: CartPaymentSectionProps) => {

    const { t } = useTranslation();

	const cart = useContext(CartContext);

    const router = useRouter();
	const businessId = router.query['business-id'] as string;

    const [clientSecret, setClientSecret] = useState<string>('');

    useEffect(() => {
        if (props.paymentType === PaymentTypes.DIGITAL &&
            props.selectedTable != null &&
            props.customerName.trim().length > 0 &&
            props.storeOpen &&
            props.amount > 0) {
            // Create new order and payment intent
            console.log("CartPaymentSection useEffect");
            setClientSecret('');

            const selectedTable = props.selectedTable;
            const customerName = props.customerName;
            const generalNote = props.generalNote;
            createPaymentIntent(businessId, selectedTable, customerName, generalNote);
        }
    }, [props.paymentType, props.selectedTable, props.customerName, props.storeOpen, props.amount])

    
    const createPaymentIntent = useCallback(debounce(async (businessId: string, selectedTable: string, customerName: string, generalNote: string) => {
        console.log(`createPaymentIntent(${businessId}, ${selectedTable}, ${customerName}, ${generalNote})`);
        try {
            const orderId = await cart.createOrderWithDigitalPayment(businessId, selectedTable, customerName, generalNote);
            const clientSecret = await cart.createStripePaymentIntent(businessId, orderId);
            console.log("new client secret", clientSecret);
            setClientSecret(clientSecret);
        } catch (error) {
            console.log("Catch block")
            console.log(error);
        }
    }, 0.7 * 1000), []);

    return (
        <>
            <h2>{t('Cart.Order.Title')}</h2>
            {props.paymentType == PaymentTypes.PRESENTIAL &&
                <LoadingButton
                    onClick={props.onCreateManualOrder}
                    disabled={!(props.selectedTable && props.customerName.trim().length > 0 && props.storeOpen)}
                    title={t('Cart.Order.PresentialPaymentButton')}
                    loading={props.waitingForManualOrder}
                    fullWidth />
            }
            {props.paymentType == PaymentTypes.DIGITAL &&
                <PaymentButtonStripe
                    clientSecret={clientSecret}
                    amount={props.amount}
                    onSuccess={props.onDigitalPaymentSuccess}
                    onError={props.onDigitalPaymentError} />
            }
        </>
    );
}

export default CartPaymentSection;