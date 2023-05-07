import { RadioGroup, Stack, Typography } from "@mui/material";
import { ABProductOptionSingleSelection, ABProductOptionSingleSelectedValue } from "@Alabarra/alabarra-types";
import React, { useEffect, useState } from "react";
import { useBusinessConfig } from "@Context/BusinessConfigContext";
import ProductOptionSingleSelectionLine from "./ProductOptionSingleSelectionLine";

type ProductOptionSingleSelectionProps = {
    index: number;
    productOption: ABProductOptionSingleSelection;
    selectedOption?: ABProductOptionSingleSelectedValue;
    onOptionChange: (selectedOption: ABProductOptionSingleSelectedValue) => void;
}

const ProductOptionSingleSelection = (props: ProductOptionSingleSelectionProps) => {

    const { index, productOption, selectedOption, onOptionChange } = props
    const businessConfig = useBusinessConfig();
    const [selectedValue, setSelectedValue] = useState<string>(selectedOption != undefined ? selectedOption.selected_value : props.productOption.default_value);

    useEffect(() => {
        setSelectedValue(selectedOption != undefined ? selectedOption.selected_value : productOption.default_value);
    }, [selectedOption]);

    const handleChange = (selectedId: string) => {
        setSelectedValue(selectedId);

        const selectedPossibleValue = productOption.possible_values.find(possibleValue => { return possibleValue.id === selectedId})!;
        onOptionChange({option_id: productOption.id, selected_value: selectedPossibleValue.id});
    }

    return (
        <>
            <Typography>{productOption.title}</Typography>
            <RadioGroup value={selectedValue}>
                <Stack>
                    {productOption.possible_values.map((possible_value) => (
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
