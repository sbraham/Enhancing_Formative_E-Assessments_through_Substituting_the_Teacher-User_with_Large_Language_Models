console.log('Loading: progress.js');


/* Importing Firebase helper functions from setup file */
import { checkLogin } from "../../firebase/auth-helper.js";
import { getUserQuizzes } from "../../firebase/database-helper.js";

/* Importing Quiz class */
import { Quiz } from "../../classes/Quiz.js";

/* Assigning variables */

/* Assigning DOM elements */

/* Assigning event listeners */

/* Assigning functions */
function createGraph(index, quiz) {
    const attempts = quiz.attempts;
    const x_values = [];
    const y_values = [];

    console.log("attempts:", attempts);

    for (let i = 0; i < attempts.length; i++) {
        console.log(attempts[i]);
        x_values.push(`Attempt ${i + 1}`);
        y_values.push(attempts[i].score);
    }

    new Chart(`chart_${index}`, {
        type: `line`,
        data: {
            labels: x_values,
            datasets: [{
                data: y_values,
                borderColor: "blue",
                fill: false
            }]
        },
        options: {
            legend: { display: false },
            title: {
                display: true,
                text: `${quiz.title} Progress`
            }
        }
    });
}

function createAccordionElement(index, quiz) {
    if (quiz.attempts.length === 0) {
        return;
    }

    const accordion = document.getElementById(`accordion`);
}


/* Assigning functions to event listeners */

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

console.log("user_quizzes:", user_quizzes);

/* Creating new Accordion Elements */

// ---------- TEST ----------

createGraph(1, user_quizzes[0]);