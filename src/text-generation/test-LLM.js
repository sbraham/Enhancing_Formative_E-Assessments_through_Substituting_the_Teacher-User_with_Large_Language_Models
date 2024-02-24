console.log('Loading: test-LLM.js');

/* Imports */
import { BatchSWQG } from "../text-generation/quiz-generation/quiz-generation.js";
import { isGivenQuestionCorrect } from "../text-generation/verify-given-answer.js";

let is_batch = false;
let is_question_evaluation = true;
let is_write_answer_evaluation = false;
let is_hallucination_evaluaton = false;

/* Variables */
let number_of_questions = 2;
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
    let quiz = await BatchSWQG(number_of_questions, 'multiple_choice', `${quiz_context}`, 4, false);

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

    let i = 1;

    for (const context of contexts_for_quiz_questions) {
        quiz_1 = await BatchSWQG(number_of_questions, 'multiple_choice', `${context}`, 4, true);
        console.log(quiz_1);
        quiz_2 = await BatchSWQG(number_of_questions, 'multiple_choice', `${context}`, 4, true);
        console.log(quiz_2);

        let merged_questions = quiz_1.concat(quiz_2);

        for (const question of merged_questions) {
            question.context = context;
            question.index = i++;
        }

        quiz = quiz.concat(merged_questions);
    }

    console.log(quiz);

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
        quiz.sort((a, b) => a.index - b.index);

        data += "-------------------------\n";
        data += "Quiz: \n";
        data += "\n";

        quiz.forEach(question => {
            data += "Question : " + (question.index) + "\n";

            data += "Context : " + question.context + "\n";
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

    console.log(data);
}

if (is_write_answer_evaluation) {
    // isGivenQuestionCorrect(question, expected_answer, given_answer, number_of_attempts = 10);

    let twenty_questions = [
        {
            "context": `Computer Science`,
            "question": `What is a programming language?`,
            "answer": `A sequence of instructions written in a formal language that a computer can interpret and execute.`,
            "given_answers": [
                "A sequence of instructions written in a formal language that a computer can interpret and execute.",
                "A formalised way of writing algorithms.",
                "a programming language.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            ]
        },
        {
            "context": `Physics - A-Level: Quantum Mechanics`,
            "question": `What is the name given to the process of particles interacting with radiation or other particles to create new particles?`,
            "answer": `Pair Production.`,
            "given_answers": [
                "Pair Production.",
                "The process is called Pair Production.",
                "Particle Transmutation.",
                "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            ]
        },
        {
            "context": `Computer Science`,
            "question": `What is a compiler?`,
            "answer": `Compiler is a computer program that translates source code written in one programming language into another programming language or machine code.`,
            "given_answers": [
                "Compiler is a computer program that translates source code written in one programming language into another programming language or machine code.",
                "A program that compliles high level language into machine code.",
                "An application for organizing and managing files on a computer system.",
                "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            ]
        },
        {
            "context": `English literature - Macbeth`,
            "question": `Who is the main character in Macbeth?`,
            "answer": `Macbeth.`,
            "given_answers": [
                "Macbeth.",
                "Lord Macbeth, the Thane of Glamis.",
                "Lady Macbeth.",
                "Kermit the Frog.",
            ]
        },
        {
            "context": `Philosophy - The Meaning of Life`,
            "question": `Who is Jean-Paul Sartre?`,
            "answer": `Existentialist philosopher and writer.`,
            "given_answers": [
                "Existentialist philosopher and writer.",
                "A French Philosopher.",
                "A German Writer.",
                "The tragedy begins amid a bloody civil war in Scotland."
            ]
        },
        {
            "context": `The Premier League - The Premier League is the top tier of English football. It was founded in 1992 and has grown to become the most-watched sports league in the world. The league is made up of 20 teams, who play 38 games each season. The teams that finish in the bottom three places are relegated to the Championship, and the top four teams qualify for the UEFA Champions League. The league is known for its fast-paced, attacking football and has a global following. The Premier League has been won by six clubs: Manchester United, Manchester City, Chelsea, Arsenal, Blackburn Rovers, and Leicester City. The current champions are Manchester City, who won the 2020-21 season. The league has a number of rivalries, including the North West Derby between Manchester United and Liverpool, and the North London Derby between Arsenal and Tottenham Hotspur. The league has also been home to some of the world's best players, including Thierry Henry, Cristiano Ronaldo, and Alan Shearer.`,
            "question": `Who currently holds the title for most-watched sports league in the world?`,
            "answer": `English Premier League.`,
            "given_answers": [
                "English Premier League.",
                "The Premier League.",
                "Bundesliga.",
                "The Beatles.",
            ]
        },
        {
            "context": `Bands from the Seventies - Led Zeppelin, Pink Floyd, Queen, The Rolling Stones, The Who, The Eagles, The Doors, The Bee Gees, The Police, The Clash`,
            "question": `What iconic British rock band had members named Freddie Mercury and Brian May?`,
            "answer": `Queen.`,
            "given_answers": [
                "Queen.",
                "The Band, Queen.",
                "An English rock band.",
                "The British Parliamentary System.",
            ]
        },
       {
            "context": `Bands from the Seventies - Led Zeppelin, Pink Floyd, Queen, The Rolling Stones, The Who, The Eagles, The Doors, The Bee Gees, The Police, The Clash`,
            "question": `What was the name of the band that released 'Bohemian Rhapsody'?`,
            "answer": `Queen.`,
            "given_answers": [
                "Queen.",
                "The Band, Queen.",
                "An English rock band.",
                "qwertyuiopasdfghjklzxcvbnm.",
            ]
        },
       {
            "context": `Computer Science`,
            "question": `What is data structure?`,
            "answer": `A collection of data items that are organized in a specific way to enable efficient access and manipulation.`,
            "given_answers": [
                "A collection of data items that are organized in a specific way to enable efficient access and manipulation.",
                "A formalised way of storing data that assists in traveral and data manipulation.",
                "A stack, queue or tree.",
                "The fitness grand pacer test is a multi-stage aerobic capacity test that progressively gets more difficult as it continues.",
            ]
        },
       {
            "context": `English literature - Macbeth`,
            "question": `What was Macbeth's occupation before he became King?`,
            "answer": `Thane of Glamis.`,
            "given_answers": [
                "Thane of Glamis.",
                "He was the thane of glamis.",
                "he was a soldier working for gladice.",
                "Macbeth dies at the end.",
            ]
        },
       {
            "context": `Physics - A-Level: Quantum Mechanics`,
            "question": `What is the quantum number that represents the energy level of an electron in a hydrogen atom?`,
            "answer": `N_electron.`,
            "given_answers": [
                "N_electron.",
                "The quantum number that represents the energy level of an electron in a hydrogen atom is called the principal quantum number, often denoted by the symbol 'n'.",
                "N",
                "qwertyuiopasdfghjklzxcvbnm.",
            ]
        },
       {
            "context": `History - AQA Norman Castles - Pre-Norman fortifications
        The Anglo-Saxon kingdoms faced a major threat from Viking invasions and as a result many towns were fortified against attack. These fortified towns, known as burhs, were not very sophisticated but they were effective. The first step in letructing a burh was to dig a very deep trench, and then to build a wooden or stone wall around the town. Inside the walls the burhs were not very different to any other town except for the large gates on either end of the town that controlled who came in and out.
        
        Motte and bailey castles
        Norman castles were designed for a different purpose, they were not defensive structures like the burhs, they were designed to intimidate the conquered Anglo-Saxons and remind them of Norman power.
        
        Norman castles were often built in locations that were considered of strategic value. The first Norman castle in England was built a few miles from where William landed and was used as a base for soldiers to terrorise the local population and gather supplies. Unlike Anglo-Saxon fortified towns, a Norman motte and bailey castle could be built very quickly, in some cases it only took a few days.
        
        William had 8000 men to try and consolidate his power in England. Building motte and bailey castles were an effective way of securing towns that had submitted to his power. Although the wooden structure was much more vulnerable to damage than a stone structure, a motte and bailey castle could be built quickly until the Normans had the time to build more permanent stone structures.
        
        The major weakness of the motte and bailey castle was the likelihood of the keep rotting or burning down. The solution was to build stone keeps but these could not always be built on the same site since the weight of the stone would sink into the motte.`,
            "question": `What are burhs?`,
            "answer": `Fortified towns.`,
            "given_answers": [
                "Fortified towns.",
                "An Anglo-Saxon fortification.",
                "Farming communities.",
                "qwertyuiopasdfghjklzxcvbnm.",
            ]
        },
       {
            "context": `Bands from the Seventies - Led Zeppelin, Pink Floyd, Queen, The Rolling Stones, The Who, The Eagles, The Doors, The Bee Gees, The Police, The Clash`,
            "question": `Who played the song "Sympathy for the Devil" on their 1968 album "Beggars Banquet"?`,
            "answer": `Rolling Stones.`,
            "given_answers": [
                "Rolling Stones.",
                "Rolling Stones",
                "The Rocks in Motion.",
                "poiuytrewqalkjuhygtfrdsamnbhgvfcxz.",
            ]
        },
       {
            "context": `The Premier League - The Premier League is the top tier of English football. It was founded in 1992 and has grown to become the most-watched sports league in the world. The league is made up of 20 teams, who play 38 games each season. The teams that finish in the bottom three places are relegated to the Championship, and the top four teams qualify for the UEFA Champions League. The league is known for its fast-paced, attacking football and has a global following. The Premier League has been won by six clubs: Manchester United, Manchester City, Chelsea, Arsenal, Blackburn Rovers, and Leicester City. The current champions are Manchester City, who won the 2020-21 season. The league has a number of rivalries, including the North West Derby between Manchester United and Liverpool, and the North London Derby between Arsenal and Tottenham Hotspur. The league has also been home to some of the world's best players, including Thierry Henry, Cristiano Ronaldo, and Alan Shearer.`,
            "question": `Who were the champions of the 2020-21 Premier League season?`,
            "answer": `Manchester City.`,
            "given_answers": [
                "Manchester City.",
                "Manchester City",
                "Manchester.",
                "qazwsxedcrfvtgbyuhnuijmikolp.",
            ]
        },
       {
            "context": `Computer Science`,
            "question": `What is a debugger?`,
            "answer": `A tool used to identify and fix errors in code.`,
            "given_answers": [
                "A tool used to identify and fix errors in code.",
                "Something that helps you fix code.",
                "A fly swatter can remove bugs.",
                "plokmoikjmnijuhnbuyhgbvtgfcrfdxeswasq.",
            ]
        },
       {
            "context": `Philosophy - The Meaning of Life`,
            "question": `Who is referred to as 'The Father of Existentialism'?`,
            "answer": `Søren Kierkegaard.`,
            "given_answers": [
                "Søren Kierkegaard.",
                "Kierkegaard",
                "Friedrich Nietzsche.",
                "qewretrytuyiuoipadsfdgfhgjhkjlzxxccvvbbnnmm.",
            ]
        },
       {
            "context": `French - GCSE: Holidays - On va en vacances en Italie chaque année. – We go to Italy on holiday every year.
                Les vacances au bord de la mer sont très reposantes. – Holidays by the sea are very relaxing.
                Je préfère les vacances d’hiver parce que j’adore faire du ski. – I prefer winter holidays because I love skiing.
                Je choisis toujours des vacances actives. - I always choose active holidays.
                Je trouve les vacances à la campagne un peu ennuyeuses. – I find holidays in the countryside a bit boring.
                Nous faisons souvent des city breaks/ des séjours courts dans des villes différentes. – We often take short breaks in cities.
                L’été dernier, je suis allé(e) en voyage scolaire avec mon collège. – Last year, we went on a school trip.
                C’était la canicule en Espagne. – There was a heatwave in Spain.
                Les lunettes de soleil sont indispensables. - Sunglasses are a necessity.`,
            "question": `Q3  Quelle saison préfèrez-vous pour les vacances?`,
            "answer": `Winter.`,
            "given_answers": [
                "Winter.",
                "winter holidays",
                "Active Holidays.",
                "1234567890.",
            ]
        },
        {
            "context": `Bands from the Seventies - Led Zeppelin, Pink Floyd, Queen, The Rolling Stones, The Who, The Eagles, The Doors, The Bee Gees, The Police, The Clash`,
            "question": `Who were known for their hit songs "Satisfaction" and "Paint It, Black"?`,
            "answer": `The Rolling Stones.`,
            "given_answers": [
                "The Rolling Stones.",
                "Rolling Stones",
                "Pink Floyd.",
                "0987654321.",
            ]
        },
       {
            "context": `The Premier League - The Premier League is the top tier of English football. It was founded in 1992 and has grown to become the most-watched sports league in the world. The league is made up of 20 teams, who play 38 games each season. The teams that finish in the bottom three places are relegated to the Championship, and the top four teams qualify for the UEFA Champions League. The league is known for its fast-paced, attacking football and has a global following. The Premier League has been won by six clubs: Manchester United, Manchester City, Chelsea, Arsenal, Blackburn Rovers, and Leicester City. The current champions are Manchester City, who won the 2020-21 season. The league has a number of rivalries, including the North West Derby between Manchester United and Liverpool, and the North London Derby between Arsenal and Tottenham Hotspur. The league has also been home to some of the world's best players, including Thierry Henry, Cristiano Ronaldo, and Alan Shearer.`,
            "question": `What is the Premier League?`,
            "answer": `The top tier of English football.`,
            "given_answers": [
                "The top tier of English football.",
                "It's the biggest football competition in England.",
                "The FA Cup.",
                "564783929201.",
            ]
        },
       {
            "context": `English literature - Macbeth`,
            "question": `What is the setting of Macbeth?`,
            "answer": `Scotland.`,
            "given_answers": [
                "Scotland.",
                "The Scottish Highlands.",
                "The globe theater.",
                "Under the sea.",
            ]
        },
    ]
    

    let question_results = [];

    // For each question
    for (const question of twenty_questions) {
        
        let given_answer_key = 1;
        let answer_results = [];

        // For each of the 4 given answers
        for (const given_answer of question.given_answers) {

            // Check it 5 times
            let response = await isGivenQuestionCorrect(question.context, question.question, question.answer, given_answer, 10, 0);
            
            if (given_answer_key === 1 || given_answer_key === 2) {
                if (response) {
                    // True Positive
                    answer_results.push(1);
                } else {
                    // False Negative
                    answer_results.push(0);
                }
            } else {
                if (response) {
                    // False Positive
                    answer_results.push(0);
                } else {
                    // True Negative
                    answer_results.push(1);
                }
            }

            given_answer_key++;        
        }

        console.log(answer_results);
        question_results.push(answer_results);
    }

    let i = 1;
    for (const question_result of question_results) {
        for (const answer_result of question_result) {
            let sum = 0;

            for (const result of answer_result) {
                sum += result;
            }
            
            console.log(`Question ${i}: ${a_results} : ${sum}`);
        }
    }
}