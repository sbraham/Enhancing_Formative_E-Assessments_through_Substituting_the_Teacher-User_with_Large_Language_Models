// import { getElement } from '../src/getElement';
import { Question } from './Question.js';

export class Quiz {
    generateQuestionsTest() {
        for (let i = 0; i < this.number_of_questions; i++) {
            this.questions.push(new Question());
        }
    }

    generateQuestions() {
        console.warn(`Quiz.generateQuestions() is not implemented!`);

        this.generateQuestionsTest();
    }

    constructor(title, description = null, number_of_questions = 10, 
        quiz_type = 'multiple_choice', endless = false, questions = []) 
    {
        this.id = null;
        this.attempt = 0;
        
        this.title = title;
        this.description = description;
        this.number_of_questions = number_of_questions;

        // quiz_type: multiple_choice, true_or_false, short_answer
        this.quiz_type = quiz_type;
        this.endless = endless;

        this.questions = questions;

        if (questions.length == 0) {
            this.generateQuestions();
        } else {
            this.number_of_questions = questions.length;
        }

        // Varaiables for running the quiz
        this._running_questions = [];
        this._current_question = null;
        this._given_answers = [];
        
        this._question_index = 0;
        this._correct_count = 0;
        this._wrong_count = 0;

        // console.log(`Quiz: Constructor:`, this);
    }

    startQuiz() {
        /* Increment attempts */
        this.attempt++;

        /* Reset question values */
        this._question_index = 0;
        this._correct_count = 0;
        this._wrong_count = 0;

        /* Reset given answers */
        this._given_answers = [];

        this.#displayQuiz();
        this.#getNextQuestion();
        this.#displayQuestion();
    }

    #displayQuiz() {
        try {
            document.getElementById(`quiz_title`).innerHTML = this.title;

            document.getElementById(`menu_quiz_title`).innerHTML = this.title;
            document.getElementById(`menu_quiz_description`).innerHTML = this.description;
        } catch (error) {
            console.error(`Quiz.displayQuiz() error: ${error}`);
        }
    }

    #getNextQuestion() {
        this._current_question = this.questions[this._question_index];
        this._question_index++;
    }

    #displayQuestion() {
        try {
            document.getElementById(`question_index`).innerHTML = `Question ${this._question_index}`;

            document.getElementById(`quiz_index_info`).innerHTML = `${this._question_index} / ${this.questions.length}`;
            document.getElementById(`correct_count_info`).innerHTML = `${this._correct_count} / ${this.questions.length}`;
            document.getElementById(`wrong_count_info`).innerHTML = `${this._wrong_count} / ${this.questions.length}`;

            document.getElementById(`offcanvas_quiz_index_info`).innerHTML = `${this._question_index} / ${this.questions.length}`;
            document.getElementById(`offcanvas_correct_count_info`).innerHTML = `${this._correct_count} / ${this.questions.length}`;
            document.getElementById(`offcanvas_wrong_count_info`).innerHTML = `${this._wrong_count} / ${this.questions.length}`;

            document.getElementById(`question`).innerHTML = this._current_question.question;

            for (let i = 0; i < this._current_question.options.length; i++) {
                document.getElementById(`option_${i}_label`).innerHTML = this._current_question.options[i];
            }
        } catch (error) {
            console.error(`Quiz.displayQuestion() error: ${error}`);
        }
    }

    submitAnswer(given_answer) {
        let correct = false;

        if (this.multichoice) {
            if (this._current_question.options[given_answer] == this._current_question.answer) {
                correct = true;
                this._correct_count++;
            } else {
                this._wrong_count++;
            }
        }

        console.log(`typeof(given_answer):`, typeof (given_answer));

        this._given_answers.push({
            "correct": correct,
            "correct_answer": this._current_question.answer,
            "given_answer": this._current_question.options[given_answer]
        });

        console.log(`this.given_answers:`, this._given_answers);

        this.showResult();
        this.#disableQuizForm();

        setTimeout(() => {
            /* Reset quiz */
            this.#resetQuizForm()
            this.#enableQuizForm();

            /* Got to next question OR end quiz */
            if (this._question_index === this.questions.length) {
                return true;
            } else {
                this.#getNextQuestion();
                this.#displayQuestion();
                return false;
            }
        }, 1000);
    }

    showResult() {
        console.warn(`Quiz.showResult() is not implemented!`);
    }

    #disableQuizForm() {
        try {
            for (let i = 0; i < this._current_question.options.length; i++) {
                document.getElementById(`option_${i}`).disabled = true;
            }
        } catch (error) {
            console.error(`Quiz.disableQuizForm() error: ${error}`);
        }
    }

    #enableQuizForm() {
        try {
            for (let i = 0; i < this._current_question.options.length; i++) {
                document.getElementById(`option_${i}`).disabled = false;
            }
        } catch (error) {
            console.error(`Quiz.enableQuizForm() error: ${error}`);
        }
    }

    #resetQuizForm() {
        for (let i = 0; i < this._current_question.options.length; i++) {
            document.getElementById(`option_${i}`).checked = false;
        }
    }

    endQuiz() {
        console.warn(`Quiz.endQuiz() is not implemented!`);
    }

    toString() {
        return JSON.stringify(this);
    }

    static fromObject(object) {
        const quiz = new Quiz(
            object.title,
            object.description,
            object.number_of_questions,
            object.quiz_type,
            object.endless,
            object.questions
        );
        quiz.id = object.id;
        quiz.attempt = object.attempt;
        return quiz;
    }
}