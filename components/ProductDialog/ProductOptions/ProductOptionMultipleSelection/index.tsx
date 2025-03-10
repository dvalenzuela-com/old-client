import { Typography, Stack } from '@mui/material';
import {
  ABProductOptionMultipleSelection,
  ABProductOptionMultipleSelectedValues,
} from '@Alabarra/alabarra-types';
import React, { useEffect, useState } from 'react';
import { useBusinessConfig } from '@Context/BusinessConfigContext';
import ProductOptionMultipleSelectionLine from './ProductOptionMultipleSelectionLine';

type ProductOptionMultipleSelectionProps = {
  index: number;
  productOption: ABProductOptionMultipleSelection;
  selectedValues?: ABProductOptionMultipleSelectedValues;
  onOptionChange: (selectedValues: ABProductOptionMultipleSelectedValues) => void;
};

const ProductOptionMultipleSelection = (props: ProductOptionMultipleSelectionProps) => {
  const businessConfig = useBusinessConfig();

  const [checkedOptions, setCheckedOptions] = useState<string[]>(
    props.selectedValues != undefined
      ? props.selectedValues.selected_values
      : props.productOption.default_values
  );
  const [disabledOptions, setDisabledOptions] = useState<boolean[]>([]);

  useEffect(() => {
    const newCheckedOptions =
      props.selectedValues != undefined
        ? props.selectedValues.selected_values
        : props.productOption.default_values;
    setCheckedOptions(newCheckedOptions);
    // Initialize an empty array
    calculateDisabledOptions(newCheckedOptions);
  }, [props.productOption, props.selectedValues]);

  const calculateDisabledOptions = (checkedOptions: string[]) => {
    const checkedOptionCount = checkedOptions.length;
    // If we already reached the number of options, disable non-checked checkboxes
    if (
      props.productOption.max_selection &&
      checkedOptionCount >= props.productOption.max_selection
    ) {
      const newDisabledOptions = props.productOption.possible_values.map((disabled, index) => {
        const possibleValueForIndex = props.productOption.possible_values[index];
        return !checkedOptions.includes(possibleValueForIndex.id);
      });
      setDisabledOptions(newDisabledOptions);
    } else {
      // Enable all
      setDisabledOptions(props.productOption.possible_values.map(() => false));
    }
  };

  const handleChange = (checked: boolean, id: string) => {
    const newCheckedOptions = [...checkedOptions];

    if (checked && !newCheckedOptions.includes(id)) {
      newCheckedOptions.push(id);
      setCheckedOptions(newCheckedOptions);
      calculateDisabledOptions(newCheckedOptions);

      props.onOptionChange({
        option_id: props.productOption.id,
        selected_values: newCheckedOptions,
      });
    }
    if (!checked && newCheckedOptions.includes(id)) {
      const positionOfId = newCheckedOptions.findIndex((obj) => obj === id);
      newCheckedOptions.splice(positionOfId, 1);
      setCheckedOptions(newCheckedOptions);
      calculateDisabledOptions(newCheckedOptions);

      props.onOptionChange({
        option_id: props.productOption.id,
        selected_values: newCheckedOptions,
      });
    }
  };

  return (
    <>
      <Typography display='inline'>{props.productOption.title}</Typography>
      {props.productOption.min_selection > 0 && (
        <Typography variant='body2' display='inline'>
          {`* (min: ${props.productOption.min_selection}, max: ${props.productOption.max_selection})`}
        </Typography>
      )}
      <Stack>
        {props.productOption.possible_values.map((possible_value, index) => (
          <ProductOptionMultipleSelectionLine
            key={possible_value.id}
            id={possible_value.id}
            title={possible_value.title}
            price={possible_value.price_adjustment}
            businessConfig={businessConfig}
            disabled={disabledOptions[index]}
            checked={checkedOptions.includes(possible_value.id)}
            onChange={handleChange}
          />
        ))}
      </Stack>
    </>
  );
};

export default ProductOptionMultipleSelection;
