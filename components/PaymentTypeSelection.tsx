import { List, ListItem, RadioGroup } from '@mui/material';
import PaymentTypeSelectionOption from './PaymentTypeSelectionOption';

export enum PaymentTypes {
  PRESENTIAL = 'PRESENTIAL',
  DIGITAL = 'DIGITAL',
}

type PaymentTypeSelectionProps = {
  selectedPaymentType: PaymentTypes;
  canPayWithStripe: boolean;
  disabled?: boolean;
  onChange: (newPaymentType: PaymentTypes) => void;
};

const PaymentTypeSelection = (props: PaymentTypeSelectionProps) => (
  <RadioGroup value={props.selectedPaymentType}>
    <List>
      <ListItem disablePadding={true}>
        <PaymentTypeSelectionOption
          paymentType={PaymentTypes.PRESENTIAL}
          onChange={props.onChange}
          disabled={props.disabled}
        />
      </ListItem>
      {props.canPayWithStripe && (
        <ListItem disablePadding={true}>
          <PaymentTypeSelectionOption
            paymentType={PaymentTypes.DIGITAL}
            onChange={props.onChange}
            disabled={props.disabled}
          />
        </ListItem>
      )}
    </List>
  </RadioGroup>
);

export default PaymentTypeSelection;
