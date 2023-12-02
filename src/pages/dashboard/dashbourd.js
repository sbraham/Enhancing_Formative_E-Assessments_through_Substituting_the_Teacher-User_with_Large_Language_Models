console.log('dashbourd.js loaded');

/* Importing Firebase helper functions from setup file */
import { checkLogin } from "../../firebase/auth-helper.js";

let index = 0;

/* Function to create a new Quiz Card */
function createQuizCard(quiz_title, quiz_description) {
    index++;

    const row = document.getElementById('row_of_quizzes');
    const card_container = document.createElement('div');
    card_container.className = 'card-container col-sm-4';
    card_container.innerHTML = `
        <div class="card height-100">
            <div class="card-header">
                <h4 class="cut-text-1">${quiz_title}</h4>
            </div>
            <div class="card-body padding-10">
                <p class="card-text cut-text-3">
                    ${quiz_description}
                </p>
            </div>
            <div class="card-footer">
                <div class="row">
                    <button type="button" class="btn btn-primary card-button" data-bs-toggle="modal"
                        data-bs-target="#details_modal_${index}">
                        <div class="cut-text-1">Details</div>
                    </button>
                    <button type="button" class="btn btn-success card-button take_quiz_button">
                        <div class="cut-text-1">Take Quiz</div>
                    </button>
                </div>
                <div class="modal fade" id="details_modal_${index}" tabindex="-1" aria-labelledby="details_modal_${index}_label"
                    aria-hidden="true">
                    <div class="modal-dialog modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="details_modal_${index}_label">${quiz_title}</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                ${quiz_description}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary"
                                    data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-success card-button take_quiz_button">
                                    <div class="cut-text-1">Take Quiz</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    row.insertBefore(card_container, row.lastElementChild);
}

function takeQuiz() {
    console.log('Redirecting to quiz');
    window.location.href = '../quiz/quiz.html'; // Replace with the desired URL
}

/* Adding event listeners */
document.querySelectorAll('.take_quiz_button').forEach(button => {
    // console.log('Adding event listener to button', button);
    button.addEventListener('click', takeQuiz);
});

document.getElementById('create_quiz_form')

/* Start of the script */

checkLogin(`../login/login.html`);

createQuizCard('Quiz 1', 'This is a quiz about something This is a quiz about something This is a quiz about somethingThis is a quiz about somethingThis is a quiz about somethingThis is a quiz about something This is a quiz about something');
createQuizCard('Quiz 2', 'This is a quiz about something');
createQuizCard('Quiz 3', 'This is a quiz about something');
