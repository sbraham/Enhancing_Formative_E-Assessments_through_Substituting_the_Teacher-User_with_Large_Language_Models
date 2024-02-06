console.log('Loading: feedback-generation.js');

/* Imports LM-Studio Helper */
import { callLMStudio } from './LM-studio-helper.js';

/**
 * Generates supportive and constructive feedback for a given answer.
 * 
 * @async
 * @param {object} answer_object - The answer object containing the context, question, correct answer, and given answer.
 * @returns {Promise<string>} - The generated feedback.
 * @throws {Error} - If an error occurs during the API call.
 */
export async function generateFeedback(answer_object) {
    let system_content = `Given the following context, question and expected answer, generate supportive and constructive feedback for the given answer.`;
    
    let user_content = `Context: ${answer_object.context}. `;
    user_content += `Question: ${answer_object.question}. `;
    user_content += `Expected Answer: ${answer_object.correct_answer}. `;
    user_content += `Given Answer: ${answer_object.given_answer}. `;
    user_content += `Is Correct: ${answer_object.isCorrect}. `;

    try {
        let response = await callLMStudio(system_content, user_content);
        return response;
    } 
            
    catch (error) {
        console.error(`generateFeedback: error:`, error);
        throw error;
    }
}