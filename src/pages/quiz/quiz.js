console.log('Loading: quiz.js');

import { getQuizById } from "../../firebase/database-helper.js";
import { Quiz } from "../../classes/Quiz.js";

/* Get DOM elements */
const quiz_form = document.getElementById('quiz_form');

/* Get quiz_id from URL */
const quiz_id = new URLSearchParams(window.location.search).get('quiz_id');

/* Get quiz from database */
console.debug(`quiz: quiz_id:`, quiz_id);
console.debug(`quiz: get quiz from database`);

console.debug(`quiz: getQuizById: awaiting...`);
const quiz_data = await getQuizById(quiz_id);
const quiz = Quiz.fromObject(quiz_data.quiz);
console.debug(`quiz: getQuizById: returned`);
console.debug(`quiz: getQuizById: quiz:`, quiz);

/* Set quiz related listeners */
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

let given_answer;

quiz_form.addEventListener('submit', async (event) => {
    try {
        console.log(`Quiz: quiz_form submitted`);

        event.preventDefault(); // Prevents the page from reloading when the form is submitted.

        if (quiz.quiz_type == 'multiple_choice') {
            const data = new FormData(quiz_form);

            for (const value of data) {
                given_answer = Number(value[1]);
            }
        } else if (quiz.quiz_type == 'true_false') {
            console.warn(`Quiz: true_or_false is not implemented!`);
        } else if (quiz.quiz_type == 'short_answer') {
            given_answer = quiz_form.short_answer.value;
        }

        console.log(`given_answer:`, given_answer);

        await quiz.submitAnswer(given_answer);
    } catch (error) {
        console.error(error);
    }
});

/* Start quiz */
quiz.startQuiz();

/* Run quiz */
while (quiz.isRunning) {
    // Wait for quiz to finish
}

/* Move to feedback page */
url = `feedback.html?given_answers=${quiz._given_answers}`;

window.location.href = url;