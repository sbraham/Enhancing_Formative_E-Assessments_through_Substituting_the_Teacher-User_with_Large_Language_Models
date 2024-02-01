/* Imports */
import { callLMStudio } from './LM-studio-helper.js';

/**
 * Verifies that the given answer is close to the expected answer.
 * 
 * @async
 * @param {string} question - The question being asked.
 * @param {string} expected_answer - The expected answer for the question.
 * @param {string} given_answer - The given answer to be checked.
 * @returns {Promise<boolean>} - A promise that resolves to true if the given answer is close to the expected answer, false otherwise.
 * @throws {Error} - If an error occurs during the process.
 */
export async function verifyGivenAnswer(question, expected_answer, given_answer, number_of_attempts = 10) {    
    let system_content = `Consider the given question. `;
    system_content += `Is the given answer close to the expected answer? `;
    system_content += `Output output either YES or NO. `;
    
    let user_content = `question: ${question}. `;
    user_content += `expected_answer: ${expected_answer}. `;
    user_content += `given_answer: ${given_answer}. `;

    try {
        let response = '';

        for (let i = 1; i <= number_of_attempts; i++) {
            response = await callLMStudio(system_content, user_content, 2);

            if (response.toLowerCase().includes('yes')) {
                return true;
            } else if (response.toLowerCase().includes('no')) {
                return false;
            }
        }

        console.error(`checkOption: Too many failed attempts. Return false.`);
        return false;
    } 
            
    catch (error) {
        throw error;
    }
}

export async function judgeGivenAnswer(question, expected_answer, given_answer, number_of_judges = 1, number_of_attempts = 10) {    
    let rulings = 0;
    
    for (let i = 0; i < number_of_judges; i++) {
        let judge_response = await verifyGivenAnswer(question, expected_answer, given_answer, number_of_attempts);

        if (judge_response) {
            rulings++;
        }
    }

    if (rulings >= Math.ceil(number_of_judges / 2)) {
        return true;
    } else {
        return false;
    }
}