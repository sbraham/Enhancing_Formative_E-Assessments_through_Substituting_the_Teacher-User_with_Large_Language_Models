console.log('Loading: LM-studio-helper.js');

/* Imports */
import { callLMStudio } from './LM-studio-helper.js';


/**
 * Checks if the given answer is close to the expected answer for a given question.
 * 
 * @async
 * @param {string} question - The question being asked.
 * @param {string} expected_answer - The expected answer for the question.
 * @param {string} given_answer - The given answer to be checked.
 * @returns {Promise<boolean>} - A promise that resolves to true if the given answer is close to the expected answer, false otherwise.
 * @throws {Error} - If an error occurs during the process.
 */
export async function checkAnswer(question, expected_answer, given_answer) {
    
    // TO DO : Make this better
    
    let system_content = `Outputting YES or NO. Consider the question and expected_answer. Is the given_answer close to the expected_answer?`;
    let user_content = `question: ${question}, expected_answer: ${expected_answer}, given_answer: ${given_answer}. `;

    try {
        let valid_answers = ['YES', 'NO'];
        let response = '';

        while (!valid_answers.includes(response.trim())) {
            response = await callLMStudio(system_content, user_content, 2);
        }

        if (response.trim() === 'YES') {
            return true;
        } else if (response.trim() === 'NO') {
            return false;
        } else {
            console.error(`LM-studio-helper.js: checkAnswer: Invalid response: ${response}`);
            return false;
        }
    } 
            
    catch (error) {
        throw error;
    }
}
