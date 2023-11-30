console.log('firebase/database-helper.js loaded');

/* Importing Firebase features */
import * as firestore from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';

import { auth, db } from "./config.js";

/**
 * Helper functions for Firebase authentication.
 * @module database-helper
 */

/**
 * Add a quiz to the database.
 * @param {JSON} quiz - The quiz to be added to the database.
 */
export async function addQuiz(quiz) {
    try {
        const docRef = await firestore.addDoc(collection(db, "quiz"), {
            user: auth.currentUser,
            quiz: quiz
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("addQuiz(): Error adding document: ", e);
    }
}


export async function getUserQuizzes(quiz) {
    try {
        const querySnapshot = await firestore.getDocs(
            firestore.query(collection(db, "quiz"), 
            firestore.where("user", "==", auth.currentUser))
        );
        console.log("Document written with ID: ", querySnapshot.data());
    } catch (e) {
        console.error("getUserQuizzes(): Error adding document: ", e);
    }
}