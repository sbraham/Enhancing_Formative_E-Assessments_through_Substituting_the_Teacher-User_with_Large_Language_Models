export async function checkAnswer(question, expected_answer, given_answer) {
    //console.log(`LM-studio-helper.js: checkAnswer`);

    let system_content = `Outputting YES or NO. Consider the question and expected_answer. Is the given_answer close to the expected_answer?`;
    let user_content = `question: ${question}, expected_answer: ${expected_answer}, given_answer: ${given_answer}. `;

    try {
        let valid_answers = ['YES', 'NO'];
        let response = '';

        while (!valid_answers.includes(response.trim())) {
            response = await callLMStudio(system_content, user_content, 2);
        }

        if (response.trim() === 'YES') {
            return true;
        } else if (response.trim() === 'NO') {
            return false;
        } else {
            console.error(`LM-studio-helper.js: checkAnswer: Invalid response: ${response}`);
            return false;
        }
    } catch (error) {
        console.error('LM-studio-helper.js: ERROR:', error);
        return '';
    }
}
