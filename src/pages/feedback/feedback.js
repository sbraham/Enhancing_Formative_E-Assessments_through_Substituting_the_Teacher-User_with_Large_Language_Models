console.log('Loading: feedback.js');

/* Get DOM elements */
const house_of_cards = document.getElementById('house_of_cards');
const dashboard_button = document.getElementById('dashboard_button');

/* Answer Objects: 
    {
        "correct": false,
        "question": "What is the capital of the United States?
        "correct_answer": "Washington D.C.",
        "given_answer": "New York"
        "given_index": 3
    }
*/

function createCard(answer, index) {
    if (answer.correct) {
        card = (`
            <div class="card m-3">
                <div class="card-header">
                    <h4 class="cut-text-1">Question ${index}</h4>
                </div>
                <div class="card-body">
                    <h5 class="card-title">Question:</h5>
                    <p class="card-title">${answer.question}</p>
                    <h5 class="card-title">Answer:</h5>
                    <p class="card-text">${answer.given_answers}</p>
                </div>
                <div class="card-footer">
                    <p class="card-text">Correct ✅</p>
                </div>
            </div>
        `);

        house_of_cards.innerHTML += card
    } else {
        card = (`
            <div class="card m-3">
                <div class="card-header">
                    <h4 class="cut-text-1">Question ${index}</h4>
                </div>
                <div class="card-body">
                    <h5 class="card-title">Question:</h5>
                    <p class="card-title">${answer.question}</p>
                    <h5 class="card-title">Given Answer:</h5>
                    <p class="card-text">${answer.given_answers}</p>
                    <h5 class="card-title">Correct Answer:</h5>
                    <p class="card-text">${answer.correct_answer}</p>
                    <h5 class="card-title">Feedback:</h5>
                    <p class="card-text"> --f-e-e-d-b-a-c-k-- </p>
                </div>
                <div class="card-footer">
                    <p class="card-text">Incorrect ❌</p>
                </div>
            </div>
        `);

        house_of_cards.innerHTML += card
    }
}

/* Event Listeners */
dashboard_button.addEventListener('click', function () {
    const url = `../dashboard/dashboard.html`;

    window.location.href = url;
});

/* Get given_answers from URL */
const given_answers_string = new URLSearchParams(window.location.search).get('given_answers');

console.log(`given_answers_string:`, given_answers_string);

/* Turn the given_answers into an array of answers objects */
const given_answers = given_answers_string ? JSON.parse(given_answers_string) : [];

console.log(`given_answers:`, given_answers);

// Call createCard for each answer
given_answers.forEach((answer, index) => {
    createCard(answer, index + 1);
});