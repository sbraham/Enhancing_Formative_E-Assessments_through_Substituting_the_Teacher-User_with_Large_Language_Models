import { callLMStudio } from './LM-studio-helper.js';
import { QUIZ_GENERATION_CREATIVITY, QUESTION_MAX_TOKENS, ANSWER_MAX_TOKENS } from '../config.js';

/**
 * Generates a question based on the given context.
 * 
 * @param {string} context - The context for generating the question.
 * @param {Array<string>} existing_questions - An optional array of existing questions to avoid generating duplicates.
 * @returns {Promise<string>} - A promise that resolves to the generated question.
 */
export async function generateQuestion(context, existing_questions = []) {
    //console.log(`LM-studio-helper.js: generateQuestion`);

    let system_content = 'Generate one short answer question relating to the following context. ';
    system_content += 'The question must be answerable by a single word or phrase. ';
    system_content += 'Only write the question, do not state the answer. ';

    let user_content = `context: ${context}.`;

    if (existing_questions.length > 0) {
        system_content += 'Outputs must different in topic from the following questions: ';

        for (let i = 0; i < existing_questions.length; i++) {
            system_content += `"${existing_questions[i].question}"`;

            if (i < existing_questions.length - 1) {
                system_content += ', ';
            } else {
                system_content += '.';
            }
        }
    }

    try {
        let response = await callLMStudio(system_content, user_content, QUESTION_MAX_TOKENS, QUIZ_GENERATION_CREATIVITY);
        return response;
    } catch (error) {
        console.error('LM-studio-helper.js: ERROR:', error);
        return 'ERROR';
    }
}

/**
 * Generates an answer to the given question using LM Studio.
 * 
 * @param {string} context - The context for generating the answer.
 * @param {string} question - The question to generate an answer for.
 * @returns {Promise<string>} - The generated answer.
 */
export async function generateAnswer(context, question) {
    //console.log(`LM-studio-helper.js: generateAnswer`);

    let system_content = `Given the context, what is the TRUE answer to the following question?`;
    let user_content = `context: ${context}, question: ${question}`;

    try {
        let response = await callLMStudio(system_content, user_content, ANSWER_MAX_TOKENS, QUIZ_GENERATION_CREATIVITY);
        return response;
    } catch (error) {
        console.error('LM-studio-helper.js: ERROR:', error);
        return 'ERROR';
    }
}

/**
 * Generates distractors for a given question and context.
 * @param {string} context - The context in which the question is asked.
 * @param {string} question - The question for which distractors need to be generated.
 * @param {Array<string>} distractors - An optional array of existing distractors to avoid generating duplicates.
 * @returns {Promise<string>} - A promise that resolves to the generated distractors.
 */
export async function generateDistractors(context, question, options = []) {
    //console.log(`LM-studio-helper.js: generateDistractors`);

    let system_content = `Given the context, what is a FALSE answer to the following question?`;
    let user_content = `context: ${context}, question: ${question}`;

    if (options.length > 0) {
        system_content += ` The distractor must be different from the following options: ${options}`;
    }

    try {
        let response = await callLMStudio(system_content, user_content, ANSWER_MAX_TOKENS, QUIZ_GENERATION_CREATIVITY);
        return response;
    } catch (error) {
        console.error('LM-studio-helper.js: ERROR:', error);
        return 'ERROR';
    }
}

/* quiz_type: multiple_choice, short_answer */

/**
 * Generates a stepwise question for a quiz.
 * @param {string} quiz_type - The type of quiz (multiple_choice, short_answer).
 * @param {string} context - The context for generating the question.
 * @param {number} number_of_options - The number of options for multiple choice questions (default: 4).
 * @param {Array} existing_questions - An array of existing questions to avoid duplication (default: []).
 * @returns {Promise<Object>} - A promise that resolves to an object containing the generated question, answer, and options.
 */
export async function SWQG(quiz_type, context, number_of_options = 4, existing_questions = []) {
    //console.debug(`LM-studio-helper.js: SWQG()`);

    // Start the timer
    const start_time = performance.now();

    let question, answer = '';
    let options = [];

    /* Step 1: Generate a question */
    console.debug('LM-studio-helper.js: SWQG: Step 1: Generate a question');
    question = await generateQuestion(context, existing_questions);

    /* Step 2: Generate the answer */
    console.debug('LM-studio-helper.js: SWQG: Step 2: Generate the answer');
    answer = await generateAnswer(context, question);

    if (quiz_type == 'multiple_choice') {
        /* Step 3: Generate the distractors */
        console.debug('LM-studio-helper.js: SWQG: Step 3: Generate the distractors');
        options.push(answer)

        for (let i = 0; i < number_of_options - 1; i++) {
            let distractor = await generateDistractors(context, question, options);
            options.push(distractor);
        }
    }

    // Calculate the execution time
    const end_time = performance.now();
    const execution_time = end_time - start_time;
    const minutes = Math.floor(execution_time / 60000);
    const seconds = Math.floor((execution_time % 60000) / 1000);
    const milliseconds = Math.floor((execution_time % 1000));
    
    console.log(`LM-studio-helper.js: SWQG: Execution time: ${minutes} minutes, ${seconds} seconds, ${milliseconds} milliseconds`);

    return { question: question, answer: answer, options: options };
}