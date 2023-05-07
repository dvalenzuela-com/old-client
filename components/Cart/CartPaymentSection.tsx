import LoadingButton from "@Components/LoadingButton/LoadingButton";
import { PaymentTypes } from "@Components/PaymentTypeSelection";
import { useCart } from "@Context/CartContext";
import { StripeError } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PaymentButtonStripe from "./PaymentButtonStripe";
import debounce from 'lodash.debounce';
import { ABTable } from "@Alabarra/alabarra-types";

type CartPaymentSectionProps = {
    paymentType: PaymentTypes | '';
    selectedTable: ABTable | null;
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

	const cart = useCart();

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
            setClientSecret('');

            createPaymentIntent(businessId, props.selectedTable.table_name, props.customerName, props.generalNote);
        }
    }, [props.paymentType, props.selectedTable, props.customerName, props.storeOpen, props.amount])

    
    const createPaymentIntent = useCallback(debounce(async (businessId: string, selectedTable: string, customerName: string, generalNote: string) => {
        try {
            const clientSecret = await cart.createOrderWithStripePayment(businessId, selectedTable, customerName, generalNote);
            setClientSecret(clientSecret);
        } catch (error) {
            console.log(error);
        }
    }, 0.9 * 1000), []);

    return (
        <>
            {props.paymentType != '' &&
                <h2>{t('Cart.Order.Title')}</h2>}
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