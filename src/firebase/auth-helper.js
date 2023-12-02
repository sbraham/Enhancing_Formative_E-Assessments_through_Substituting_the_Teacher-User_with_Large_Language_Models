console.log('Loading: firebase/auth-helper.js');

/* Importing Firebase features */
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';

/**
 * Checks if the user is logged in or not.
 * @returns {Promise<boolean>} - A promise that resolves to true if the user is logged in, or false if the user is not logged in.
 */
export async function checkLogin(pathToLogin) {
	try {
		console.debug(window.auth);

		onAuthStateChanged(window.auth, (user) => {
			if (user) {
				// User is signed in.
				console.log("User is logged in:", user.uid);
				return user.uid;
			} else {
				// No user is signed in.
				console.log("User is not logged in");

				// Redirect to the login page
				window.location.href = pathToLogin;
				return null;
			}
		});
	} catch (error) {
		console.error(error);
		return null;
	}
}

/**
 * Checks if the user is logged in or not.
 * @returns {Promise<boolean>} - A promise that resolves to true if the user is logged in, or false if the user is not logged in.
 */
export async function checkLoginOnFrame(iframe) {
	const account_button = document.getElementById('account');
	const login_status = document.getElementById('login_status');

	try {
		onAuthStateChanged(window.auth, (user) => {
			iframe.src = `../loading.html`

			if (user) {
				// User is signed in.
				console.log("User is logged in:", user.uid);

				account_button.innerText = `Log Out`;
				login_status.innerText = `🟩: Logged in as ${user.email}`;

				// Redirect to the chat page
				iframe.src = `../pages/dashboard/dashboard.html`

				return user.uid;
			} else {
				// No user is signed in.
				console.log("User is not logged in");

				account_button.innerText = `Log In`;
				login_status.innerText = `🟥: Not logged in`;

				// Redirect to the login page
				iframe.src = `../pages/login/login.html`

				return null;
			}
		});
	} catch (error) {
		console.error(error);
		return null;
	}
}

/**
 * Creates a new user with the provided email and password.
 * 
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<string|Error>} - A promise that resolves to "successful-sign-up" if the user is created successfully, or an Error object if there is an error.
 */
export async function createUser(email, password) {
	console.log(`auth-helper: createUser called`);
	console.debug(`auth-helper: email:`, email);

	try {
		console.log(`auth-helper: createUserWithEmailAndPassword: awaiting response...`);
		let userCredential = await createUserWithEmailAndPassword(window.auth, email, password)
		console.log(`auth-helper: createUserWithEmailAndPassword: received`);
		/** @type {userCredential} */

		console.assert(userCredential.user.email != null && userCredential.user.email != undefined, `ERROR: userCredential.user.email is null or undefined`);

		return `successful-sign-up`;
	} catch (error) {
		return error;
	}
}

/**
 * Logs in a user with the provided email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<string|Error>} - A promise that resolves to "successful-login" if the login is successful, or an Error object if there is an error.
 */
export async function loginUser(email, password) {
	console.log(`auth-helper: loginUser called`);
	console.debug(`auth-helper: email:`, email);

	try {
		console.log(`auth-helper: signInWithEmailAndPassword: awaiting response...`);
		let userCredential = await signInWithEmailAndPassword(window.auth, email, password);
		console.log(`auth-helper: signInWithEmailAndPassword: received`);
		/** @type {userCredential} */

		console.assert(userCredential.user.email != null && userCredential.user.email != undefined, `ERROR: userCredential.user.email is null or undefined`);

		return `successful-login`;
	} catch (error) {
		return error;
	}
}

/**
 * Signs out the current user.
 */
export async function logout() {
	console.log(`auth-helper: logout called`);

	try {
		console.log(`auth-helper: signOut: awaiting response...`);

		await signOut(auth);
	}
	catch (error) {
		console.error(error);
	}
}