import { ABCategory, ABProduct, ABTable, CategoryConverter, ProductConverter, TableConverter } from "@dvalenzuela-com/alabarra-types";
import { collection, doc, getDocs, getFirestore, orderBy, query, setDoc } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebaseApp from "./firebaseApp";

const firestore =  getFirestore(firebaseApp);
export default firestore;

 const categoriesCollection = collection(firestore, 'categories').withConverter(CategoryConverter);
 const productsCollection = collection(firestore, 'products').withConverter(ProductConverter);
 const tablesCollection = collection(firestore, 'tables').withConverter(TableConverter);
 const usersCollection = collection(firestore, 'users');

 export const allProductsQuery = query<ABProduct>(productsCollection, orderBy('created_at', 'desc'));
 export const allCategoriesQuery = query<ABCategory>(categoriesCollection, orderBy('created_at', 'desc'));
 export const allTablesQuery = query<ABTable>(tablesCollection, orderBy('created_at', 'desc'));

 export const useCategories = () => {
	 return useCollectionData<ABCategory>(allCategoriesQuery, {
		 snapshotListenOptions: { includeMetadataChanges: true }
	 });
 }
 
 export const useProducts = () => {
	 return useCollectionData<ABProduct>(allProductsQuery, {
		 snapshotListenOptions: { includeMetadataChanges: true }
	 });
 }

/**
 * Tables
 */

export const getAllTableIds = async () => {
    const results = await getDocs(tablesCollection);
    return results.docs.map(doc => doc.id)
}

export const createUserIfNotFound = async (uid: string) => {
	console.log('calling createUserIfNotFound()', uid);
	const docRef = doc(firestore, `users/${uid}`);
	return setDoc(docRef, {
		orders: []
	}, {merge: true});
}