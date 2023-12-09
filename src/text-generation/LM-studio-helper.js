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
 * @param {string} user_content - The content provided by the user.
 * @returns {Promise<string|null>} - A promise that resolves with the generated response or null if there was an error.
 */
export async function callLMStudio(system_content, user_content) {
    //console.log('LM-studio-helper.js: generateResponse');

    console.log('LM-studio-helper.js: generateResponse: $.ajax: awaiting...');
    const response = await new Promise((resolve, reject) => {
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
                temperature: 0.7,
                max_tokens: -1,
                stream: false
            }),
            success: function(response) {
                console.log('LM-studio-helper.js: generateResponse: $.ajax: returned successfully');
                console.debug('LM-studio-helper.js: generateResponse:', response);
                resolve(response.choices[0].message.content);
            },
            error: function(error) {
                console.log('LM-studio-helper.js: generateResponse: $.ajax: returned eroneously');
                console.error('LM-studio-helper.js: ERROR:', error);
                reject(null);
            }
        });
    });

    return response;
}

export async function generateQuestion(context, existing_questions = []) {
    //console.log(`LM-studio-helper.js: generateQuestion`);

    const system_content = `Generate a question relating to the following context.`;

    if (existing_questions.length > 0) {
        const system_content = system_content + ` The question must be different to the following questions: ${existing_questions}`;
    }

    const user_content = `context: ${context}`;

    const response = await callLMStudio(system_content, user_content);
    console.log(response);
}

export async function generateStatement(true_or_false, context, existing_questions = []) {
    //console.log(`LM-studio-helper.js: generateStatement`);

    const system_content = `Generate a ${true_or_false} statement relating to the following topic.`;

    if (existing_questions.length > 0) {
        const system_content = system_content + ` The statement must be different to the following questions: ${existing_questions}`;
    }

    const user_content = `context: ${context}`;

    const response = await callLMStudio(system_content, user_content);
    console.log(response);
}

export async function generateAnswer(question) {
    //console.log(`LM-studio-helper.js: generateAnswer`);

    const system_content = `Generate the answer to the following question. The answer must be true.`;
    const user_content = `question: ${context}`;

    const response = await callLMStudio(system_content, user_content);
    console.log(response);
}

export async function generateDistractors(question, context) {
    //console.log(`LM-studio-helper.js: generateDistractors`);

    const system_content = `Generate a false answer to the following question, take into account the given context`;
    const user_content = `question: ${question}, context: ${context}`;

    const response = await callLMStudio(system_content, user_content);
    console.log(response);
}

/* quiz_type: multiple_choice, true_or_false, short_answer */
const quiz_context = `GCSE AQA History Norman England 1066-1100 (The Norman Rule in England)`;

export async function StepwiseQuestionGeneration(quiz_type, context, number_of_options = 4, existing_questions = []) {
    console.log(`LM-studio-helper.js: StepwiseQuestionGeneration(${quiz_type})`);

    let question, answer, options;

    if (quiz_type == 'multiple_choice') {
        /* Step 1: Generate a question */
        console.debug('LM-studio-helper.js: StepwiseQuestionGeneration: Step 1: Generate a question');
        question = await generateQuestion(context, existing_questions);

        /* Step 2: Generate the answer */
        console.debug('LM-studio-helper.js: StepwiseQuestionGeneration: Step 2: Generate the answer');
        answer = await generateAnswer(question);

        /* Step 3: Generate the distractors */
        console.debug('LM-studio-helper.js: StepwiseQuestionGeneration: Step 3: Generate the distractors');
        options.push(answer)

        for(let i = 0; i < number_of_options - 1; i++) {
            const distractor = await generateDistractors(question, context);
            options.push(distractor);
        }
    }

    if (quiz_type == 'true_or_false') {
        /* Step 1: Generate a statement */
        console.debug('LM-studio-helper.js: StepwiseQuestionGeneration: Step 1: Generate a statement');
        const true_or_false = Math.random() < 0.5 ? 'true' : 'false';

        question = await generateStatement(true_or_false, context, existing_questions);

        /* Step 2: Generate the answer */
        answer = true_or_false;

        /* Step 3: Generate the distractors */
        options = ['true', 'false'];
    }

    if (quiz_type == 'short_answer') {
        /* Step 1: Generate a question */
        console.debug('LM-studio-helper.js: StepwiseQuestionGeneration: Step 1: Generate a question');
        question = await generateQuestion(context, existing_questions);

        /* Step 2: Generate the answer */
        console.debug('LM-studio-helper.js: StepwiseQuestionGeneration: Step 2: Generate the answer');
        answer = await generateAnswer(question);

        /* Step 3: Generate the distractors */
        options = [];
    }

    return {question: question, answer: answer, options: options};
}