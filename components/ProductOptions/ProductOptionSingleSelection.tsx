import { Grid, Radio, RadioGroup, Typography } from "@mui/material";
import { ABProductOptionSingleSelection, ABProductOptionSingleSelectionSelectedValue } from "@dvalenzuela-com/alabarra-types";
import React, { useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { CurrencyNumberFormat } from "@Lib/helper";
import { red } from "@mui/material/colors";
import { Box } from "@mui/system";

type ProductOptionSingleSelectionProps = {
    index: number;
    productOption: ABProductOptionSingleSelection;
    selectedOption: ABProductOptionSingleSelectionSelectedValue;
    onOptionChange: (selectedOption: string) => void;
}

const ProductOptionSingleSelection = (props: ProductOptionSingleSelectionProps) => {

    const [selectedValue, setSelectedValue] = useState('');

    useEffect(() => {
        setSelectedValue(props.selectedOption != undefined ? props.selectedOption : (props.productOption.default_value ? props.productOption.default_value : ''));
    }, [props.productOption, props.selectedOption]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
        
        props.onOptionChange(event.target.value);
    }

    return (
        <>
            <Typography>{props.productOption.title}</Typography>
            <RadioGroup value={selectedValue}>
                <Grid container spacing={0} >
                {props.productOption.possible_values.map((possible_value, index) => {

                    return (
                        <Grid item xs={12}>
                            <Grid container alignItems="stretch" justifyContent="space-between">
                                <Grid item sx={{display: "flex", justifyContent: "center", alignItems: "center"}} >
                                    <Box>
                                        <Radio value={possible_value.title} onChange={handleChange} size='small' />
                                    </Box>
                                    {/* //TODO: Fix layout when title too long  */}
                                    <Box>
                                        <Typography variant='body2' display='inline'>{possible_value.title}</Typography>
                                    </Box>
                                </Grid>
                                <Grid item  sx={{display: "flex", alignItems: "center"}}>
                                    {possible_value.price_adjustment != 0 &&
                                            (<Typography variant='body2'>
                                                {possible_value.price_adjustment > 0 ? "+" : "-"}&nbsp;
                                                <NumberFormat value={Math.abs(possible_value.price_adjustment)} displayType='text' {...CurrencyNumberFormat} />
                                            </Typography>)}
                                </Grid>
                            </Grid>

                        </Grid>
                        
                    );
                })}
                </Grid>
            </RadioGroup>
        </>
    );
}

export default ProductOptionSingleSelection

/*

<Grid container key={index} alignItems="stretch">   
    <Grid item>
        <Radio value={possible_value.title} onChange={handleChange} size='small'/>
        <Typography variant='body2' display='inline'>{possible_value.title}</Typography>
    </Grid>
    <Grid item>
        {possible_value.price_adjustment != 0 &&
            (<Typography variant='body2' sx={{height: 38}}>
                + <NumberFormat value={possible_value.price_adjustment} displayType='text' {...CurrencyNumberFormat} />
            </Typography>)}
    </Grid>
</Grid>

*/