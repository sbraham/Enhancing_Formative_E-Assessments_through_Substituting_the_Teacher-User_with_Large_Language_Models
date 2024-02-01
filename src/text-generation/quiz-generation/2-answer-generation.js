/* Imports LM-Studio Helper */
import { callLMStudio } from '../LM-studio-helper.js';

/**
 * Opton 1: Generates an answer to the given question using LM Studio.
 * 
 * @async
 * @param {string} context - The context for generating the answer.
 * @param {string} question - The question to generate an answer for.
 * @param {boolean} hallucination_detection - Whether or not to use hallucination detection. Default is true.
 * @returns {Promise<string>} - The generated answer.
 * @throws {Error} - If an error occurs during the answer generation process.
 */
export async function generateAnswer(context, question, hallucination_detection = true) {
    let system_content = `Given the context, what is the TRUE answer to the following question?`;
    system_content += `Do not state in any way that the answer is true, or that it is the answer. `;
    system_content += `Only write the answer, do not write any examples or other possible answers. `;

    system_content += `Start and end the answer with a | character. `;
    system_content += `For example, for the question "What is the capital of France?",  `;
    system_content += `The output would be, "| Paris |". `;

    let user_content = `Context: ${context}. `;
    user_content += `Question: ${question}. `;

    try {
        for (let i = 0; i < 10; i++) {
            /* Generate an answer */
            let response = await callLMStudio(system_content, user_content, 500);

            /* Clean up output */
            response = response.split('|')
                .filter(ans => /[a-zA-Z]/.test(ans)) // Remove empty strings
                .map(ans => ans.replace(/^[^\w\s]+|[^\w\s]+$/g, '')) // Remove leading and trailing punctuation
                .map(ans => ans.trim()); // Remove leading and trailing whitespace

            let answer = response[0];

            /* Hallucination Detection */
            if (!hallucination_detection) {
                break;
            }

            /* Otherwise */
            if (await isAnswerCorrect(question, answer)) {
                break;
            }

            /* If the answer is not correct, try again */
            if (i === 9) {
                console.error(`generateAnswer: Too many failed attempts. Return empty string.`);
            }
        }

        return answer;
    }

    catch (error) {
        throw error;
    }
}

// CODE NO LONGER IN USE
// /** 
//  * Option 2: Generates one answer and multiple options for a given question and context.
//  * 
//  * @async
//  * @param {string} context - The context for the question.
//  * @param {string} question - The question for which the answer and options need to be generated.
//  * @param {number} number_of_options - The number of options to generate.
//  * @returns {Promise<Object>} - A promise that resolves to an object containing the generated answer and options.
//  * @throws {Error} - If an error occurs during the answer and option generation process.
//  */
// export async function generateManyOptions(context, question, number_of_options) {
//     let system_content = `Given the context, generate exactly ${number_of_options + 1} answers to the following question. `;
//     system_content += `The first answer is the true answer. The other options are false answers. `;
//     system_content += `Each answer must be different from the true answer and from each other. Answers should look similar to the true answer in form.`;
//     system_content += `Do not number the answers. `;

//     system_content += `Each answer should have the following format: `;
//     system_content += `Start and end each answer with a | character. `;
//     system_content += `For example, for the question "What is the capital of France?",  `;
//     system_content += `The output would be, "| Paris | London | Madrid | Berlin |". `;

//     let user_content = `Context: ${context}. `;
//     user_content += `Question: ${question}. `;

//     try {
//         let options = [];

//         while (options.length !== number_of_options) {
//             let response = await callLMStudio(system_content, user_content, 1000);

//             let potential_options = response.split('|')
//                 .filter(option => /[a-zA-Z]/.test(option)) // Remove empty strings
//                 .map(option => option.replace(/^[^\w\s]+|[^\w\s]+$/g, '')) // Remove leading and trailing punctuation
//                 .map(option => option.trim()) // Remove leading and trailing whitespace
//                 .filter(option => option.toLowerCase() !== question.toLowerCase()); // Remove the answer

//             if (potential_options.length > number_of_options) {
//                 potential_options = potential_options.slice(0, number_of_options);
//             }

//             options = potential_options;
//         }            

//         return { answer: question, options: options };
//     }

//     catch (error) {
//         throw error;
//     }
// }

/***************************/
/* Hallucination Detection */
/***************************/

export async function isAnswerCorrect(question, answer) {
    let system_content = `Is the given answer the right answer to the following question? `;
    system_content += `Output either YES or NO. `;

    let user_content = `Given answer: ${answer}. `;
    user_content += `Following question: ${question}. `;

    try {
        let response = await callLMStudio(system_content, user_content, 2);

        if (response.toLowerCase().includes('yes')) {
            console.log(`Hallucination Detection: Is Answer Correct? : YES`);
            return true;
        } else if (response.toLowerCase().includes('no')) {
            console.warn(`Hallucination Detection: Is Answer Correct? : NO`);
            return false;
        }
    }

    catch (error) {
        throw error;
    }
}