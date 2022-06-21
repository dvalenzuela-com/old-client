import { AlabarraProduct, AlabarraCreateOrderResponse, AlabarraProductOption, AlabarraProductOptionsType, AlabarraProductOptionSingleSelectionSelectedValue, AlabarraProductOptionMultipleSelectionSelectedValues } from "alabarra-types";
import { getFunctions, HttpsCallableResult } from "firebase/functions";
import React, { createContext, ReactNode, ReactPropTypes, useEffect, useState } from "react"
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { v4 } from "uuid";

export type ProductOptionSelection = (AlabarraProductOptionSingleSelectionSelectedValue | AlabarraProductOptionMultipleSelectionSelectedValues);

export type Cart = {
    getNumberOfItems: () => number;
    getCartTotal: () => number;
    addProduct: (product: AlabarraProduct, quantity: number, options: ProductOptionSelection[], comment: string | null) => void;
    getLines: () => CartLine[];
    editLineWithId: (id: string, product: AlabarraProduct, quantity: number, options: ProductOptionSelection[], comment: string | null) => void;
    calculateTotalPrice: (product: AlabarraProduct, selectedOptions: ProductOptionSelection[], quantity: number) => number;
    clearCart: () => void;
    createOrderWithManualPayment: () => Promise<string>;
}

const defaultCart: Cart = {
    getNumberOfItems: () => 0,
    addProduct: () => {},
    getLines: () => [],
    editLineWithId: () => {},
    getCartTotal: () => 0,
    clearCart: () => {},
    calculateTotalPrice: () => 0,
    createOrderWithManualPayment: () => Promise.reject("override this promise")
}

export const CartContext = createContext<Cart>(defaultCart)

type CartProviderProps = {
    children: JSX.Element
}

export type CartLine = {
    lineId: string;
    product: AlabarraProduct;
    quantity: number;
    options: ProductOptionSelection[];
    note: string | null;
}
export const CartProvider = ({ children }: CartProviderProps) => {

    const CART_STORAGE_KEY = "cart";

    const [numberOfItems, setNumberOfItems] = useState(0);
    const [cartLines, setCartLines] = useState<CartLine[]>([]);

    
    useEffect(() => {
        const savedCartString = localStorage.getItem(CART_STORAGE_KEY);

        if (savedCartString == null) {
            return;
        }

        const localCart = JSON.parse(savedCartString) as CartLine[];

        if (localCart) {
            setCartLines(localCart);
        }
    }, []);


    const updateCartLines = (cartLines: CartLine[]) => {
        let cartString = JSON.stringify(cartLines);
        localStorage.setItem(CART_STORAGE_KEY, cartString);
        setCartLines(cartLines)
    }

    // TODO: Move away from here!

    const [createOrder, executingCreateOrder, errorCreateOrder] = useHttpsCallable(getFunctions(), 'createManualPaymentOrder')

    const addItem = (product: AlabarraProduct, quantity: number, options: ProductOptionSelection[], comment: string | null) => {
        const newCartLine: CartLine = {
            lineId: v4(),
            note: comment,
            product: product,
            options: options,
            quantity: quantity
        }
        updateCartLines(cartLines.concat([newCartLine]));
    }

    const getItems = () => {
        return cartLines
    }

    const editLineWithId = (id: string, product: AlabarraProduct, quantity: number, options: ProductOptionSelection[], comment: string | null) => {

        if (quantity == 0 || product == null || product == undefined) {
            // Remove from cart
            const newCart = cartLines.filter(cartLine => { return cartLine.lineId != id } )
            updateCartLines(newCart);
        } else {
            // Replace old line with new line
            const updatedCart = cartLines.map(cartLine => {
                if (cartLine.lineId == id) {
                    // If we found our line, replace it with the updated one
                    return {
                        lineId: id,
                        note: comment,
                        product: product,
                        options: options,
                        quantity: quantity
                    }
                } else {
                    // Return as is, we dont want to modify this line
                    return cartLine
                }
            })
            updateCartLines(updatedCart);
        }
    }

    const getNumberOfItems = () => {
        return cartLines.length
    }

    const calculateTotalPrice = (product: AlabarraProduct, selectedOptions: ProductOptionSelection[], quantity: number): number => {
        //console.log(`calculateTotalPrice(${product}, ${selectedOptions}, ${quantity})`)
        //console.log(selectedOptions);
        // base price
        let unitPrice = product.price;


        // Go trough every selected option
        selectedOptions.forEach((selectedOption, index) => {

            // Original product option
            const productOption = product.options[index];

            if (productOption.type == AlabarraProductOptionsType.SINGLE_SELECTION) {
                //Get selected option
                const singleSelectedOption = selectedOptions[index] as AlabarraProductOptionSingleSelectionSelectedValue;

                if (singleSelectedOption) {
                    // Find product option that is selected to find price adjustment value
                    const originOption = productOption.possible_values.find(possible_value => possible_value.title == singleSelectedOption);
                    unitPrice += originOption?.price_adjustment ?? 0;
                }
            } else if (productOption.type == AlabarraProductOptionsType.MULTIPLE_SELECTION) {
                
                //Get selected option
                const selectedValues = selectedOptions[index] as AlabarraProductOptionMultipleSelectionSelectedValues;
                if (selectedValues) {
                    selectedValues.forEach((selectedValue, index) => {
                        if (selectedValue) {
                            unitPrice += productOption.possible_values[index].price_adjustment;
                        }
                    });
                }
            }
        });

        return quantity * unitPrice;
    }

    const getCartTotal = () => {
        return cartLines.reduce((sum, cartLine) => {
            return sum + calculateTotalPrice(cartLine.product, cartLine.options, cartLine.quantity);
        }, 0);
    }

    const handleClearCart = () => {
        updateCartLines([]);
    }

    const handleCreateOrderWithManualPayment = (): Promise<string> => {

        return new Promise<string>((resolve, reject) => {
            var api_cart_lines: any[] = []

            cartLines.forEach( line => {

                api_cart_lines.push({product_id: `/products/${line.product.id}`, quantity: 1, note: null})
            })
            createOrder({
                customer: "dummyCustomerId",
                general_note: "note created from Callable function",
                cart: api_cart_lines,
                table_number: 15})
                .then((result: HttpsCallableResult<AlabarraCreateOrderResponse> | undefined) => {
                    if (result != undefined) {
                        resolve(result.data.order_id)
                    }})
                .catch((error) => {
                    console.log(error)
                    reject(error)})
        });
    }

    return (
        <CartContext.Provider value={{
            getNumberOfItems: getNumberOfItems,
            addProduct: addItem,
            getLines: getItems,
            editLineWithId: editLineWithId,
            getCartTotal: getCartTotal,
            clearCart: handleClearCart,
            calculateTotalPrice: calculateTotalPrice,
            createOrderWithManualPayment: handleCreateOrderWithManualPayment}
        }>
            {children}
        </CartContext.Provider>
    )
}

