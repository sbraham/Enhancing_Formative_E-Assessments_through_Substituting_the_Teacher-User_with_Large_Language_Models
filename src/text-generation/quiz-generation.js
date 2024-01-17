console.log(`Loading: LM-studio-helper.js`);

/* Imports LM-Studio Helper */
import { callLMStudio } from './LM-studio-helper.js';

/**
 * Generates a short answer question based on the given context.
 * 
 * @async
 * @param {string} context - The context for the question.
 * @param {Array} existing_questions - An array of existing questions to avoid repetition.
 * @returns {Promise<string>} - A promise that resolves to the generated question.
 * @throws {Error} - If there is an error while generating the question.
 */
export async function generateQuestion(context, existing_questions = []) {
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
        let response = await callLMStudio(system_content, user_content);
        return response;
    } 
            
    catch (error) {
        throw error;
    }
}

/**
 * Generates multiple short answer questions based on a given context.
 * 
 * @async
 * @param {number} number_of_questions - The number of questions to generate.
 * @param {string} [context=''] - The context for the questions.
 * @returns {Promise<string[]>} - An array of generated questions.
 * @throws {Error} - If an error occurs during the question generation process.
 */
export async function generateManyQuestion(number_of_questions, context = ``) {
    let system_content = ``;

    if (number_of_questions > 1) {
        system_content += `Generate ${number_of_questions} different short answer question relating to the following context. `;
    } else {
        system_content += `Generate a short answer question relating to the following context. `;
    }

    system_content += `The question must be answerable by a single word or phrase. `;
    system_content += `Only write the question, do not state the answer or any examples. `;
    
    system_content += `Start and end each question with a | character. `;
    system_content += `For example, | 1. What is the capital of France? | 2. What is the capital of Spain? | ... | n. What is the capital of Italy? |`;

    let user_content = `Context: ${context}. `;

    try {
        let questions = [];

        while (Number(questions.length) !== Number(number_of_questions)) {

            let response = await callLMStudio(system_content, user_content);
            
            questions = response.split('|').filter(question => /[a-zA-Z0-9]/.test(question));
        }
        
        return questions;
    } 
            
    catch (error) {
        throw error;
    }
}

/**
 * Generates an answer to the given question using LM Studio.
 * 
 * @async
 * @param {string} context - The context for generating the answer.
 * @param {string} question - The question to generate an answer for.
 * @returns {Promise<string>} - The generated answer.
 * @throws {Error} - If an error occurs during the answer generation process.
 */
export async function generateAnswer(context, question) {
    let system_content = `Given the context, what is the TRUE answer to the following question?`;
    system_content += `Do not state in any way that the answer is true, or that it is the answer. `;
    system_content += `Only write the answer, do not write any examples or other possible answers. `;

    let user_content = `Context: ${context}. `;
    user_content += `Question: ${question}. `;

    try {
        let response = await callLMStudio(system_content, user_content);
        return response;
    } 
            
    catch (error) {
        throw error;
    }
}

/**
 * Generates distractors for a given question and context.
 * 
 * @async
 * @param {string} context - The context in which the question is asked.
 * @param {string} question - The question for which distractors need to be generated.
 * @param {Array<string>} distractors - An optional array of existing distractors to avoid generating duplicates.
 * @returns {Promise<string>} - A promise that resolves to the generated distractors.
 * @throws {Error} - If an error occurs during the distractor generation process.
 */
export async function generateDistractors(context, question, options = []) {
    let system_content = `Given the context, what is a FALSE distractor answer to the following question?`;
    system_content += `Do not state in any way that the answer is false, or that it is a distractor. `;

    let user_content = `Context: ${context}. `;
    user_content += `Question: ${question}. `;

    if (options.length > 0) {
        system_content += `The distractor must be different from the following options: ${options}. `;
    }

    try {
        let response = await callLMStudio(system_content, user_content);
        return response;
    } 
            
    catch (error) {
        throw error;
    }
}

/**
 * Generates multiple distractor answers for a given question and context.
 * 
 * @async
 * @param {number} number_of_distractors - The number of false distractor answers to generate.
 * @param {string} context - The context for the question.
 * @param {string} question - The question for which distractors need to be generated.
 * @returns {Promise<string[]|string>} - An array of distractor answers or an error message if an error occurs.
 * @throws {Error} - If an error occurs during the distractor generation process.
 */
export async function generateManyDistractors(number_of_distractors, context, question, answer) {
    let system_content = `Given the context, give ${number_of_distractors} FALSE distractor answers to the following question?`;
    system_content += `The true answer is "${answer}", and distractors should be similar in format to it. `;
    system_content += `Do not state in any way that the answer is false, or that it is a distractor. `;
    system_content += `Do not number the distractors. `;
    system_content += `Only generate ${number_of_distractors} distractors, do not generate more. `;

    system_content += `Each distractor answer should have the following format:`;
    system_content += `Start and end each question with a | character. `;
    system_content += `For example, | London | Paris | ... | Rome |`;
    system_content += `Do not include the true answer in the distractors. `;
    system_content += `Do not number the distracotrs. `;

    let user_content = `Context: ${context}. `;
    user_content += `Question: ${question}. `;

    try {
        let distractors = [];

        while (distractors.length !== number_of_distractors) {

            let response = await callLMStudio(system_content, user_content);
            
            distractors = response.split('|')

            distractors = distractors.filter(distractor => distractor !== "");
        }
        
        return distractors;
    } 
            
    catch (error) {
        throw error;
    }
}

/**
 * Generates a stepwise question for a quiz.
 * 
 * @async
 * @param {string} quiz_type - The type of quiz (multiple_choice, short_answer).
 * @param {string} context - The context for generating the question.
 * @param {number} number_of_options - The number of options for multiple choice questions (default: 4).
 * @param {Array} existing_questions - An array of existing questions to avoid duplication (default: []).
 * @returns {Promise<Object>} - A promise that resolves to an object containing the generated question, answer, and options.
 */
export async function SWQG(quiz_type, context, number_of_options = 4, existing_questions = []) {
    // Start the timer
    const start_time = performance.now();

    let question, answer = ``;
    let options = [];

    /* Step 1: Generate a question */
    console.debug(`LM-studio-helper.js: SWQG: Step 1: Generate a question`);
    question = await generateQuestion(context, existing_questions);

    /* Step 2: Generate the answer */
    console.debug(`LM-studio-helper.js: SWQG: Step 2: Generate the answer`);
    answer = await generateAnswer(context, question);

    if (quiz_type == `multiple_choice`) {
        /* Step 3: Generate the distractors */
        console.debug(`LM-studio-helper.js: SWQG: Step 3: Generate the distractors`);
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
    
    console.debug(`LM-studio-helper.js: SWQG: Execution time: ${minutes} minutes, ${seconds} seconds, ${milliseconds} milliseconds`);

    return { question: question, answer: answer, options: options };
}


/**
 * Generates a batch of questions for a quiz.
 * 
 * @async
 * @param {number} number_of_questions - The number of questions to generate.
 * @param {string} quiz_type - The type of quiz (e.g., "multiple_choice").
 * @param {string} context - The context for generating the questions.
 * @param {number} [number_of_options=4] - The number of options for multiple-choice questions.
 * @returns {Promise<Array<Object>>} - An array of question objects, each containing the question, answer, and options.
 */
export async function BatchSWQG(number_of_questions, quiz_type, context, number_of_options = 4) {
    // Start the timer
    const start_time = performance.now();

    let question_objects = [];
    let array_of_questions = [];
    let answer = ``;
    let distractors = [];

    /* Step 1: Generate a question */
    console.debug(`LM-studio-helper.js: BatchSWQG: Step 1: Generate all the questions`);
    array_of_questions = await generateManyQuestion(number_of_questions, context);
    
    array_of_questions.forEach(question => {
        question_objects.push({ question: question, answer: ``, options: [] });
    });

    /* Step 2: Generate the answer */
    console.debug(`LM-studio-helper.js: BatchSWQG: Step 2: Generate an answer for each question`);
    for (const question of question_objects) {
        answer = await generateAnswer(context, question.question);
        question.answer = answer;
    }

    if (quiz_type == `multiple_choice`) {
        /* Step 3: Generate the distractors */
        console.debug(`LM-studio-helper.js: SWQG: Step 3: Generate the distractors`);
        
        for (const question of question_objects) {
            question.options.push(question.answer);

            distractors = await generateManyDistractors(number_of_options - 1, context, question.question, question.answer);

            distractors.forEach(distractor => {
                question.options.push(distractor);
            });
        }
    }

    // Calculate the execution time
    const end_time = performance.now();
    const execution_time = end_time - start_time;
    const minutes = Math.floor(execution_time / 60000);
    const seconds = Math.floor((execution_time % 60000) / 1000);
    const milliseconds = Math.floor((execution_time % 1000));
    
    console.debug(`LM-studio-helper.js: BatchSWQG: Execution time: ${minutes} minutes, ${seconds} seconds, ${milliseconds} milliseconds`);

    return question_objects;
}