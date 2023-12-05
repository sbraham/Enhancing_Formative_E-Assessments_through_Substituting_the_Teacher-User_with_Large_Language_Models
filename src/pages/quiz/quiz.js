console.log('Loading: quiz.js');

import { getQuizById } from "../../firebase/database-helper.js";
import { Quiz } from "../../classes/Quiz.js";

/* Get DOM elements */
const quiz_form = document.getElementById('quiz_form');

const quiz_id = new URLSearchParams(window.location.search).get('quiz_id');

console.debug(`quiz: quiz_id:`, quiz_id);
console.debug(`quiz: get quiz from database`);

const quiz_data = await getQuizById(quiz_id);
const quiz = Quiz.fromObject(quiz_data.quiz);

quiz.startQuiz();

let given_answer;
let quiz_finished = false;
quiz_form.addEventListener('submit', (event) => {
    try {
        console.log(`quiz_form submitted`);

        event.preventDefault(); // Prevents the page from reloading when the form is submitted.

        const data = new FormData(quiz_form);

        for (const value of data) {
            given_answer = Number(value[1]);
        }

        console.log(`given_answer:`, given_answer);

        quiz_finished = quiz.submitAnswer(given_answer);
    } catch (error) {
        alert(error);
    }
});
