import { FirebaseOptions, getApp, initializeApp } from "firebase/app";

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

export default firebaseApp;