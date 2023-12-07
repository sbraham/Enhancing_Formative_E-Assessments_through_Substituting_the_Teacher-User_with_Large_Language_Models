import 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js';

console.log('Loading: LM-studio-helper.js');

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
function generateResponse(user_content) {
    console.log('LM-studio-helper.js: generateResponse');

    console.log('LM-studio-helper.js: generateResponse: $.ajax: awaiting...');
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://localhost:1234/v1/chat/completions',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                messages: [
                    { role: 'system', content: 'Always answer in rhymes.' },
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
}