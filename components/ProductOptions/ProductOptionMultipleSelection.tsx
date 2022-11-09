import { Checkbox, Grid, Typography } from "@mui/material";
import { ABProductOptionMultipleSelection, ABProductOptionMultipleSelectionSelectedValues } from "@dvalenzuela-com/alabarra-types";
import React, { useContext, useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import CurrencyText from "@Components/CurrencyText";
import { BusinessConfigContext } from "@Context/BusinessConfigContext";

type ProductOptionMultipleSelectionProps = {
    index: number;
    productOption: ABProductOptionMultipleSelection;
    selectedValues: ABProductOptionMultipleSelectionSelectedValues;
    onOptionChange: (selectedValues: ABProductOptionMultipleSelectionSelectedValues) => void;
}

const ProductOptionMultipleSelection = (props: ProductOptionMultipleSelectionProps) => {

    const businessConfig = useContext(BusinessConfigContext);
    
    const [checkedOptions, setCheckedOptions] = useState<ABProductOptionMultipleSelectionSelectedValues>([]);
    const [disabledOptions, setDisabledOptions] = useState<boolean[]>([]);

    useEffect(() => {
        const newCheckedOptions = props.selectedValues != undefined ? props.selectedValues : props.productOption.default_values;
        setCheckedOptions(newCheckedOptions);
        // Initialize an empty array
        calculateDisabledOptions(newCheckedOptions);
    }, [props.productOption, props.selectedValues]);


    const calculateDisabledOptions = (checkedOptions: boolean[]) => {
        const checkedOptionCount = checkedOptions.reduce(((sum, option) => sum + (option ? 1 : 0)), 0);
        
        // If we already reached the number of options, disable non-checked checkboxes
        if (props.productOption.max_selection && 
            checkedOptionCount >= props.productOption.max_selection) {
            const newDisabledOptions = checkedOptions.map((option, index) => {
                return !option;
            })
            setDisabledOptions(newDisabledOptions);
        } else {
            // Enable all
            setDisabledOptions(props.productOption.default_values.map(() => { return false }));
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {

        let newCheckedOptions = checkedOptions;

        newCheckedOptions[index] = event.target.checked;
        setCheckedOptions(newCheckedOptions);

        calculateDisabledOptions(newCheckedOptions);

        props.onOptionChange(newCheckedOptions);
    }

    return (
        <>
            <Typography display='inline'>{props.productOption.title}</Typography>
            {props.productOption.min_selection > 0 &&
                <Typography variant="body2" display='inline'>{`* (min. ${props.productOption.min_selection})`}</Typography>
            }
            <Grid container spacing={0} justifyContent='space-between' alignItems='stretch'>

            {props.productOption.possible_values.map((possible_value, index) => {

                return (
                    <React.Fragment key={index}>   
                        <Grid item>
                            <Checkbox onChange={(e) => (handleChange(e, index))} checked={checkedOptions[index] ?? false} disabled={disabledOptions[index]} size='small' />
                            {/* TODO: Disable typography */}
                            <Typography variant='body2' display='inline'>{possible_value.title}</Typography>
                        </Grid>
                        <Grid item flexDirection='column' justifyContent='center' display='flex'>
                            {possible_value.price_adjustment != 0 &&
                                (<Typography variant='body2' >
                                    + <CurrencyText value={possible_value.price_adjustment} businessConfig={businessConfig} />
                                </Typography>)}
                        </Grid>
                    </React.Fragment>
                );
            })}
            </Grid>
        </>
    );
}

export default ProductOptionMultipleSelection