import { Grid, Radio, RadioGroup, Typography } from "@mui/material";
import { ABProductOptionSingleSelection, ABProductOptionSingleSelectedValue } from "@dvalenzuela-com/alabarra-types";
import React, { useContext, useEffect, useState } from "react";
import { Box } from "@mui/system";
import CurrencyText from "@Components/CurrencyText";
import { BusinessConfigContext } from "@Context/BusinessConfigContext";

type ProductOptionSingleSelectionProps = {
    index: number;
    productOption: ABProductOptionSingleSelection;
    selectedOption?: ABProductOptionSingleSelectedValue;
    onOptionChange: (selectedOption: ABProductOptionSingleSelectedValue) => void;
}

const ProductOptionSingleSelection = (props: ProductOptionSingleSelectionProps) => {

    const businessConfig = useContext(BusinessConfigContext);
    const [selectedValue, setSelectedValue] = useState<string>(props.selectedOption != undefined ? props.selectedOption.selected_value : props.productOption.default_value);
    
    useEffect(() => {
        setSelectedValue(props.selectedOption != undefined ? props.selectedOption.selected_value : props.productOption.default_value);
    }, [props.selectedOption]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedId = event.target.value;
        console.log(selectedId);
        setSelectedValue(selectedId);
        
        const selectedPossibleValue = props.productOption.possible_values.find(possibleValue => { return possibleValue.id === selectedId})!;
        props.onOptionChange({option_id: props.productOption.id, selected_value: selectedPossibleValue.id});
    }

    return (
        <>
            <Typography>{props.productOption.title}</Typography>
            <RadioGroup value={selectedValue}>
                <Grid container spacing={0} >
                {props.productOption.possible_values.map((possible_value, index) => {

                    return (
                        <Grid item xs={12} key={index}>
                            <Grid container alignItems="stretch" justifyContent="space-between">
                                <Grid item sx={{display: "flex", justifyContent: "center", alignItems: "center"}} >
                                    <Box>
                                        <Radio value={possible_value.id} onChange={handleChange} size='small' />
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
                                                <CurrencyText value={Math.abs(possible_value.price_adjustment)} businessConfig={businessConfig} />
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

export default ProductOptionSingleSelection;
