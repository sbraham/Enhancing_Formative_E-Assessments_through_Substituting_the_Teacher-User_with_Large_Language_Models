console.log(`index.js loaded`);

/* Importing Firebase helper functions from setup file */
import { logout } from "./firebase/auth-helper.js";

/* Fetching elements front HTML */
const main = document.getElementById('main');
const dashboardButton = document.getElementById('dashboard');
const accountButton = document.getElementById('account');
const loginStatus = document.getElementById('loginStatus');

/* Adding event listener to auth state change */
import { auth } from '../../firebase/config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in.
        console.log("User is logged in:", user);

        accountButton.innerText = `Log Out`;
        loginStatus.innerText = `🟩: Logged in as ${user.email}`;
    } else {
        // No user is signed in.
        console.log("User is not logged in");

        accountButton.innerText = `Log In`;
        loginStatus.innerText = `🟥: Not logged in`;
    }
});

/* Adding event listeners to buttons */
dashboardButton.addEventListener("click", async () => {
    console.log(`Dashboard button clicked`);
    main.src = "./pages/dashboard/dashboard.html";
});

accountButton.addEventListener("click", async () => {
    console.log(`Account button clicked`);
    console.log(`Loggin out...`);
    await logout();
    main.src = "./pages/login/login.html";
});