//build console.log('Loading: dashbourd.js');

/* Importing Firebase helper functions from setup file */
import { checkLogin } from "../../firebase/auth-helper.js";
import { getUserQuizzes, addQuizToDB, removeQuizFromDB } from "../../firebase/database-helper.js";

/* Importing Quiz class */
import { Quiz } from "../../classes/Quiz.js";

/* Assigning variables */
let index = 0;
let isGenerating = false;

const spinnerHTML = `<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>`


/**
 * Creates a quiz card and inserts it into the specified location.
 * 
 * @param {Object} quiz - The quiz object containing the quiz details.
 */
function createQuizCard(quiz) {
    //build console.log('createQuizCard: Creating quiz card:', quiz.id);

    /* Create the details table */
    const max_score = Math.max(...quiz.attempts.map(attempt => attempt.score));
    const max_score_attempt = quiz.attempts.find(attempt => attempt.score === max_score);

    let details_table = `
        <table class="table table-striped table-bordered">
            <tbody>
                <tr>
                    <th scope="row">Title</th>
                    <td>${quiz.title}</td>
                </tr>
                <tr>
                    <th scope="row">Description</th>
                    <td><div>${quiz.description}</div></td>
                </tr>
                <tr>
                    <th scope="row">Num. of Q.</th>
                    <td>${quiz.number_of_questions}</td>
                </tr>
                <tr>
                    <th scope="row">Quiz Type</th>
                    <td>${quiz.quiz_type}</td>
                </tr>
                <tr>
                    <th scope="row">Attempts</th>
                    <td>
                        <table class="table table-striped table-bordered">
                            <tbody>
                                <tr>
                                    <th scope="row">Num.</th>
                                    <td>${quiz.attempts.length}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Best Score</th>
                                    <td>${quiz.attempts.length > 0 ? max_score : 'N/A'}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Last Attempt</th>
                                    <td>${quiz.attempts.length > 0 ? quiz.attempts[0].date_time : 'N/A'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
            </tbody>
        </table>
    `;

    /* Get the location to insert into */
    const row = document.getElementById('row_of_quizzes');

    /* Create the card */
    const card_container = document.createElement('div');
    card_container.className = 'card-container col-sm-4';
    card_container.innerHTML = `
        <div class="card height-100" id="${index}">
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
                        data-bs-target="#details_${index}">
                        <div class="cut-text-1">Details</div>
                    </button>
                    <div id="take_quiz_${index}_container" class="no-spacing card-button" style="text-align: center;">
                        <button type="button" class="btn btn-success no-spacing w-100 h-100" id="take_quiz_${index}">
                            <div class="cut-text-1">Take Quiz</div>
                        </button>
                    </div>
                </div>
                <div class="modal fade" id="details_${index}" tabindex="-1" aria-labelledby="details_${index}_label"
                    aria-hidden="true">
                    <div class="modal-dialog modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="details_${index}_label">${quiz.title}</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                ${details_table}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" class="btn btn-danger delete_quiz_button" data-bs-dismiss="modal" id="delete_quiz_${index}">
                                    <div class="cut-text-1">Delete Quiz</div>
                                </button>
                                <div id="take_quiz_${index}_model_container">
                                    <button type="button" class="btn btn-success" id="take_quiz_${index}_model">
                                        <div class="cut-text-1">Take Quiz</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    /* Insert the card into the page */
    row.insertBefore(card_container, row.lastElementChild);

    /* Add event listeners to the buttons */
    document.getElementById(`take_quiz_${index}`).addEventListener('click', () => takeQuiz(quiz));
    document.getElementById(`take_quiz_${index}_model`).addEventListener('click', () => takeQuiz(quiz));
    document.getElementById(`delete_quiz_${index}`).addEventListener('click', () => deleteQuiz(quiz, index));
}


/**
 * Creates a new quiz card and adds it to the page.
 * 
 * @async
 */
function createAddNewQuizCard() {
    //build console.log('createAddNewQuizCard: Creating add_new_quiz card');

    /* Create the tooltip text */
    let tooltip_text = `The description will help you specify exactly what topics you want the quiz to cover. It will also help you remember what the quiz is about when you come back to it later. You can leave it blank for a broud quiz, give it a specific topic area to focus on, or give it a large piece of text to make the questions from. It's up to you!`;

    /* Get the location to insert into */
    const row = document.getElementById('row_of_quizzes');

    /* Create the card */
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
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="new_quiz_modal_label">Create New Quiz</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>

                    <!-- Form for creating a new quiz -->
                    <div class="modal-body">
                        <form id="create_quiz_form">
                            <!-- Quiz Title -->
                            <div class="mb-3">
                                <label for="quiz_title" class="form-label">Title</label>
                                <input type="text" class="form-control" id="quiz_title" required
                                    placeholder="Enter quiz title">
                            </div>

                            <!-- Question Topic -->
                            <div class="mb-3">
                                <label for="quiz_topic" class="form-label">Topic</label>
                                <select class="form-select" id="quiz_topic" required>
                                    <option>English</option>
                                    <option>Maths</option>
                                    <option>Science</option>
                                    <option>Computing</option>
                                    <option>Geography</option>
                                    <option>History</option>
                                    <option>RE</option>
                                    <option>Art</option>
                                    <option>Music</option>
                                    <option>Drama</option>
                                    <option>French</option>
                                    <option>Spanish</option>
                                    <option>German</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <!-- Quiz Description -->
                            <div class="mb-3">
                                <div class="info-group">
                                    <label for="quiz_description" class="form-label">Description</label>
                                    <span class="badge text-bg-info fs-6 fw-bold" data-bs-toggle="tooltip"
                                        data-bs-placement="right" title="${tooltip_text}">
                                        ⓘ
                                    </span>
                                </div>
                                <textarea class="form-control" id="quiz_description" 
                                    placeholder="Enter quiz description"></textarea>
                            </div>

                            <!-- Number of Questions -->
                            <div class="mb-3">
                                <label for="number_of_questions" class="form-label">Number of Questions</label>
                                <div class="row align-items-center">
                                    <div class="col-sm-9">
                                        <input type="number" class="form-control" id="number_of_questions" 
                                            required min="1" max="50" placeholder="Enter number of questions">
                                    </div>
                                </div>
                            </div>

                            <!-- Question Type -->
                            <div class="mb-3">
                                <label for="question_type" class="form-label">Question Type</label>
                                <select class="form-select" id="question_type" required>
                                    <option value="multiple_choice">Multiple Choice</option>
                                    <option value="short_answer">Short Answer</option>
                                </select>
                            </div>
                        </form>
                    </div>

                    <div class="modal-footer">
                        <!-- Button to close the modal -->
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>

                        <!-- Another button to take the quiz -->
                        <button id="createQuizButton" type="submit" class="btn btn-success card-button" form="create_quiz_form">
                            <div class="cut-text-1">Create Quiz</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    /* Insert the card into the page */
    row.appendChild(card_container);

    /* Add event listener to the form */
    document.getElementById('create_quiz_form').addEventListener('submit', event => {
        event.preventDefault(); // Prevents the default behaviour of the form
    
        addNewQuiz()
    });

    /* Initialise the tooltips */
    const tooltip_trigger_list = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltip_list = [...tooltip_trigger_list].map(tooltip_trigger_element => new bootstrap.Tooltip(tooltip_trigger_element))
}

/**
 * Adds a new quiz to the dashboard.
 * 
 * @async
 * @returns {Promise<void>} A promise that resolves when the quiz has been added.
 */
async function addNewQuiz() {
    //build console.log('addNewQuiz: Creating quiz');

    /* Check if a quiz is already being generated */
    if (isGenerating) {
        //build console.log('addNewQuiz: Already generating quiz');

        alert('You cannot create a new quiz while another quiz is being created. Please wait until the current quiz has finished generating.');

        return;
    }

    const specialCharactersRegex = /[<>[\]]/g;

    /* Getting the values from the form */
    let quiz_title = document.getElementById('quiz_title').value.replace(specialCharactersRegex, ' ');
    let quiz_topic = document.getElementById('quiz_topic').value;
    let quiz_description = document.getElementById('quiz_description').value.replace(specialCharactersRegex, ' ');
    let number_of_questions = document.getElementById('number_of_questions').value;
    let question_type = document.getElementById('question_type').value;

    /* Clearning the form */
    document.getElementById('quiz_title').value = '';
    document.getElementById('quiz_topic').value = 'Other';
    document.getElementById('quiz_description').value = '';
    document.getElementById('number_of_questions').value = '';
    document.getElementById('question_type').value = 'multiple_choice';

    if (quiz_topic !== 'Other') {
        quiz_title = `${quiz_topic} - ${quiz_title}`;
    }

    /* Creating the quiz */
    const quiz = new Quiz(quiz_title, quiz_description, number_of_questions, question_type);   

    /* Add the quiz to the page */
    createQuizCard(quiz, index);

    /* Replacing the take_quiz buttons with spinners until the quiz has been made */
    const take_quiz_button_container = document.getElementById(`take_quiz_${index}_container`);
    const take_quiz_button_modal_container = document.getElementById(`take_quiz_${index}_model_container`);

    const take_quiz_button_container_innerHTML = take_quiz_button_container.innerHTML;
    const take_quiz_button_modal_container_innerHTML = take_quiz_button_modal_container.innerHTML;

    take_quiz_button_container.innerHTML = spinnerHTML;
    take_quiz_button_modal_container.innerHTML = spinnerHTML;

    isGenerating = true;

    /* Generate the questions */
    await quiz.generateQuestions();

    // Add quiz to database
    //build console.log('addNewQuiz: Adding quiz to database...');
    await addQuizToDB(quiz);
    //build console.log('addNewQuiz: Quiz added to database');

    isGenerating = false;

    /* Replace the take_quiz buttons now that there is a quiz that can be taken */
    take_quiz_button_container.innerHTML = take_quiz_button_container_innerHTML;
    take_quiz_button_modal_container.innerHTML = take_quiz_button_modal_container_innerHTML;

    /* Re-add event listeners to the buttons */
    document.getElementById(`take_quiz_${index}_container`).addEventListener('click', () => takeQuiz(quiz));
    document.getElementById(`take_quiz_${index}_model_container`).addEventListener('click', () => takeQuiz(quiz));

    /* Increment the index */
    index++;

    /* It would be nice for the modal to close automatically, but I don't know how that can be done and it's not a priority */
}

/**
 * Deletes a quiz from the dashboard.
 * 
 * @param {Object} quiz - The quiz object to delete.
 * @param {number} index_to_delete - The index of the quiz card to delete.
 */
function deleteQuiz(quiz, index_to_delete) {
    //build console.log('deleteQuiz: Deleting quiz:', quiz.id);

    /* Remove the quiz from the database */
    removeQuizFromDB(quiz);

    /* Remove the quiz card from the page */
    const card_container = document.getElementById(index_to_delete);
    card_container.remove();

    /* Refresh the page */
    window.location.href = window.location.href;
}

/**
 * Redirects the user to the quiz page with the specified quiz ID.
 * 
 * @param {Object} quiz - The quiz object containing the quiz ID.
 */
function takeQuiz(quiz) {
    //build console.log('Redirecting to quiz page:', quiz.id);

    /* Construct the URL with the quiz.id as a query parameter */
    const url = `../quiz/quiz.html?quiz_id=${quiz.id}`;

    //build console.log('Redirecting to quiz...');
    //build console.log('--------------------------------');

    window.location.href = url;
}

/********************* *
 * Start of the script *
 * *********************/

/* checking login */
await checkLogin(`../login/login.html`);

/* fetching user quizzes as raw JSON */
const quizzes_data = await getUserQuizzes();
const user_quizzes = [];

/* converting raw JSON to quiz objects */
quizzes_data.forEach(quiz_data => {
    const quiz = Quiz.fromObject(quiz_data.quiz);
    user_quizzes.push(quiz); // Add quiz to user quizzes
});

/* Sort the quizzes alphabetically */
user_quizzes.sort((a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();

    if (titleA < titleB) {
        return -1;
    }
    if (titleA > titleB) {
        return 1;
    }
    return 0;
});

/* Creating add new quiz card */
createAddNewQuizCard();

/* Creating quiz cards */
user_quizzes.forEach((quiz) => {
    createQuizCard(quiz, index);
    index++;
});

/* Remove the loading indicator */
const loading = document.getElementById("loading");

if (loading) {
    loading.remove();
}