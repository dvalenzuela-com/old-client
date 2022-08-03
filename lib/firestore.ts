import { AlabarraCategory, AlabarraProduct, AlabarraTable, CategoryConverter, ProductConverter, TableConverter } from "@dvalenzuela-com/alabarra-types";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, orderBy, query, setDoc } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebaseApp from "./firebaseApp";

const firestore =  getFirestore(firebaseApp);
export default firestore;

 const categoriesCollection = collection(firestore, 'categories').withConverter(CategoryConverter);
 const productsCollection = collection(firestore, 'products').withConverter(ProductConverter);
 const tablesCollection = collection(firestore, 'tables').withConverter(TableConverter);
 const usersCollection = collection(firestore, 'users');

 export const allProductsQuery = query<AlabarraProduct>(productsCollection, orderBy('created_at', 'desc'));
 export const allCategoriesQuery = query<AlabarraCategory>(categoriesCollection, orderBy('created_at', 'desc'));
 export const allTablesQuery = query<AlabarraTable>(tablesCollection, orderBy('created_at', 'desc'));

 export const useCategories = () => {
	 return useCollectionData<AlabarraCategory>(allCategoriesQuery, {
		 snapshotListenOptions: { includeMetadataChanges: true }
	 });
 }
 
 export const useProducts = () => {
	 return useCollectionData<AlabarraProduct>(allProductsQuery, {
		 snapshotListenOptions: { includeMetadataChanges: true }
	 });
 }

/**
 * Tables
 */

export const getAllTableIds = async () => {
    const results = await getDocs(collection(firestore, 'tables'));
    return results.docs.map(doc => doc.id)
}

export const createUserIfNotFound = async (uid: string) => {
	console.log('calling createUserIfNotFound()', uid);
	const docRef = doc(firestore, `users/${uid}`);
	return setDoc(docRef, {
		orders: []
	}, {merge: true});
}