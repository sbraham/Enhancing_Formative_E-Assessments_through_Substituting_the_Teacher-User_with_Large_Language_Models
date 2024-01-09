console.log('Loading: test-LLM.js');

/* Imports */

import { SWQG } from "./quiz-generation.js";

/* Variables */

// Define the number of quizzes you want to generate
const number_of_quizzes = 1;

// Define the structure of your quizzes
const quiz = [];
 
// Data which will write in a file.
let data = ""

let quiz_title = "GCSE AQA Computer Science - Hardware and software";
let quiz_description = "Computer systems consist of hardware and software. Hardware is the physical components of the computer, such as the central processing unit (CPU), hard disk, monitor, keyboard and mouse. Software is the programs that run on a computer.";

/* Functions */

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

quiz.forEach(question => {
    data += "Question : " + (i++) + "\n";

    data += "Question : " + question.question + "\n";
    data += "Answer   : " + question.answer + "\n";
    data += "Options  : " + question.options + "\n";

    data += "\n";
});

console.log(data);