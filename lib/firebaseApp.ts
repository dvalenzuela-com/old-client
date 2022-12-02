import { FirebaseOptions, getApp, initializeApp } from "firebase/app";

const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
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