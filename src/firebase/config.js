console.log("firebase/config.js loaded");

/* Importing Firebase SDK from the CDN (Content Delivery Network) */
import * as firebase from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js';
import * as authenticator from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';
import * as firestore from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

/* Configuring Firebase SDK (Software Development Kit) */
const firebaseConfig = {
    apiKey: "AIzaSyDYs62LawEuFZ4zqox4rs3o_rD2fpRmeXc",
    authDomain: "sxb1567-diss.firebaseapp.com",
    projectId: "sxb1567-diss",
    storageBucket: "sxb1567-diss.appspot.com",
    messagingSenderId: "851005068985",
    appId: "1:851005068985:web:76c8d5b4fb069bc8c6ad68",
    measurementId: "G-W66SC8SGKH"
};

/* Initializing Firebase */
export const app = firebase.initializeApp(firebaseConfig);
export const auth = authenticator.getAuth(app);
export const db = firestore.getFirestore(app);