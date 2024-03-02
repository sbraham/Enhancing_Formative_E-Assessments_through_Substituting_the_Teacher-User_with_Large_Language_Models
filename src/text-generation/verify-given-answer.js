/* Imports */
import { callLMStudio } from './LM-studio-helper.js';

/**
 * Verifies that the given answer is close to the expected answer.
 * 
 * @async
 * @param {string} context - The context for the question.
 * @param {string} question - The question being asked.
 * @param {string} expected_answer - The expected answer for the question.
 * @param {string} given_answer - The given answer to be checked.
 * @param {number} number_of_attempts - The number of attempts to verify the given answer. Default is 10.
 * @returns {Promise<boolean>} - A promise that resolves to true if the given answer is close to the expected answer, false otherwise.
 * @throws {Error} - If an error occurs during the process.
 */
export async function isGivenQuestionCorrect(context, question, expected_answer, given_answer, number_of_attempts = 5, temperature = 0) {    
    let system_content = `Consider the given question. `;
    system_content += `Is the given answer close to the expected answer? `;
    system_content += `Output output either YES or NO. `;
    
    let user_content = `context: ${context}. `;
    user_content += `question: ${question}. `;
    user_content += `expected_answer: ${expected_answer}. `;
    user_content += `given_answer: ${given_answer}. `;

    try {
        let response = '';

        for (let i = 1; i <= number_of_attempts; i++) {
            response = await callLMStudio(system_content, user_content, 2, temperature);

            //console.debug(`isGivenQuestionCorrect: response_${i}: ${response}`);

            if (response.toLowerCase().includes('yes')) {
                return true;
            } else if (response.toLowerCase().includes('no')) {
                return false;
            }
        }

        console.error(`isGivenQuestionCorrect: Too many failed attempts. Return false.`);
        return false;
    } 
            
    catch (error) {
        console.error(`isGivenQuestionCorrect: error:`, error);
        throw error;
    }
}

// /**
//  * Judges the given answer based on the expected answer and the question.
//  * @param {string} question - The question being asked.
//  * @param {string} expected_answer - The expected answer to the question.
//  * @param {string} given_answer - The given answer to be judged.
//  * @param {number} number_of_judges - The number of judges to consult. Default is 1.
//  * @param {number} number_of_attempts - The number of attempts to verify the given answer. Default is 10.
//  * @returns {boolean} - Returns true if the given answer is judged to be correct, false otherwise.
//  */
// export async function judgeGivenAnswer(question, expected_answer, given_answer, number_of_judges = 1, number_of_attempts = 10, temperature = 0.2) {    
//     let rulings = 0;

//     console.debug(`judgeGivenAnswer: judging...`);
//     console.debug(`judgeGivenAnswer: question: ${question}`);
//     console.debug(`judgeGivenAnswer: expected_answer: ${expected_answer}`);
//     console.debug(`judgeGivenAnswer: given_answer: ${given_answer}`);
    
//     for (let i = 0; i < number_of_judges; i++) {
//         let judge_response = await isGivenQuestionCorrect(question, expected_answer, given_answer, number_of_attempts, temperature);

//         if (judge_response) {
//             rulings++;
//         }
//     }

//     if (rulings > Math.ceil(number_of_judges / 2)) {
//         const final_ruling = true;
//     } else {
//         const final_ruling = false;
//     }

//     console.debug(`judgeGivenAnswer: final_ruling: ${final_ruling}`);

//     return final_ruling;
// }