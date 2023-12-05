console.log('Loading: dashbourd.js');

/* Importing Firebase helper functions from setup file */
import { checkLogin } from "../../firebase/auth-helper.js";
import { getUserQuizzes, addQuizToDB } from "../../firebase/database-helper.js";

import { Quiz } from "../../classes/Quiz.js";

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
    const endless_checkbox = document.getElementById('endless_checkbox').value;
    const question_type = document.getElementById('question_type').value;

    createQuizCard(quiz_title, quiz_description);

    const quiz = new Quiz(quiz_title, quiz_description, number_of_questions, question_type, endless_checkbox);

    addQuizToDB(quiz);

    // Clearing the form
    document.getElementById('quiz_title').value = '';
    document.getElementById('quiz_description').value = '';
    document.getElementById('number_of_questions').value = '';
    document.getElementById('endless_checkbox').value = '';
    document.getElementById('question_type').value = '';
}

function takeQuiz() {
    console.log('takeQuiz: Redirecting to quiz page');

    window.location.href = '../quiz/quiz.html'; // Replace with the desired URL
}

document.querySelectorAll('.take_quiz_button').forEach(button => {
    // console.log('Adding event listener to button', button);
    button.addEventListener('click', takeQuiz);
});

document.getElementById('endless_checkbox').addEventListener('change', () => {
    if (document.getElementById('endless_checkbox').checked) {
        document.getElementById('number_of_questions').disabled = true;
        document.getElementById('number_of_questions').value = '';
    } else {
        document.getElementById('number_of_questions').disabled = false;
        document.getElementById('number_of_questions').value = placeholder;
    }
});


document.getElementById('create_quiz_form').addEventListener('submit', event => {
    event.preventDefault(); // Prevents the default behaviour of the form

    addNewQuiz()
});

/* Start of the script */
await checkLogin(`../login/login.html`);

const quizzes = await getUserQuizzes();

quizzes.forEach(quiz => {
    console.log(quiz);
    createQuizCard(quiz.title, quiz.description);
});