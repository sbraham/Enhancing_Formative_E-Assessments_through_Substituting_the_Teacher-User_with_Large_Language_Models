console.log('Loading: LM-studio-helper.js');

import 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js';

/* Example Response:
    {
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
 * Cleans the response by removing special characters and keywords.
 * 
 * @param {string} response - The response to be cleaned.
 * @returns {string} The cleaned response.
 */
function responseCleaning(response) {
    const specialCharactersRegex = /[<>[\]\n]|SYS|INST|:|QUESTION|Question|ANSWER|Answer|Option|Distractor/g;

    // Remove special characters and keywords
    response = response.replace(specialCharactersRegex, '');

    console.debug('response:', response);

    return response;
}

/**
 * Calls the LM Studio API to generate text based on system and user content.
 * @param {string} system_content - The system content.
 * @param {string} user_content - The user content.
 * @param {number} [max_tokens=-1] - The maximum number of tokens to generate.
 * @param {number} [creativity=0.7] - The creativity level.
 * @returns {Promise<[string, string]>} - A promise that resolves to an array containing the generated text and the execution time.
 * @throws {Error} - If an error occurs during the API call.
 */
export async function callLMStudio(system_content, user_content, max_tokens = -1, creativity = 0.7) {
    //console.log('LM-studio-helper.js: callLMStudio');

    // Start the timer
    const start_time = performance.now();

    //console.log('LM-studio-helper.js: callLMStudio: $.ajax: awaiting...');
    try {
        let response = await new Promise((resolve, reject) => {
            $.ajax({
                url: 'http://localhost:1234/v1/chat/completions',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    messages: [
                        { role: 'system', content: system_content },
                        { role: 'user', content: user_content }
                    ],
                    temperature: creativity,
                    max_tokens: max_tokens,
                    stream: false
                }),
                success: function (response) {
                    //console.log('LM-studio-helper.js: callLMStudio: $.ajax: returned successfully');
                    //console.debug('LM-studio-helper.js: callLMStudio:', response.choices[0].message.content);
                    resolve(response.choices[0].message.content);
                },
                error: function (error) {
                    //console.log('LM-studio-helper.js: callLMStudio: $.ajax: returned erroneously');
                    console.error('LM-studio-helper.js: ERROR:', error);
                    reject('');
                }
            });
        });

        // Calculate the execution time
        const end_time = performance.now();
        const execution_time = end_time - start_time;
        const minutes = Math.floor(execution_time / 60000);
        const seconds = Math.floor((execution_time % 60000) / 1000);
        const milliseconds = Math.floor((execution_time % 1000));
        
        //console.debug(`Execution time: ${minutes} minutes, ${seconds} seconds, ${milliseconds} milliseconds`);

        response = responseCleaning(response);

        return response;
    } catch (error) {
        console.error('LM-studio-helper.js: ERROR:', error);
        return '';
    }
}