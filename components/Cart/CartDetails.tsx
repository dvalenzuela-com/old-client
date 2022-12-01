import PaymentTypeSelection, { PaymentTypes } from "@Components/PaymentTypeSelection"
import { useCart } from "@Context/CartContext";
import { Alert, Autocomplete, TextField } from "@mui/material"
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

type CartDetailsProps = {

    storeOpen: boolean;

    tableIds: string[];
    selectedTable: string | null;
    customerName: string;
    generalNote: string;

    paymentType: PaymentTypes | '';

    canPayWithStripe: boolean;

    onTableSelection: (selectedTableId: string | null) => void;
    onCustomerNameChange: (newCustomerName: string) => void;
    onGeneralNoteChange: (newGeneralNote: string) => void;
    onChangePaymentType: (newPaymentType: PaymentTypes) => void;
}

const CartDetails = (props: CartDetailsProps) => {

    const { t } = useTranslation();

	const cart = useCart();

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
            {!props.storeOpen && 
                <Alert severity='warning'>The store is closed</Alert>}
            {props.storeOpen &&
                <>
                    <PaymentTypeSelection
                        selectedPaymentType={props.paymentType as PaymentTypes}
                        canPayWithStripe={props.canPayWithStripe}
                        onChange={props.onChangePaymentType}
                        disabled={!(props.storeOpen && props.selectedTable != null && props.customerName.trim().length > 0)} />
                </>
            }
        </>
    );
}

export default CartDetails;
