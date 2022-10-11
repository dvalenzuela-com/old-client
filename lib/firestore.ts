import { ABCategory, ABProduct, ABTable, CategoryConverter, ProductConverter, TableConverter } from "@dvalenzuela-com/alabarra-types";
import { collection, doc, getDocs, getFirestore, orderBy, query, setDoc } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebaseApp from "./firebaseApp";

const firestore =  getFirestore(firebaseApp);

export default firestore;

const categoriesCollection = (businessId: string) => collection(firestore, `businesses/${businessId}/categories`).withConverter(CategoryConverter);
const productsCollection = (businessId: string) => collection(firestore, `businesses/${businessId}/products`).withConverter(ProductConverter);
const tablesCollection = (businessId: string) => collection(firestore, `businesses/${businessId}/tables`).withConverter(TableConverter);
const usersCollection = collection(firestore, `users`);
const businessesCollection = collection(firestore, `businesses`);

 export const allProductsQuery = (businessId: string) => query<ABProduct>(productsCollection(businessId), orderBy('created_at', 'desc'));
 export const allCategoriesQuery = (businessId: string) => query<ABCategory>(categoriesCollection(businessId), orderBy('created_at', 'desc'));
 export const allTablesQuery = (businessId: string) => query<ABTable>(tablesCollection(businessId), orderBy('created_at', 'desc'));

 export const useCategories = (businessId: string) => {
	 return useCollectionData<ABCategory>(allCategoriesQuery(businessId), {
		 snapshotListenOptions: { includeMetadataChanges: true }
	 });
 }
 
 export const useProducts = (businessId: string) => {
	 return useCollectionData<ABProduct>(allProductsQuery(businessId), {
		 snapshotListenOptions: { includeMetadataChanges: true }
	 });
 }

/**
 * Tables
 */

 export const getAllTableIds = async (businessId: string) => {
    const results = await getDocs(tablesCollection(businessId));
    return results.docs.map(doc => doc.id)
}

export const getAllBusinessIds = async () => {
    const results = await getDocs(businessesCollection);
    return results.docs.map(doc => doc.id)
}

export const createUserIfNotFound = async (uid: string) => {
	// TODO: See if it's possible to use the usersCollection
	const docRef = doc(firestore, `users/${uid}`);
	return setDoc(docRef, {
		orders: []
	}, {merge: true});
}