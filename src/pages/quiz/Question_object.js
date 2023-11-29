/**
 * Represents a question in a quiz.
 */
export class Question {
    generateQuesionTest() {
        this.question = `What is the capital of the United States? Test:[${Math.random().toString().slice(2, 8)}]`;
        this.answer = `Washington D.C.`;

        if (this.multichoice) {
            this.options = [this.answer, `New York`, `Los Angeles`, `Chicago`];
        }
    }

    generateQuesion() {
        console.warn(`Question.generateQuesion() is not implemented!`);

        this.generateQuesionTest();
    }    

    /**
     * Represents a question object.
     * @constructor
     * @param {boolean} multichoice - Indicates whether the question is a multiple choice question.
     */
    constructor(multichoice = true) {
        /** The unique identifier for the question.
         * @type {number} */
        this.id = 1;

        /** Indicates whether the question is a multiple choice question.
         * @type {boolean} */
        this.multichoice = multichoice;

        /** The text of the question.
         * @type {string} */
        this.question;

        /** The correct answer for the question.
         * @type {string} */
        this.answer;

        if (multichoice) {
            /** The possible options for the question.
             * @type {string[]} */
            this.options;
        }

        this.generateQuesion();
    }

    shuffleOptions() {
        console.warn(`Question.shuffleOptions() is not implemented!`);
    }
}