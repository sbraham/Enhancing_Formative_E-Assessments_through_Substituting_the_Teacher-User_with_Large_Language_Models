console.log('Loading: LM-studio-helper.js');

import 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js';

/* Example Response:
    "id": "chatcmpl-mdowwzprhxwl1kij74teg",
    "object": "chat.completion",
    "created": 1701974950,
    "model": "C:\\Users\\Samuel Braham\\.cache\\lm-studio\\models\\TheBloke\\Llama-2-7B-Chat-GGUF\\llama-2-7b-chat.Q5_K_M.gguf",
    "choices": [
        {
        "index": 0,
        "message": {
            "role": "assistant",
            "content": "  Sure, I'd be happy to always answer in rhymes! Here's my response:\nHello, world, it's great to be here,\nWith a smile on my face and a rhyme in my ear.\nI hope you're feeling cheerful and bright,\nAnd that our conversation will be a delightful sight."
        },
        "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 0,
        "completion_tokens": 74,
        "total_tokens": 74
    }
    }
*/

/**
 * Generates a response using LM-studio-helper.
 * @param {string} system_content - The content provided by the system.
 * @param {string} user_content - The content provided by the user.
 * @param {number} max_tokens - The maximum number of tokens for the response (default: -1).
 * @param {number} creativity - The creativity level for generating the response (default: 0.7).
 * @returns {Promise<string|null>} - A promise that resolves with the generated response or null if there was an error.
 */
export async function callLMStudio(system_content, user_content, max_tokens = -1, creativity = 0.7) {
    //console.log('LM-studio-helper.js: generateResponse');

    console.log('LM-studio-helper.js: generateResponse: $.ajax: awaiting...');
    try {
        let response = await new Promise((resolve, reject) => {
            $.ajax({
                url: 'http://localhost:1234/v1/chat/completions',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    messages: [
                        { role: 'system', content: system_content},
                        { role: 'user', content: user_content }
                    ],
                    temperature: creativity,
                    max_tokens: max_tokens,
                    stream: false
                }),
                success: function(response) {
                    console.log('LM-studio-helper.js: generateResponse: $.ajax: returned successfully');
                    console.debug('LM-studio-helper.js: generateResponse:', response);
                    resolve(response.choices[0].message.content);
                },
                error: function(error) {
                    console.log('LM-studio-helper.js: generateResponse: $.ajax: returned erroneously');
                    console.error('LM-studio-helper.js: ERROR:', error);
                    reject('');
                }
            });
        });

        return response;
    } catch (error) {
        console.error('LM-studio-helper.js: ERROR:', error);
        return '';
    }
}

/**
 * Generates a question based on the given context.
 * 
 * @param {string} context - The context for generating the question.
 * @param {Array<string>} existing_questions - An optional array of existing questions to avoid generating duplicates.
 * @returns {Promise<string>} - A promise that resolves to the generated question.
 */
export async function generateShortQuestion(context, existing_questions = []) {
    //console.log(`LM-studio-helper.js: generateQuestion`);

    let system_content = 'Generate a short answer question relating to the following context. ';
    system_content += 'The question must be answerable by a single word or phrase. ';
    system_content += 'Only write the question, do not state the answer. ';
    system_content += 'Generate the output in the format "Question:<question>".';

    if (existing_questions.length > 0) {
        system_content += `The question must significantly different from the following questions: `;

        for (let i = 0; i < existing_questions.length; i++) {
            system_content += `${existing_questions[i].question}`;

            if (i < existing_questions.length - 1) {
                system_content += ', ';
            } else {
                system_content += '.';
            }
        }
    }

    let user_content = `context: ${context}.`;

    try {
        let response = await callLMStudio(system_content, user_content, 100);
        return response;
    } catch (error) {
        console.error('LM-studio-helper.js: ERROR:', error);
        return '';
    }
}

/**
 * Generates a statement based on the given parameters.
 * 
 * @param {boolean} true_or_false - Indicates whether the statement should be true or false.
 * @param {string} context - The context for generating the statement.
 * @param {Array<string>} existing_questions - An optional array of existing questions to avoid generating similar statements.
 * @returns {Promise<string>} - A promise that resolves to the generated statement.
 */
export async function generateStatement(context, true_or_false, existing_questions = []) {
    //console.log(`LM-studio-helper.js: generateStatement`);

    let system_content = `Generate a short ${true_or_false} statement relating to the following topic.`;

    if (existing_questions.length > 0) {
        system_content += ` The statement must be different to the following questions: ${existing_questions}`;
    }

    let user_content = `context: ${context}`;

    try {
        let response = await callLMStudio(system_content, user_content, 100);
        return response;
    } catch (error) {
        console.error('LM-studio-helper.js: ERROR:', error);
        return '';
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

    let system_content = `Given the context, What is the answer to the following question?`;
    let user_content = `context: ${context}, question: ${question}`;

    system_content += `Write the output in the format "Answer: <answer>"`;

    try {
        let response = await callLMStudio(system_content, user_content, 100);
        return response;
    } catch (error) {
        console.error('LM-studio-helper.js: ERROR:', error);
        return '';
    }
}

/**
 * Generates distractors for a given question and context.
 * @param {string} context - The context in which the question is asked.
 * @param {string} question - The question for which distractors need to be generated.
 * @param {Array<string>} distractors - An optional array of existing distractors to avoid generating duplicates.
 * @returns {Promise<string>} - A promise that resolves to the generated distractors.
 */
export async function generateDistractors(context, question, distractors = []) {
    //console.log(`LM-studio-helper.js: generateDistractors`);

    let system_content = `Given the context, generate distractors answer to the following question multiple choice question. Distractor answer must be false.`;
    let user_content = `context: ${context}, question: ${question}`;

    if (distractors.length > 0) {
        system_content += ` The distractor must be different from the following options: ${distractors}`;
    }

    system_content += `Write the output in the format "Answer: <answer>".`;

    try {
        let response = await callLMStudio(system_content, user_content, 100);
        return response;
    } catch (error) {
        console.error('LM-studio-helper.js: ERROR:', error);
        return '';
    }
}

/* quiz_type: multiple_choice, true_or_false, short_answer */

/**
 * Generates a stepwise question for a quiz.
 * @param {string} quiz_type - The type of quiz (multiple_choice, true_or_false, short_answer).
 * @param {string} context - The context for generating the question.
 * @param {number} number_of_options - The number of options for multiple choice questions (default: 4).
 * @param {Array} existing_questions - An array of existing questions to avoid duplication (default: []).
 * @returns {Promise<Object>} - A promise that resolves to an object containing the generated question, answer, and options.
 */
export async function StepwiseQuestionGeneration(quiz_type, context, number_of_options = 4, existing_questions = []) {
    console.debug(`LM-studio-helper.js: StepwiseQuestionGeneration(${quiz_type})`);

    // Start the timer
    const start_time = performance.now();

    let question, answer = ''; 
    let options = [];

    if (quiz_type == 'multiple_choice') {
        
        console.error(`LM-studio-helper.js: StepwiseQuestionGeneration: multiple_choice is not yet implemented`);
        return '';

        /* Step 1: Generate a question */
        console.debug('LM-studio-helper.js: StepwiseQuestionGeneration: Step 1: Generate a question');
        question = await generateShortQuestion(context, existing_questions);

        /* Step 2: Generate the answer */
        console.debug('LM-studio-helper.js: StepwiseQuestionGeneration: Step 2: Generate the answer');
        answer = await generateAnswer(question);

        /* Step 3: Generate the distractors */
        console.debug('LM-studio-helper.js: StepwiseQuestionGeneration: Step 3: Generate the distractors');
        options.push(answer)

        for(let i = 0; i < number_of_options - 1; i++) {
            let distractor = await generateDistractors(question, context, options);
            options.push(distractor);
        }
    }

    if (quiz_type == 'true_or_false') {

        console.error(`LM-studio-helper.js: StepwiseQuestionGeneration: true_or_false is not yet implemented`);
        return '';

        /* Step 1: Generate a statement */
        console.debug('LM-studio-helper.js: StepwiseQuestionGeneration: Step 1: Generate a statement');
        let true_or_false = Math.random() < 0.5 ? 'true' : 'false';

        question = await generateStatement(true_or_false, context, existing_questions);

        /* Step 2: Generate the answer */
        answer = true_or_false;

        /* Step 3: Generate the distractors */
        options = ['true', 'false'];
    }

    if (quiz_type == 'short_answer') {
        /* Step 1: Generate a question */
        console.debug('LM-studio-helper.js: StepwiseQuestionGeneration: Step 1: Generate a question');
        question = await generateShortQuestion(context, existing_questions);

        /* Step 2: Generate the answer */
        console.debug('LM-studio-helper.js: StepwiseQuestionGeneration: Step 2: Generate the answer');
        answer = await generateAnswer(question);

        /* Step 3: Generate the distractors */
        options = [];
    }

    // Calculate the execution time
    const end_time = performance.now();
    const execution_time = end_time - start_time;
    const minutes = Math.floor(execution_time / 60000);
    const seconds = Math.floor((execution_time % 60000) / 1000);
    const milliseconds = Math.floor((execution_time % 1000));
    console.log(`LM-studio-helper.js: StepwiseQuestionGeneration: Execution time: ${minutes} minutes, ${seconds} seconds, ${milliseconds} milliseconds`);

    return {question: question, answer: answer, options: options};
}
