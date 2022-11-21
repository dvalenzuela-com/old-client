import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { ABProduct, ABProductOption, ABProductOptionMultipleSelection, ABProductOptionMultipleSelectedValues, ABProductOptionSelections, ABProductOptionSingleSelection, ABProductOptionSingleSelectedValue, ABProductOptionsType } from "@dvalenzuela-com/alabarra-types";
import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "@Context/CartContext";
import ProductDialogButton from "./ProductDialogButton";
import ProductOptionMultipleSelection from "./ProductOptions/ProductOptionMultipleSelection";
import ProductOptionSingleSelection from "./ProductOptions/ProductOptionSingleSelection";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

export enum ProductDialogMode {
    NewLine,
    EditLine
}

export type ProductDialogProps = {
    mode: ProductDialogMode;
    product: ABProduct;

    lineId?: string;
    quantity: number;
    options?: ABProductOptionSelections[];
    comment: string | null;
    onClose: () => void;
}
const ProductDialog = (props: ProductDialogProps) => {

    const {enqueueSnackbar} = useSnackbar();
    const { t } = useTranslation();

    const cart = useContext(CartContext);

    const [selectedOptions, setSelectedOptions] = useState<ABProductOptionSelections[]>([]);
    const [addToCartDisabled, setAddToCartDisabled] = useState<boolean>(false);
    const [comment, setComment] = useState<string>('');
    const [selectedQuantity, setSelectedQuantity] = useState<number>(props.quantity ?? 0);

    useEffect(() => {
        // Show saved comment if available
        setComment(props.comment != null ? props.comment : '');

    }, [props.comment]);

    useEffect(() => {
        const newOptions = props.options ?? [];
        setSelectedOptions(newOptions);

        // Check if there are mandatory options. If so, deactivate the add to cart button
        handleAddToCartDisabled(props.product.options, newOptions);

    }, [props.product, props.options]);


    const handleAddToCartDisabled = (productOptions: ABProductOption[], selectedOptions: ABProductOptionSelections[]) => {
        let addToCartButtonStartsDisabled = false;

        productOptions.forEach((option, index) => {
            if (option.type == ABProductOptionsType.SINGLE_SELECTION) {
                // Single options always contain a default value, therefore do not need a mandatory check
            } else if (option.type == ABProductOptionsType.MULTIPLE_SELECTION) {
                const multipleOption = option as ABProductOptionMultipleSelection;
                const currentSelectedOption = selectedOptions.find(obj => obj.option_id === option.id);

                // If we have a minimum selection, which in turn is higher as the default values, deactivate the button
                if (multipleOption.min_selection > 0) {
                    if (currentSelectedOption) {
                        const multipleSelection = currentSelectedOption as ABProductOptionMultipleSelectedValues;
                        if (multipleSelection.selected_values.length < multipleOption.min_selection) {
                            addToCartButtonStartsDisabled = true;
                        }
                    }
                }
            }
        });

        setAddToCartDisabled(addToCartButtonStartsDisabled);
    }

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    }

    const handleClose = () => {
        props.onClose();
    }

    const handleDecreaseProductCount = () => {

        if (props.mode == ProductDialogMode.NewLine) {
            if (selectedQuantity > 1) {
                setSelectedQuantity(selectedQuantity - 1);
            }
        } else if (props.mode == ProductDialogMode.EditLine) {
            if (selectedQuantity > 0) {
                setSelectedQuantity(selectedQuantity - 1);
            }
        }
    }

    const handleIncreaseProductCount = () => {
        setSelectedQuantity(selectedQuantity + 1);
    }

    const handleAddToOrder = () => {
        if (!props.product) {
            return
        }

        if (props.mode == ProductDialogMode.NewLine) {
            const trimmedComment = comment.trim();
            cart.addProduct(props.product, selectedQuantity, selectedOptions, trimmedComment == '' ? null : trimmedComment);
            enqueueSnackbar(`${selectedQuantity} x ${props.product.title} added to the cart`, {variant: 'success'});

        } else if (props.mode == ProductDialogMode.EditLine && props.lineId != undefined) {
            const trimmedComment = comment.trim();

            cart.editLineWithId(props.lineId, props.product, selectedQuantity, selectedOptions, trimmedComment == '' ? null : trimmedComment);
            
            if (selectedQuantity == 0) {
                enqueueSnackbar(t('ProductDialog.Snackbar.ProductRemoved'), {variant: 'success'});
            } else {
                enqueueSnackbar(t('ProductDialog.Snackbar.OrderLineUpdated'), {variant: 'success'});
            }
        }

        handleClose();
    }

    const handleOptionChange = (selectedOption: ABProductOptionSelections) => { 

        const indexOfOption = selectedOptions.findIndex(obj => obj.option_id === selectedOption.option_id);
        
        const newSelectedOptions = [...selectedOptions];

        if (indexOfOption >= 0) {
            // The option was there already. replace it with a new one.
            newSelectedOptions.splice(indexOfOption, 1, selectedOption);
        } else {
            // The option was no there. Add it.
            newSelectedOptions.push(selectedOption);
        }
        setSelectedOptions(newSelectedOptions);
        handleAddToCartDisabled(props.product.options!, newSelectedOptions);
    }

    const selectedValuesForOption = (optionId: string) => {
        const result = selectedOptions.find(obj => obj.option_id === optionId);
        return result;
    }
    return (
        <>
            {props.product &&
                <Dialog open={true} onClose={handleClose}>

                        <DialogTitle>{props.product.title}</DialogTitle>
                        <DialogContent>
                            <img src={props.product.image_url} width='100%'/>
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
                                            selectedOption={selectedValuesForOption(option.id) as ABProductOptionSingleSelectedValue}
                                            onOptionChange={(selectedOption) => {handleOptionChange(selectedOption)}}
                                        />
                                    );
                                } else if (option.type == ABProductOptionsType.MULTIPLE_SELECTION) {
                                    return (
                                        <ProductOptionMultipleSelection
                                            key={index}
                                            index={index}
                                            productOption={option as ABProductOptionMultipleSelection}
                                            selectedValues={selectedValuesForOption(option.id) as ABProductOptionMultipleSelectedValues}
                                            onOptionChange={(selectedOption) => {handleOptionChange(selectedOption)}}
                                        />
                                    );
                                }       
                            })}

                            <TextField label={t('ProductCard.CommentPlaceholder')} multiline maxRows={4} value={comment} onChange={handleCommentChange} fullWidth />
    
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDecreaseProductCount}>-</Button>{selectedQuantity}<Button onClick={handleIncreaseProductCount}>+</Button>
                            <Button onClick={handleAddToOrder} disabled={addToCartDisabled}>

                                <ProductDialogButton
                                    mode={props.mode}
                                    product={props.product}
                                    selectedOptions={selectedOptions}
                                    selectedQuantity={selectedQuantity}
                                />
                            </Button>
                        </DialogActions>
                </Dialog>
            }
        </>
    )
}

export default ProductDialog;
