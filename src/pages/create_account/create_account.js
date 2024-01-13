console.log('Loading: sign-up.js');

/* Importing Firebase helper functions from setup file */
import { createUser } from '../../firebase/auth-helper.js';

/* Get DOM elements */
const create_account_form = document.getElementById('create_account_form');
const login_link = document.getElementById('login_link');

/* Adding event listener to handle the form submission */
create_account_form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevents the page from reloading when the form is submitted.

    const email = create_account_form.email.value;
    const password = create_account_form.password.value;
    const confirm_password = create_account_form.confirmPassword.value;

    if (password !== confirm_password) {
        console.warn(`create_account_form: Passwords do not match.`);
        alert(`Passwords do not match. Please take care when inputting your password.`);
        return;
    }
    
    console.log(`createUser: awaiting response...`);
    let responce = await createUser(email, password);
    console.log(`createUser: received`);

    if (responce === 'successful-sign-up') {
        
        /* Redirect to dashboard */
        console.log(`Redirecting to dashboard...`);
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
            throw responce;
        }
    }
});

/* Adding event listener to handle the link within the iframe */
login_link.addEventListener('click', function(event) {
    console.log(`login_link clicked`);

    /* Redirect to login */
    console.log('Redirecting to login...');
    console.log('--------------------------------------------------');

    window.location.href = "../login/login.html";
});