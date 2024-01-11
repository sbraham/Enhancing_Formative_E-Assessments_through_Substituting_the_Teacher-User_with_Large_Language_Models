console.log('Loading: feedback-generation.js');

import { callLMStudio } from './LM-studio-helper.js';

/* Answer Objects: 
    {
        "correct": false,
        "question": "What is the capital of the United States?
        "correct_answer": "Washington D.C.",
        "given_answer": "New York"
        "given_index": 3
    }
*/

export async function generateFeedback(answer_object) {
    let system_content = `Given the following context, question and expected answer, generate supportive and constructive feedback for the given answer.`;
    
    let user_content = `Context: ${answer_object.context}.`;
    system_content += `\nQuestion: ${answer_object.question}.`;
    system_content += `\nExpected Answer: ${answer_object.correct_answer}.`;
    system_content += `\nGiven Answer: ${answer_object.given_answer}.`;

    // console.log('system_content:', system_content);
    // console.log('user_content:', user_content);

    try {
        let response = await callLMStudio(system_content, user_content);
        return response;
    } catch (error) {
        console.error('LM-studio-helper.js: ERROR:', error);
        return 'ERROR';
    }
}