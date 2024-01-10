import { callLMStudio } from './LM-studio-helper.js';

const QUIZ_GENERATION_CREATIVITY = 0.5;
const QUESTION_MAX_TOKENS = 1000; 
const ANSWER_MAX_TOKENS = 50;

/**
 * Generates a question based on the given context.
 * 
 * @param {string} context - The context for generating the question.
 * @param {Array<string>} existing_questions - An optional array of existing questions to avoid generating duplicates.
 * @returns {Promise<string>} - A promise that resolves to the generated question.
 */
export async function generateQuestion(context, existing_questions = []) {
    //console.log(`LM-studio-helper.js: generateQuestion`);
 
    let system_content = `Generate one short answer question relating to the following context.`;
    system_content += `\nThe question must be answerable by a single word or phrase.`;
    system_content += `\nOnly write the question, do not state the answer or any examples.`;

    let user_content = `Context: ${context}.`;

    if (existing_questions.length > 0) {
        system_content += '\nThe question must be different to the following questions: ';

        for (let i = 0; i < existing_questions.length; i++) {
            system_content += `"${i}: ${existing_questions[i].question}"`;

            if (i < existing_questions.length - 1) {
                system_content += `, `;
            } else {
                system_content += `.`;
            }
        }
    }

    try {
        let response = await callLMStudio(system_content, user_content, QUESTION_MAX_TOKENS, QUIZ_GENERATION_CREATIVITY);
        return response;
    } catch (error) {
        console.error(`LM-studio-helper.js: ERROR:`, error);
        return `ERROR`;
    }
}


/**
 * Generates multiple short answer questions based on a given context.
 * 
 * @param {number} number_of_questions - The number of questions to generate.
 * @param {string} [context=""] - The context for generating the questions.
 * @returns {Promise<string[]>} - An array of generated questions.
 */
export async function generateManyQuestion(number_of_questions, context = ``) {
    //console.log(`LM-studio-helper.js: generateQuestion`);
 
    let system_content = `Generate ${number_of_questions} different short answer question relating to the following context.`;
    system_content += `\nThe question must be answerable by a single word or phrase.`;
    system_content += `\nOnly write the question, do not state the answer or any examples.`;
    system_content += `\nDo not number the questions.`;
    system_content += `\n`;
    system_content += `\nEach question should have the following format:`;
    system_content += `\nQuestion: <question> |`;

    let user_content = `Context: ${context}.`;

    try {
        let questions = [];

        while (questions.length !== number_of_questions) {

            let response = await callLMStudio(system_content, user_content, QUESTION_MAX_TOKENS, QUIZ_GENERATION_CREATIVITY);
            
            questions = response.split('|')

            questions = questions.filter(question => question !== "");
        }
        
        return questions;
    } catch (error) {
        console.error(`LM-studio-helper.js: ERROR:`, error);
        return `ERROR`;
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
    system_content += `\nDo not state in any way that the answer is true, or that it is the answer.`;
    system_content += `\nOnly write the answer, do not write any examples or other possible answers.`;

    let user_content = `Context: ${context}.`;
    user_content += `\nQuestion: ${question}.`;

    try {
        let response = await callLMStudio(system_content, user_content, ANSWER_MAX_TOKENS, QUIZ_GENERATION_CREATIVITY);
        return response;
    } catch (error) {
        console.error(`LM-studio-helper.js: ERROR:`, error);
        return `ERROR`;
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

    let system_content = `Given the context, what is a FALSE distractor answer to the following question?`;
    system_content += `\nDo not state in any way that the answer is false, or that it is a distractor.`;

    let user_content = `Context: ${context}.`;
    user_content += `\nQuestion: ${question}.`;

    if (options.length > 0) {
        system_content += `\nThe distractor must be different from the following options: ${options}.`;
    }

    try {
        let response = await callLMStudio(system_content, user_content, ANSWER_MAX_TOKENS, QUIZ_GENERATION_CREATIVITY);
        return response;
    } catch (error) {
        console.error(`LM-studio-helper.js: ERROR:`, error);
        return `ERROR`;
    }
}

/**
 * Generates multiple distractor answers for a given question and context.
 * 
 * @param {number} number_of_distractors - The number of false distractor answers to generate.
 * @param {string} context - The context for the question.
 * @param {string} question - The question for which distractors need to be generated.
 * @returns {Promise<string[]|string>} - An array of distractor answers or an error message if an error occurs.
 */
export async function generateManyDistractors(number_of_distractors, context, question) {
    //console.log(`LM-studio-helper.js: generateDistractors`);

    let system_content = `Given the context, give ${number_of_distractors} FALSE distractor answers to the following question?`;
    system_content += `\nDo not state in any way that the answer is false, or that it is a distractor.`;
    system_content += `\nDo not number the distractors.`;
    system_content += `\n`;
    system_content += `\nEach distractor answer should have the following format:`;
    system_content += `\nDistractor: <distractor> |`;

    let user_content = `Context: ${context}.`;
    user_content += `\nQuestion: ${question}.`;

    try {
        let distractors = [];

        while (distractors.length !== number_of_distractors) {

            let response = await callLMStudio(system_content, user_content, ANSWER_MAX_TOKENS, QUIZ_GENERATION_CREATIVITY);
            
            distractors = response.split('|')

            distractors = distractors.filter(distractor => distractor !== "");
        }
        
        return distractors;
    } catch (error) {
        console.error(`LM-studio-helper.js: ERROR:`, error);
        return `ERROR`;
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
    
    console.log(`LM-studio-helper.js: SWQG: Execution time: ${minutes} minutes, ${seconds} seconds, ${milliseconds} milliseconds`);

    return { question: question, answer: answer, options: options };
}


/**
 * Generates a batch of questions for a quiz.
 * @param {number} number_of_questions - The number of questions to generate.
 * @param {string} quiz_type - The type of quiz (e.g., "multiple_choice").
 * @param {string} context - The context for generating the questions.
 * @param {number} [number_of_options=4] - The number of options for multiple-choice questions.
 * @returns {Promise<Array<Object>>} - An array of question objects, each containing the question, answer, and options.
 */
export async function BatchSWQG(number_of_questions, quiz_type, context, number_of_options = 4) {
    //console.debug(`LM-studio-helper.js: BatchSWQG()`);

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

    console.log(question_objects);

    /* Step 2: Generate the answer */
    console.debug(`LM-studio-helper.js: BatchSWQG: Step 2: Generate an answer for each question`);
    for (const question of question_objects) {
        answer = await generateAnswer(context, question.question);
        question.answer = answer;
    }

    console.log(question_objects);

    if (quiz_type == `multiple_choice`) {
        /* Step 3: Generate the distractors */
        console.debug(`LM-studio-helper.js: SWQG: Step 3: Generate the distractors`);
        
        for (const question of question_objects) {
            question.options.push(question.answer);

            distractors = await generateManyDistractors(number_of_options - 1, context, question.question);

            distractors.forEach(distractor => {
                question.options.push(distractor);
            });
        }

        console.log(question_objects);
    }

    // Calculate the execution time
    const end_time = performance.now();
    const execution_time = end_time - start_time;
    const minutes = Math.floor(execution_time / 60000);
    const seconds = Math.floor((execution_time % 60000) / 1000);
    const milliseconds = Math.floor((execution_time % 1000));
    
    console.log(`LM-studio-helper.js: BatchSWQG: Execution time: ${minutes} minutes, ${seconds} seconds, ${milliseconds} milliseconds`);

    return question_objects;
}