console.log('Loading: progress.js');

/* Importing Firebase helper functions from setup file */
import { checkLogin } from "../../firebase/auth-helper.js";
import { getUserQuizzes } from "../../firebase/database-helper.js";

/* Importing Quiz class */
import { Quiz } from "../../classes/Quiz.js";

/* Assigning DOM elements */
const quiz_accordion = document.getElementById(`quiz_accordion`);

/* Assigning functions */

/**
 * Formats a given date and time into a string representation.
 *
 * @param {string} date_time - The date and time to format.
 * @returns {string} The formatted date in the format "day/month/year".
 */
function formatDateTime(date_time) {
    const date = new Date(date_time);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${day}/${month}/${year}`;
}

/**
 * Formats the duration in milliseconds into a human-readable string.
 * 
 * @param {number} duration - The duration in milliseconds.
 * @returns {string} The formatted duration string.
 */
function formatDuration(duration) {
    const milliseconds = Math.floor(duration % 1000);
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const duration_string = `${hours}h ${minutes}m ${seconds}s (${milliseconds}ms)`;

    return duration_string;
}

function createGraph(index, quiz) {
    const attempts = quiz.attempts;
    const x_values = [];
    const y_values = [];

    for (let i = 0; i < attempts.length; i++) {
        console.log(attempts[i]);
        x_values.push(`Attempt ${i + 1}`);
        y_values.push(attempts[i].score);
    }

    new Chart(`chart_${index}`, {
        type: `bar`,
        data: {
            labels: x_values,
            datasets: [{
                data: y_values,
                backgroundColor: `rgba(15, 50, 230, 0.5)`,
                borderColor: `rgba(15, 50, 255, 1)`,
                borderWidth: 1
            }]
        },
        options: {
            legend: { display: false },
            title: {
                display: true,
                text: `${quiz.title} Progress`
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1
                    }
                }]
            }
        }
    });
}

function addQuizToAccordion(index, quiz) {
    if (quiz.attempts.length === 0) {
        return;
    }

    const quiz_accordion_item = document.createElement(`div`);
    quiz_accordion_item.classList.add(`accordion-item`);

    quiz_accordion_item.innerHTML = `
        <h2 class="accordion-header">
            <button class="accordion-button" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapse_${index}" aria-expanded="true" aria-controls="collapse_${index}">
                ${quiz.title}
            </button>
        </h2>

        <div id="collapse_${index}" class="accordion-collapse collapse">
            <div class="accordion-body">
                <div class="d-flex">
                    <div style="width: 70%;">
                        <canvas id="chart_${index}"></canvas>
                    </div>

                    <div style="width: 30%;">
                        <label for="attempt_select_${index}" class="form-label">Attempts</label>
                        <select class="form-select" id="attempt_select_${index}" required>
                            <option value="" disabled selected>Select an attempt</option>
                            ${quiz.attempts.map((attempt, index) => {
                                return `<option value="${index}">Attempt ${index + 1}</option>`;
                            })}
                        </select>

                        <div class="m-2" id="attempt_view_${index}">
                            <!-- Attempt Info -->
                        </div>
                    </div>
                </div>

                <!-- Given Answers Accordion -->
                <div class="accordion m-3">
                    <div class="accordion">
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapse_given_answers_${index}" aria-expanded="true" aria-controls="collapse_given_answers_${index}">
                                    Given Answers
                                </button>
                            </h2>

                            <div id="collapse_given_answers_${index}" class="accordion-collapse collapse">
                                <div class="accordion-body">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Question</th>
                                                <th scope="col">Answer Given</th>
                                                <th scope="col">Result</th>
                                            </tr>
                                        </thead>
                    
                                        <tbody id="given_answer_table_body_${index}">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    quiz_accordion.append(quiz_accordion_item);

    createGraph(index, quiz);

    /* Add event listener to the attempt select */
    const attempt_select_element = document.getElementById(`attempt_select_${index}`);
    attempt_select_element.addEventListener(`change`, () => {
        const attempt_view = document.getElementById(`attempt_view_${index}`);

        if (!attempt_view) {
            console.warn(`Attempt view not found.`);
            return;
        }

        const attempt_index = attempt_select_element.value;
        const attempt = quiz.attempts[attempt_index];



        attempt_view.innerHTML = `
            <h5>Date:</h5>
            <p>${formatDateTime(attempt.date_time)}</p>

            <h5>Duration:</h5>
            <p>${formatDuration(attempt.duration)}</p>

            <h5>Score:</h5>
            <p>${attempt.score} / ${attempt.given_answers.length}</p>
        `;

        /* Update the given answers table */
        const given_answer_table = document.getElementById(`given_answer_table_body_${index}`);
        const given_answers = attempt.given_answers;

        given_answer_table.innerHTML = `
            ${given_answers.map((given_answer, index) => {
                const result = given_answer.is_correct ? '✅' : '❌';
                return `
                        <tr>
                            <td>${given_answer.question}</td>
                            <td>${given_answer.given_answer}</td>
                            <td>${result}</td>
                        </tr>
                    `;
            }).join('')}
        `;
    });
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
    const quiz = Quiz.fromJSONObject(quiz_data.quiz);
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

console.log("user_quizzes:", user_quizzes);

/* Creating new Accordion Elements */
for (let i = 0; i < user_quizzes.length; i++) {
    const quiz = user_quizzes[i];
    addQuizToAccordion(i, quiz);
}