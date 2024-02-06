console.log('Loading: test-LLM.js');

/* Imports */
import { BatchSWQG } from "../text-generation/quiz-generation/quiz-generation.js";

let is_batch = false;
let is_question_evaluation = true;

/* Variables */
let number_of_questions = 5;
let quiz = [];
let data = ""

function shuffleArray(array) {
    let random_array = [];
    let array_length = array.length;

    for (let i = 0; i < array_length; i++) {
        let random_index = Math.floor(Math.random() * array.length);
        random_array.push(array[random_index]);
        array.splice(random_index, 1);
    }

    return random_array;
}

// Topic with no title or context - 1
// Topic with tile but no context - 4
// Topic with title and context - 3
// Title and context with no topic -2

let contexts_for_quiz_questions = [
    "Computer Science",
    
    "English literature - Macbeth",
    "Physics - A-Level: Quantum Mechanics",
    "Philosophy - The Meaning of Life",
    "Art - The Renaissance",
    
    `History - AQA Norman Castles - Pre-Norman fortifications
    The Anglo-Saxon kingdoms faced a major threat from Viking invasions and as a result many towns were fortified against attack. These fortified towns, known as burhs, were not very sophisticated but they were effective. The first step in letructing a burh was to dig a very deep trench, and then to build a wooden or stone wall around the town. Inside the walls the burhs were not very different to any other town except for the large gates on either end of the town that controlled who came in and out.
    
    Motte and bailey castles
    Norman castles were designed for a different purpose, they were not defensive structures like the burhs, they were designed to intimidate the conquered Anglo-Saxons and remind them of Norman power.
    
    Norman castles were often built in locations that were considered of strategic value. The first Norman castle in England was built a few miles from where William landed and was used as a base for soldiers to terrorise the local population and gather supplies. Unlike Anglo-Saxon fortified towns, a Norman motte and bailey castle could be built very quickly, in some cases it only took a few days.
    
    William had 8000 men to try and consolidate his power in England. Building motte and bailey castles were an effective way of securing towns that had submitted to his power. Although the wooden structure was much more vulnerable to damage than a stone structure, a motte and bailey castle could be built quickly until the Normans had the time to build more permanent stone structures.
    
    The major weakness of the motte and bailey castle was the likelihood of the keep rotting or burning down. The solution was to build stone keeps but these could not always be built on the same site since the weight of the stone would sink into the motte.`,
    
    `Mathematics - GCSE: Algebra - Letters can be used to stand for unknown values or values that can change. Formulas can be written and equations solved to solve a range of problems in science and engineering. Give me some questions that contain algebra.`,
    
    `French - GCSE: Holidays - On va en vacances en Italie chaque année. – We go to Italy on holiday every year.

    Les vacances au bord de la mer sont très reposantes. – Holidays by the sea are very relaxing.
    
    Je préfère les vacances d’hiver parce que j’adore faire du ski. – I prefer winter holidays because I love skiing.
    
    Je choisis toujours des vacances actives. - I always choose active holidays.
    
    Je trouve les vacances à la campagne un peu ennuyeuses. – I find holidays in the countryside a bit boring.
    
    Nous faisons souvent des city breaks/ des séjours courts dans des villes différentes. – We often take short breaks in cities.
    
    L’été dernier, je suis allé(e) en voyage scolaire avec mon collège. – Last year, we went on a school trip.
    
    C’était la canicule en Espagne. – There was a heatwave in Spain.
    
    Les lunettes de soleil sont indispensables. - Sunglasses are a necessity.`,

    "Bands from the Seventies - Led Zeppelin, Pink Floyd, Queen, The Rolling Stones, The Who, The Eagles, The Doors, The Bee Gees, The Police, The Clash",
    "The Premier League - The Premier League is the top tier of English football. It was founded in 1992 and has grown to become the most-watched sports league in the world. The league is made up of 20 teams, who play 38 games each season. The teams that finish in the bottom three places are relegated to the Championship, and the top four teams qualify for the UEFA Champions League. The league is known for its fast-paced, attacking football and has a global following. The Premier League has been won by six clubs: Manchester United, Manchester City, Chelsea, Arsenal, Blackburn Rovers, and Leicester City. The current champions are Manchester City, who won the 2020-21 season. The league has a number of rivalries, including the North West Derby between Manchester United and Liverpool, and the North London Derby between Arsenal and Tottenham Hotspur. The league has also been home to some of the world's best players, including Thierry Henry, Cristiano Ronaldo, and Alan Shearer.",
];

/* Functions */

if (is_batch) {

    // Generate a quiz using your SWQG module
    let quiz = await BatchSWQG(number_of_questions, 'multiple_choice', `${quiz_context}`);

    // Convert the quizzes array to a string
    let i = 1;

    data += "-------------------------\n";
    data += "Quiz: \n";
    data += "\n";

    quiz.forEach(question => {
        data += "Question : " + (i++) + "\n";

        data += "Question: " + question.question + "\n";
        data += "Answer: " + question.answer + "\n";

        data += "Options: \n";
        question.options.forEach(option => {
            data += "   - " + option + "\n";
        });
    });

    data += "\n";
    data += "-------------------------\n";

    console.log(data);

}

if (is_question_evaluation) {
    let quiz_1 = []
    let quiz_2 = []

    for (const context of contexts_for_quiz_questions) {
        quiz_1 = await BatchSWQG(number_of_questions, 'multiple_choice', `${context}`);
        quiz_2 = await BatchSWQG(number_of_questions, 'multiple_choice', `${context}`);

        merged_questions = quiz_1.concat(quiz_2);

        for (const question of merged_questions) {
            question.context = context;
        }

        quiz = quiz.concat(merged_questions);
    }

    quiz = shuffleArray(quiz);

    let quiz_length = quiz.length;
    let assessors = 5;
    let quizzes = [];

    for (let i = 0; i < assessors; i++) {
        let start = i * (quiz_length / assessors);
        let end = (i + 1) * (quiz_length / assessors);
        let quiz_slice = quiz.slice(start, end);
        quizzes.push(quiz_slice);
    }

    console.log(quizzes);

    quizzes.forEach(quiz => {
        let i = 1;

        data += "-------------------------\n";
        data += "Quiz: \n";
        data += "\n";

        quiz.forEach(question => {
            data += "Question : " + (i++) + "\n";

            data += "Context: " + question.context + "\n";
            data += "\n";

            data += "Question: " + question.question + "\n";
            data += "Answer: " + question.answer + "\n";

            data += "Options: \n";
            question.options.forEach(option => {
                data += "   - " + option + "\n";
            });
        });

        data += "\n";
        data += "-------------------------\n";
    });
}