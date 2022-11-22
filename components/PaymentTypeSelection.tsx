import { List, ListItem, RadioGroup } from "@mui/material";
import PaymentTypeSelectionOption from "./PaymentTypeSelectionOption";

export type PaymentTypes = 'presential' | 'digital';

type PaymentTypeSelectionProps = {
    selectedPaymentType: PaymentTypes;
    canMakeDigitalPayments: boolean;
    onChange: (newPaymentType: PaymentTypes) => void;
}

const PaymentTypeSelection = (props: PaymentTypeSelectionProps) => {
    return (
        <RadioGroup value={props.selectedPaymentType}>
            <List>
                <ListItem disablePadding={true}>
                    <PaymentTypeSelectionOption
                        paymentType='presential'
                        onChange={props.onChange} />
                </ListItem>
                {props.canMakeDigitalPayments &&
                    <ListItem disablePadding={true}>
                    <PaymentTypeSelectionOption
                        paymentType='digital'
                        onChange={props.onChange} />
                    </ListItem>
                }
            </List>
        </RadioGroup>
    );
}

export default PaymentTypeSelection;