console.log('Loading: firebase/database-helper.js');

/* Importing Firebase features */
import * as authentication from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';
import { addDoc, collection } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js';

import { checkLogin } from './auth-helper.js';

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
        const user = checkLogin("../pages/login/login.html");

        console.log(`addQuiz(): Adding quiz to database:`, quiz.title);
        console.debug(`addQuiz(): User:`, user);
        console.debug(`addQuiz(): Quiz:`, quiz);

        // Add a new document with a generated id.
        const docRef = await addDoc(collection(window.db, user), {
            quiz
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("addQuiz(): Error adding document: ", error);
    }
}

export async function getUserQuizzes() {
    try {
        const querySnapshot = await firestore.getDocs(
            firestore.query(collection(window.db, "quiz"),
                firestore.where("user", "==", auth.currentUser))
        );
        console.log("Document written with ID: ", querySnapshot.data());
    } catch (e) {
        console.error("getUserQuizzes(): Error adding document: ", e);
    }
}