import { FirebaseOptions, getApp, initializeApp } from "firebase/app";

const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.FNEXT_PUBLIC_IREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

function createFirebaseApp(firebaseConfig: FirebaseOptions) {
	try {
		return getApp();
	} catch {
		return initializeApp(firebaseConfig);
	}
}

const firebaseApp = createFirebaseApp(firebaseConfig);

export default firebaseApp;