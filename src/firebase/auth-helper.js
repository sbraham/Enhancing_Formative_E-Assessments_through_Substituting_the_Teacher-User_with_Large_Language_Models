console.log('firebase/auth-helper.js loaded');

/* Importing Firebase features */
import * as firebase from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js';
import * as authenticator from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';
import * as functions from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-functions.js';

import { auth } from "./config.js";

/**
 * Helper functions for Firebase authentication.
 * @module auth-helper
 */

/**
 * Creates a new user with the given email and password.
 * @param {string} email - The email of the user to be created.
 * @param {string} password - The password of the user to be created.
 * @returns {Promise<string>} - A promise that resolves to 'successful-sign-up' if the user was created successfully, or an error code if there was an error.
 */
export async function createUser(email, password) {
	console.log(`auth-helper: createUser called`);
	console.debug(`auth-helper: email:`, email);

	try {
		console.log(`auth-helper: createUserWithEmailAndPassword: awaiting response...`);
		let userCredential = await authenticator.createUserWithEmailAndPassword(auth, email, password)
		/** @type {userCredential} */

		console.assert(userCredential.user.email != null && userCredential.user.email != undefined, `ERROR: userCredential.user.email is null or undefined`);

		return `successful-sign-up`;
	}
	catch (error) {
		console.error(error);

		return error.code;
	}
}

/**
 * Attempt to sign in a user with the given email and password.
 * @param {string} email - The email of the user to be created.
 * @param {string} password - The password of the user to be created.
 * @returns {Promise<string>} - A promise that resolves to 'successful-login' if the user was signed in successfully, or an error code if there was an error.
 */
/**
 * Logs in a user with the provided email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<string>} - A promise that resolves to "successful-login" if the login is successful, or an error message if there is an error.
 */
export async function loginUser(email, password) {
	console.log(`auth-helper: loginUser called`);
	console.debug(`auth-helper: email:`, email);

	try {
		console.log(`auth-helper: signInWithEmailAndPassword: awaiting response...`);
		let userCredential = await authenticator.signInWithEmailAndPassword(auth, email, password);
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
		await authenticator.signOut(auth);
	}
	catch (error) {
		console.error(error);
	}
}