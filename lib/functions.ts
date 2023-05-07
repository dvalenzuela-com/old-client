import { ABCreateOrderData, ABCreateOrderResponse, ABCreateStripePaymentOrderData, ABCreateStripePaymentOrderResponse, ABCreateStripePaymentIntentData, ABCreateStripePaymentIntentResponse } from "@Alabarra/alabarra-types";
import { getFunctions } from "firebase/functions";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import firebaseApp from "./firebaseApp";

const functions =  getFunctions(firebaseApp);
//connectFunctionsEmulator(functions, "localhost", 5001);

export const useCreateManualPaymentOrder = () => {
    return useHttpsCallable<ABCreateOrderData, ABCreateOrderResponse>(functions, 'createManualPaymentOrder')
};

export const useCreateDigitalPaymentOrder = () => {
    return useHttpsCallable<ABCreateOrderData, ABCreateOrderResponse>(functions, 'createDigitalPaymentOrder')
};

export const useCreateStripePaymentOrder = () => {
    return useHttpsCallable<ABCreateStripePaymentOrderData, ABCreateStripePaymentOrderResponse>(functions, 'createStripePaymentOrder')
};

export const useCreateStripePaymentIntent = () => {
    return useHttpsCallable<ABCreateStripePaymentIntentData, ABCreateStripePaymentIntentResponse>(functions, 'createStripePaymentIntent')
};
