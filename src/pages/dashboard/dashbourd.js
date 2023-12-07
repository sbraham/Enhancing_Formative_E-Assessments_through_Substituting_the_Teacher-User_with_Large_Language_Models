console.log('Loading: dashbourd.js');

/* Importing Firebase helper functions from setup file */
import { checkLogin } from "../../firebase/auth-helper.js";
import { getUserQuizzes, addQuizToDB } from "../../firebase/database-helper.js";

import { Quiz } from "../../classes/Quiz.js";

let index = 0;

/* Function to create a new Quiz Card */
function createQuizCard(quiz) {
    console.log('createQuizCard: Creating quiz card:', quiz.id);

    index++;

    const row = document.getElementById('row_of_quizzes');
    const card_container = document.createElement('div');
    card_container.className = 'card-container col-sm-4';
    card_container.innerHTML = `
        <div class="card height-100">
            <div class="card-header">
                <h4 class="cut-text-1">${quiz.title}</h4>
            </div>
            <div class="card-body padding-10">
                <p class="card-text cut-text-3">
                    ${quiz.description}
                </p>
            </div>
            <div class="card-footer">
                <div class="row">
                    <button type="button" class="btn btn-primary card-button" data-bs-toggle="modal"
                        data-bs-target="#details_modal_${index}">
                        <div class="cut-text-1">Details</div>
                    </button>
                    <button type="button" class="btn btn-success card-button" id="${index}">
                        <div class="cut-text-1">Take Quiz</div>
                    </button>
                </div>
                <div class="modal fade" id="details_modal_${index}" tabindex="-1" aria-labelledby="details_modal_${index}_label"
                    aria-hidden="true">
                    <div class="modal-dialog modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="details_modal_${index}_label">${quiz.title}</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                ${quiz.description}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary"
                                    data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-danger delete_quiz_button">
                                    <div class="cut-text-1">Delete Quiz</div>
                                </button>
                                <button type="button" class="btn btn-success card-button" id="${index}_model">
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

    document.getElementById(`${index}`).addEventListener('click', () => takeQuiz(quiz));

    document.getElementById(`${index}_model`).addEventListener('click', () => takeQuiz(quiz));
}

function addNewQuiz() {
    console.log('addNewQuiz: Creating quiz');

    // Getting the values from the form
    const quiz_title = document.getElementById('quiz_title').value;
    const quiz_description = document.getElementById('quiz_description').value;
    const number_of_questions = document.getElementById('number_of_questions').value;
    const endless_checkbox = document.getElementById('endless_checkbox').value;
    const question_type = document.getElementById('question_type').value;

    const quiz = new Quiz(quiz_title, quiz_description, number_of_questions, question_type, endless_checkbox);

    createQuizCard(quiz);

    addQuizToDB(quiz);

    // Clearing the form
    document.getElementById('quiz_title').value = '';
    document.getElementById('quiz_description').value = '';
    document.getElementById('number_of_questions').value = '';
    document.getElementById('endless_checkbox').value = '';
    document.getElementById('question_type').value = '';
}

function takeQuiz(quiz) {
    const quiz_id = quiz.id;

    console.log('takeQuiz: Redirecting to quiz page:', quiz_id);
    console.log('--------------------------------------------------');

    // Construct the URL with the quiz_id as a query parameter
    const url = `../quiz/quiz.html?quiz_id=${quiz_id}`;

    window.location.href = url; // Redirect to the quiz page with the quiz_id
}

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
console.log(`dashbourd: checking login`);
await checkLogin(`../login/login.html`);

console.log('~~~');

const quizzes_data_test = await getUserQuizzes();
if (quizzes_data_test.length == 0) {

    /* make a bunch of random quizzes */
    for (let i = 0; i < 2; i++) {
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        const quiz = new Quiz(`Quiz ${randomNumber}`, `This is a quiz description`);

        await addQuizToDB(quiz);
    }

}

console.log('~~~');

console.log(`dashbourd: fetching user quizzes`);
const quizzes_data = await getUserQuizzes();
const user_quizzes = [];

console.log(`dashbourd: creating quiz cards`);
quizzes_data.forEach(quiz_data => {
    const quiz = Quiz.fromObject(quiz_data.quiz);
    user_quizzes.push(quiz); // Add quiz to user quizzes

    createQuizCard(quiz);
});