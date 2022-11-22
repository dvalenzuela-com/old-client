import { Box, Radio, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { PaymentTypes } from "./PaymentTypeSelection";

type PaymentTypeSelectionOptionProps = {
    paymentType: PaymentTypes;
    onChange: (newPaymentType: PaymentTypes) => void;
}

const PaymentTypeSelectionOption = (props: PaymentTypeSelectionOptionProps) => {

    const { t } = useTranslation();

    return (
        <>
            <Radio value={props.paymentType} onChange={(e) => {props.onChange(e.target.value as PaymentTypes)}} />
            <Typography>
                {props.paymentType === 'presential' &&
                    <>
                        <Box display='inline' fontWeight='bold' component='span'>{t('Cart.PaymentMethod.Presential.Title')}</Box>
                        {t('Cart.PaymentMethod.Presential.Subtitle')}
                    </>
                }
                {props.paymentType === 'digital' &&
                    <>
                        <Box display='inline' fontWeight='bold' component='span'>{t('Cart.PaymentMethod.Digital.Title')}</Box>
                        {t('Cart.PaymentMethod.Digital.Subtitle')}
                    </>
                }
                
            </Typography>
        </>
    );
}

export default PaymentTypeSelectionOption;