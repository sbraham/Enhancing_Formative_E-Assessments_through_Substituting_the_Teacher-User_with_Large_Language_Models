/* Imports LM-Studio Helper */
import { callLMStudio } from '../LM-studio-helper.js';

/**
 * Options 1: Generates a short answer question based on the given context.
 * 
 * @async
 * @param {string} context - The context for the question.
 * @param {Array} existing_questions - An array of existing questions to avoid repetition.
 * @returns {Promise<string>} - A promise that resolves to the generated question.
 * @throws {Error} - If there is an error while generating the question.
 */
export async function generateOneQuestion(context, existing_questions = []) {
    let system_content = `Generate one short answer question relating to the following context. `;
    system_content += `The question must be answerable by a single word or phrase. `;
    system_content += `Only write the question, do not state the answer or any examples. `;

    let user_content = `Context: ${context}. `;

    if (existing_questions.length > 0) {
        system_content += 'The question must be different to the following questions: ';

        for (let i = 0; i < existing_questions.length; i++) {
            system_content += `"${i}: ${existing_questions[i].question}"`;

            if (i < existing_questions.length - 1) {
                system_content += `, `;
            } else {
                system_content += `. `;
            }
        }
    }

    try {
        let question = await callLMStudio(system_content, user_content, 500);
        return question.trim();
    }

    catch (error) {
        throw error;
    }
}

/**
 * Options 2: Generates multiple short answer questions based on a given context.
 * 
 * @async
 * @param {number} number_of_questions - The number of questions to generate.
 * @param {string} [context=''] - The context for the questions.
 * @returns {Promise<string[]>} - An array of generated questions.
 * @throws {Error} - If an error occurs during the question generation process.
 */
export async function generateManyQuestions(number_of_questions, context = ``) {
    let system_content = ``;

    if (number_of_questions > 1) {
        system_content += `Generate exactly ${number_of_questions} different short answer question relating to the following context. `;
    } else {
        system_content += `Generate a short answer question relating to the following context. `;
    }

    system_content += `The question must be answerable by a single word or phrase. `;
    system_content += `Only write the question, do not state the answer or any examples. `;

    system_content += `Start and end each question with a | character. `;
    system_content += `For example, "| 1. What is the capital of France? | 2. What is the capital of Spain? | ... | n. What is the capital of Italy? |"`;

    let user_content = `Context: ${context}. `;

    try {
        let questions = [];
        number_of_questions = Number(number_of_questions);

        while (questions.length !== number_of_questions) {
            let response = await callLMStudio(system_content, user_content, 1000);

            let potential_questions = response.split('|')
                .filter(question => /[a-zA-Z]/.test(question)) // Remove empty strings
                .map(question => question.replace(/^[^\w\s]+|[^\w\s]+$/g, '')) // Remove leading and trailing punctuation
                .map(question => question.trim()); // Remove leading and trailing whitespace

            if (potential_questions.length > number_of_questions) {
                potential_questions = potential_questions.slice(0, number_of_questions);
            }

            questions = potential_questions;
        }

        return questions;
    }

    catch (error) {
        throw error;
    }
}