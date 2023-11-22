console.log(`index.js loaded`);

// This is the code that will run when the page loads
// It will check if the user is logged in or not
// If the user is logged in, it will redirect to the user dashboard
// Otherwise, it will redirect to the login page

import { auth } from './firebase/config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in.
        console.log("User is logged in:", user);

        // Redirect to the chat page
        window.location.href = `./pages/dashboard/dashboard.html`
    } else {
        // No user is signed in.
        console.log("User is not logged in");

        // Redirect to the login page
        window.location.href = `./pages/login/login.html`
    }
});
