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
export async function generateAnswer(context, question, hallucination_detection) {
    let attempts = 5;
    let answer = '';

    for (let i = 0; i < attempts; i++) {
        console.debug(`generateAnswer: Attempt ${i + 1} of ${attempts}`);

        /* Generate an answer */
        let response = await promptAnswers(context, question);
        answer = response;

        /* Hallucination Detection */
        if (!hallucination_detection) {
            console.debug(`generateAnswer: Hallucination Detection: OFF`);
            break;
        }

        /* Otherwise */
        console.debug(`generateAnswer: Hallucination Detection: ON`);
        if (await isAnswerCorrect(question, answer)) {
            console.debug(`generateAnswer: Answers are relevant`);
            break;
        }

        console.debug(`generateAnswer: Questions are not relevant`);
    }
    
    return answer;
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
//                 .filter(Boolean) // Remove undefined elements
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

/*****************************/
/* Currated LM Studio Prompt */
/*****************************/

export async function promptAnswers(context, question) {
    let system_content = `Given the context, what is the TRUE answer to the following question?`;
    system_content += `Do not state in any way that the answer is true, or that it is the answer. `;
    system_content += `Only write the answer, do not write any examples or other possible answers. `;

    system_content += `Start and end the answer with a | character. `;
    system_content += `For example, for the question "What is the capital of France?",  `;
    system_content += `The output would be, "| Paris |". `;

    let user_content = `Context: ${context}. `;
    user_content += `Question: ${question}. `;

    try {
        let answer = '';

        /* Generate an answer */
        let response = await callLMStudio(system_content, user_content, 500);

        let potential_answers = response.split('|')
        //console.debug(`generateAnswer: potential_answers: ${potential_answers}`);

        potential_answers = potential_answers.map(answer => String(answer)) // Convert to string
        //console.debug(`generateAnswer: potential_answers: ${potential_answers}`);

        potential_answers = potential_answers.map(answer => answer.trim()) // Remove leading and trailing punctuation
        //console.debug(`generateAnswer: potential_answers: ${potential_answers}`);

        potential_answers = potential_answers.filter(answer => /[a-zA-Z0-9+\-*/^()]/.test(answer)) // Remove strings that don't contain letters, numbers or mathematical symbols (including empty strings)
        //console.debug(`generateAnswer: potential_answers: ${potential_answers}`);

        potential_answers = potential_answers.map(answer => answer.replace(/^[.,?!]+|[.,?!]+$/g, '')); // Remove leading and trailing punctuation
        potential_answers = potential_answers.map(answer => /[a-zA-Z]/.test(answer) ? answer + "." : answer); // Add a period to the end of each answer if it contains a text character
        //console.debug(`generateAnswer: potential_answers: ${potential_answers}`);

        answer = potential_answers[0];

        return answer;
    }

    catch (error) {
        console.error(`generateAnswer: error:`, error);
        console.error(error);
    }
}


/***************************/
/* Hallucination Detection */
/***************************/

export async function isAnswerCorrect(question, answer) {
    let system_content = `Is the given answer the right answer to the following question? `;
    system_content += `Output either YES or NO. `;

    let user_content = `Given answer: ${answer}. `;
    user_content += `Following question: ${question}. `;

    try {
        let response = await callLMStudio(system_content, user_content, 2, 0);

        if (response.toLowerCase().includes('yes')) {
            // console.debug(`✅ Hallucination Detection: Is Answer Correct? : YES`);
            return true;
        } else if (response.toLowerCase().includes('no')) {
            // console.debug(`❌ Hallucination Detection: Is Answer Correct? : NO`);
            // console.debug(`Question: ${question}`);
            // console.debug(`Answer: ${answer}`);
            return false;
        }
    }

    catch (error) {
        console.error(`isAnswerCorrect: error:`, error);
        throw error;
    }
}

// export async function judgeQuestionRelevence(context, question, number_of_judges = 10, temperature = 0.2) {
//     let rulings = 0;

//     console.debug(`judgeGivenAnswer: judging...`);
//     console.debug(`judgeGivenAnswer: context: ${context}`);
//     console.debug(`judgeGivenAnswer: question: ${question}`);
    
//     for (let i = 0; i < number_of_judges; i++) {
//         let judge_response = await isAnswerCorrect(context, question, temperature);

//         console.debug(`judgeGivenAnswer: judge_response_${i}: ${judge_response}`);

//         if (judge_response) {
//             rulings++;
//         }
//     }

//     let final_ruling = false;

//     if (rulings > Math.ceil(number_of_judges / 2)) {
//         final_ruling = true;
//     }

//     console.debug(`judgeGivenAnswer: final_ruling: ${final_ruling}`);

//     return final_ruling;
// }