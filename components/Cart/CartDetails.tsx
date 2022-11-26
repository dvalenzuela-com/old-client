import LoadingButton from "@Components/LoadingButton";
import PaymentTypeSelection, { PaymentTypes } from "@Components/PaymentTypeSelection"
import StripeButton from "@Components/StripeButton";
import { CartContext } from "@Context/CartContext";
import { ABBusinessConfig } from "@dvalenzuela-com/alabarra-types";
import { isStoreOpen } from "@Lib/helper";
import { Autocomplete, LinearProgress, TextField } from "@mui/material"
import { ChangeEvent, useContext } from "react";
import { useTranslation } from "react-i18next";

type CartDetailsProps = {

    businessConfig: ABBusinessConfig;

    tableIds: string[];
    selectedTable: string | null;
    customerName: string;
    generalNote: string;

    paymentType: PaymentTypes | '';

    canMakeDigitalPayments: boolean;

    clientSecret: string;

    waitingForManualOrder: boolean;

    onTableSelection: (selectedTableId: string | null) => void;
    onCustomerNameChange: (newCustomerName: string) => void;
    onGeneralNoteChange: (newGeneralNote: string) => void;
    onChangePaymentType: (newPaymentType: PaymentTypes) => void;

    onCreateManualOder: () => void;
    onDigitalPaymentError: (error: any) => void;
    onDigitalPaymentSuccess: () => void;
}

const CartDetails = (props: CartDetailsProps) => {

    const { t } = useTranslation();

	const cart = useContext(CartContext);

    const handleTableSelection = (event: any, newValue: string | null) => {
        props.onTableSelection(newValue);
    }

    const handleCustomerNameChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        //(e) => {setCustomerName(e.target.value)
        props.onCustomerNameChange(e.target.value);
    }
    const handleChangeGeneralNote = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        //(e) => {setCustomerName(e.target.value)
        props.onGeneralNoteChange(e.target.value);
    }

    return (
        <>
            <h2>{t('Cart.SelectTable.Title')}</h2>
            <Autocomplete
                disablePortal
                id="select-table"
                options={props.tableIds}
                value={props.selectedTable}
                onChange={handleTableSelection}
                renderInput={(params) => <TextField {...params} label={t('Cart.SelectTable.Placeholder')} variant="standard" />}
            />
            <h2>{t('Cart.Username.Title')}</h2>
            <TextField
                value={props.customerName} 
                placeholder={t('Cart.Username.Placeholder')}
                onChange={handleCustomerNameChange}
                fullWidth />
            <h2>{t('Cart.GeneralNote.Title')}</h2>
            <TextField
                value={props.generalNote}
                placeholder={t('Cart.GeneralNote.Placeholder')}
                onChange={handleChangeGeneralNote}
                multiline
                fullWidth />
            <h2>{t('Cart.PaymentMethod.Title')}</h2>
            <PaymentTypeSelection
                selectedPaymentType={props.paymentType as PaymentTypes}
                canMakeDigitalPayments={props.canMakeDigitalPayments}
                onChange={props.onChangePaymentType}
                disabled={!isStoreOpen(props.businessConfig)} />
            {props.paymentType != '' &&
                <>
                    <h2>{t('Cart.Order.Title')}</h2>
                    { props.paymentType == "presential" &&
                        <LoadingButton
                            onClick={props.onCreateManualOder}
                            disabled={!(props.selectedTable && props.customerName.trim().length > 0 && isStoreOpen(props.businessConfig))}
                            title={t('Cart.Order.PresentialPaymentButton')}
                            loading={props.waitingForManualOrder}
                            fullWidth/>
                    }
                    { props.paymentType == "digital" && props.clientSecret == '' &&
                        <LinearProgress />
                    }
                    { props.paymentType == "digital" && props.clientSecret != '' && 
                    // TODO: disable when no table is selected
                    // TODO: disable when store closed
                        <StripeButton
                            amount={cart.getCartTotal()}
                            clientSecret={props.clientSecret}
                            onPaymentError={props.onDigitalPaymentError}
                            onPaymentSuccess={props.onDigitalPaymentSuccess} />
                    }
                </>
            }
        </>
    );
}

export default CartDetails;
