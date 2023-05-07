import CurrencyText from "@Components/CurrencyText/CurrencyText";
import { ABBusinessConfig } from "@Alabarra/alabarra-types";
import { Box, Radio, Stack, Typography } from "@mui/material";

type ProductOptionSingleSelectionLineProps = {
    id: string;
    selected?: boolean;
    disabled?: boolean;
    title: string;
    price: number;
    businessConfig: ABBusinessConfig;
    onChange: (selectedId: string) => void;
}

const ProductOptionSingleSelectionLine = (props: ProductOptionSingleSelectionLineProps) => {
    return (
        <Stack direction='row' alignItems='center' justifyContent="space-between">
            <Box>
                <Radio value={props.id} onChange={(e) => (props.onChange(e.target.value))} size='small' />
                <Typography variant='body2' display='inline'>{props.title}</Typography>
            </Box>
            <Box textAlign='right'>
                {props.price > 0 && 
                    <Typography variant='body2' >+<CurrencyText value={props.price} businessConfig={props.businessConfig} /></Typography>}
                {props.price < 0 &&
                    <Typography variant='body2' ><CurrencyText value={props.price} businessConfig={props.businessConfig} /></Typography>}
            </Box>
        </Stack>
    );
}

export default ProductOptionSingleSelectionLine;