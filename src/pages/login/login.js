//build console.log('Loading: login.js');

/* Importing Firebase helper functions from setup file */
import { loginUser } from "../../firebase/auth-helper.js";

/* Fetching elements front HTML */
const login_form = document.getElementById('login_form');
const create_account_link = document.getElementById('create_account_link');

/* Adding event listener to handle the form submission */
login_form.addEventListener("submit", async (event) => {
    event.preventDefault(); /* Prevents the default behaviour of the form */
    
    const email    = login_form.email.value;
    const password = login_form.password.value;

    //build console.log(`login_form: loginUser: awaiting response...`);
    let responce = await loginUser(email, password);
    //build console.log(`login_form: loginUser: received`);

    if (responce === `successful-login`) {
        /* Redirect to dashboard */
        //build console.log(`Redirecting to dashboard...`);
        //build console.log('--------------------------------');
        
        window.location.href = "../dashboard/dashboard.html";
    } else {
        if (responce.code === 'auth/invalid-login-credentials' || responce.code === 'auth/user-not-found') {
            //build console.warn(`login_form: Email and/or password are incorrect.`);
            alert(`Email and/or password are incorrect.\nPlease sign up or use a different email.`);
        }
        else if (responce.code === 'auth/too-many-requests') {
            //build console.warn(`login_form: Too many failed login attempts.`);
            alert(`Access to this account has been temporarily disabled due to many failed login attempts.\nPlease try again later.`);
        }        
        else {
            throw responce;
        }
    }
});

/* Adding event listener to handle the link within the iframe */
create_account_link.addEventListener('click', function(event) {
    //build console.log(`create_account_link clicked`);

    /* Redirect to create_account */
    //build console.log('Redirecting to create_account...');
    //build console.log('--------------------------------');

    window.location.href = "../create_account/create_account.html";
});