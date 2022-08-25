import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { ABProduct, ABProductOption, ABProductOptionMultipleSelection, ABProductOptionMultipleSelectionSelectedValues, ABProductOptionSingleSelection, ABProductOptionSingleSelectionSelectedValue, ABProductOptionsType } from "@dvalenzuela-com/alabarra-types";
import React, { useContext, useEffect, useState } from "react";
import { CartContext, ProductOptionSelection } from "../context/CartContext";
import ProductDialogButton from "./ProductDialogButton";
import ProductOptionMultipleSelection from "./ProductOptions/ProductOptionMultipleSelection";
import ProductOptionSingleSelection from "./ProductOptions/ProductOptionSingleSelection";
import { useSnackbar } from "notistack";

export enum ProductDialogMode {
    NewLine,
    EditLine
}

export type ProductDialogProps = {
    mode: ProductDialogMode;
    lineId?: string;
    product: ABProduct | undefined;
    quantity: number;
    options?: ProductOptionSelection[];
    comment: string | null;
    onClose: () => void;
}
const ProductDialog = (props: ProductDialogProps) => {

    const {enqueueSnackbar} = useSnackbar();

    const cart = useContext(CartContext);

    const [selectedOptions, setSelectedOptions] = useState<ProductOptionSelection[]>([]);
    const [addToCartDisabled, setAddToCartDisabled] = useState<boolean>(false);
    const [comment, setComment] = useState<string>('');
    const [selectedQuantity, setSelectedQuantity] = useState<number>(0);

    useEffect(() => {
        // Show saved comment if available
        setComment(props.comment != null ? props.comment : '');
        
        // Show saved quantity if available
        setSelectedQuantity(props.quantity);

        // Show saved options if available, otherwise default options if defined
        const productOptions = props.product?.options
        if (productOptions) {            
            const updatedOptions = productOptions.map( (option, index) => { 

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
            }) as ProductOptionSelection[];
            setSelectedOptions(updatedOptions);
        } else {
            setSelectedOptions([])
        }

        if (productOptions) {
            // Check if there are mandatory options. If so, deactivate the add to cart button
            handleAddToCartDisabled(productOptions);
        }

    }, [props.product, props.options, props.quantity, props.comment]);


    const handleAddToCartDisabled = (productOptions: ABProductOption[]) => {
        let addToCartButtonStartsDisabled = false;
        productOptions.forEach( (option, index) => {
            if (option.type == ABProductOptionsType.SINGLE_SELECTION) {
                // Single options always contain a default value, therefore do not need a mandatory check
                const singleOption = option as ABProductOptionSingleSelection;
                const currentSelectedOption = selectedOptions[index] as ABProductOptionSingleSelectionSelectedValue;
                // TODO: Bug here. The currentSelectedOption is not being updated "fast enough" and the old/wrong value is compared               
                // if (singleOption.mandatory &&
                //     !singleOption.possible_values.some(possible_value => possible_value.title == currentSelectedOption) &&
                //     !singleOption.default_value) {
                //     addToCartButtonStartsDisabled = true;
                // }
            } else if (option.type == ABProductOptionsType.MULTIPLE_SELECTION) {
                const multipleOption = option as ABProductOptionMultipleSelection;
                const currentSelectedOption = selectedOptions[index] as ABProductOptionMultipleSelectionSelectedValues;

                // If we have a minimum selection, which in turn is higher as the default values, deactivate the button
                if (multipleOption.min_selection > 0 &&
                    currentSelectedOption &&
                    multipleOption.min_selection > currentSelectedOption.filter(value => value === true).length) {
                    addToCartButtonStartsDisabled = true;
                } else if (multipleOption.min_selection > 0 &&
                    multipleOption.default_values.filter(value => value === true).length < multipleOption.min_selection) {
                    addToCartButtonStartsDisabled = true;
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
                enqueueSnackbar(`Product removed from the cart`, {variant: 'success'});
            } else {
                enqueueSnackbar(`Order line updated`, {variant: 'success'});
            }
        }

        handleClose();
    }

    const handleOptionChange = (optionIndex: number, selectedOption: ProductOptionSelection) => { 

        const newSelectedOptions = selectedOptions.map((oldSelectedOption, index) => {
            if (index == optionIndex) {
                return selectedOption;
            } else {
                return oldSelectedOption;
            }
        });
        setSelectedOptions(newSelectedOptions);

        if (props.product && props.product.options) {
            handleAddToCartDisabled(props.product.options!);
        }
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

                            {props.product.options && props.product.options.map((option, index) => {
                                
                                if (option.type == ABProductOptionsType.SINGLE_SELECTION) {
                                    return (
                                        <ProductOptionSingleSelection
                                            key={index}
                                            index={index}
                                            productOption={option as ABProductOptionSingleSelection}
                                            selectedOption={selectedOptions[index] as ABProductOptionSingleSelectionSelectedValue}
                                            onOptionChange={(selectedOption) => {handleOptionChange(index, selectedOption)}}
                                        />
                                    );
                                } else if (option.type == ABProductOptionsType.MULTIPLE_SELECTION) {
                                    return (
                                        <ProductOptionMultipleSelection
                                            key={index}
                                            index={index}
                                            productOption={option as ABProductOptionMultipleSelection}
                                            selectedValues={selectedOptions[index] as ABProductOptionMultipleSelectionSelectedValues}
                                            onOptionChange={(selectedOption) => {handleOptionChange(index, selectedOption)}}
                                        />
                                    );
                                }       
                            })}

                            <TextField label='Any comments for this?' multiline maxRows={4} value={comment} onChange={handleCommentChange} fullWidth />
    
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
