console.log('Loading: firebase/auth-helper.js');

/* Importing Firebase features */
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';

/* Importing Firebase config */
import { auth } from './config.js';

/**
 * Checks the login status of the user.
 * If a pathToLogin is provided, it redirects to the login page if the user is not logged in.
 * 
 * @async
 * @param {string} pathToLogin - The path to the login page (optional).
 * @returns {string|null} - The user's UID if logged in, or null if not logged in.
 * @throws {Error} - If an error occurs during the login status check.
 */
export async function checkLogin(pathToLogin = null) {
	if (pathToLogin == null) {
		console.log(`checkLogin: checking login status`);
	} else {
		console.log(`checkLogin: checking login status (with redirect: ${pathToLogin})`);
	}

	try {
		console.debug(`checkLogin: awaiting response...`);
		let user = await new Promise(async (resolve, reject) => {
			await onAuthStateChanged(auth, (user) => {
				resolve(user);
			});
		});
		console.log(`checkLogin: received`);

		if (user) {
			/* User is signed in. */
			console.log("checkLogin: User is logged in:", user.uid);

			return user.uid;
		} else {
			/* No user is signed in. */
			console.log("checkLogin: User is not logged in");

			if (pathToLogin != null) {
				console.log(`Redirecting to login page...`);
				console.log('--------------------------------');

				/* Redirect to the login page */
				window.location.href = pathToLogin;
			} else {
				console.warn(`checkLogin: User is not logged in`);
			}

			return null;
		}
	} 
            
    catch (error) {
        console.error(`checkLogin: error:`, error);
		throw error;
	}
}

/**
 * Checks the login status on a given iframe and updates the UI accordingly.
 * If the user is logged in, it redirects to the dashboard page.
 * If the user is not logged in, it redirects to the login page.
 *
 * @async
 * @param {HTMLIFrameElement} iframe - The iframe element to check the login status on.
 * @throws {Error} If there is an error checking the login status.
 */
export async function checkLoginOnFrame(iframe) {
	console.log(`checkLoginOnFrame: checking login status`);

	const account_button = document.getElementById('account');
	const login_status = document.getElementById('login_status');

	try {
		onAuthStateChanged(auth, (user) => {
			iframe.src = `../loading.html`

			if (user) {
				/* User is signed in. */
				console.log("checkLoginOnFrame: User is logged in:", user.uid);

				/* Update the UI */
				account_button.innerText = `Log Out`;
				login_status.innerText = `🟩: Logged in as ${user.email}`;

				/* Redirect to the dashboard */
				console.log('Redirecting to dashboard...');
				console.log('--------------------------------');

				iframe.src = `../pages/dashboard/dashboard.html`
			} else {
				// No user is signed in.
				console.log("checkLoginOnFrame: User is not logged in");

				/* Update the UI */
				account_button.innerText = `Log In`;
				login_status.innerText = `🟥: Not logged in`;

				/* Redirect to the login page */
				console.log('Redirecting to login...');
				console.log('--------------------------------');

				iframe.src = `../pages/login/login.html`
			}
		});
	} 
            
    catch (error) {
        console.error(`checkLoginOnFrame: error:`, error);
		throw error;
	}
}

/**
 * Creates a new user with the provided email and password.
 * 
 * @async
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<string>} A promise that resolves to "successful-sign-up" if the user is created successfully.
 * @throws {Error} If there is an error during the user creation process.
 */
export async function createUser(email, password) {
	console.log(`createUser: creating user`);

	try {
		console.debug(`createUserWithEmailAndPassword: awaiting response...`);
		let userCredential = await createUserWithEmailAndPassword(auth, email, password)
		console.debug(`createUserWithEmailAndPassword: received`);

		console.assert(userCredential.user.email != null && userCredential.user.email != undefined, `ERROR: userCredential.user.email is null or undefined`);
	
		console.warn(`create_account_form: ${userCredential}`);

		return {code: `auth/successful-sign-up`};
	} catch (error) {
		return error;
	}
}

/**
 * Logs in a user with the provided email and password.
 * 
 * @async
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<string>} - A promise that resolves to "successful-login" if the login is successful.
 * @throws {Error} - If an error occurs during the login process.
 */
export async function loginUser(email, password) {
	console.log(`loginUser: logging in user`);
	// console.debug(`email:`, email);

	try {
		console.debug(`signInWithEmailAndPassword: awaiting response...`);
		let userCredential = await signInWithEmailAndPassword(auth, email, password);
		console.debug(`signInWithEmailAndPassword: received`);
		/** @type {userCredential} */

		console.assert(userCredential.user.email != null && userCredential.user.email != undefined, `ERROR: userCredential.user.email is null or undefined`);

		return {code: `auth/successful-login`};
	} 
            
    catch (error) {
		throw error;
	}
}

/**
 * Logs out the user.
 * 
 * @async
 * @throws {Error} If an error occurs during the sign out process.
 */
export async function logout() {
	console.log(`logout: logging out user`);

	try {
		console.debug(`signOut: awaiting response...`);
		await signOut(auth);
		console.debug(`signOut: received`);
	}
	
	catch (error) {
        console.error(`logout: error:`, error);
		throw error;
	}
}