console.log('Loading: LM-studio-helper.js');

/* Imports */
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

    return response;
}

/**
 * Calls the LM Studio API to generate text based on system and user input.
 * 
 * @async
 * @param {string} system_content - The system input content.
 * @param {string} user_content - The user input content.
 * @returns {Promise<string>} - The generated text response.
 * @throws {Error} - If there is an error during the API call.
 */
export async function callLMStudio(system_content, user_content, max_tokens = -1) {
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
                    temperature: 0.7,
                    max_tokens: max_tokens,
                    stream: false
                }),
                success: function (response) {
                    resolve(response.choices[0].message.content);
                },
                error: function (error) {
                    throw error;
                }
            });
        });

        response = responseCleaning(response);

        return response;
    } 
            
    catch (error) {
        throw error;
    }
}