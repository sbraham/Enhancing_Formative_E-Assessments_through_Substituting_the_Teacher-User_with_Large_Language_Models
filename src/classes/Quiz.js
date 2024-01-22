import { BatchSWQG } from '../text-generation/quiz-generation.js';
import { checkAnswer } from '../text-generation/question-verification.js';
import { updateQuiz } from '../firebase/database-helper.js';

/**
 * Represents a Quiz object.
 * 
 * @constructor
 * @param {string} title - The title of the quiz.
 * @param {string} [description=''] - The description of the quiz.
 * @param {number} number_of_questions - The number of questions in the quiz (1-50).
 * @param {string} quiz_type - The type of the quiz (multiple_choice, short_answer).
 * @param {number|null} [id=null] - The ID of the quiz (null if not in the database).
 * @param {Array} [questions=[]] - The array of questions in the quiz.
 * @param {Array} [attempts=[]] - The array of attempts of the quiz.
 */
export class Quiz {
    constructor(title, description = '', number_of_questions, quiz_type, id = null, questions = [], attempts = []) {
        /* Core variables */

        this.id = id; // id is null if the quiz is not in the database
        
        this.title = title;
        this.description = description;
        this.number_of_questions = number_of_questions; // number_of_questions: 1-50

        this.quiz_type = quiz_type; // quiz_type: multiple_choice, short_answer

        this.questions = questions; // questions: array of question objects

        this.attempts = attempts; // attempts: array of attempt objects

        /* Varaiables for running the quiz */

        this._question_index = 0;

        this._running_questions = [];
        this._current_question = null;
        
        this._given_answers = [];

        this._quiz_start_time = null;
    }

    /**
     * Generates the questions for the quiz.
     * 
     * @async
     * @returns {Promise<void>} A promise that resolves when the questions are generated.
     */
    async generateQuestions() {
        console.log(`Quiz: generateQuestions`);

        /* Example question object */
        const example_question_object = {
            question: 'What is the capital of the United States?',
            answer: 'Washington D.C.',
            options: ['Washington D.C.', 'New York', 'Los Angeles', 'Chicago']
        };

        /* If the questions have already been generated */
        if (this.questions.length > 0) {
            /* Log and do nothing */
            console.warn(`Quiz: generateQuestions: questions already generated`);
            return;
        } 

        /* If the questions have not been generated */        
        
        /* Generate the questions */
        const quiz_context = `${this.title} (${this.description})`;
        this.questions = await BatchSWQG(this.number_of_questions, this.quiz_type, quiz_context);
    }

    /** Start the quiz. */

    startQuiz() {
        /* Reset quiz variables */
        this._question_index = 0;
        this._given_answers = [];

        this._running_questions = [...this.questions]; // Create a shallow copy of this.questions

        /* If the quiz is multiple choice */
        if (this.quiz_type === 'multiple_choice') {
            // Shuffle the order of options in running questions
            this._running_questions.forEach(question => {
                question.options = this.shuffleArray(question.options);
            });
        }

        /* Start timer */
        this._quiz_start_time = new Date().getTime();

        /* Display the quiz */
        this.displayQuiz();
        this.createAnswerElements();

        this.getNextQuestion();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /** Question index controls */

    getNextQuestion() {
        /* get the next question */
        this._question_index++;
        this._current_question = this._running_questions[this._question_index-1];

        /* display it */
        this.displayQuestion();
    }

    getPreviousQuestion() {
        /* if the quiz is on the first question */
        if (this._question_index === 1) {
            /* log and do nothing */
            console.warn(`Quiz.getPreviousQuestion(): Cannot go back any further!`);
            return;
        }

        /* Otherwise, get the previous question */
        this._question_index--;
        this._current_question = this._running_questions[this._question_index-1];

        /* display it */
        this.displayQuestion();
    }

    /** Set initial quiz UI */

    displayQuiz() {

        /* Set quiz title */
        try {
            document.getElementById(`quiz_title`).innerHTML = this.title;
        } 
            
        catch (error) {
            throw error;
        }
    }

    createAnswerElements() {
        const answer_container = document.getElementById('answer_container');

        /* If the quiz is multiple choice */
        if(this.quiz_type == 'multiple_choice') {

            /* Create 4 radio buttons for each option */
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

                /* Add the radio button to the answer container */
                answer_container.appendChild(container);
            }
        } 
        
        /* If the quiz is short answer */
        else if (this.quiz_type == 'short_answer') {

            /* Create a text input for the answer */
            const container = document.createElement('div');
            container.classList.add('form-group', 'margin-top');

            container.innerHTML = `
                <label for="short_answer" id="answer">Short Answer:</label>
                <input type="text" class="form-control" name="short_answer" id="short_answer" required>
            `;

            /* Add the text input to the answer container */
            answer_container.appendChild(container);
        }
    }

    /** Set quiz UI throughout */

    displayQuestion() {
        try {
            /* Set question number and question text */
            document.getElementById(`question_index`).innerHTML = `Question ${this._question_index}`;
            document.getElementById(`question`).innerHTML = this._current_question.question;
            
            /* If the quiz is multiple choice */
            if (this.quiz_type == 'multiple_choice') {
                /* Set the options */
                for (let i = 0; i < this._current_question.options.length; i++) {
                    document.getElementById(`option_${i}_label`).innerHTML = this._current_question.options[i];
                }
            } 
            
            /* If the quiz is short answer */
            else if (this.quiz_type == 'short_answer') {
                /* Set the answer label */
                document.getElementById(`answer`).innerHTML = 'Short Answer: ';
            }

            /* If an answer has already been give */
            if (this._given_answers[this._question_index-1]) {
                /* Set the answer */
                if (this.quiz_type == 'multiple_choice') {
                    let i = 0;

                    this._current_question.options.forEach(option => {
                        if (option == this._given_answers[this._question_index-1].given_answer) {
                            document.getElementById(`option_${i}`).checked = true;
                        }

                        i++;
                    });
                } else if (this.quiz_type == 'short_answer') {
                    document.getElementById(`short_answer`).value = this._given_answers[this._question_index-1].given_answer;
                }
            }
        } 
            
        catch (error) {
            throw error;
        }
    }

    /** Set loading wheel */

    addWheel() {
        /* Create loading wheel */
        const previous_button = document.getElementById('previous_button');
        const loading_wheel = document.createElement('div');
        loading_wheel.classList.add('spinner-border', 'text-primary', 'mx-2', 'spinner-lg');
        loading_wheel.setAttribute('id', 'loading_wheel');
        loading_wheel.setAttribute('role', 'status');
        loading_wheel.innerHTML = '<span class="visually-hidden">Loading...</span>';
        loading_wheel.style.alignSelf = 'center';

        /* Add loading wheel to the DOM */
        previous_button.insertAdjacentElement('beforebegin', loading_wheel);
    }

    removeWheel() {
        /* Get loading wheel */
        try { 
            const loading_wheel = document.getElementById('loading_wheel');

            /* Remove loading wheel from the DOM, if it was found */
            if (loading_wheel) {
                loading_wheel.remove();
            }
        } catch (error) {
            return;
        }
    }

    /** Submit answer */


    async submitAnswer(given_answer) {
        /* Enable the previous button as quiz index will be at least 2 */
        document.getElementById('previous_button').disabled = false;

        /* Disable the quiz form and add the loading wheel */
        this.addWheel();
        this.disableQuizForm();

        let isCorrect = false;

        /* Check if the answer is correct */

        if (this._current_question.answer == given_answer) {
            isCorrect = true;
        }

        else if (this.quiz_type == 'short_answer') {
            isCorrect = await checkAnswer(this._current_question.question, this._current_question.answer, given_answer);
        }

        /* Create an answer_object detailing the given answer */
        const answer_object = {
            "context": `${this.title} (${this.description})`,
            "question": this._current_question.question,
            "given_answer": given_answer,
            "correct_answer": this._current_question.answer,
            "isCorrect": isCorrect,
        }

        /* Add the answer_object to the given_answers array */
        if (this._given_answers.length < this._question_index) {
            this._given_answers.push(answer_object);
        } else {
            this._given_answers[this._question_index - 1] = answer_object;
        }

        /* Wait 500ms before moving on */
        setTimeout(async () => {
            /* Reset quiz */
            this.enableQuizForm();
            this.removeWheel();

            /* Check if quiz has ended */
            if (this._question_index === this._running_questions.length) {
                /* If yes, check if the player wants the quiz to end */
                const result = confirm("Quiz completed. Are you happy with all your answers?");
                if (result) {
                    // If yes, End quiz
                    await this.endQuiz();
                } else {
                    // If no, Wait for next input
                }
            } else {
                /* If no, get next question */
                this.resetQuizForm();
                this.getNextQuestion();
                return false;
            }
        }, 500);
    }

    /* Quiz form controls */

    disableQuizForm() {
        
        /* Disable the quiz form */
        try {
            if (this.quiz_type == 'multiple_choice') {
                for (let i = 0; i < this._current_question.options.length; i++) {
                    document.getElementById(`option_${i}`).disabled = true;
                }
            } 
            
            else if (this.quiz_type == 'short_answer') {
                document.getElementById(`short_answer`).disabled = true;
            }
        } 
            
        catch (error) {
            throw error;
        }
    }

    enableQuizForm() {

        /* Enable the quiz form */
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
        } 
            
        catch (error) {
            throw error;
        }
    }

    resetQuizForm() {

        /* Reset the quiz form */
        try {
            if (this.quiz_type === 'multiple_choice') {
                for (let i = 0; i < this._current_question.options.length; i++) {
                    document.getElementById(`option_${i}`).checked = false;
                }
            } 
            
            else if (this.quiz_type === 'short_answer') {
                document.getElementById(`short_answer`).value = '';
            }
        } 
            
        catch (error) {
            throw error;
        }
    }
    
    /** End quiz */

    async endQuiz() {
        /* Save this attempt */
        const score = this._given_answers.filter(answer => answer.isCorrect).length;

        const attempt_duration = ( new Date().getTime() ) - this._quiz_start_time;

        const attempt = {
            "index": this.attempts.length + 1,
            "date_time": new Date(),
            "duration": attempt_duration,
            "score": score,
            "given_answers": this._given_answers,
        }

        this.attempts.push(attempt);

        console.log(`Quiz.endQuiz(): Attempt:`, attempt);

        /* Update the quiz in the database */
        await updateQuiz(this);

        /* save given_answers as raw JSON */
        const given_answers = JSON.stringify(this._given_answers);

        /* Move to feedback page */

        console.log('Redirecting to feedback page...');
        console.log('--------------------------------------------------');

        const url = `../feedback/feedback.html?given_answers=${given_answers}`;

        window.location.href = url;
    }

    /** For saving quiz */

    static fromObject(object) {
        const quiz = new Quiz(
            object.title,
            object.description,
            object.number_of_questions,
            object.quiz_type,
            object.id,
            object.questions,
            object.attempts,
        );
        return quiz;
    }
}