// import { getElement } from '../src/getElement';
import { Question } from '../quiz/Question_object.js';

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

export class Quiz {
    generateQuizTest() {
        for (let i = 0; i < this.number_of_questions; i++) {
            this.questions.push(new Question());
        }
    }

    generateQuiz() {
        console.warn(`Quiz.generateQuiz() is not implemented!`);

        this.generateQuizTest();
    }

    constructor(title, description, number_of_questions) {
        this.id = 1;

        this.title = title;
        this.description = description || null;
        this.number_of_questions = number_of_questions || 10;

        this.questions = [];
        this.running_questions = [];
        this.current_question;
        this.given_answers = [];

        this.attempt = 0;
        this.question_index = 0;
        this.correct_count = 0;
        this.wrong_count = 0;

        this.multichoice = true;
        this.endless = false;

        this.generateQuiz();
    }

    startQuiz() {
        /* Increment attempts */
        this.attempt++;

        /* Reset question values */
        this.question_index = 0;
        this.correct_count = 0;
        this.wrong_count = 0;

        /* Reset given answers */
        this.given_answers = [];

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
        this.current_question = this.questions[this.question_index];
        this.question_index++;
    }

    #displayQuestion() {
        try {
            document.getElementById(`question_index`).innerHTML = `Question ${this.question_index}`;

            document.getElementById(`quiz_index_info`).innerHTML = `${this.question_index} / ${this.questions.length}`;
            document.getElementById(`correct_count_info`).innerHTML = `${this.correct_count} / ${this.questions.length}`;
            document.getElementById(`wrong_count_info`).innerHTML = `${this.wrong_count} / ${this.questions.length}`;

            document.getElementById(`offcanvas_quiz_index_info`).innerHTML = `${this.question_index} / ${this.questions.length}`;
            document.getElementById(`offcanvas_correct_count_info`).innerHTML = `${this.correct_count} / ${this.questions.length}`;
            document.getElementById(`offcanvas_wrong_count_info`).innerHTML = `${this.wrong_count} / ${this.questions.length}`;

            document.getElementById(`question`).innerHTML = this.current_question.question;

            for (let i = 0; i < this.current_question.options.length; i++) {
                document.getElementById(`option_${i}_label`).innerHTML = this.current_question.options[i];
            }
        } catch (error) {
            console.error(`Quiz.displayQuestion() error: ${error}`);
        }
    }

    submitAnswer(given_answer) {
        let correct = false;

        if (this.multichoice) {
            if (this.current_question.options[given_answer] == this.current_question.answer) {
                correct = true;
                this.correct_count++;
            } else {
                this.wrong_count++;
            }
        }

        console.log(`typeof(given_answer):`, typeof(given_answer));

        this.given_answers.push({
            "correct": correct,
            "correct_answer": this.current_question.answer,
            "given_answer": this.current_question.options[given_answer]
        });

        console.log(`this.given_answers:`, this.given_answers);

        this.showResult();
        this.#disableQuizForm();

        setTimeout(() => {
            /* Reset quiz */
            this.#resetQuizForm()
            this.#enableQuizForm();

            /* Got to next question OR end quiz */
            if (this.question_index === this.questions.length) {
                return true;
            } else {
                this.#getNextQuestion();
                this.#displayQuestion();
                return false;
            }
        }, 1000);
    }

    showResult() {
        console.log(`Quiz.showResult() is not implemented!`);
    }

    #disableQuizForm() {
        for (let i = 0; i < this.current_question.options.length; i++) {
            document.getElementById(`option_${i}`).disabled = true;
        }
    }

    #enableQuizForm() {
        for (let i = 0; i < this.current_question.options.length; i++) {
            document.getElementById(`option_${i}`).disabled = false;
        }
    }

    #resetQuizForm() {
        for (let i = 0; i < this.current_question.options.length; i++) {
            document.getElementById(`option_${i}`).checked = false;
        }
    }

    endQuiz() {
        console.log(`Quiz.endQuiz() is not implemented!`);
    }

    getJSON() {
        return JSON.stringify(this);
    }
}