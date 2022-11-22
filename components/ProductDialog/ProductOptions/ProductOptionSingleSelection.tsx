import { RadioGroup, Stack, Typography } from "@mui/material";
import { ABProductOptionSingleSelection, ABProductOptionSingleSelectedValue } from "@dvalenzuela-com/alabarra-types";
import React, { useContext, useEffect, useState } from "react";
import { BusinessConfigContext } from "@Context/BusinessConfigContext";
import ProductOptionSingleSelectionLine from "./ProductOptionSingleSelectionLine";

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

    const handleChange = (selectedId: string) => {
        setSelectedValue(selectedId);

        const selectedPossibleValue = props.productOption.possible_values.find(possibleValue => { return possibleValue.id === selectedId})!;
        props.onOptionChange({option_id: props.productOption.id, selected_value: selectedPossibleValue.id});
    }

    return (
        <>
            <Typography>{props.productOption.title}</Typography>
            <RadioGroup value={selectedValue}>
                <Stack>
                    {props.productOption.possible_values.map((possible_value) => (
                            <ProductOptionSingleSelectionLine
                                key={possible_value.id}
                                id={possible_value.id}
                                title={possible_value.title}
                                price={possible_value.price_adjustment}
                                businessConfig={businessConfig}
                                onChange={handleChange} />
                    ))}
                </Stack>
            </RadioGroup>
        </>
    );
}

export default ProductOptionSingleSelection;
