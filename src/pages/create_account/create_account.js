console.log('Loading: sign-up.js');

/* Importing Firebase helper functions from setup file */
import { createUser } from '../../firebase/auth-helper.js';

/**
 * The sign up form element.
 * @type {HTMLElement}
 */
const create_account_form = document.getElementById('create_account_form');
const login_link = document.getElementById('login_link');

/**
 * The event listener for the create account form.
 * Runs when the form has been submitted.
 * @type {EventListener}
 */
create_account_form.addEventListener("submit", async (event) => {
    console.log(`create_account_form: create account form submit`);

    event.preventDefault(); // Prevents the page from reloading when the form is submitted.

    const email = create_account_form.email.value;
    const password = create_account_form.password.value;
    const confirmPassword = create_account_form.confirmPassword.value;

    console.log(`create_account_form: Email:`, email);

    if (password !== confirmPassword) {
        console.warn(`create_account_form: Passwords do not match.`);
        alert(`Passwords do not match. Please take care when inputting your password.`);
        return;
    }
    
    console.log(`createUser: awaiting response...`);
    let responce = await createUser(email, password);
    console.log(`createUser: received`);
    /** @type {Promise<string>} */

    if (responce === 'successful-sign-up') {
        console.log(`create_account_form: User successfully signed up.`);
        
        alert("You have successfully signed up. Click OK to continue to the chatbot.");
        console.log('--------------------------------------------------');
        window.location.href = "../dashboard/dashboard.html";
    }
    else {
        if (responce === 'auth/email-already-in-use') {
            console.warn(`create_account_form: Email, ${email}, is already in use.`);
            alert(`Email, ${email}, is already in use. Log in or use a different email.`);
        } else if (responce === 'auth/invalid-email') {
            console.warn(`create_account_form: Email, ${email}, is invalid.`);
            alert(`Email, ${email}, is invalid. Please enter a valid email.`);
        } else if (responce === 'auth/weak-password') {
            console.warn(`create_account_form: Password is too weak.`);
            alert(`Password is too weak. Try a mix of letters, numbers and symbols.`);
        } else {
            console.error(`create_account_form: ERROR:`, responce);
            alert(`ERROR: ${responce.message}`);
        }
    }
});

/* Adding event listener to handle the link within the iframe */
login_link.addEventListener('click', function(event) {
    console.log(`login_link: login link clicked`);
    console.log('--------------------------------------------------');
    window.location.href = "../login/login.html";
});