/* Imports LM-Studio Helper */
import { callLMStudio } from '../LM-studio-helper.js';

// CODE NO LONGER IN USE
// /**
//  * Options 1: Generates a short answer question based on the given context.
//  * 
//  * @async
//  * @param {string} context - The context for the question.
//  * @param {Array} existing_questions - An array of existing questions to avoid repetition.
//  * @param {boolean} hallucination_detection - Whether or not to use hallucination detection. Default is true.
//  * @returns {Promise<string>} - A promise that resolves to the generated question.
//  * @throws {Error} - If there is an error while generating the question.
//  */
// export async function generateOneQuestion(context, existing_questions = [], hallucination_detection = false) {
//     system_content += `Generate a short answer question relating to the following context. `;

//     system_content += `The question must be answerable by a single word or phrase. `;
//     system_content += `Only write the question, do not state the answer or any examples. `;

//     system_content += `Start and end each question with a | character. `;
//     system_content += `For example, "| What is the capital of France? |". `;

//     let user_content = `Context: ${context}. `;

//     if (existing_questions.length > 0) {
//         system_content += 'The question must be different to the following questions: ';

//         for (let i = 0; i < existing_questions.length; i++) {
//             system_content += `"${i}: ${existing_questions[i].question}"`;

//             if (i < existing_questions.length - 1) {
//                 system_content += `, `;
//             } else {
//                 system_content += `. `;
//             }
//         }
//     }

//     try {
//         for (let i = 0; i < 10; i++) {
//             /* Generate a question */   
//             let response = await callLMStudio(system_content, user_content, 500);
            
//             /* Clean up output */
//             response = response.split('|')
//                 .filter(Boolean) // Remove undefined elements
//                 .filter(question => /[a-zA-Z]/.test(question)) // Remove empty strings
//                 .map(question => question.replace(/^[^\w\s]+|[^\w\s]+$/g, '')) // Remove leading and trailing punctuation
//                 .map(question => question.trim()); // Remove leading and trailing whitespace

//             let question = response[0];

//             /* Hallucination Detection */
//             if (!hallucination_detection) {
//                 break;
//             }

//             /* Otherwise */

//             if(await isQuestionRelevent(context, question)) {
//                 break;
//             }

//             /* If the question is not relevant, try again */
//             if (i === 9) {
//                 console.error(`generateOneQuestion: Too many failed attempts. Return empty string.`);
//             }
//         }

//         return question;
//     }

//     catch (error) {
//         throw error;
//     }
// }

/**
 * Options 2: Generates multiple short answer questions based on a given context.
 * 
 * @async
 * @param {number} number_of_questions - The number of questions to generate.
 * @param {string} [context=''] - The context for the questions.
 * @param {boolean} hallucination_detection - Whether or not to use hallucination detection. Default is true.
 * @param {number} relevence_threshold - The threshold to determine the percentage of questions that must be relevant (when hallucination_detection is true). Default is 0.75 (75%)
 * @returns {Promise<string[]>} - An array of generated questions.
 * @throws {Error} - If an error occurs during the question generation process.
 */
export async function generateManyQuestions(number_of_questions, context, hallucination_detection, relevence_threshold = 0.80) {
    try {
        let attempts = 5;
        let questions = [];

        for (let i = 0; i < attempts; i++) {
            /* Generate all questions */
            let response = await promptQuestions(number_of_questions, context);
            questions = response;

            /* Hallucination Detection */
            if (!hallucination_detection) {
                break;
            }

            /* Otherwise */
            let relevant_questions = 0;
            for (let question of questions) {
                if (await isQuestionRelevent(context, question)) {
                    relevant_questions++;
                }
            }

            if (relevant_questions / number_of_questions >= relevence_threshold) {
                break;
            }
        }

        return questions;
    } 
    
    catch (error) {
        console.error(error);
    }

}

/*****************************/
/* Currated LM Studio Prompt */
/*****************************/

export async function promptQuestions(number_of_questions, context) {
    number_of_questions = Number(number_of_questions);
    let system_content = ``;

    if (number_of_questions > 1) {
        system_content += `Generate exactly ${number_of_questions} different short answer question relating to the following context. `;
    } else {
        system_content += `Generate a short answer question relating to the following context. `;
    }

    system_content += `The question must be answerable by a single word or phrase. `;
    system_content += `Only write the question, do not state the answer or any examples. `;

    system_content += `Format the questions as a list, separated by bars "|". `;
    system_content += `For example, if the context was "The capital cities of Europe", `;
    system_content += `"| What is the capital of France? | What is the capital of Spain? | ... | What is the capital of Italy? |"`;
    system_content += `Do not number the questions. `;

    let user_content = `Context: ${context}. `;

    try {
        let questions = [];

        /* Generate all questions */
        while (questions.length !== number_of_questions) {
            let response = await callLMStudio(system_content, user_content, 1000);

            let potential_questions = response.split('|')
            //console.debug(`generateManyQuestions: potential_questions: ${potential_questions}`);

            potential_questions = potential_questions.map(question => String(question)) // Convert to string
            //console.debug(`generateManyQuestions: potential_questions: ${potential_questions}`);

            potential_questions = potential_questions.map(question => question.trim()) // Remove leading and trailing punctuation
            //console.debug(`generateManyQuestions: potential_questions: ${potential_questions}`);            
            
            potential_questions = potential_questions.filter(question => /[a-zA-Z]/.test(question)) // Remove strings that don't contain letters (including empty strings)
            //console.debug(`generateManyQuestions: potential_questions: ${potential_questions}`);

            if (potential_questions.length > number_of_questions) {
                potential_questions = potential_questions.slice(0, number_of_questions);
            }

            questions = potential_questions;
        }

        return questions;

    } catch (error) {
        console.error(`generateManyQuestions: error:`, error);
    }
}

/***************************/
/* Hallucination Detection */
/***************************/

// export async function isQuestionRelevent(context, question) {
//     let system_content = `Is the given question fall within the given context? `;
//     system_content += `i.e. Do the topics in the question relate to the topics in the context? `;
//     system_content += `Output either YES or NO. `;

//     let user_content = `Given question: ${question}. `;
//     user_content += `Given context: ${context}. `;

//     try {
//         let response = await callLMStudio(system_content, user_content, 2);

//         if (response.toLowerCase().includes('yes')) {
//             console.debug(`✅ Hallucination Detection: Is Question Relevant? : YES`);
//             return true;
//         } else if (response.toLowerCase().includes('no')) {
//             console.debug(`❌ Hallucination Detection: Is Question Relevant? : NO`);
//             console.debug(`Question: ${question}`);
//             return false;
//         }
//     }

//     catch (error) {
//         throw error;
//     }
// }