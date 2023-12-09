// import { getElement } from '../src/getElement';
import { StepwiseQuestionGeneration } from '../text-generation/LM-studio-helper.js';

export class Quiz {
    async generateQuestions(generate = true) {
        /**
         * Question = {
         *     question: 'What is the capital of the United States?', 
         *     answer: 'Washington D.C.', 
         *     options: [answer, 'New York', 'Los Angeles', 'Chicago']
         * };
        */

        // this.questions = [];

        console.log(`Quiz: generateQuestions`);

        if (!generate) {
            console.warn(`Quiz: generateQuestions: generate is false, skipping...`);

            const placeholder_question = {
                question: 'What is the capital of the United States?', 
                answer: 'Washington D.C.', 
                options: [answer, 'New York', 'Los Angeles', 'Chicago']
            };

            for (let i = 0; i < this.number_of_questions; i++) {
                this.questions.push(placeholder_question);
            }
        }

        const quiz_context = `${this.title} (${this.description})`;

        for (let i = 0; i < this.number_of_questions; i++) {
            console.debug(`Quiz: generateQuestions: Question ${i}: generating...`);
            this.questions.push(await StepwiseQuestionGeneration(this.quiz_type, quiz_context, 4, this.questions));
            console.debug(`Quiz: generateQuestions: Question ${i}: `, this.questions[i]);
        }
    }

    constructor(title, description = null, number_of_questions, quiz_type, 
        id = null, endless = false, questions = [], attempts = 0) 
    {
        this.id = id;
        this.attempts = attempts;
        
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

        // console.log(`Quiz:Constructor:`, this);
    }

    startQuiz() {
        console.log(`Quiz:startQuiz()`);

        /* Increment attempts */
        this.attempts++;

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
        console.log(`Quiz:displayQuiz()`);

        try {
            document.getElementById(`quiz_title`).innerHTML = this.title;

            document.getElementById(`menu_quiz_title`).innerHTML = this.title;
            document.getElementById(`menu_quiz_description`).innerHTML = this.description;
        } catch (error) {
            console.error(`Quiz.displayQuiz() error: ${error}`);
        }
    }

    #getNextQuestion() {
        console.log(`Quiz:getNextQuestion()`);

        this._current_question = this.questions[this._question_index];
        this._question_index++;
    }

    #displayQuestion() {
        console.log(`Quiz:displayQuestion()`);

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

    #addWheel() {
        const submitButton = document.querySelector('#submit_button');
        const loadingWheel = document.createElement('div');
        loadingWheel.classList.add('spinner-border', 'spinner-border-sm', 'text-primary', 'mx-2');
        loadingWheel.setAttribute('id', 'loading_wheel');
        loadingWheel.setAttribute('role', 'status');
        loadingWheel.innerHTML = '<span class="visually-hidden">Loading...</span>';

        submitButton.insertAdjacentElement('beforebegin', loadingWheel);
    }

    #removeWheel() {
        const loadingWheel = document.querySelector('#loading_wheel');
        if (loadingWheel) {
            loadingWheel.remove();
        }
    }

    submitAnswer(given_answer) {
        console.log(`Quiz:submitAnswer(${given_answer})`);

        this.#addWheel();

        let correct = false;

        if (this._current_question.question_type == 'multiple_choice') {
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

        this.showResult(given_answer, correct);
        this.#disableQuizForm();

        setTimeout(() => {
            /* Reset quiz */
            this.#resetQuizForm();
            this.#enableQuizForm();
            this.#removeWheel();

            /* Got to next question OR end quiz */
            if (this._question_index === this.questions.length) {
                return true;
            } else {
                this.#getNextQuestion();
                this.#displayQuestion();
                return false;
            }
        }, 1500);
    }

    showResult(given_answer, correct) {
        console.log(`Quiz:showResult(${correct})`);

        if (correct) {
            /* If the answer is correct */
            for (let i = 0; i < this._current_question.options.length; i++) {
                if (this._current_question.options[i] == this._current_question.answer) {
                    /* Highlight it with green */
                    document.getElementById(`option_${i}_label`).innerHTML = `<span class="text-success">${this._current_question.options[i]}</span>`;
                }
            }
        } else {  
            /* If the answer is wrong */      
            for (let i = 0; i < this._current_question.options.length; i++) {
                if (this._current_question.options[i] == this._current_question.answer) {
                    /* Highlight the correct answer with green */
                    document.getElementById(`option_${i}_label`).innerHTML = `<span class="text-success">${this._current_question.options[i]}</span>`;
                }
                if (this._current_question.options[i] == this._current_question.options[given_answer]) {
                    /* Highlight the given answer with red */
                    document.getElementById(`option_${i}_label`).innerHTML = `<span class="text-danger">${this._current_question.options[i]}</span>`;
                }
            }
        }
    }

    #disableQuizForm() {
        console.log(`Quiz:disableQuizForm()`);

        try {
            for (let i = 0; i < this._current_question.options.length; i++) {
                document.getElementById(`option_${i}`).disabled = true;
            }
        } catch (error) {
            console.error(`Quiz.disableQuizForm() error: ${error}`);
        }
    }

    #enableQuizForm() {
        console.log(`Quiz:enableQuizForm()`);

        try {
            for (let i = 0; i < this._current_question.options.length; i++) {
                document.getElementById(`option_${i}`).disabled = false;
            }
        } catch (error) {
            console.error(`Quiz.enableQuizForm() error: ${error}`);
        }
    }

    #resetQuizForm() {
        console.log(`Quiz:resetQuizForm()`);

        for (let i = 0; i < this._current_question.options.length; i++) {
            document.getElementById(`option_${i}`).checked = false;
        }
    }

    endQuiz() {
        console.log(`Quiz:endQuiz()`);

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
            object.id,
            object.endless,
            object.questions,
            object.attempts
        );
        return quiz;
    }
}