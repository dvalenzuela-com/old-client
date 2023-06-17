import {
  ABCategory,
  ABProduct,
  ABTable,
  ABUserData,
  BusinessConfigConverter,
  CategoryConverter,
  ProductConverter,
  TableConverter,
} from '@Alabarra/alabarra-types';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebaseApp from './firebaseApp';

const firestore = getFirestore(firebaseApp);

export default firestore;

const categoriesCollection = (businessId: string) =>
  collection(firestore, `businesses/${businessId}/categories`).withConverter(CategoryConverter);
const productsCollection = (businessId: string) =>
  collection(firestore, `businesses/${businessId}/products`).withConverter(ProductConverter);
const tablesCollection = (businessId: string) =>
  collection(firestore, `businesses/${businessId}/tables`).withConverter(TableConverter);
const businessesCollection = collection(firestore, `businesses`).withConverter(
  BusinessConfigConverter
);
//const usersCollection = collection(firestore, `users`).withConverter(UserConverter);

export const allProductsQuery = (businessId: string) =>
  query<ABProduct>(productsCollection(businessId), orderBy('created_at', 'asc'));
export const allCategoriesQuery = (businessId: string) =>
  query<ABCategory>(categoriesCollection(businessId), orderBy('rank', 'asc'));
export const allTablesQuery = (businessId: string) =>
  query<ABTable>(tablesCollection(businessId), orderBy('created_at', 'desc'));

export const useCategories = (businessId: string) =>
  useCollectionData<ABCategory>(allCategoriesQuery(businessId), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

export const useProducts = (businessId: string) =>
  useCollectionData<ABProduct>(allProductsQuery(businessId), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

/*
 * TABLES
 */

export const getAllTables = async (businessId: string) => {
  const results = await getDocs(tablesCollection(businessId));
  return results.docs.map((doc) => doc.data());
};

/*
 * BUSINESSES
 */
export const getAllBusinessIds = async () => {
  const results = await getDocs(businessesCollection);
  return results.docs.map((doc) => doc.id);
};

export const getAllBusinessConfigs = async () => {
  const results = await getDocs(businessesCollection);
  return results.docs.map((doc) => doc.data());
};

export const getBusinessConfig = async (businessId: string) => {
  const results = await getDoc(doc(businessesCollection, businessId));
  return results.data();
};

/*
 * USERS
 */
export const createUserInDbIfNotFound = (uid: string) => {
  const docRef = doc(firestore, `users/${uid}`);

  const newUserData: ABUserData = {
    orders: [],
    first_name: null,
    last_name: null,
    email: null,
  };

  return setDoc(docRef, newUserData, { merge: true });
};
