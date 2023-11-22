console.log('sign-up.js loaded');

/* Importing Firebase helper functions from setup file */
import { createUser } from '../firebase/firebase-helper.js';

/* Fetching elements front HTML */
const signUpForm = document.getElementById('sign-up-form');


/**
 * Gets the email and password from the sign-up-form element,
 * checks there are not empty,
 * and attempts to create a new user with the given email and password.
 * Called when the sign-up-form element is submitted.
 * @param {Event} event - used to prevent the page from reloading when the form is submitted.
*/
signUpForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevents the page from reloading when the form is submitted.

    console.log(`sign-up-form submit`);
    console.debug(`Event:`, event);
    console.debug(`signUpForm:`, signUpForm);

    const email = signUpForm.email.value;
    const password = signUpForm.password.value;
    
    console.log(`Attempting sign up. awaiting response...`);
    let responce = await createUser(email, password);
    /** @type {Promise<string>} */

    if (responce === 'successful-sign-up') {
        console.log(`User successfully signed up.`);
        alert("You have successfully signed up. Click OK to continue to the chatbot.");
        window.location.href = "../_pages/chatbot.html";
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