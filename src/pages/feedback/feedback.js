console.log('Loading: feedback.js');

import { generateFeedback } from "../../text-generation/feedback-generation.js";

/* Get DOM elements */
const house_of_cards = document.getElementById('house_of_cards');
const dashboard_button = document.getElementById('dashboard_button');

/* Global variables */
let card = ``;
let wrong_answers = [];

/* Functions */

/**
 * Creates a card element based on the provided answer and index.
 * If the answer is correct, a success card is created.
 * If the answer is incorrect, a danger card is created and the answer is added to the wrong_answers array.
 * 
 * @param {Object} answer - The answer object containing question, given_answer, correct_answer, and correct properties.
 * @param {number} index - The index of the question.
 */
function createCard(answer, index) {
    if (answer.isCorrect) {
        card = (`
            <div class="card m-3 bg-success-subtle">
                <div class="card-header">
                    <h4 class="cut-text-1">Question ${index}</h4>
                </div>
                <div class="card-body">
                    <h5 class="card-title">Question:</h5>
                    <p class="card-title">${answer.question}</p>
                    <h5 class="card-title">Answer:</h5>
                    <p class="card-text">${answer.given_answer}</p>
                </div>
                <div class="card-footer">
                    <p class="card-text">Correct ✅</p>
                </div>
            </div>
        `);
    } else {
        card = (`
            <div class="card m-3 bg-danger-subtle">
                <div class="card-header">
                    <h4 class="cut-text-1">Question ${index}</h4>
                </div>
                <div class="card-body">
                    <h5 class="card-title">Question:</h5>
                    <p class="card-title">${answer.question}</p>
                    <h5 class="card-title">Given Answer:</h5>
                    <p class="card-text">${answer.given_answer}</p>
                    <h5 class="card-title">Correct Answer:</h5>
                    <p class="card-text">${answer.correct_answer}</p>
                    <h5 class="card-title">Feedback:</h5>
                    <div class="card-text" id="feedback-${index}"> 
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <p class="card-text">Incorrect ❌</p>
                </div>
            </div>
        `);
    }

    house_of_cards.innerHTML += card
}

/* Event Listeners */   
dashboard_button.addEventListener('click', function () {

    console.log('dashboard_button clicked');
    console.log('Redirecting to dashboard...');
    console.log('--------------------------------------------------');

    const url = `../dashboard/dashboard.html`;

    window.location.href = url;
});

/* Get given_answers from URL */
const given_answers_string = new URLSearchParams(window.location.search).get('given_answers');

/* Turn the given_answers into an array of answers objects */
const given_answers = given_answers_string ? JSON.parse(given_answers_string) : [];

/* Set index to 1 */
let index = 1;

/* For each answer */
given_answers.forEach((answer) => {
    /* Create a card */
    createCard(answer, index);

    /* If the answer is incorrect, add it to the wrong_answers array */
    if (answer.isCorrect === false) {
        wrong_answers.push(answer, index);
    }

    /* Increment index */
    index++;
});

/* Generate feedback for incorrect answers */

// TO DO - make sure that the the right question is handed to the generateFeedback function and are inserted into the right card

// put a bunch of logs in it so you can tell what zee fuck its doing
// It's not assigning or generating the first questions feedback for some reasong - TO DO

try {
    wrong_answers.forEach(async (answer, index) => {
        let feedback = await generateFeedback(answer);

        let feedback_element = document.getElementById(`feedback-${index}`);
        feedback_element.innerHTML = `<p>${feedback}</p>`;
    });
} catch (error) {
    throw new Error(error);
}
