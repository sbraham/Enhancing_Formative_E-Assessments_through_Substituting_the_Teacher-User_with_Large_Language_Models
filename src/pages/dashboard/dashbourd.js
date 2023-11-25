console.log('dashbourd.js loaded');

/* Fetching elements front HTML */
const take_quiz_button = document.getElementById('take_quiz');

take_quiz_button.addEventListener('click', () => {
    console.log('The button has been pressed');
    window.location.href = '../quiz/quiz.html'; // Replace with the desired URL
});
