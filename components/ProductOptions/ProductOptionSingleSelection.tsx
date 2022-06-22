import { Grid, Radio, RadioGroup, Typography } from "@mui/material";
import { AlabarraProductOptionSingleSelection, AlabarraProductOptionSingleSelectionSelectedValue } from "alabarra-types";
import React, { useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { CurrencyNumberFormat } from "../../lib/helper";

type ProductOptionSingleSelectionProps = {
    index: number;
    productOption: AlabarraProductOptionSingleSelection;
    selectedOption: AlabarraProductOptionSingleSelectionSelectedValue;
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
                <Grid container spacing={0} justifyContent='space-between' alignItems='stretch'>
                {props.productOption.possible_values.map((possible_value, index) => {

                    return (
                        <React.Fragment key={index}>   
                            <Grid item>
                                <Radio value={possible_value.title} onChange={handleChange} size='small'/>
                                <Typography variant='body2' display='inline'>{possible_value.title}</Typography>
                            </Grid>
                            <Grid item flexDirection='column' justifyContent='center' display='flex'>
                                {possible_value.price_adjustment != 0 &&
                                    (<Typography variant='body2' >
                                        + <NumberFormat value={possible_value.price_adjustment} displayType='text' {...CurrencyNumberFormat} />
                                    </Typography>)}
                            </Grid>
                        </React.Fragment>
                    );
                })}
                </Grid>
            </RadioGroup>
        </>
    );
}

export default ProductOptionSingleSelection