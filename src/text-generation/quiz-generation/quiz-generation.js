//import { Timer } from "./../../classes/Timer.js"
import { generateManyQuestions } from "./1-question-generation.js";
import { generateAnswer } from "./2-answer-generation.js";
import { generateManyDistractors } from "./3-distractor-generation.js";

//const timer = new Timer();

// /**
//  * Generates a stepwise question for a quiz.
//  * SWQG = Stepwise Question Generation
//  * 
//  * @async
//  * @param {string} quiz_type - The type of quiz (multiple_choice, short_answer).
//  * @param {string} context - The context for generating the question.
//  * @param {number} number_of_options - The number of options for multiple choice questions (default: 4).
//  * @param {Array} existing_questions - An array of existing questions to avoid duplication (default: []).
//  * @returns {Promise<Object>} - A promise that resolves to an object containing the generated question, answer, and options.
//  */
// export async function SWQG(quiz_type, context, number_of_options = 4, existing_questions = []) {
//     // Start the timer
//     //timer.reset();
//     //timer.start();

//     let question, answer = ``;
//     let options = [];

//     /* Step 1: Generate a question */
//     console.debug(`LM-studio-helper.js: SWQG: Step 1: Generate a question`);
//     question = await generateOneQuestion(context, existing_questions);

//     /* Step 2: Generate the answer */
//     console.debug(`LM-studio-helper.js: SWQG: Step 2: Generate the answer`);
//     answer = await generateAnswer(context, question);

//     if (quiz_type == `multiple_choice`) {
//         /* Step 3: Generate the distractors */
//         console.debug(`LM-studio-helper.js: SWQG: Step 3: Generate the distractors`);
//         options.push(answer)

//         for (let i = 0; i < number_of_options - 1; i++) {
//             let distractor = await generateDistractor(context, question, options);
//             options.push(distractor);
//         }
//     }

//     // Stop the timer
//     //const time = timer.stop();
//     console.debug(`LM-studio-helper.js: SWQG: ${time}`);

//     return { question: question, answer: answer, options: options };
// }


/**
 * Generates a batch of questions for a quiz.
 * SWQG = Stepwise Question Generation
 * 
 * @async
 * @param {number} number_of_questions - The number of questions to generate.
 * @param {string} quiz_type - The type of quiz (e.g., "multiple_choice").
 * @param {string} context - The context for generating the questions.
 * @param {number} [number_of_options=4] - The number of options for multiple-choice questions.#
 * @param {boolean} hallucination_detection - Whether or not to use hallucination detection. Default is true.
 * @returns {Promise<Array<Object>>} - An array of question objects, each containing the question, answer, and options.
 */
export async function BatchSWQG(number_of_questions, quiz_type, context, number_of_options = 4, hallucination_detection = true) {
    // Start the timer
    //timer.reset();
    //timer.start();

    let question_objects = [];
    let array_of_questions = [];
    let answer = ``;
    let distractors = [];

    /* Step 1: Generate a question */
    console.debug(`LM-studio-helper.js: BatchSWQG: Step 1: Generate all the questions`);
    array_of_questions = await generateManyQuestions(number_of_questions, context, hallucination_detection, 0.80);

    array_of_questions.forEach(question => {
        question_objects.push({ question: question, answer: ``, options: [] });
    });

    /* Step 2: Generate the answer */
    console.debug(`LM-studio-helper.js: BatchSWQG: Step 2: Generate an answer for each question`);
    for (const question of question_objects) {
        answer = await generateAnswer(context, question.question, hallucination_detection);
        question.answer = answer;
    }

    if (quiz_type == `multiple_choice`) {
        /* Step 3: Generate the distractors */
        console.debug(`LM-studio-helper.js: BatchSWQG: Step 3: Generate the distractors for each question`);

        for (const question of question_objects) {
            question.options.push(question.answer);

            distractors = await generateManyDistractors(number_of_options - 1, context, question.question, question.answer, hallucination_detection);

            distractors.forEach(distractor => {
                question.options.push(distractor);
            });
        }
    }

    // Stop the timer
    //const time = timer.stop();
    console.debug(`LM-studio-helper.js: SWQG: ${time}`);

    return question_objects;
}

// /**
//  * Generates a full question.
//  * EEQG = End-to-End Question Generation
//  * 
//  * @async
//  * @param {string} quiz_type - The type of quiz (e.g., "multiple_choice").
//  * @param {string} context - The context for generating the questions.
//  * @param {number} [number_of_options=4] - The number of options for multiple-choice questions.
//  * @returns {Promise<Array<Object>>} - An array of question objects, each containing the question, answer, and options.
//  */
// export async function EEQG(quiz_type, context, number_of_options = 4) {
//     // Start the timer
//     timer.reset();
//     timer.start();

//     let question = { question: ``, answer: ``, options: [] }

//     console.error(`LM-studio-helper.js: EEQG: Not implemented yet`);

//     // Stop the timer
//     const time = timer.stop();
// }

// /**
//  * Generates a batch of questions for a quiz.
//  * EEQG = End-to-End Question Generation
//  * 
//  * @async
//  * @param {number} number_of_questions - The number of questions to generate.
//  * @param {string} quiz_type - The type of quiz (e.g., "multiple_choice").
//  * @param {string} context - The context for generating the questions.
//  * @param {number} [number_of_options=4] - The number of options for multiple-choice questions.
//  * @returns {Promise<Array<Object>>} - An array of question objects, each containing the question, answer, and options.
//  */
// export async function BatchEEQG(number_of_questions, quiz_type, context, number_of_options = 4) {
//     // Start the timer
//     timer.reset();
//     timer.start();

//     let question = { question: ``, answer: ``, options: [] }

//     console.error(`LM-studio-helper.js: EEQG: Not implemented yet`);

//     // Stop the timer
//     const time = timer.stop();
// }