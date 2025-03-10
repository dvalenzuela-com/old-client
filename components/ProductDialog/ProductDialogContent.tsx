import ProductOptionMultipleSelection from '@Components/ProductDialog/ProductOptions/ProductOptionMultipleSelection';
import ProductOptionSingleSelection from '@Components/ProductDialog/ProductOptions/ProductOptionSingleSelection';
import {
  ABProduct,
  ABProductOptionsType,
  ABProductOptionSingleSelection,
  ABProductOptionSingleSelectedValue,
  ABProductOptionMultipleSelectedValues,
  ABProductOptionMultipleSelection,
  ABProductOptionSelections,
} from '@Alabarra/alabarra-types';
import { TextField, Typography } from '@mui/material';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

type ProductDialogContentProps = {
  product: ABProduct;
  comment?: string;
  selectedOptions?: ABProductOptionSelections[];
  onOptionChange: (selectedOption: ABProductOptionSelections) => void;
  onCommentChange: (newComment: string) => void;
};

const ProductDialogContent = (props: ProductDialogContentProps) => {
  const { t } = useTranslation();

  const selectedValuesForOption = (optionId: string) => {
    if (!props.selectedOptions) {
      return undefined;
    }
    const result = props.selectedOptions.find((obj) => obj.option_id === optionId);
    return result;
  };

  return (
    <>
      <Image
        src={props.product.image_url}
        alt={props.product.title}
        width='100%'
        height='100%'
        layout='responsive'
        objectFit='contain'
      />
      <br />
      <Typography variant='body1'>{props.product.description}</Typography>
      <br />

      {props.product.options.map((option, index) => {
        if (option.type == ABProductOptionsType.SINGLE_SELECTION) {
          return (
            <ProductOptionSingleSelection
              key={index}
              index={index}
              productOption={option as ABProductOptionSingleSelection}
              selectedOption={
                selectedValuesForOption(option.id) as ABProductOptionSingleSelectedValue
              }
              onOptionChange={props.onOptionChange}
            />
          );
        } else if (option.type == ABProductOptionsType.MULTIPLE_SELECTION) {
          return (
            <ProductOptionMultipleSelection
              key={index}
              index={index}
              productOption={option as ABProductOptionMultipleSelection}
              selectedValues={
                selectedValuesForOption(option.id) as ABProductOptionMultipleSelectedValues
              }
              onOptionChange={props.onOptionChange}
            />
          );
        } else {
          return <></>;
        }
      })}

      <TextField
        label={t('ProductCard.CommentPlaceholder')}
        multiline
        maxRows={4}
        value={props.comment}
        onChange={(e) => {
          props.onCommentChange(e.target.value);
        }}
        fullWidth
      />
    </>
  );
};

export default ProductDialogContent;
