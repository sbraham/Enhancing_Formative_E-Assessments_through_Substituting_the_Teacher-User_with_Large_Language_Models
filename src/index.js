console.log(`Loading: index.js`);

/* Importing Firebase helper functions from setup file */
import { logout, checkLoginOnFrame } from "./firebase/auth-helper.js";

/* Fetching elements front HTML */
const main = document.getElementById('main');
const dashboard_button = document.getElementById('dashboard');
const account_button = document.getElementById('account');

await checkLoginOnFrame(main);

/* Adding event listeners to buttons */
dashboard_button.addEventListener("click", async () => {
    console.log(`Dashboard button clicked`);
    main.src = "./pages/dashboard/dashboard.html";
});

account_button.addEventListener("click", async () => {
    console.log(`Account button clicked`);
    console.log(`Loggin out...`);
    await logout();
    main.src = "./pages/login/login.html";
});