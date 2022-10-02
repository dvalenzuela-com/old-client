import { AlabarraCreateOrderData, AlabarraCreateOrderResponse, ABCreateStripePaymentIntentData, ABCreateStripePaymentIntentResponse } from "@dvalenzuela-com/alabarra-types";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import firebaseApp from "./firebaseApp";

const functions =  getFunctions(firebaseApp);
//connectFunctionsEmulator(functions, "localhost", 5001);

export const useCreateManualPaymentOrder = () => { return useHttpsCallable<AlabarraCreateOrderData, AlabarraCreateOrderResponse>(functions, 'createManualPaymentOrder') };
export const useCreateDigitalPaymentOrder = () => { return useHttpsCallable<AlabarraCreateOrderData, AlabarraCreateOrderResponse>(functions, 'createDigitalPaymentOrder') };
export const useCreateStripePaymentIntent = () => { return useHttpsCallable<ABCreateStripePaymentIntentData, ABCreateStripePaymentIntentResponse>(functions, 'createStripePaymentIntent') };
