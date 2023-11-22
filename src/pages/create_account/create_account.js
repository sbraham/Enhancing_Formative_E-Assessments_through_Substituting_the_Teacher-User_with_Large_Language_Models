console.log('sign-up.js loaded');

/* Importing Firebase helper functions from setup file */
import { createUser } from '../../firebase/auth-helper.js';

/**
 * The sign up form element.
 * @type {HTMLElement}
 */
const createAccountForm = document.getElementById('createAccountForm');

/**
 * The event listener for the create account form.
 * Runs when the form has been submitted.
 * @type {EventListener}
 */
createAccountForm.addEventListener("submit", async (event) => {
    console.log(`signUpForm submit`);

    event.preventDefault(); // Prevents the page from reloading when the form is submitted.

    const email = createAccountForm.email.value;
    const password = createAccountForm.password.value;
    const confirmPassword = createAccountForm.confirmPassword.value;

    console.log(`Email:`, email);

    if (password !== confirmPassword) {
        console.warn(`Passwords do not match.`);
        alert(`Passwords do not match. Please take care when inputting your password.`);
        return;
    }
    
    console.log(`createUser: awaiting response...`);
    let responce = await createUser(email, password);
    console.log(`createUser: received`);
    /** @type {Promise<string>} */

    if (responce === 'successful-sign-up') {
        console.log(`User successfully signed up.`);
        alert("You have successfully signed up. Click OK to continue to the chatbot.");
        window.location.href = "../dashboard/dashboard.html";
    }
    else {
        if (responce === 'auth/email-already-in-use') {
            console.warn(`Email, ${email}, is already in use.`);
            alert(`Email, ${email}, is already in use. Log in or use a different email.`);
        } else if (responce === 'auth/invalid-email') {
            console.warn(`Email, ${email}, is invalid.`);
            alert(`Email, ${email}, is invalid. Please enter a valid email.`);
        } else if (responce === 'auth/weak-password') {
            console.warn(`Password is too weak.`);
            alert(`Password is too weak. Try a mix of letters, numbers and symbols.`);
        } else {
            console.error(`ERROR:`, responce);
            alert(`ERROR: ${responce}`);
        }
    }
});