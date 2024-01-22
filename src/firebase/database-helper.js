console.log('Loading: firebase/database-helper.js');

/* Importing Firebase features */
import { doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query, collection } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js';

/* Importing Firebase config */
import { auth, db } from './config.js';

/* Importing auth helper */
import { checkLogin } from './auth-helper.js';



/**
 * Retrieves the quizzes associated with the logged-in user from the database.
 * 
 * @async
 * @returns {Promise<Array<Object>>} An array of quiz objects.
 * @throws {Error} If there is an error retrieving the quizzes.
 */
export async function getUserQuizzes() {
    console.log(`getUserQuizzes: Retrieving the quizzes associated with the logged-in user from the database`);

    const quizzes_data = [];

    try {
        const user = await checkLogin();

        if (user == null) {
            console.warn(`getUserQuizzes: User is not logged in. Returning empty array.`);
            return quizzes_data;
        }

        /* Get all the quizzes associated with the user */
        console.debug(`getDocs: awaiting response...`);
        const querySnapshot = await getDocs(query(
            collection(db, user)
        ));
        console.log(`getDocs: received`);

        /* For each quiz, add it to the list of quizzes */
        querySnapshot.forEach((doc) => {
            /* doc.data() is never undefined for query doc snapshots */
            quizzes_data.push(doc.data());
        });

        return quizzes_data;
    } 
            
    catch (error) {
        throw error;
    }
}

/**
 * Adds a quiz to the database.
 * 
 * @async
 * @param {Object} quiz - The quiz object to be added.
 * @returns {Promise<void>} - A promise that resolves when the quiz is successfully added to the database.
 * @throws {Error} - If the user is not logged in, an error is thrown.
 */
export async function addQuizToDB(quiz) {
    console.log(`addQuizToDB: Adding a quiz to the database:`, quiz.title);

    try {
        /* Get the user's id token */
        const user = await checkLogin();
        
        if (user == null) {
            throw new Error(`User is not logged in. Cannot add quiz to database.`);
        }

        /* Save space in memory and save the docRef */
        console.debug(`addDoc: awaiting response...`);
        const docRef = await addDoc(collection(db, user), {
            quiz: null
        });
        console.debug(`addDoc: received`);

        /* Add the quiz id to the quiz object */
        quiz.id = docRef.id;

        /* Make an unattached copy of the quiz, so changes to quiz don't effect this object */
        const quiz_copy = JSON.parse(JSON.stringify(quiz));

        /* Add the quiz in the previous location in the Databse */
        console.debug(`setDoc: awaiting response...`);
        await setDoc(doc(db, user, docRef.id), {
            quiz: quiz_copy
        });
        console.debug(`setDoc: received`);

    } 
            
    catch (error) {
        throw error;
    }
}

export async function updateQuizAttempts(quiz) {
    console.log(`updateQuizAttempts: Updating the attempts of a quiz in the database:`, quiz.id);

    /* Check if the quiz is valid */
    if (quiz.id == null) {
        throw new Error(`Quiz does not have an ID. Cannot update quiz attempts.`);
    }

    if (quiz.attempts.length === 0) {
        console.warn(`updateQuizAttempts: Quiz has no attempts. Cannot update quiz attempts.`);
        return;
    }

    try {
        /* Get the user's id token */
        const user = await checkLogin();
        
        if (user == null) {
            throw new Error(`User is not logged in. Cannot update quiz attempts.`);
        }

        /* Update the quiz in the database */
        await updateDoc(quiz.id, {
            attempts: quiz.attempts
        });
    } 
            
    catch (error) {
        throw error;
    }
}

/**
 * Removes a quiz from the database.
 * 
 * @async
 * @param {Object} quiz - The quiz object to be removed.
 * @returns {Promise<void>} - A promise that resolves when the quiz is successfully removed.
 * @throws {Error} - If the user is not logged in, an error is thrown.
 */
export async function removeQuizFromDB(quiz) {
    console.log(`removeQuizFromDB: Removing a quiz from the database:`, quiz.title);

    try {
        /* Get the user's id token */
        const user = await checkLogin();
        
        if (user == null) {
            throw new Error(`User is not logged in. Cannot remove quiz from database.`);
        }

        /* Remove the quiz from the database */
        console.debug(`deleteDoc: awaiting response...`);
        await deleteDoc(doc(db, user, quiz.id));
        console.debug(`deleteDoc: received`);

    } 
            
    catch (error) {
        throw error;
    }
}

/**
 * Retrieves a quiz by its ID from the Firebase database.
 * @param {string} quiz_id - The ID of the quiz to retrieve.
 * @returns {Promise<Object|null>} - A promise that resolves to the quiz data if it exists, or null if it doesn't.
 */
export async function getQuizById(quiz_id) {
    console.log(`getQuizById: Retrieving a quiz by its ID from the Firebase database`);

    try {
        const user = await checkLogin();

        if (user == null) {
            console.warn(`getQuizById: User is not logged in. Returning null.`);
            return null;
        }

        /* Get all the quizzes associated with the user */
        console.debug(`getDoc: awaiting response...`);
        const docSnap = await getDoc(doc(db, user, quiz_id));
        console.debug(`getDoc: received`);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.warn(`getQuizById: No such document. Returning null.`);
            return null;
        }

    } 
            
    catch (error) {
        throw error;
    }
}