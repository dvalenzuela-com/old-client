import { AlabarraProduct } from "alabarra-types";
import { FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import { collection, DocumentData, FirestoreDataConverter, getDocs, getFirestore, orderBy, query, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
    apiKey: "AIzaSyByFFP4aIvH3eHSuOFp-skrn2rLnSYsRcI",
    authDomain: "alabarra-5d7c3.firebaseapp.com",
    projectId: "alabarra-5d7c3",
    storageBucket: "alabarra-5d7c3.appspot.com",
    messagingSenderId: "961611564816",
    appId: "1:961611564816:web:da92f3e1e984b3aa6b8795"
};


function createFirebaseApp(firebaseConfig: FirebaseOptions) {
	try {
		return getApp();
	} catch {
		return initializeApp(firebaseConfig);
	}
}

const firebaseApp = createFirebaseApp(firebaseConfig);

const firestore =  getFirestore(firebaseApp);
export default firestore;

/**
 * Products
 */

 const productConverter: FirestoreDataConverter<AlabarraProduct> = {
	toFirestore(product: WithFieldValue<AlabarraProduct>): DocumentData {
		return product;
	},
	fromFirestore(
		snapshot: QueryDocumentSnapshot,
		options: SnapshotOptions
	): AlabarraProduct {
		const data = snapshot.data(options);
		data.id = snapshot.id
		return data as AlabarraProduct;
	},
};

const productsCollection = collection(firestore, 'products').withConverter(productConverter)

export const allProductsQuery = query<AlabarraProduct>(productsCollection, orderBy('created_at', 'desc'));


/**
 * Tables
 */

export const getAllTableIds = async () => {
    const results = await getDocs(collection(firestore, 'tables'))
    return results.docs.map(doc => doc.id)
}