console.log('Loading: quiz.js');

import { getQuizById } from "../../firebase/database-helper.js";
import { Quiz } from "../../classes/Quiz.js";

/* Get DOM elements */
const quiz_form = document.getElementById('quiz_form');

/* Get quiz_id from URL */
const quiz_id = new URLSearchParams(window.location.search).get('quiz_id');

/* Get quiz from database */
console.debug(`getQuizById: awaiting...`);
const quiz_data = await getQuizById(quiz_id);
console.debug(`quiz: getQuizById: returned`);

/* Create quiz object */
const quiz = Quiz.fromObject(quiz_data.quiz);

/* Set previous_button listener */
document.getElementById('previous_button').addEventListener('click', () => {
    quiz.resetQuizForm();
    quiz.enableQuizForm();
    quiz.removeWheel();

    quiz.getPreviousQuestion();

    if (quiz._question_index === 1) {
        document.getElementById('previous_button').disabled = true;
    }

    quiz.displayQuestion();
});


/* Set next_button listener */
let given_answer;

quiz_form.addEventListener('submit', async (event) => {
    try {
        event.preventDefault(); // Prevents the page from reloading when the form is submitted.

        if (quiz.quiz_type == 'multiple_choice') {
            const data = new FormData(quiz_form);

            for (const value of data) {
                given_answer = Number(value[1]);
            }
        } 
        
        else if (quiz.quiz_type == 'short_answer') {
            given_answer = quiz_form.short_answer.value;
        }

        await quiz.submitAnswer(given_answer);
    } 
            
    catch (error) {
        throw error;
    }
});

/* Start quiz */
quiz.startQuiz();

/** The Quiz will run
 * when the final quiz has been submitted
 * the window will be redirected to the feedback page
*/

console.log('Redirecting to feedback page...');
console.log('--------------------------------------------------');

const url = `../feedback/feedback.html?given_answers=${quiz._given_answers}`;