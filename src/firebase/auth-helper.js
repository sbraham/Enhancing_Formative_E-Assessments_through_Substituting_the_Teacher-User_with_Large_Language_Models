//build console.log('Loading: firebase/auth-helper.js');

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
		//build console.log(`checkLogin: checking login status`);
	} else {
		//build console.log(`checkLogin: checking login status (with redirect: ${pathToLogin})`);
	}

	try {
		//build console.debug(`checkLogin: awaiting response...`);
		let user = await new Promise(async (resolve, reject) => {
			await onAuthStateChanged(auth, (user) => {
				resolve(user);
			});
		});
		//build console.log(`checkLogin: received`);

		if (user) {
			/* User is signed in. */
			//build console.log("checkLogin: User is logged in:", user.uid);

			return user.uid;
		} else {
			/* No user is signed in. */
			//build console.log("checkLogin: User is not logged in");

			if (pathToLogin != null) {
				//build console.log(`Redirecting to login page...`);
				//build console.log('--------------------------------');

				/* Redirect to the login page */
				window.location.href = pathToLogin;
			} else {
				//build console.warn(`checkLogin: User is not logged in`);
			}

			return null;
		}
	} 
            
    catch (error) {
        //build console.error(`checkLogin: error:`, error);
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
	//build console.log(`checkLoginOnFrame: checking login status`);

	const account_button = document.getElementById('account');
	const login_status = document.getElementById('login_status');

	try {
		onAuthStateChanged(auth, (user) => {
			iframe.src = `../loading.html`

			if (user) {
				/* User is signed in. */
				//build console.log("checkLoginOnFrame: User is logged in:", user.uid);

				/* Update the UI */
				account_button.innerText = `Log Out`;
				login_status.innerText = `🟩: Logged in as ${user.email}`;

				/* Redirect to the dashboard */
				//build console.log('Redirecting to dashboard...');
				//build console.log('--------------------------------');

				iframe.src = `../pages/dashboard/dashboard.html`
			} else {
				// No user is signed in.
				//build console.log("checkLoginOnFrame: User is not logged in");

				/* Update the UI */
				account_button.innerText = `Log In`;
				login_status.innerText = `🟥: Not logged in`;

				/* Redirect to the login page */
				//build console.log('Redirecting to login...');
				//build console.log('--------------------------------');

				iframe.src = `../pages/login/login.html`
			}
		});
	} 
            
    catch (error) {
        //build console.error(`checkLoginOnFrame: error:`, error);
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
	//build console.log(`createUser: creating user`);

	try {
		//build console.debug(`createUserWithEmailAndPassword: awaiting response...`);
		let userCredential = await createUserWithEmailAndPassword(auth, email, password)
		//build console.debug(`createUserWithEmailAndPassword: received`);

		//build console.assert(userCredential.user.email != null && userCredential.user.email != undefined, `ERROR: userCredential.user.email is null or undefined`);

		return `successful-sign-up`;
	} 
            
    catch (error) {
        //build console.error(`createUser: error:`, error);
		throw error;
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
	//build console.log(`loginUser: logging in user`);
	// //build console.debug(`email:`, email);

	try {
		//build console.debug(`signInWithEmailAndPassword: awaiting response...`);
		let userCredential = await signInWithEmailAndPassword(auth, email, password);
		//build console.debug(`signInWithEmailAndPassword: received`);
		/** @type {userCredential} */

		//build console.assert(userCredential.user.email != null && userCredential.user.email != undefined, `ERROR: userCredential.user.email is null or undefined`);

		return `successful-login`;
	} 
            
    catch (error) {
		//build console.error(`loginUser: error:`, error);
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
	//build console.log(`logout: logging out user`);

	try {
		//build console.debug(`signOut: awaiting response...`);
		await signOut(auth);
		//build console.debug(`signOut: received`);
	}
	
	catch (error) {
        //build console.error(`logout: error:`, error);
		throw error;
	}
}