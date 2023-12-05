console.log('Loading: firebase/database-helper.js');

/* Importing Firebase features */
import { getDocs, query, where, addDoc, collection } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js';

import { auth, db } from './config.js';
import { checkLogin } from './auth-helper.js';


/**
 * Retrieves the quizzes associated with the logged-in user from the database.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of quiz objects.
 */
export async function getUserQuizzes() {
    console.log(`database-helper: getUserQuizzes`);

    try {
        const user = await checkLogin();
        let user_quizes = [];

        // Get a list of all the user's quizzes
        const querySnapshot = await getDocs(query(
            collection(db, user)
        ));
        
        // For each quiz, add it to the list
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.debug(`database-helper: getUserQuizzes:`, doc.id, " => ", doc.data());
            user_quizes.push(doc.data());
        });

        return user_quizes;
    } catch (e) {
        console.error(`database-helper: getUserQuizzes: Error adding document:`, e);
        return [];
    }
}

/**
 * Add a quiz to the database.
 * @param {JSON} quiz - The quiz to be added to the database.
 */
export async function addQuizToDB(quiz) {
    console.log(`database-helper: addQuizToDB: Adding a quiz to the database`, quiz.title);

    try {
        const user = await checkLogin();

        console.debug(`database-helper: addQuizToDB: User:`, user);
        console.debug(`database-helper: addQuizToDB: Quiz:`, quiz);

        // Convert quiz to a plain JavaScript object
        const plainQuiz = JSON.parse(JSON.stringify(quiz));

        // Add a new document with a generated id.
        const docRef = await addDoc(collection(db, user), {
            quiz: plainQuiz
        });
        console.log(`database-helper: addQuiz: Document written with ID:`, docRef.id);
    } catch (error) {
        console.error(`database-helper: addQuiz: Error adding document:`, error);
    }
}