console.log('quiz.js loaded');

/* Get Quiz object */
import { Quiz } from './Quiz_object.js';

/* Get DOM elements */
const quiz_form = document.getElementById('quiz_form');

const quiz = new Quiz("My Really Cool Quiz", "A cool quiz about beans", 12);

quiz.startQuiz();

let given_answer;
let quiz_finished = false;
quiz_form.addEventListener('submit', (event) => {
    console.log(`quiz_form submitted`);

    event.preventDefault(); // Prevents the page from reloading when the form is submitted.

    const data = new FormData(quiz_form);

    for (const value of data) {
        given_answer = Number(value[1]);
    }

    console.log(`given_answer:`, given_answer);

    quiz_finished = quiz.submitAnswer(given_answer);
});