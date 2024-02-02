console.log('Loading: test-LLM.js');

/* Imports */
import { BatchSWQG } from "../text-generation/quiz-generation/quiz-generation.js";

const is_batch = true;

/* Variables */
const number_of_questions = 20;
const quiz = [];
let data = ""

let quiz_context = "History - Russia 1894-1945";

/* Functions */

if (is_batch) {

    // Generate a quiz using your SWQG module
    const quiz = await BatchSWQG(number_of_questions, 'multiple_choice', `${quiz_context}`);

    // Convert the quizzes array to a string
    let i = 1;

    data += "-------------------------\n";
    data += "Quiz: \n";
    data += "\n";

    quiz.forEach(question => {
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