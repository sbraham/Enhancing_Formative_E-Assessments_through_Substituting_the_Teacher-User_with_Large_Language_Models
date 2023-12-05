console.log('Loading: firebase/auth-helper.js');

/* Importing Firebase features */
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';

import { auth } from './config.js';

/**
 * Checks if a user is logged in and returns their user ID.
 * If the user is not logged in, it can redirect to a specified login page.
 * @param {string} pathToLogin - The path to the login page (optional).
 * @returns {Promise<string|null>} - A promise that resolves with the user ID if logged in, or null if not logged in.
 */
export function checkLogin(pathToLogin = null) {
	if (pathToLogin == null) {
		console.log(`auth-helper: checkLogin`);
	} else {
		console.log(`auth-helper: checkLogin(${pathToLogin})`);
	}

	return new Promise((resolve, reject) => {
		try {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					console.log("auth-helper: checkLogin: User is logged in:", user.uid);
					resolve(user.uid);
				} else {
					// No user is signed in.
					console.warn("auth-helper: checkLogin: User is not logged in");

					if (pathToLogin != null) {
						// Redirect to the login page
						window.location.href = pathToLogin;
					}

					resolve(null);
				}
			});
		} catch (error) {
			console.error(`auth-helper: checkLogin:`, error);
			reject(error);
		}
	});
}

/**
 * Checks if the user is logged in or not.
 * @returns {Promise<boolean>} - A promise that resolves to true if the user is logged in, or false if the user is not logged in.
 */
export async function checkLoginOnFrame(iframe) {
	console.log(`auth-helper: checkLoginOnFrame`);
	console.debug(`auth-helper: iframe:`, iframe);

	const account_button = document.getElementById('account');
	const login_status = document.getElementById('login_status');

	try {
		onAuthStateChanged(auth, (user) => {
			iframe.src = `../loading.html`

			if (user) {
				// User is signed in.
				console.log("auth-helper: checkLoginOnFrame: User is logged in:", user.uid);

				account_button.innerText = `Log Out`;
				login_status.innerText = `🟩: Logged in as ${user.email}`;

				// Redirect to the chat page
				iframe.src = `../pages/dashboard/dashboard.html`
			} else {
				// No user is signed in.
				console.log("auth-helper: checkLoginOnFrame: User is not logged in");

				account_button.innerText = `Log In`;
				login_status.innerText = `🟥: Not logged in`;

				// Redirect to the login page
				iframe.src = `../pages/login/login.html`
			}
		});
	} catch (error) {
		console.error(`auth-helper: checkLoginOnFrame:`, error);
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
	console.log(`auth-helper: createUser`);
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
	console.log(`auth-helper: loginUser`);
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
	console.log(`auth-helper: logout`);

	try {
		console.log(`auth-helper: logout: awaiting response...`);
		await signOut(auth);
		console.log(`auth-helper: logout: received`);
	}
	catch (error) {
		console.error(`auth-helper: logout:`, error);
	}
}