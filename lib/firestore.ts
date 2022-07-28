import { AlabarraCategory, AlabarraProduct, AlabarraTable, CategoryConverter, ProductConverter, TableConverter } from "@dvalenzuela-com/alabarra-types";
import { collection, getDocs, getFirestore, orderBy, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebaseApp from "./firebaseApp";

const firestore =  getFirestore(firebaseApp);
export default firestore;

 const categoriesCollection = collection(firestore, 'categories').withConverter(CategoryConverter);
 const productsCollection = collection(firestore, 'products').withConverter(ProductConverter);
 const tablesCollection = collection(firestore, 'tables').withConverter(TableConverter);

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