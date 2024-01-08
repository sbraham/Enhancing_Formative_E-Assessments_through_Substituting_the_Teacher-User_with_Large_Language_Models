// import { getElement } from '../src/getElement';
import { SWQG } from '../text-generation/quiz-generation.js';

export class Quiz {
    /**
     * Represents a Quiz object.
     * @constructor
     * @param {string} title - The title of the quiz.
     * @param {string} [description=''] - The description of the quiz.
     * @param {number} number_of_questions - The number of questions in the quiz.
     * @param {string} quiz_type - The type of the quiz (multiple_choice, true_or_false, short_answer).
     * @param {number|null} [id=null] - The ID of the quiz.
     * @param {boolean} [endless=false] - Indicates if the quiz is endless.
     * @param {Array} [questions=[]] - The array of questions in the quiz.
     * @param {number} [attempts=0] - The number of attempts made on the quiz.
     */
    constructor(title, description = '', number_of_questions, quiz_type, id = null, endless = false, questions = [], attempts = 0) {
        console.log(`Quiz: Constructor`);

        this.id = id;
        this.attempts = attempts;
        
        this.title = title;
        this.description = description;
        this.number_of_questions = number_of_questions;

        // quiz_type: multiple_choice, true_or_false, short_answer
        this.quiz_type = quiz_type;
        this.endless = endless;

        this.questions = questions;

        // Varaiables for running the quiz
        this._running_questions = [];
        this._current_question = null;
        this._given_answers = [];
        
        this._question_index = 0;
        this._correct_count = 0;
        this._wrong_count = 0;

        this.isRunning = false;
    }

    /** Generates questions for the quiz. */
    async generateQuestions() {
        /**
         * Question = {
         *     question: 'What is the capital of the United States?', 
         *     answer: 'Washington D.C.', 
         *     options: [answer, 'New York', 'Los Angeles', 'Chicago']
         * };
        */

        console.log(`Quiz: generateQuestions`);

        if (this.questions.length > 0) {
            console.warn(`Quiz: generateQuestions: questions already generated`);
        } else {
            const quiz_context = `${this.title} (${this.description}) `;

            for (let i = 0; i < this.number_of_questions; i++) {
                //console.log(`Quiz: generateQuestions: Question ${i}: generating...`);
                let question = await SWQG(this.quiz_type, quiz_context, 4, this.questions);
                // console.log(`Quiz: generateQuestions: Question ${i}: generated`);
                // console.log(`question:`, question.question);
                // console.log(`answer:`, question.answer);
                // console.log(`options:`, question.options);

                this.questions.push(question);
            }
        }
    }

    /** Starts the quiz. */

    startQuiz() {
        console.log(`Quiz:startQuiz()`);

        this.isRunning = true;

        /* Increment attempts */
        this.attempts++;

        /* Reset question values */
        this._question_index = 0;
        this._correct_count = 0;
        this._wrong_count = 0;

        /* Reset given answers */
        this._given_answers = [];

        this.displayQuiz();
        this.createAnswerElements()
        this.getNextQuestion();
        this.displayQuestion();
    }

    /** Set initial quiz UI */

    displayQuiz() {
        console.log(`Quiz:displayQuiz()`);

        try {
            document.getElementById(`quiz_title`).innerHTML = this.title;

            document.getElementById(`menu_quiz_title`).innerHTML = this.title;
            document.getElementById(`menu_quiz_description`).innerHTML = this.description;
        } catch (error) {
            console.error(`Quiz.displayQuiz() error: ${error}`);
        }
    }

    createAnswerElements() {
        console.log(`Quiz:createAnswerElements()`);

        if(this.quiz_type == 'multiple_choice') {
            try {
                for (let i = 0; i < 4; i++) {
                    const container = document.createElement('div');
                    container.classList.add('form-check');

                    container.innerHTML = `
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="multichoice" id="option_${i}" value="${i}" required>
                            <label class="form-check-label w-100" id="option_${i}_label" for="option_${i}">
                                <p class="placeholder-glow">
                                    <span class="placeholder col-7"></span>
                                </p>
                            </label>
                        </div>
                    `;

                    document.getElementById('answer_container').appendChild(container);
                }
            } catch (error) {
                console.error(`Quiz.createAnswerElements() error: ${error}`);
            }
        } else if (this.quiz_type == 'true_or_false') {
            console.warn(`Quiz.createAnswerElements(): true_or_false is not implemented!`);
        } else if (this.quiz_type == 'short_answer') {
            try {
                const container = document.createElement('div');
                container.classList.add('form-group', 'margin-top');

                container.innerHTML = `
                    <label for="short_answer" id="answer">Short Answer:</label>
                    <input type="text" class="form-control" name="short_answer" id="short_answer" required>
                `;

                document.getElementById('answer_container').appendChild(container);
            } catch (error) {
                console.error(`Quiz.createAnswerElements() error: ${error}`);
            }
        }
    }

    /** Set quiz UI throughout */

    displayQuestion() {
        console.log(`Quiz:displayQuestion()`);
        
        try {
            /* Set question number and question text */
            document.getElementById(`question_index`).innerHTML = `Question ${this._question_index}`;
            document.getElementById(`question`).innerHTML = this._current_question.question;
            
            if (this.quiz_type == 'multiple_choice') {
                for (let i = 0; i < this._current_question.options.length; i++) {
                    document.getElementById(`option_${i}_label`).innerHTML = this._current_question.options[i];
                }
            } else if (this.quiz_type == 'true_or_false') {
                console.warn(`Quiz.displayQuestion(): true_or_false is not implemented!`);
            } else if (this.quiz_type == 'short_answer') {
                document.getElementById(`answer`).innerHTML = 'Short Answer: ';
            }

            /* Set give answer */
            if (this._given_answers[this._question_index-1]) {
                if (this.quiz_type == 'multiple_choice') {
                    document.getElementById(`option_${this._given_answers[this._question_index-1].given_index}`).checked = true;
                } else if (this.quiz_type == 'true_or_false') {
                    console.warn(`Quiz.selectPreviousAnswer(): true_or_false is not implemented!`);
                } else if (this.quiz_type == 'short_answer') {
                    document.getElementById(`short_answer`).value = this._given_answers[this._question_index-1].given_answer;
                }
            }
        } catch (error) {
            console.error(`Quiz.displayQuestion() error: ${error}`);
        }
    }

    /** Set loading wheel */

    addWheel() {
        const previous_button = document.getElementById('previous_button');
        const loading_wheel = document.createElement('div');
        loading_wheel.classList.add('spinner-border', 'text-primary', 'mx-2', 'spinner-lg');
        loading_wheel.setAttribute('id', 'loading_wheel');
        loading_wheel.setAttribute('role', 'status');
        loading_wheel.innerHTML = '<span class="visually-hidden">Loading...</span>';
        loading_wheel.style.alignSelf = 'center';

        previous_button.insertAdjacentElement('beforebegin', loading_wheel);
    }

    removeWheel() {
        const loading_wheel = document.getElementById('loading_wheel');
        if (loading_wheel) {
            loading_wheel.remove();
        }
    }

    /** Question index controls */

    getNextQuestion() {
        console.log(`Quiz:getNextQuestion()`);

        this._question_index++;
        this._current_question = this.questions[this._question_index-1];
    }

    getPreviousQuestion() {
        console.log(`Quiz:getPreviousQuestion()`);

        this.resetQuizForm();

        if (this._question_index === 1) {
            throw new Error(`Quiz.getPreviousQuestion(): Cannot go back any further!`);
        }

        this._question_index--;
        this._current_question = this.questions[this._question_index-1];

        this.displayQuestion();
    }

    /** Submit answer */

    async submitAnswer(given_answer) {
        console.log(`Quiz:submitAnswer(${given_answer})`);

        document.getElementById('previous_button').disabled = false;

        this.addWheel();
        this.disableQuizForm();

        let isCorrect = false;

        if (this.quiz_type == 'multiple_choice') {
            if (this._current_question.options[given_answer] == this._current_question.answer) {
                isCorrect = true;
                this._correct_count++;
            } else {
                this._wrong_count++;
            }
        } if (this.quiz_type == 'true_or_false') {
            console.warn(`Quiz.submitAnswer(): true_or_false is not implemented!`);
        } else if (this.quiz_type == 'short_answer') {
            if (this._current_question.answer == given_answer) {
                isCorrect = true;
                this._correct_count++;
            } else {
                isCorrect = await checkAnswer(this._current_question.question, this._current_question.answer, given_answer);
                
                if (isCorrect) {
                    this._correct_count++;
                } else {
                    this._wrong_count++;
                }
            }
        }

        console.log(`typeof(given_answer):`, typeof (given_answer));

        /* Answer Objects: 
            {
                "correct": false,
                "question": "What is the capital of the United States?
                "correct_answer": "Washington D.C.",
                "given_answer": "New York"
                "given_index": 3
            }
        */

        const answer_object = {
            "correct": isCorrect,
            "correct_answer": this._current_question.answer,
            "given_answer": this._current_question.options[given_answer],
            "given_index": given_answer
        }

        if (this._given_answers.length < this._question_index) {
            this._given_answers.push(answer_object);
        } else {
            this._given_answers[this._question_index - 1] = answer_object;
        }

        console.log(`this.given_answers:`, this._given_answers);

        /* The showResult function would display the answers to the user as they go through the quiz */
        /* Do to the existence of the previous button, this function is not needed */
        
        // this.showResult(given_answer, isCorrect);

        setTimeout(() => {
            /* Reset quiz */
            this.enableQuizForm();
            this.removeWheel();

            /* Check if quiz has ended */
            if (this._question_index === this.questions.length) {
                /* If yes, check if the player wants the quiz to end */
                const result = confirm("Quiz completed. Are you happy with all your answers?");
                if (result) {
                    // End quiz
                    this.endQuiz();
                } else {
                    // Wait for next input
                }
            } else {
                /* If no, get next question */
                this.resetQuizForm();
                this.getNextQuestion();
                this.displayQuestion();
                return false;
            }
        }, 500);
    }

    showResult(given_answer, correct) {
        console.log(`Quiz:showResult(${correct})`);

        if (this.quiz_type == 'multiple_choice') {
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
        } else if (this.quiz_type == 'true_or_false') {
            console.warn(`Quiz.showResult(): true_or_false is not implemented!`);
        } else if (this.quiz_type == 'short_answer') {
            if (correct) {
                document.getElementById(`answer`).innerHTML = `<span class="text-success">Short Answer: ✅</span>`;
            } else {
                document.getElementById(`answer`).innerHTML = `<span class="text-danger">Short Answer: ❌</span>`;
            }
        }
    }

    /* Quiz form controls */

    disableQuizForm() {
        console.log(`Quiz:disableQuizForm()`);

        try {
            if (this.quiz_type == 'multiple_choice') {
                for (let i = 0; i < this._current_question.options.length; i++) {
                    document.getElementById(`option_${i}`).disabled = true;
                }
            } else if (this.quiz_type == 'true_or_false') {
                console.warn(`Quiz.disableQuizForm(): true_or_false is not implemented!`);
            } else if (this.quiz_type == 'short_answer') {
                document.getElementById(`short_answer`).disabled = true;
            }
        } catch (error) {
            console.error(`Quiz.disableQuizForm() error: ${error}`);
        }
    }

    enableQuizForm() {
        console.log(`Quiz:enableQuizForm()`);

        try {
            if (this.quiz_type == 'multiple_choice') {
                for (let i = 0; i < this._current_question.options.length; i++) {
                    document.getElementById(`option_${i}`).disabled = false;
                }
            } else if (this.quiz_type == 'true_or_false') {
                console.warn(`Quiz.enableQuizForm(): true_or_false is not implemented!`);
            } else if (this.quiz_type == 'short_answer') {
                document.getElementById(`short_answer`).disabled = false;
            }
        } catch (error) {
            console.error(`Quiz.enableQuizForm() error: ${error}`);
        }
    }

    resetQuizForm() {
        console.log(`Quiz:resetQuizForm()`);

        try {
            if (this.quiz_type === 'multiple_choice') {
                for (let i = 0; i < this._current_question.options.length; i++) {
                    document.getElementById(`option_${i}`).checked = false;
                }
            } else if (this.quiz_type === 'true_or_false') {
                console.warn(`Quiz.resetQuizForm(): true_or_false is not implemented!`);
            } else if (this.quiz_type === 'short_answer') {
                document.getElementById(`short_answer`).value = '';
            }
        } catch (error) {
            console.error(`Quiz.resetQuizForm() error: ${error}`);
        }
    }
    
    /** End quiz */

    endQuiz() {
        console.log(`Quiz:endQuiz()`);

        const given_answers = JSON.stringify(this._given_answers);

        console.log(`Final answers are:`, given_answers);

        this.isRunning = false;

        /* Move to feedback page */
        const url = `../feedback/feedback.html?given_answers=${given_answers}`;

        window.location.href = url;
    }

    /** For saving quiz */

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