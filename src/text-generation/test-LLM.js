console.log('Loading: test-LLM.js');

/* Imports */

import { SWQG, BatchSWQG } from "./quiz-generation.js";

const isBatch = true;

/* Variables */

// Define the number of quizzes you want to generate
const number_of_questions = 25;

// Define the structure of your quizzes
const quiz = [];
 
// Data which will write in a file.
let data = ""

let quiz_title = "GCSE AQA Computer Science - Hardware and software";
let quiz_description = "Computer systems consist of hardware and software. Hardware is the physical components of the computer, such as the central processing unit (CPU), hard disk, monitor, keyboard and mouse. Software is the programs that run on a computer.";

/* Functions */

if (isBatch) {

    // Generate a quiz using your SWQG module
    const short_answer = await BatchSWQG(number_of_questions, 'short_answer', `${quiz_title} (${quiz_description})`);
    const multiple_choice = await BatchSWQG(number_of_questions, 'multiple_choice', `${quiz_title} (${quiz_description})`);

    // Store the quiz in the quizzes array
    quiz.push(...short_answer);
    quiz.push(...multiple_choice);

    // Convert the quizzes array to a string
    let i = 1;

    data += "Short Answer Questions: \n";
    data += "\n";

    quiz.forEach(question => {
        data += "Question : " + (i++) + "\n";

        data += "Question : " + question.question + "\n";
        data += "Answer   : " + question.answer + "\n";
        data += "Options  : \n";
        question.options.forEach(option => {
            data += "    " + option + "\n";
        });

        data += "\n";

        if (i == number_of_questions + 1) {
            data += "Multiple Choice Questions: \n";
            data += "\n";
        }
    });

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