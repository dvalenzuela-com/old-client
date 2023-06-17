import CurrencyText from '@Components/CurrencyText/CurrencyText';
import { ABBusinessConfig } from '@Alabarra/alabarra-types';
import { Box, Checkbox, Stack, Typography } from '@mui/material';

type ProductOptionMultipleSelectionLineProps = {
  id: string;
  checked?: boolean;
  disabled?: boolean;
  title: string;
  price: number;
  businessConfig: ABBusinessConfig;
  onChange: (checked: boolean, id: string) => void;
};

const ProductOptionMultipleSelectionLine = (props: ProductOptionMultipleSelectionLineProps) => (
  <Stack direction='row' alignItems='center' justifyContent='space-between'>
    <Box>
      <Checkbox
        onChange={(e) => props.onChange(e.target.checked, props.id)}
        checked={props.checked}
        disabled={props.disabled}
        size='small'
      />
      <Typography variant='body2' display='inline'>
        {props.title}
      </Typography>
    </Box>
    <Box textAlign='right'>
      {props.price > 0 && (
        <Typography variant='body2'>
          +<CurrencyText value={props.price} businessConfig={props.businessConfig} />
        </Typography>
      )}
      {props.price < 0 && (
        <Typography variant='body2'>
          <CurrencyText value={props.price} businessConfig={props.businessConfig} />
        </Typography>
      )}
    </Box>
  </Stack>
);

export default ProductOptionMultipleSelectionLine;
