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
    console.log('dashboard_button clicked');

    console.log('Redirecting to dashboard...');
    console.log('--------------------------------------------------');

    main.src = "./pages/dashboard/dashboard.html";
});

account_button.addEventListener("click", async () => {
    console.log(`account_button clicked`);

    console.log(`Loggin out...`);
    await logout();

    console.log('Redirecting to login...');
    console.log('--------------------------------------------------');
    
    main.src = "./pages/login/login.html";
});