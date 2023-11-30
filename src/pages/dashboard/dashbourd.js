console.log('dashbourd.js loaded');

/* Importing Firebase helper functions from setup file */
import { checkLogin } from "../../firebase/auth-helper.js";

/* Function to create a new Quiz Card */
function createQuizCard(quizTitle, quizDetails) {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container', 'col-sm-4');

    const card = document.createElement('div');
    card.classList.add('card', 'height-100');

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');

    const title = document.createElement('h4');
    title.classList.add('cut-text-1');
    title.textContent = quizTitle;

    cardHeader.appendChild(title);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body', 'padding-10');

    const details = document.createElement('p');
    details.classList.add('card-text', 'cut-text-3');
    details.textContent = quizDetails;

    cardBody.appendChild(details);

    const cardFooter = document.createElement('div');
    cardFooter.classList.add('card-footer');

    const row = document.createElement('div');
    row.classList.add('row');

    const detailsButton = document.createElement('button');
    detailsButton.classList.add('btn', 'btn-primary', 'card-button');
    detailsButton.setAttribute('type', 'button');
    detailsButton.setAttribute('data-bs-toggle', 'modal');
    detailsButton.setAttribute('data-bs-target', '#details_modal');

    const detailsButtonText = document.createElement('div');
    detailsButtonText.classList.add('cut-text-1');
    detailsButtonText.textContent = 'Details';

    detailsButton.appendChild(detailsButtonText);

    const takeQuizButton = document.createElement('button');
    takeQuizButton.classList.add('btn', 'btn-success', 'card-button', 'take_quiz_button');
    takeQuizButton.setAttribute('type', 'button');

    const takeQuizButtonText = document.createElement('div');
    takeQuizButtonText.classList.add('cut-text-1');
    takeQuizButtonText.textContent = 'Take Quiz';

    takeQuizButton.appendChild(takeQuizButtonText);

    row.appendChild(detailsButton);
    row.appendChild(takeQuizButton);

    cardFooter.appendChild(row);

    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.setAttribute('id', 'details_modal');
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', 'details_modal_label');
    modal.setAttribute('aria-hidden', 'true');

    const modalDialog = document.createElement('div');
    modalDialog.classList.add('modal-dialog', 'modal-dialog-scrollable');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');

    const modalTitle = document.createElement('h1');
    modalTitle.classList.add('modal-title', 'fs-5');
    modalTitle.setAttribute('id', 'details_modal_label');
    modalTitle.textContent = quizTitle;

    const closeButton = document.createElement('button');
    closeButton.classList.add('btn-close');
    closeButton.setAttribute('type', 'button');
    closeButton.setAttribute('data-bs-dismiss', 'modal');
    closeButton.setAttribute('aria-label', 'Close');

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    modalBody.textContent = quizDetails;

    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');

    const closeButtonModal = document.createElement('button');
    closeButtonModal.classList.add('btn', 'btn-secondary');
    closeButtonModal.setAttribute('type', 'button');
    closeButtonModal.setAttribute('data-bs-dismiss', 'modal');
    closeButtonModal.textContent = 'Close';

    const takeQuizButtonModal = document.createElement('button');
    takeQuizButtonModal.classList.add('btn', 'btn-success', 'card-button', 'take_quiz_button');

    const takeQuizButtonTextModal = document.createElement('div');
    takeQuizButtonTextModal.classList.add('cut-text-1');
    takeQuizButtonTextModal.textContent = 'Take Quiz';

    takeQuizButtonModal.appendChild(takeQuizButtonTextModal);

    modalFooter.appendChild(closeButtonModal);
    modalFooter.appendChild(takeQuizButtonModal);

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);

    modalDialog.appendChild(modalContent);

    modal.appendChild(modalDialog);

    cardFooter.appendChild(modal);

    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    card.appendChild(cardFooter);

    cardContainer.appendChild(card);

    // Append the card container to the desired parent element
    // Replace 'parentElement' with the actual parent element where you want to append the card
    const parentElement = document.getElementById('row_of_quizzes');
    parentElement.appendChild(cardContainer);
}

function takeQuiz() {
    console.log('Redirecting to quiz');
    window.location.href = '../quiz/quiz.html'; // Replace with the desired URL
}

/* Start of the script */

checkLogin(`../login/login.html`);

createQuizCard('Quiz 1', 'This is a quiz about something This is a quiz about something This is a quiz about somethingThis is a quiz about somethingThis is a quiz about somethingThis is a quiz about something This is a quiz about something');
createQuizCard('Quiz 2', 'This is a quiz about something');
createQuizCard('Quiz 3', 'This is a quiz about something');

document.querySelectorAll('.take_quiz_button').forEach(button => {
    // console.log('Adding event listener to button', button);
    button.addEventListener('click', takeQuiz);
});
