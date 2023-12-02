console.log('Loading: firebase/database-helper.js');

/* Importing Firebase features */
import { addDoc, collection } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js';

import { auth, db } from './config.js';
import { getUserUid } from './auth-helper.js';

/**
 * Helper functions for Firebase authentication.
 * @module database-helper
 */

/**
 * Add a quiz to the database.
 * @param {JSON} quiz - The quiz to be added to the database.
 */
export async function addQuiz(quiz) {
    console.log(`database-helper: Adding a quiz to the database`);
    console.debug(`database-helper: quiz:`, quiz);

    try {
        const user = await getUserUid();

        console.log(`database-helper: addQuiz: Adding quiz to database:`, quiz.title);
        console.debug(`database-helper: addQuiz: User:`, user);
        console.debug(`database-helper: addQuiz: Quiz:`, quiz);

        // Add a new document with a generated id.
        const docRef = await addDoc(collection(db, user), {
            quiz
        });
        console.log(`database-helper: addQuiz: Document written with ID:`, docRef.id);
    } catch (error) {
        console.error(`database-helper: addQuiz: Error adding document:`, error);
    }
}

export async function getUserQuizzes() {
    console.log(`database-helper: getUserQuizzes`);

    try {
        const querySnapshot = await firestore.getDocs(
            firestore.query(collection(window.db, "quiz"),
                firestore.where("user", "==", auth.currentUser))
        );
        console.log(`database-helper: getUserQuizzes: Document written with ID:`, querySnapshot.data());
    } catch (e) {
        console.error(`database-helper: getUserQuizzes: Error adding document:`, e);
    }
}