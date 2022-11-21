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
        
        // Show saved quantity if available
        //setSelectedQuantity(props.quantity);

        // Show saved options if available, otherwise default options if defined
        const updatedOptions = props.product.options.map( (option, index) => { 

            if (option.type == ABProductOptionsType.SINGLE_SELECTION) {
                const singleOption = option as ABProductOptionSingleSelection;
                if (props.options && props.options[index]) {
                    return props.options[index];
                } else {
                    return singleOption.default_value;
                }
            } else if (option.type == ABProductOptionsType.MULTIPLE_SELECTION) {
                const multipleOption = option as ABProductOptionMultipleSelection;
                if (props.options && props.options[index]) {
                    return props.options[index];
                } else {
                    return multipleOption.default_values;
                }
            }
        }) as ABProductOptionSelections[];

        setSelectedOptions(updatedOptions);

        // Check if there are mandatory options. If so, deactivate the add to cart button
        handleAddToCartDisabled(props.product.options, updatedOptions);

    }, [props.product, props.options, props.quantity, props.comment]);


    const handleAddToCartDisabled = (productOptions: ABProductOption[], selectedOptions: ABProductOptionSelections[]) => {
        let addToCartButtonStartsDisabled = false;
        productOptions.forEach( (option, index) => {
            if (option.type == ABProductOptionsType.SINGLE_SELECTION) {
                // Single options always contain a default value, therefore do not need a mandatory check
                const singleOption = option as ABProductOptionSingleSelection;
                const currentSelectedOption = selectedOptions[index] as ABProductOptionSingleSelectedValue;
                // Nothing to do here :) 
            } else if (option.type == ABProductOptionsType.MULTIPLE_SELECTION) {
                const multipleOption = option as ABProductOptionMultipleSelection;
                const currentSelectedOption = selectedOptions[index] as ABProductOptionMultipleSelectedValues;

                // If we have a minimum selection, which in turn is higher as the default values, deactivate the button
                if (multipleOption.min_selection > 0) {

                    if (currentSelectedOption && currentSelectedOption.selected_values.length < multipleOption.min_selection) {
                        addToCartButtonStartsDisabled = true;
                    } 
                }   

                // If we have selected
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

    const handleOptionChange = (optionIndex: number, selectedOption: ABProductOptionSelections) => { 

        const newSelectedOptions = selectedOptions.map((oldSelectedOption, index) => {
            if (index == optionIndex) {
                return selectedOption;
            } else {
                return oldSelectedOption;
            }
        });
        setSelectedOptions(newSelectedOptions);
        //console.log("newSelectedOptions", newSelectedOptions);
        handleAddToCartDisabled(props.product.options!, newSelectedOptions);
    }

    const selectedValuesForOption = (optionId: string) => {
        const result = selectedOptions.find(obj => obj.option_id === optionId);
        //console.log(`selectedValuesForOption(${optionId})`, result);
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
                                            onOptionChange={(selectedOption) => {handleOptionChange(index, selectedOption)}}
                                        />
                                    );
                                } else if (option.type == ABProductOptionsType.MULTIPLE_SELECTION) {
                                    return (
                                        <ProductOptionMultipleSelection
                                            key={index}
                                            index={index}
                                            productOption={option as ABProductOptionMultipleSelection}
                                            selectedValues={selectedValuesForOption(option.id) as ABProductOptionMultipleSelectedValues}
                                            onOptionChange={(selectedOption) => {handleOptionChange(index, selectedOption)}}
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
