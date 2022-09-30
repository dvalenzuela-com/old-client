import { AlabarraCreateOrderData, AlabarraCreateOrderResponse, ABCreateStripePaymentIntentData, ABCreateStripePaymentIntentResponse } from "@dvalenzuela-com/alabarra-types";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import firebaseApp from "./firebaseApp";

const functions =  getFunctions(firebaseApp);
//connectFunctionsEmulator(functions, "localhost", 5001);

export const useCreateManualPaymentOrder = () => { return useHttpsCallable<AlabarraCreateOrderData, AlabarraCreateOrderResponse>(functions, 'createManualPaymentOrder') };
export const useCreateDigitalPaymentOrder = () => { return useHttpsCallable<AlabarraCreateOrderData, AlabarraCreateOrderResponse>(functions, 'createDigitalPaymentOrder') };
export const useCreateStripePaymentIntent = () => { return useHttpsCallable<ABCreateStripePaymentIntentData, ABCreateStripePaymentIntentResponse>(functions, 'createStripePaymentIntent') };


// export const useDeleteTable = () => { return useHttpsCallable<AlabarraCreateTableData, AlabarraCreateTableResponse>(functions, 'deleteTable') };
// export const useCreateCategory = () => { return useHttpsCallable<AlabarraCreateCategoryData, AlabarraCreateCategoryResponse>(functions, 'createCategory') };
// export const useCreateTable = () => { return useHttpsCallable<AlabarraCreateTableData, AlabarraCreateTableResponse>(functions, 'createTable') };
// export const useEditProduct = () => { return useHttpsCallable<AlabarraEditProductData, AlabarraEditProductResponse>(functions, 'editProduct') };
// export const useCreateProduct = () => { return useHttpsCallable<AlabarraCreateProductData, AlabarraCreateCategoryResponse>(functions, 'createProduct') };
// export const useConfirmManualPayment = () => { return useHttpsCallable<AlabarraConfirmManualPaymentData, AlabarraResponseSuccessAbstract | AlabarraResponseError>(functions, 'confirmManualPayment') };
// export const useFullfillOrder = () => { return useHttpsCallable<AlabarraFulfillOrderData, AlabarraResponseSuccessAbstract | AlabarraResponseError>(functions, 'fullfillOrder') };
// export const useSetOrderReadyForDelivery = () => { return useHttpsCallable<AlabarraSetOrderReadyForDeliveryData, AlabarraResponseSuccessAbstract | AlabarraResponseError>(functions, 'setOrderReadyForDelivery') };

// export const useCreateManualPaymentOrder = () => { return useHttpsCallable(getFunctions(), 'createManualPaymentOrder') };
// export const useCreatDigitalPaymentOrder = () => { return useHttpsCallable(getFunctions(), 'createDigitalPaymentOrder') };
// export const useCreateStripePaymentIntent = () => { useHttpsCallable(getFunctions(), 'createStripePaymentIntent') };
