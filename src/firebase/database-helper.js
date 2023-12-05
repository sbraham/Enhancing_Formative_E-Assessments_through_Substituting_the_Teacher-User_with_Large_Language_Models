console.log('Loading: firebase/database-helper.js');

/* Importing Firebase features */
import { doc, getDoc, getDocs, setDoc, addDoc, query, where, collection } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js';

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
        let quizzes_data = [];

        // Get a list of all the user's quizzes
        const querySnapshot = await getDocs(query(
            collection(db, user)
        ));

        // For each quiz, add it to the list
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.debug(`database-helper: getUserQuizzes:`, doc.id, " => ", doc.data());
            quizzes_data.push(doc.data());
        });

        return quizzes_data;
    } catch (error) {
        console.error(`database-helper: getUserQuizzes: Error adding document:`, error);
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
        // Get the user's id token
        const user = await checkLogin();
        if (user == null) {
            console.error(`User is not logged in`);
            return;
        }

        console.debug(`database-helper: addQuizToDB: User:`, user);

        // Save space in memory and save the id
        const docRef = await addDoc(collection(db, user), {
            quiz: null
        });
        console.log(`database-helper: addQuizToDB: Document written with ID:`, docRef.id);

        quiz.id = docRef.id;

        console.debug(`database-helper: addQuizToDB: Quiz:`, quiz);

        // Convert quiz to a plain JavaScript object
        const plainQuiz = JSON.parse(JSON.stringify(quiz));

        // Add a new document in collection "cities"
        await setDoc(doc(db, user, docRef.id), {
            quiz: plainQuiz
        });
    } catch (error) {
        console.error(`database-helper: addQuiz: Error adding document:`, error);
    }
}

/**
 * Retrieves the quizzes associated with the logged-in user from the database.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of quiz objects.
 */
export async function getQuizById(quiz_id) {
    console.log(`database-helper: getQuizById`);

    try {
        const user = await checkLogin();

        const docSnap = await getDoc(doc(db, user, quiz_id));

        if (docSnap.exists()) {
            console.debug("database-helper: getQuizById: quiz data:", docSnap.data());
        } else {
            // docSnap.data() will be undefined in this case
            console.log("database-helper: getQuizById: No such document!");
        }

        return docSnap.data();
    } catch (error) {
        console.error(`database-helper: getQuizById: Error adding document:`, error);
        return null;
    }
}