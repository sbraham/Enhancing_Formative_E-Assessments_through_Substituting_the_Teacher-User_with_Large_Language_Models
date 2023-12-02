console.log('login.js');

/* Importing Firebase helper functions from setup file */
import { loginUser } from "../../firebase/auth-helper.js";

/* Fetching elements front HTML */
const login_form = document.getElementById('login_form');
const create_account_link = document.getElementById('create_account_link');

/**
 * The event listener for the login form.
 * Runs when the form has been submitted.
 * @type {EventListener}
 */
login_form.addEventListener("submit", async (event) => {
    console.log(`login-form submit`);

    event.preventDefault(); // Prevents the page from reloading when the form is submitted.
    
    const email    = login_form.email.value;
    const password = login_form.password.value;

    console.debug(`Email`, email);

    console.log(`loginUser: awaiting response...`);
    let responce = await loginUser(email, password);
    console.log(`loginUser: received`);
    /** @type {Promise<string>} */

    if (responce === `successful-login`) {
        console.log(`User successfully logged in.`);

        alert("You have successfully logged in.\nClick OK to continue to the chatbot.");
        window.location.href = "../dashboard/dashboard.html";
    } else {
        if (responce.code === 'auth/invalid-login-credentials' || responce.code === 'auth/user-not-found') {
            console.log(`Email and/or password are incorrect.`);

            alert(`Email and/or password are incorrect.\nPlease sign up or use a different email.`);
        }
        else if (responce.code === 'auth/too-many-requests') {
            console.log(`Too many failed login attempts.`);

            alert(`Access to this account has been temporarily disabled due to many failed login attempts.\nPlease try again later.`);
        }        
        else {
            console.error(`Error: `, responce.code);
            alert(responce.message);
        }
    }
});

/* Adding event listener to handle the link within the iframe */
create_account_link.addEventListener('click', function(event) {
    console.log(`create_account_link clicked`);
    window.location.href = "../create_account/create_account.html";
});