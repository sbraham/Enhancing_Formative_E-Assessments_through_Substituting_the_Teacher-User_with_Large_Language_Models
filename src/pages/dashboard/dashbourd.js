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

    /* Get the location to insert into */
    const row = document.getElementById('row_of_quizzes');

    /* Create the card */
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


    row.appendChild(card_container);

    document.getElementById(`${index}`).addEventListener('click', () => takeQuiz(quiz));

    document.getElementById(`${index}_model`).addEventListener('click', () => takeQuiz(quiz));
}

function createCreateQuizCard() {
    console.log('createCreateQuizCard: Creating create quiz card');

    const row = document.getElementById('row_of_quizzes');

    const card_container = document.createElement('div');
    card_container.className = 'card-container col-sm-4';
    card_container.innerHTML = `
        <button class="btn btn-secondary new-card-button" data-bs-toggle="modal" data-bs-target="#new_quiz_modal">
            <p style="font-size: 64px;">+</p>
        </button>

        <!-- Modal -->
        <div class="modal fade" id="new_quiz_modal" tabindex="-1" aria-labelledby="new_quiz_modal_label"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <form id="create_quiz_form">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="new_quiz_modal_label">Create New Quiz</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                        </div>

                        <!-- Form for creating a new quiz -->
                        <div class="modal-body">
                            <!-- Quiz Title -->
                            <div class="mb-3">
                                <label for="quiz_title" class="form-label">Title</label>
                                <input type="text" class="form-control" id="quiz_title" required
                                    placeholder="Enter quiz title">
                            </div>

                            <!-- Quiz Description -->
                            <div class="mb-3">
                                <label for="quiz_description" class="form-label">Description</label>
                                <textarea class="form-control" id="quiz_description" rows="3"
                                    placeholder="Enter quiz description"></textarea>
                            </div>

                            <!-- Number of Questions -->
                            <div class="mb-3">
                                <label for="number_of_questions" class="form-label">Number of Questions</label>
                                <div class="row align-items-center">
                                    <div class="col-sm-9">
                                        <input type="number" class="form-control" id="number_of_questions" required
                                            placeholder="Enter number of questions" min="0" max="20">
                                    </div>

                                    <!-- Endless Checkbox -->
                                    <div class="col-sm">
                                        <input class="form-check-input" type="checkbox" value=""
                                            id="endless_checkbox">
                                    </div>
                                    <div class="col-sm">
                                        <label class="form-check-label" for="endless_checkbox">
                                            Endless
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <!-- Question Type -->
                            <div class="mb-3">
                                <label for="question_type" class="form-label">Question Type</label>
                                <select class="form-select" id="question_type" required>
                                    <option value="multiple_choice" selected>Multiple Choice</option>
                                    <option value="true_or_false">True/False</option>
                                    <option value="short_answer">Short Answer</option>
                                </select>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <!-- Button to close the modal -->
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>

                            <!-- Another button to take the quiz -->
                            <button id="createQuizButton" type="submit" class="btn btn-success card-button">
                                <div class="cut-text-1">Create Quiz</div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    row.appendChild(card_container);

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

/* Start of the script */
console.log(`dashbourd: checking login`);
await checkLogin(`../login/login.html`);

const quizzes_data_test = await getUserQuizzes();

console.log(`dashbourd: quizzes_data_test:`, quizzes_data_test);

if (quizzes_data_test.length == 0) {

    console.log('~~~');

    const quiz1 = new Quiz(`GCSE AQA History Norman England 1066-1100`, `The Norman Rule in England`, 5, 'short_answer');
    await quiz1.generateQuestions();

    const quiz2 = new Quiz(`Tayler Swift`, `Lyrics`, 5, 'short_answer');
    await quiz2.generateQuestions();

    // await addQuizToDB(quiz);

    console.log('~~~');
}

console.log(`dashbourd: fetching user quizzes`);
const quizzes_data = await getUserQuizzes();
const user_quizzes = [];

console.log(`dashbourd: creating quiz cards`);
quizzes_data.forEach(quiz_data => {
    const quiz = Quiz.fromObject(quiz_data.quiz);
    user_quizzes.push(quiz); // Add quiz to user quizzes

    createQuizCard(quiz);
});

createCreateQuizCard()

const loading_spinner = document.getElementById("loading_spinner");

if (loading_spinner) {
    loading_spinner.remove();
}