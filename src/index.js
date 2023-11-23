console.log(`index.js loaded`);

/* Importing Firebase helper functions from setup file */
import { logout } from "./firebase/auth-helper.js";

/* Fetching elements front HTML */
const main = document.getElementById('main');
const dashboardButton = document.getElementById('dashboard');
const loginButton = document.getElementById('login');
const logoutButton = document.getElementById('logout');
const loginStatus = document.getElementById('loginStatus');

/* Adding event listeners to buttons */
dashboardButton.addEventListener("click", async () => {
    console.log(`Dashboard button clicked`);
    main.src = "./pages/dashboard/dashboard.html";
});

loginButton.addEventListener("click", async () => {
    console.log(`Log in button clicked`);
    main.src = "./pages/login/login.html";
});

logoutButton.addEventListener("click", async () => {
    console.log(`Logout button clicked`);
    await logout();
    main.src = "./pages/login/login.html";
});

/* Adding event listener to auth state change */
import { auth } from '../../firebase/config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in.
        console.log("User is logged in:", user);

        loginStatus.innerText = `Logged in as ${user.email}`;
    } else {
        // No user is signed in.
        console.log("User is not logged in");

        loginStatus.innerText = `Not logged in`;
    }
});