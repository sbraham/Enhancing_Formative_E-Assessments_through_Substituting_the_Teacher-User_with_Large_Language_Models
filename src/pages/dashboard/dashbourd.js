console.log('Loading: dashbourd.js');

/* Importing Firebase helper functions from setup file */
import { checkLogin } from "../../firebase/auth-helper.js";
import { addQuiz } from "../../firebase/database-helper.js";

let index = 0;

/* Function to create a new Quiz Card */
function createQuizCard(quiz_title, quiz_description) {
    console.log('createQuizCard: Creating quiz card');

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
                                <button type="button" class="btn btn-danger delete_quiz_button">
                                    <div class="cut-text-1">Delete Quiz</div>
                                </button>
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

    console.debug('createQuizCard: Quiz card created: ', card_container);
}

function addNewQuiz() {
    console.log('addNewQuiz: Creating quiz');

    // Getting the values from the form
    const quiz_title = document.getElementById('quiz_title').value;
    const quiz_description = document.getElementById('quiz_description').value;
    const number_of_questions = document.getElementById('number_of_questions').value;
    const question_type = document.getElementById('questionType').value;

    createQuizCard(quiz_title, quiz_description);


    // Clearing the form
    document.getElementById('quiz_title').value = '';
    document.getElementById('quiz_description').value = '';
    document.getElementById('number_of_questions').value = '';
    document.getElementById('questionType').value = '';

    const quiz = {
        quiz_title: quiz_title,
        quiz_description: quiz_description,
        number_of_questions: number_of_questions,
        question_type: question_type
    };
}

function takeQuiz() {
    console.log('takeQuiz: Redirecting to quiz page');
    
    window.location.href = '../quiz/quiz.html'; // Replace with the desired URL
}

/* Adding event listeners */
document.querySelectorAll('.take_quiz_button').forEach(button => {
    // console.log('Adding event listener to button', button);
    button.addEventListener('click', takeQuiz);
});

document.getElementById('create_quiz_form').addEventListener('submit', event => {
    event.preventDefault(); // Prevents the default behaviour of the form
    
    addNewQuiz()
});

/* Start of the script */
checkLogin(`../login/login.html`);

for (let i = 1; i < 6; i++) {
    createQuizCard(`Quiz ${i}`, `This is the description of quiz ${i}`);
}

import { Quiz } from "../../classes/Quiz.js"

const quiz = new Quiz("Test Quiz", "This is a test quiz", 10);

addQuiz(quiz);
