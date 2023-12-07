/**
 * Represents a question in a quiz.
 */
export class Question {
    generateQuesionTest() {
        this.question = `What is the capital of the United States? Test:[${Math.random().toString().slice(2, 8)}]`;
        this.answer = `Washington D.C.`;

        if (this.question_type == 'multiple_choice') {
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
     * @param {string} question - The text of the question.
     * @param {string} answer - The correct answer for the question.
     * @param {string} question_type - The type of question.
     * @param {string[]} options - The possible options for the question.
     */
    constructor(question = '', answer = '', question_type = 'multiple_choice', options = []) {
        /** The text of the question.
         * @type {string} */
        this.question = question;

        /** The correct answer for the question.
         * @type {string} */
        this.answer = answer;

        /** The type of question.
         * @type {string} */
        this.question_type = question_type;

        this.options = options;

        if (this.question.length == 0 || this.answer.length == 0) {
            this.generateQuesion();
        }
    }

    shuffleOptions() {
        console.warn(`Question.shuffleOptions() is not implemented!`);
    }

    toString() {
        return JSON.stringify(this);
    }

    static fromObject(object) {
        const question = new Question(
            object.question,
            object.answer,
            object.question_type,
            object.options
        );
        return question;
    }
}