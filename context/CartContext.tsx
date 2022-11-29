import {
    ABProduct,
    ABCreateOrderData,
    ABResponseStatus,
    ABCreateOrderDataCartLine,
    ABFunctionCalculatePrice,
    ABProductOptionSelections,
    ABCreateStripePaymentOrderData,
    ABTipOption} from "@dvalenzuela-com/alabarra-types";
import React, { createContext, useContext, useEffect, useState } from "react"
import { v4 } from "uuid";
import { useCreateDigitalPaymentOrder, useCreateManualPaymentOrder, useCreateStripePaymentIntent, useCreateStripePaymentOrder } from "@Lib/functions";
import { UserContext } from "./UserContext";
import { getBusinessConfig } from "@Lib/firestore";
import { BusinessConfigContext } from "./BusinessConfigContext";


export type Cart = {
    getNumberOfItems: () => number;
    getCartTotal: () => number;
    addProduct: (product: ABProduct, quantity: number, options: ABProductOptionSelections[], comment: string | null) => void;
    getLines: () => CartLine[];
    editLineWithId: (id: string, product: ABProduct, quantity: number, options: ABProductOptionSelections[], comment: string | null) => void;
    
    setTipOption: (tipOptionId: string) => void;
    getCurrentTipOption: () => ABTipOption;
    getCurrentTipPercentage: () => number;
    calculateTip: () => number;
    calculateTotalPrice: (product: ABProduct, selectedOptions: ABProductOptionSelections[], quantity: number) => number;
    clearCart: () => void;
    createOrderWithManualPayment: (businessId: string, tableName: string, customerName?: string, generalNote?: string) => Promise<string>;
    createOrderWithDigitalPayment: (businessId: string, tableName: string, customerName?: string, generalNote?: string) => Promise<string>;
    createOrderWithStripePayment: (businessId: string, tableName: string, customerName?: string, generalNote?: string) => Promise<string>;
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
    setTipOption: () => {},
    getCurrentTipPercentage: () => 0,
    getCurrentTipOption: () => ({id: "INVALID", default: false, percentage: 0}),
    calculateTip: () => 0,
    calculateTotalPrice: () => 0,
    createOrderWithManualPayment: () => Promise.reject("override this promise"),
    createOrderWithDigitalPayment: () => Promise.reject("override this promise"),
    createOrderWithStripePayment: () => Promise.reject("override this promise"),
    createStripePaymentIntent: () => Promise.reject("override this promise"),
    setSelectedTableId: () => {},
    getSelectedTableId: () => null
}

export const CartContext = createContext<Cart>(defaultCart)

type CartProviderProps = {
    businessId: string
    children: React.ReactNode
}

export type CartStorage = {
    tipOptionId: string;
    tipPercentage: number;
    cart: CartLine[];
}

export type CartLine = {
    lineId: string;
    product: ABProduct;
    quantity: number;
    options: ABProductOptionSelections[];
    note: string | null;
}
export const CartProvider = ({ businessId, children }: CartProviderProps) => {

    const CART_STORAGE_KEY = `cart-${businessId}`;
    const TABLE_SESSION_KEY = "persistedTable";

    const businessConfig = useContext(BusinessConfigContext);

    const [cart, setCart] = useState<CartStorage>({tipOptionId:"", tipPercentage: 0, cart: []});

    const user = useContext(UserContext).getUser();
    
    useEffect(() => {
        console.log("businessConfig", businessConfig);
        if(businessConfig && cart.tipOptionId === "") {
            const newCart = cart;
            const defaultTipConfig = businessConfig.tip_options.find(obj => obj.default);
            if (defaultTipConfig) {
                newCart.tipOptionId = defaultTipConfig.id;
                newCart.tipPercentage = defaultTipConfig.percentage;
                setCart(newCart);
            }
        }
    }, [businessConfig]);

    useEffect(() => {
        const savedCartString = localStorage.getItem(CART_STORAGE_KEY);

        if (savedCartString == null) {
            return;
        }

        const localCart = JSON.parse(savedCartString) as CartStorage;

        if (localCart) {
            setCart(localCart);
        }
    }, [CART_STORAGE_KEY]);


    const updateCartLines = (cartLines: CartLine[]) => {
        const newCart = cart;
        newCart.cart = cartLines;
        let cartString = JSON.stringify(newCart);
        localStorage.setItem(CART_STORAGE_KEY, cartString);
        setCart(newCart);
    }

    // TODO: Move away from here!
    const [createManualPaymentOrder, executingCreateManualPaymentOrder, errorCreateManualPaymentOrder] = useCreateManualPaymentOrder();
    const [createDigitalPaymentOrder] = useCreateDigitalPaymentOrder();
    const [createStripePaymentOrder] = useCreateStripePaymentOrder();
    const [createStripePaymentIntent] = useCreateStripePaymentIntent();

    const addItem = (product: ABProduct, quantity: number, options: ABProductOptionSelections[], comment: string | null) => {
        const newCartLine: CartLine = {
            lineId: v4(),
            note: comment,
            product: product,
            options: options,
            quantity: quantity
        }
        updateCartLines(cart.cart.concat([newCartLine]));
    }

    const getItems = () => {
        return cart.cart;
    }

    const editLineWithId = (id: string, product: ABProduct, quantity: number, options: ABProductOptionSelections[], comment: string | null) => {

        // TODO: Where does the coment gets updated for existing lines?
        if (quantity == 0 || product == null || product == undefined) {
            // Remove from cart
            const newCart = cart.cart.filter(cartLine => { return cartLine.lineId != id } )
            updateCartLines(newCart);
        } else {
            // Replace old line with new line
            const updatedCart = cart.cart.map(cartLine => {
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
        return cart.cart.length
    }

    const calculateTotalPrice = (product: ABProduct, selectedOptions: ABProductOptionSelections[], quantity: number): number => {
        return quantity * ABFunctionCalculatePrice(product, selectedOptions);
    }

    const getCartTotal = () => {
        return cart.cart.reduce((sum, cartLine) => {
            return sum + calculateTotalPrice(cartLine.product, cartLine.options, cartLine.quantity);
        }, 0);
    }

    const handleClearCart = () => {
        updateCartLines([]);
    }

    const handleCreateOrderWithManualPayment = (businessId: string, tableName: string, customerName?: string, generalNote?: string): Promise<string> => {
        return new Promise<string>(async (resolve, reject) => {
            try {
                const newOrder: ABCreateOrderData = prepareData(businessId, tableName, customerName, generalNote);
                const result = await createManualPaymentOrder(newOrder);
                if (!result) throw Error("undefined result");
                if (result.data.status === ABResponseStatus.ERROR) throw Error(result.data.error_message);
                resolve(result.data.result.order_id);
            } catch (error: any) {
                console.log(error.message);
                reject(error);
            }
        });
    }

    const handleCreateOrderWithDigitalPayment = (businessId: string, tableName: string, customerName?: string, generalNote?: string): Promise<string> => {
        return new Promise<string>(async (resolve, reject) => {
            try {
                const newOrder: ABCreateOrderData = prepareData(businessId, tableName, customerName, generalNote);
                const result = await createDigitalPaymentOrder(newOrder);
                if (!result) throw Error("undefined result");
                if (result.data.status === ABResponseStatus.ERROR) throw Error(result.data.error_message);
                resolve(result.data.result.order_id);
            } catch (error: any) {
                console.log(error.message);
                reject(error);
            }
        });
    }

    const handleCreateOrderWithStripePayment = (businessId: string, tableName: string, customerName?: string, generalNote?: string): Promise<string> => {
        return new Promise<string>(async (resolve, reject) => {
            try {
                const newOrder: ABCreateOrderData = prepareData(businessId, tableName, customerName, generalNote);
                const result = await createStripePaymentOrder(newOrder);
                if (!result) throw Error("undefined result");
                if (result.data.status === ABResponseStatus.ERROR) throw Error(result.data.error_message);
                resolve(result.data.result.client_secret);
            } catch (error: any) {
                console.log(error.message);
                reject(error);
            }
        });
    }

    const prepareData = (businessId: string, tableName: string, customerName?: string, generalNote?: string): ABCreateOrderData => {
        var api_cart_lines: ABCreateOrderDataCartLine[] = []

        cart.cart.forEach( line => {
            api_cart_lines.push({
                product_id: line.product.id,
                selected_options: line.options,
                quantity: line.quantity,
                note: line.note
            });
        });

        return {
            business_id: businessId,
            customer_id: user?.uid ?? "userid_not_found",
            customer_nickname: customerName,
            general_note: (generalNote && generalNote.trim().length > 0) ? generalNote : null,
            cart: api_cart_lines,
            table_name: tableName
        }
    }

    const handleCreateStripePaymentIntent = (businessId: string, orderId: string): Promise<string> => {
        return new Promise<string>(async (resolve, reject) => {
            try {
                const result = await createStripePaymentIntent({business_id: businessId, order_id: orderId});
                if (!result) throw Error("undefined result");
                if (result.data.status === ABResponseStatus.ERROR) throw Error(result.data.error_message);
                resolve(result.data.result.payment_intent_client_secret);
            } catch (error: any) {
                console.log(error.message)
                    reject(error);
            }
        });
    }

    const handleSetTipOption = (tipOptionId: string) => {

        console.log(`Setting tip from ${cart.tipOptionId} to ${tipOptionId}`)
        const selectedTipOption = businessConfig.tip_options.find(obj => obj.id === tipOptionId);

        if (selectedTipOption) {
            console.log(`Setting tip from ${cart.tipPercentage} to ${selectedTipOption.percentage}`)
            const newCart = cart;
            newCart.tipOptionId = selectedTipOption.id;
            newCart.tipPercentage = selectedTipOption.percentage;
            setCart(newCart);
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
        }
    }

    const handleGetCurrentTipOption = (): ABTipOption => {
        return {id: cart.tipOptionId, percentage: cart.tipPercentage, default: true};
    }

    const handleGetCurrentTipPercentage = (): number => {
        return cart.tipPercentage;
    }

    const handleCalculateTip = (): number => {
        return Math.floor(getCartTotal() * (cart.tipPercentage / 100));
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
            setTipOption: handleSetTipOption,
            getCurrentTipOption: handleGetCurrentTipOption,
            getCurrentTipPercentage: handleGetCurrentTipPercentage,
            calculateTip: handleCalculateTip,
            calculateTotalPrice: calculateTotalPrice,
            createOrderWithManualPayment: handleCreateOrderWithManualPayment,
            createOrderWithDigitalPayment: handleCreateOrderWithDigitalPayment,
            createOrderWithStripePayment: handleCreateOrderWithStripePayment,
            createStripePaymentIntent: handleCreateStripePaymentIntent,
            setSelectedTableId: handleSetSelectedTableId,
            getSelectedTableId: handleGetSelectedTableId
        }}>
            {children}
        </CartContext.Provider>
    )
}

