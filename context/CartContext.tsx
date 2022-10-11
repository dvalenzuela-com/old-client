import {
    ABProduct,
    ABProductOptionsType,
    ABProductOptionSingleSelectionSelectedValue,
    ABProductOptionMultipleSelectionSelectedValues,
    ABCreateOrderData,
    ABCreateOrderResponse, 
    ABResponseStatus} from "@dvalenzuela-com/alabarra-types";
import React, { createContext, useContext, useEffect, useState } from "react"
import { v4 } from "uuid";
import { useCreateDigitalPaymentOrder, useCreateManualPaymentOrder, useCreateStripePaymentIntent } from "@Lib/functions";
import { UserContext } from "./UserContext";

export type ProductOptionSelection = (ABProductOptionSingleSelectionSelectedValue | ABProductOptionMultipleSelectionSelectedValues);

export type Cart = {
    getNumberOfItems: () => number;
    getCartTotal: () => number;
    addProduct: (product: ABProduct, quantity: number, options: ProductOptionSelection[], comment: string | null) => void;
    getLines: () => CartLine[];
    editLineWithId: (id: string, product: ABProduct, quantity: number, options: ProductOptionSelection[], comment: string | null) => void;
    calculateTotalPrice: (product: ABProduct, selectedOptions: ProductOptionSelection[], quantity: number) => number;
    clearCart: () => void;
    createOrderWithManualPayment: (businessId: string, tableName: string, customerName?: string, generalNote?: string) => Promise<string>;
    createOrderWithDigitalPayment: (businessId: string, tableName: string, customerName?: string, generalNote?: string) => Promise<string>;
    createStripePaymentIntent: (businessId: string, orderId: string) => Promise<string>;
    setSelectedTableId: (tableId: string | null) => void;
    getSelectedTableId: () => string | null;
}

const defaultCart: Cart = {
    getNumberOfItems: () => 0,
    addProduct: () => {},
    getLines: () => [],
    editLineWithId: () => {},
    getCartTotal: () => 0,
    clearCart: () => {},
    calculateTotalPrice: () => 0,
    createOrderWithManualPayment: () => Promise.reject("override this promise"),
    createOrderWithDigitalPayment: () => Promise.reject("override this promise"),
    createStripePaymentIntent: () => Promise.reject("override this promise"),
    setSelectedTableId: () => {},
    getSelectedTableId: () => null
}

export const CartContext = createContext<Cart>(defaultCart)

type CartProviderProps = {
    businessId: string
    children: React.ReactNode
}

export type CartLine = {
    lineId: string;
    product: ABProduct;
    quantity: number;
    options: ProductOptionSelection[];
    note: string | null;
}
export const CartProvider = ({ businessId, children }: CartProviderProps) => {

    const CART_STORAGE_KEY = `cart-${businessId}`;
    const TABLE_SESSION_KEY = "persistedTable";

    const [cartLines, setCartLines] = useState<CartLine[]>([]);

    const user = useContext(UserContext).getUser();
    
    useEffect(() => {
        const savedCartString = localStorage.getItem(CART_STORAGE_KEY);

        if (savedCartString == null) {
            return;
        }

        const localCart = JSON.parse(savedCartString) as CartLine[];

        if (localCart) {
            setCartLines(localCart);
        }
    }, [CART_STORAGE_KEY]);


    const updateCartLines = (cartLines: CartLine[]) => {
        let cartString = JSON.stringify(cartLines);
        localStorage.setItem(CART_STORAGE_KEY, cartString);
        setCartLines(cartLines)
    }

    // TODO: Move away from here!
    const [createManualPaymentOrder, executingCreateManualPaymentOrder, errorCreateManualPaymentOrder] = useCreateManualPaymentOrder();
    const [createDigitalPaymentOrder] = useCreateDigitalPaymentOrder();
    const [createStripePaymentIntent] = useCreateStripePaymentIntent();

    const addItem = (product: ABProduct, quantity: number, options: ProductOptionSelection[], comment: string | null) => {
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

    const editLineWithId = (id: string, product: ABProduct, quantity: number, options: ProductOptionSelection[], comment: string | null) => {

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

    const calculateTotalPrice = (product: ABProduct, selectedOptions: ProductOptionSelection[], quantity: number): number => {
        //console.log(`calculateTotalPrice(${product}, ${selectedOptions}, ${quantity})`)
        //console.log(selectedOptions);
        // base price
        let unitPrice = product.price;

        // Go trough every selected option
        selectedOptions.forEach((selectedOption, index) => {

            // Original product option
            if (product.options) {
                const productOption = product.options[index];

                if (productOption.type == ABProductOptionsType.SINGLE_SELECTION) {
                    //Get selected option
                    const singleSelectedOption = selectedOptions[index] as ABProductOptionSingleSelectionSelectedValue;

                    if (singleSelectedOption) {
                        // Find product option that is selected to find price adjustment value
                        const originOption = productOption.possible_values.find(possible_value => possible_value.title == singleSelectedOption);
                        unitPrice += originOption?.price_adjustment ?? 0;
                    }
                } else if (productOption.type == ABProductOptionsType.MULTIPLE_SELECTION) {
                    
                    //Get selected option
                    const selectedValues = selectedOptions[index] as ABProductOptionMultipleSelectionSelectedValues;
                    if (selectedValues) {
                        selectedValues.forEach((selectedValue, index) => {
                            if (selectedValue) {
                                unitPrice += productOption.possible_values[index].price_adjustment;
                            }
                        });
                    }
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

    const handleCreateOrderWithManualPayment = (businessId: string, tableName: string, customerName?: string, generalNote?: string): Promise<string> => {

        return new Promise<string>((resolve, reject) => {
            var api_cart_lines: any[] = []

            cartLines.forEach( line => {
                api_cart_lines.push({product_id: line.product.id, quantity: line.quantity, note: line.note});
            })

            const newOrder: ABCreateOrderData = {
                business_id: businessId,
                customer_id: user?.uid ?? "userid_not_found",
                customer_nickname: customerName,
                general_note: generalNote ?? null,
                cart: api_cart_lines,
                table_name: tableName
            };

            createManualPaymentOrder(newOrder)
                .then(result => { 
                    if (!result) {
                        reject("undefined result");
                    } else if (result.data.status == ABResponseStatus.ERROR) {
                        reject(result.data.error_message);
                    } else if (result.data.status == ABResponseStatus.SUCCESS) {
                        resolve(result.data.result.order_id);
                    }
                })
                .catch((error: any) => {
                    console.log(error.message)
                    reject(error);
                });
        });
    }

    const handleCreateOrderWithDigitalPayment = (businessId: string, tableName: string, customerName?: string, generalNote?: string): Promise<string> => {

        return new Promise<string>((resolve, reject) => {
            var api_cart_lines: any[] = []

            cartLines.forEach( line => {
                api_cart_lines.push({product_id: line.product.id, quantity: line.quantity, note: line.note});
            });

            const newOrder: ABCreateOrderData = {
                business_id: businessId,
                customer_id: user?.uid ?? "userid_not_found",
                customer_nickname: customerName,
                general_note: generalNote ?? null,
                cart: api_cart_lines,
                table_name: tableName
            }

            createDigitalPaymentOrder(newOrder)
                .then(result => { 
                    if (!result) {
                        reject("undefined result");
                    } else if (result.data.status == ABResponseStatus.ERROR) {
                        reject(result.data.error_message);
                    } else if (result.data.status == ABResponseStatus.SUCCESS) {
                        resolve(result.data.result.order_id);
                    }
                })
                .catch((error: any) => {
                    console.log(error.message)
                    reject(error);
                });
        });
    }

    const handleCreateStripePaymentIntent = (businessId: string, orderId: string): Promise<string> => {

        return new Promise<string>((resolve, reject) => {
            var api_cart_lines: any[] = []

            createStripePaymentIntent({business_id: businessId, order_id: orderId})
                .then(result => {
                    if (!result) {
                        reject("undefined result");
                    } else if (result.data.status == ABResponseStatus.ERROR) {
                        reject(result.data.error_message);
                    } else if (result.data.status == ABResponseStatus.SUCCESS) {
                        resolve(result.data.result.payment_intent_client_secret);
                    }
                })
                .catch((error: any) => {
                    console.log(error.message)
                    reject(error);
                });
        });
    }

    const handleSetSelectedTableId = (tableId: string | null) => {

        if (tableId != null && tableId.trim().length > 0) {
            sessionStorage.setItem(TABLE_SESSION_KEY, tableId);
        } else {
            sessionStorage.removeItem(TABLE_SESSION_KEY);
        }
    }

    const handleGetSelectedTableId = (): string | null => {
        return sessionStorage.getItem(TABLE_SESSION_KEY);
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
            createOrderWithManualPayment: handleCreateOrderWithManualPayment,
            createOrderWithDigitalPayment: handleCreateOrderWithDigitalPayment,
            createStripePaymentIntent: handleCreateStripePaymentIntent,
            setSelectedTableId: handleSetSelectedTableId,
            getSelectedTableId: handleGetSelectedTableId
        }}>
            {children}
        </CartContext.Provider>
    )
}

