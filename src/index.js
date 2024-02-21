//build console.log(`Loading: index.js`);

/* Importing Firebase helper functions from setup file */
import { logout, checkLoginOnFrame } from "./firebase/auth-helper.js";

/* Fetching elements front HTML */
const main = document.getElementById('main');
const dashboard_button = document.getElementById('dashboard');
const progress_button = document.getElementById('progress');
const account_button = document.getElementById('account');
const info_button = document.getElementById('info');

await checkLoginOnFrame(main);

/* Adding event listeners to buttons */
dashboard_button.addEventListener("click", async () => {
    //build console.log('dashboard_button clicked');

    //build console.log('Redirecting to dashboard...');
    //build console.log('--------------------------------');

    main.src = "./pages/dashboard/dashboard.html";
});

progress_button.addEventListener("click", async () => {
    //build console.log('progress_button clicked');

    //build console.log('Redirecting to progress...');
    //build console.log('--------------------------------');

    main.src = "./pages/progress/progress.html";
});

account_button.addEventListener("click", async () => {
    //build console.log(`account_button clicked`);

    //build console.log(`Loggin out...`);
    await logout();

    //build console.log('Redirecting to login...');
    //build console.log('--------------------------------');
    
    main.src = "./pages/login/login.html";
});

info_button.addEventListener("click", async () => {
    //build console.log('info_button clicked');

    //build console.log('Redirecting to info...');
    //build console.log('--------------------------------');

    main.src = "./pages/info/info.html";
});