/* Imports LM-Studio Helper */
import { callLMStudio } from '../LM-studio-helper.js';

// CODE NO LONGER IN USE
// /**
//  * Options 1: Generates distractors for a given question and context.
//  * 
//  * @async
//  * @param {string} context - The context in which the question is asked.
//  * @param {string} question - The question for which distractors need to be generated.
//  * @param {Array<string>} options - An optional array of existing distractors to avoid generating duplicates.
//  * @returns {Promise<string>} - A promise that resolves to the generated distractors.
//  * @throws {Error} - If an error occurs during the distractor generation process.
//  */
// export async function generateDistractor(context, question, options = []) {
//     let system_content = `Given the context, what is a FALSE distractor answer to the following question?`;
//     system_content += `Do not state in any way that the answer is false, or that it is a distractor. `;

//     let user_content = `Context: ${context}. `;
//     user_content += `Question: ${question}. `;

//     if (options.length > 0) {
//         system_content += `The distractor must be different from the following options: ${options}. `;
//     }

//     try {
//         let distractor = await callLMStudio(system_content, user_content, 500);
//         return distractor.trim();
//     }

//     catch (error) {
//         throw error;
//     }
// }

/**
 * Option 2: Generates multiple distractor answers for a given question and context.
 * 
 * @async
 * @param {number} number_of_distractors - The number of false distractor answers to generate.
 * @param {string} context - The context for the question.
 * @param {string} question - The question for which distractors need to be generated.
 * @param {string} answer - The true answer to the question.
 * @param {boolean} hallucination_detection - Whether or not to use hallucination detection. Default is true.
 * @param {number} false_threshold - The threshold to determine the percentage of distractors that must be false (when hallucination_detection is true). Default is 1 (100%)
 * @param {number} relevence_threshold - The threshold to determine the percentage of distractors that must be relevant (when hallucination_detection is true). Default is 1 (100%)
 * @returns {Promise<string[]|string>} - An array of distractor answers or an error message if an error occurs.
 * @throws {Error} - If an error occurs during the distractor generation process.
 */
export async function generateManyDistractors(number_of_distractors, context, question, answer, hallucination_detection = false, false_threshold = 1, relevence_threshold = 1) {
    let system_content = `Given the context, generate exactly ${number_of_distractors + 2} FALSE distractor answers to the following question. `;
    system_content += `The true answer is "${answer}". Each distractor must be different from the true answer and from each other. Distractors should look similar to the answer in form. `;
    system_content += `Do not state in any way that the answer is false, or that it is a distractor. `;
    
    system_content += `Format the distractors as a list, separated by bars "|". `;
    system_content += `For example, if the question was "What is the capital of France?", `;
    system_content += `a valid response might be "|Lyon|Berlin|London|Madrid|". `;
    system_content += `Do not number the distractors. `;

    let user_content = `Context: ${context}. `;
    user_content += `Question: ${question}. `;

    try {
        let distractors = [];

        for (let i = 0; i < 10; i++) {

            /* Generate all distractors */
            while (distractors.length !== number_of_distractors) {
                let response = await callLMStudio(system_content, user_content, 1000);

                let potential_distractors = response.split('|');
                //console.debug(`generateManyDistractors: response: ${response}`);

                potential_distractors = potential_distractors.map(distractor => String(distractor)) // Convert to string
                //console.debug(`generateManyDistractors: potential_distractors: ${potential_distractors}`);
    
                potential_distractors = potential_distractors.map(distractor => distractor.trim()) // Remove leading and trailing punctuation
                //console.debug(`generateManyDistractors: potential_distractors: ${potential_distractors}`);
    
                potential_distractors = potential_distractors.filter(distractor => /[a-zA-Z+\-*/^()]/.test(distractor)) // Remove strings that don't contain letters or mathematical symbols (including empty strings)
                //console.debug(`generateManyDistractors: potential_distractors: ${potential_distractors}`);
    
                potential_distractors = potential_distractors.map(distractor => distractor.replace(/^[.,?!]+|[.,?!]+$/g, '')); // Remove leading and trailing punctuation
                potential_distractors = potential_distractors.map(distractor => /[a-zA-Z]/.test(distractor) ? distractor + "." : distractor); // Add a period to the end of each answer if it contains a text character
                //console.debug(`generateManyDistractors: potential_distractors: ${potential_distractors}`);

                potential_distractors = potential_distractors.filter(distractor => distractor !== answer); // Remove the true answer from the list of potential distractors
                potential_distractors = potential_distractors.filter(distractor => !distractors.includes(distractor)); // Remove any distractors that have already been added to the list
                //console.debug(`generateManyDistractors: potential_distractors: ${potential_distractors}`);

                if (potential_distractors.length > number_of_distractors) {
                    potential_distractors = potential_distractors.slice(0, number_of_distractors);
                }

                distractors = potential_distractors;
            }

            /* Hallucination Detection */
            if (!hallucination_detection) {
                break;
            } else {
                let is_false_count = 0;
                // let is_relevent_count = 0;

                for (let distractor of distractors) {
                    if (await judgeDistractorFalcity(question, distractor)) {
                        is_false_count++;
                    }

                    // if (await areDistractorsRelevent(context, question, distractor)) {
                    //     is_relevent_count++;
                    // }
                }

                if (is_false_count / number_of_distractors >= false_threshold /* && is_relevent_count / number_of_distractors >= relevence_threshold */) {
                    break;
                }

                /* Otherwise */
                /* If the distractor is not correct, try again */
            }
        }

        return distractors;

    } catch (error) {
        // Handle the error here
        console.error(error);
    }
}

/***************************/
/* Hallucination Detection */
/***************************/

export async function areDistractorsFalse(question, distractor, temperature = 0.2) {
    let system_content = `Is the given answer a false distractor to the following question? `;
    system_content += `Output either YES or NO. `;

    let user_content = `Given answer: ${distractor}. `;
    user_content += `Following question: ${question}. `;

    try {
        let response = await callLMStudio(system_content, user_content, 2, temperature);

        if (response.toLowerCase().includes('yes')) {
            //console.debug(`✅ Hallucination Detection: Is Distractor False? : YES`);
            return true;
        } else if (response.toLowerCase().includes('no')) {
            //console.debug(`❌ Hallucination Detection: Is Distractor False? : NO`);
            //console.debug(`Question: ${question}`);
            //console.debug(`Distractor: ${distractor}`);
            return false;
        }
    }

    catch (error) {
        console.error(error);
    }
}

export async function judgeDistractorFalcity(question, distractor, number_of_judges = 10, temperature = 0.2) {
    let rulings = 0;

    console.debug(`judgeDistractorFalcity: judging...`);
    console.debug(`judgeDistractorFalcity: question: ${question}`);
    console.debug(`judgeDistractorFalcity: distractor: ${distractor}`);

    for (let i = 0; i < number_of_judges; i++) {
        let judge_response = await areDistractorsFalse(question, distractor, temperature);

        console.debug(`judgeDistractorFalcity: judge_response_${i}: ${judge_response}`);

        if (judge_response) {
            rulings++;
        }
    }

    if (rulings > Math.ceil(number_of_judges / 2)) {
        const final_ruling = true;
    } else {
        const final_ruling = false;
    }

    console.debug(`judgeDistractorFalcity: final_ruling: ${final_ruling}`);

    return final_ruling;
}

// CODE NO LONGER IN USE
// export async function areDistractorsRelevent(context, question, distractor) {
//     let system_content = `Is the given distractor fall within to the given context and question? `;
//     system_content += `i.e. Do the topics in the distractor relate to the topics in the context? `;
//     system_content += `Output output either YES or NO. `;

//     let user_content = `Given distractor: ${distractor}. `;
//     user_content += `Given context: ${context}. `;
//     user_content += `Given question: ${question}. `;

//     try {
//         let response = await callLMStudio(system_content, user_content, 2);

//         if (response.toLowerCase().includes('yes')) {
//             console.debug(`✅ Hallucination Detection: Is Distractor Relevant? : YES`);
//             return true;
//         } else if (response.toLowerCase().includes('no')) {
//             console.debug(`❌ Hallucination Detection: Is Distractor Relevant? : NO`);
//             console.debug(`Distractor: ${distractor}`);
//             return false;
//         }
//     }

//     catch (error) {
//         throw error;
//     }
// }