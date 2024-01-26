console.log('Loading: test-LLM.js');

/* Imports */
import { SWQG, BatchSWQG } from "./quiz-generation.js";

const isBatch = true;

/* Variables */
const number_of_questions = 5;
const quiz = [];
let data = ""

let quiz_context_1 = "History - Russia 1894-1945 - Difficulty: Very Hard Questions";
let quiz_context_2 = "History - Russia 1894-1945 - Difficulty: Medium Questions";
let quiz_context_3 = "History - Russia 1894-1945 - Difficulty: Very Easy Questions";

/* Functions */

if (isBatch) {

    // Generate a quiz using your SWQG module
    const quiz_1 = await BatchSWQG(number_of_questions, 'multiple_choice', `${quiz_context_1}`);
    const quiz_2 = await BatchSWQG(number_of_questions, 'multiple_choice', `${quiz_context_2}`);
    const quiz_3 = await BatchSWQG(number_of_questions, 'multiple_choice', `${quiz_context_3}`);

    // Convert the quizzes array to a string
    let i = 1;

    data += "-------------------------\n";
    data += "Quiz One: \n";
    data += "\n";

    quiz_1.forEach(question => {
        data += "Question : " + (i++) + "\n";

        data += "Question: " + question.question + "\n";
        data += "Answer: " + question.answer + "\n";

        data += "Options: \n";
        question.options.forEach(option => {
            data += "   - " + option + "\n";
        });
    });

    data += "\n";

    data += "-------------------------\n";
    data += "Quiz Two: \n";
    data += "\n";

    quiz_2.forEach(question => {
        data += "Question : " + (i++) + "\n";

        data += "Question: " + question.question + "\n";
        data += "Answer: " + question.answer + "\n";

        data += "Options: \n";
        question.options.forEach(option => {
            data += "   - " + option + "\n";
        });
    });

    data += "\n";

    data += "-------------------------\n";
    data += "Quiz Three: \n";
    data += "\n";

    quiz_3.forEach(question => {
        data += "Question : " + (i++) + "\n";

        data += "Question: " + question.question + "\n";
        data += "Answer: " + question.answer + "\n";

        data += "Options: \n";
        question.options.forEach(option => {
            data += "   - " + option + "\n";
        });
    });

    data += "\n";

    data += "-------------------------\n";

    console.log(data);

} else {

    for (let i = 0; i < number_of_quizzes; i++) {
        // Generate a quiz using your SWQG module
        const question = await SWQG('short_answer', `${quiz_title} (${quiz_description})`);

        // Store the quiz in the quizzes array
        quiz.push(question);
    }

    for (let i = 0; i < number_of_quizzes; i++) {
        // Generate a quiz using your SWQG module
        const question = await SWQG('multiple_choice', `${quiz_title} (${quiz_description})`);

        // Store the quiz in the quizzes array
        quiz.push(question);
    }



    // Convert the quizzes array to a string
    let i = 1;

    data += "Short Answer Questions: \n";
    data += "\n";

    quiz.forEach(question => {
        data += "Question : " + (i++) + "\n";

        data += "Question : " + question.question + "\n";
        data += "Answer   : " + question.answer + "\n";
        data += "Options  : " + question.options + "\n";

        data += "\n";

        if (i == number_of_questions + 1) {
            data += "Multiple Choice Questions: \n";
            data += "\n";
        }
    });

    console.log(data);
}