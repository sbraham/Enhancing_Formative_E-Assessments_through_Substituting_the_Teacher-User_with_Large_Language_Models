import { SWQG } from "./quiz-generation.js";

// Define the number of quizzes you want to generate
const number_of_quizzes = 5;

// Define the structure of your quizzes
const quizzes = [];

for (let i = 0; i < number_of_quizzes; i++) {
    // Generate a quiz using your SWQG module
    const quiz = await SWQG('short_answer', 'GCSE Biology (Cell Biology)', 4, []);

    // Store the quiz in the quizzes array
    quizzes.push(quiz);
}

for (let i = 0; i < number_of_quizzes; i++) {
    // Generate a quiz using your SWQG module
    const quiz = await SWQG('multiple_choice', 'GCSE Biology (Cell Biology)', 4, []);

    // Store the quiz in the quizzes array
    quizzes.push(quiz);
}

// Convert the quizzes array to a string
const quizzesString = JSON.stringify(quizzes);

console.log(quizzesString);

export const exportable = null;

