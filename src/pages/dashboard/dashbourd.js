console.log('dashbourd.js loaded');

/* Function to create a new Quiz Card */
export function createQuizCard(quiz_name, quiz_description, quiz_id) {}

function takeQuiz() {
    console.log('Redirecting to quiz');
    window.location.href = '../quiz/quiz.html'; // Replace with the desired URL
}

document.querySelectorAll('.take_quiz_button').forEach(button => {
    // console.log('Adding event listener to button', button);
    button.addEventListener('click', takeQuiz);
});
