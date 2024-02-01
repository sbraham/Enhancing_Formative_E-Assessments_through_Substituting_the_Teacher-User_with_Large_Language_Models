/* Imports LM-Studio Helper */
import { callLMStudio } from '../LM-studio-helper.js';

/**
 * Options 1: Generates distractors for a given question and context.
 * 
 * @async
 * @param {string} context - The context in which the question is asked.
 * @param {string} question - The question for which distractors need to be generated.
 * @param {Array<string>} options - An optional array of existing distractors to avoid generating duplicates.
 * @returns {Promise<string>} - A promise that resolves to the generated distractors.
 * @throws {Error} - If an error occurs during the distractor generation process.
 */
export async function generateDistractor(context, question, options = []) {
    let system_content = `Given the context, what is a FALSE distractor answer to the following question?`;
    system_content += `Do not state in any way that the answer is false, or that it is a distractor. `;

    let user_content = `Context: ${context}. `;
    user_content += `Question: ${question}. `;

    if (options.length > 0) {
        system_content += `The distractor must be different from the following options: ${options}. `;
    }

    try {
        let distractor = await callLMStudio(system_content, user_content, 500);
        return distractor.trim();
    }

    catch (error) {
        throw error;
    }
}

/**
 * Option 2: Generates multiple distractor answers for a given question and context.
 * 
 * @async
 * @param {number} number_of_distractors - The number of false distractor answers to generate.
 * @param {string} context - The context for the question.
 * @param {string} question - The question for which distractors need to be generated.
 * @returns {Promise<string[]|string>} - An array of distractor answers or an error message if an error occurs.
 * @throws {Error} - If an error occurs during the distractor generation process.
 */
export async function generateManyDistractors(number_of_distractors, context, question, answer) {
    let system_content = `Given the context, generate exactly ${number_of_distractors + 2} FALSE distractor answers to the following question. `;
    system_content += `The true answer is "${answer}". Each distractor must be different from the true answer and from each other. Distractors should look similar to the answer in form. `;
    system_content += `Do not state in any way that the answer is false, or that it is a distractor. `;
    system_content += `Do not number the distractors. `;

    system_content += `Each distractor answer should have the following format:`;
    system_content += `Start and end each question with a | character. `;
    system_content += `For example, | London | Paris | Madrid | . `;

    let user_content = `Context: ${context}. `;
    user_content += `Question: ${question}. `;

    try {
        let distractors = [];

        while (distractors.length !== number_of_distractors) {
            let response = await callLMStudio(system_content, user_content, 1000);

            let potential_distractors = response.split('|')
                .filter(distractor => /[a-zA-Z]/.test(distractor)) // Remove empty strings
                .map(distractor => distractor.replace(/^[^\w\s]+|[^\w\s]+$/g, '')) // Remove leading and trailing punctuation
                .map(distractor => distractor.trim()) // Remove leading and trailing whitespace
                .filter(distractor => distractor.toLowerCase() !== answer.toLowerCase()); // Remove the answer

            if (potential_distractors.length > number_of_distractors) {
                potential_distractors = potential_distractors.slice(0, number_of_distractors);
            }

            distractors = potential_distractors;
        }

        return distractors;

    } catch (error) {
        throw error;
    }
}