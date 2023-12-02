console.log("Loading: firebase/config.js");

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
window.app = firebase.initializeApp(firebaseConfig);
console.debug("Firebase initialized:", window.app);

window.auth = firebase.auth(window.app);
console.debug("Firebase auth initialized:", window.auth);

window.db = firebase.firestore(window.app);
console.debug("Firebase firestore initialized:", window.db);