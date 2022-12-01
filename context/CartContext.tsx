import {
    ABProduct,
    ABCreateOrderData,
    ABResponseStatus,
    ABCreateOrderDataCartLine,
    ABFunctionCalculatePrice,
    ABProductOptionSelections,
    ABTipOption} from "@dvalenzuela-com/alabarra-types";
import React, { createContext, useContext, useEffect, useState } from "react"
import { v4 } from "uuid";
import { useCreateDigitalPaymentOrder, useCreateManualPaymentOrder, useCreateStripePaymentIntent, useCreateStripePaymentOrder } from "@Lib/functions";
import { useUser } from "./UserContext";
import { useBusinessConfig } from "./BusinessConfigContext";

export const useCart = () => useContext(CartContext);

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
    lines: CartLine[];
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

    const businessConfig = useBusinessConfig();
    const user = useUser().getUser();

    const [tipOptionId, setTipOptionId] = useState<string>('');
    const [tipPercentage, setTipPercentage] = useState<number>(0);
    const [lines, setLines] = useState<CartLine[]>([]);

    
    const [createManualPaymentOrder, executingCreateManualPaymentOrder, errorCreateManualPaymentOrder] = useCreateManualPaymentOrder();
    const [createDigitalPaymentOrder] = useCreateDigitalPaymentOrder();
    const [createStripePaymentOrder] = useCreateStripePaymentOrder();
    const [createStripePaymentIntent] = useCreateStripePaymentIntent();


    useEffect(() => {
        if(businessConfig && tipOptionId === "") {
            const defaultTipConfig = businessConfig.tip_options.find(obj => obj.default);
            if (defaultTipConfig) {
                setTipOptionId(defaultTipConfig.id);
                setTipPercentage(defaultTipConfig.percentage);
            }
        }
    }, [businessConfig]);

    useEffect(() => {
        const savedCartString = localStorage.getItem(CART_STORAGE_KEY);
    
        if (savedCartString == null) return;

        const localCart = JSON.parse(savedCartString) as CartStorage;
        if (!localCart) return;

        setLines(localCart.lines);
        setTipOptionId(localCart.tipOptionId);
        setTipPercentage(localCart.tipPercentage);
    }, [CART_STORAGE_KEY]);

    const persistCart = (tipOptionId: string, tipPercentage: number, lines: CartLine[]) => {
        const newCart: CartStorage = {
            tipOptionId: tipOptionId,
            tipPercentage: tipPercentage,
            lines: lines
        };
        let cartString = JSON.stringify(newCart);
        localStorage.setItem(CART_STORAGE_KEY, cartString);
    }

    const updateCartLines = (newLines: CartLine[]) => {
        setLines(newLines);
        persistCart(tipOptionId, tipPercentage, newLines);
    }

    const addItem = (product: ABProduct, quantity: number, options: ABProductOptionSelections[], comment: string | null) => {
        const newCartLine: CartLine = {
            lineId: v4(),
            note: comment,
            product: product,
            options: options,
            quantity: quantity
        }
        updateCartLines(lines.concat([newCartLine]));
    }

    const getItems = () => {
        return lines;
    }

    const editLineWithId = (id: string, product: ABProduct, quantity: number, options: ABProductOptionSelections[], comment: string | null) => {

        // TODO: Where does the coment gets updated for existing lines?
        if (quantity == 0 || product == null || product == undefined) {
            // Remove from cart
            const newCart = lines.filter(cartLine => { return cartLine.lineId != id } )
            updateCartLines(newCart);
        } else {
            // Replace old line with new line
            const updatedCart = lines.map(cartLine => {
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
        return lines.reduce((acc, line) => acc + line.quantity, 0);
    }

    const calculateTotalPrice = (product: ABProduct, selectedOptions: ABProductOptionSelections[], quantity: number): number => {
        return quantity * ABFunctionCalculatePrice(product, selectedOptions);
    }

    const getCartTotal = () => {
        return lines.reduce((sum, cartLine) => {
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

        lines.forEach( line => {
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
        const selectedTipOption = businessConfig.tip_options.find(obj => obj.id === tipOptionId);

        if (selectedTipOption) {
            setTipOptionId(selectedTipOption.id);
            setTipPercentage(selectedTipOption.percentage);
            persistCart(selectedTipOption.id, selectedTipOption.percentage, lines);
        }
    }

    const handleGetCurrentTipOption = (): ABTipOption => {
        return {id: tipOptionId, percentage: tipPercentage, default: true};
    }

    const handleGetCurrentTipPercentage = (): number => {
        return tipPercentage;
    }

    const handleCalculateTip = (): number => {
        return Math.floor(getCartTotal() * (tipPercentage / 100));
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

