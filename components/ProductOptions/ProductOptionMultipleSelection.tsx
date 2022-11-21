import { Checkbox, Grid, Typography } from "@mui/material";
import { ABProductOptionMultipleSelection, ABProductOptionMultipleSelectedValues } from "@dvalenzuela-com/alabarra-types";
import React, { useContext, useEffect, useState } from "react";
import CurrencyText from "@Components/CurrencyText";
import { BusinessConfigContext } from "@Context/BusinessConfigContext";
import { Box, Stack } from "@mui/system";

type ProductOptionMultipleSelectionProps = {
    index: number;
    productOption: ABProductOptionMultipleSelection;
    selectedValues?: ABProductOptionMultipleSelectedValues;
    onOptionChange: (selectedValues: ABProductOptionMultipleSelectedValues) => void;
}

const ProductOptionMultipleSelection = (props: ProductOptionMultipleSelectionProps) => {

    const businessConfig = useContext(BusinessConfigContext);
    
    const [checkedOptions, setCheckedOptions] = useState<ABProductOptionMultipleSelectedValues>(props.selectedValues != undefined ? props.selectedValues : props.productOption.default_values);
    const [disabledOptions, setDisabledOptions] = useState<boolean[]>([]);

    useEffect(() => {
        const newCheckedOptions = props.selectedValues != undefined ? props.selectedValues : props.productOption.default_values;
        setCheckedOptions(newCheckedOptions);
        // Initialize an empty array
        calculateDisabledOptions(props.selectedValues != undefined ? props.selectedValues : props.productOption.default_values);
    }, [props.productOption, props.selectedValues]);


    const calculateDisabledOptions = (checkedOptions: ABProductOptionMultipleSelectedValues) => {
        const checkedOptionCount = checkedOptions.length;
        
        // If we already reached the number of options, disable non-checked checkboxes
        if (props.productOption.max_selection && 
            checkedOptionCount >= props.productOption.max_selection) {

            const newDisabledOptions = props.productOption.possible_values.map((disabled, index) => {
                const possibleValueForIndex = props.productOption.possible_values[index];
                return !checkedOptions.includes(possibleValueForIndex.id);
            });
            setDisabledOptions(newDisabledOptions);
        } else {
            // Enable all
            setDisabledOptions(props.productOption.possible_values.map(() => { return false }));
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {

        let newCheckedOptions = [...checkedOptions];

        if (event.target.checked && !newCheckedOptions.includes(id)) {
            newCheckedOptions.push(id);
            setCheckedOptions(newCheckedOptions);
            calculateDisabledOptions(newCheckedOptions);
            props.onOptionChange(newCheckedOptions);
        }
        if (!event.target.checked && newCheckedOptions.includes(id)) {
            const positionOfId = newCheckedOptions.findIndex((obj) => obj === id);
            newCheckedOptions.splice(positionOfId, 1);
            setCheckedOptions(newCheckedOptions);
            calculateDisabledOptions(newCheckedOptions);
            props.onOptionChange(newCheckedOptions);
        }
    }

    return (
        <>
            <Typography display='inline'>{props.productOption.title}</Typography>
            {props.productOption.min_selection > 0 &&
                <Typography variant="body2" display='inline'>{`* (min: ${props.productOption.min_selection}, max: ${props.productOption.max_selection})`}</Typography>
            }
            <Grid container spacing={0} justifyContent='space-between' alignItems='stretch'>

            {props.productOption.possible_values.map((possible_value, index) => {

                return (
                    <React.Fragment key={index}>   
                        <Grid item xs={12}>
                            <Stack direction='row' alignItems='center' justifyContent="space-between">
                                <Box>
                                    <Checkbox
                                        onChange={(e) => (handleChange(e, possible_value.id))}
                                        checked={checkedOptions.includes(possible_value.id)}
                                        disabled={disabledOptions[index]}
                                        size='small' />
                                    <Typography variant='body2' display='inline'>{possible_value.title}</Typography>
                                </Box>
                                <Box textAlign='right'>
                                    {possible_value.price_adjustment != 0 &&
                                    (<Typography variant='body2' >
                                        + <CurrencyText value={possible_value.price_adjustment} businessConfig={businessConfig} />
                                    </Typography>)}
                                </Box>
                            </Stack>
                        </Grid>
                    </React.Fragment>
                );
            })}
            </Grid>
        </>
    );
}

export default ProductOptionMultipleSelection