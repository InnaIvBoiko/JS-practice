import quizData from "../data/quiz-app.json" with {type: "json"};
console.log(quizData);

const card = document.querySelector('.quiz-container');
const question = document.getElementById('question');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitBtn = document.querySelector('.btn');
const answers = document.querySelectorAll('input[name="answer"]');


let currentQuiz = 0;
let score = 0;

const loadQuiz = () => {
    const currentQuizData = quizData[currentQuiz];

    answers.forEach(answer => {
        answer.checked = false
    });

    question.innerHTML = currentQuizData.question;
    a_text.innerHTML = currentQuizData.a;
    b_text.innerHTML = currentQuizData.b;
    c_text.innerHTML = currentQuizData.c;
    d_text.innerHTML = currentQuizData.d;
};

loadQuiz();

const checkAnswer = () => {
    const answer = document.querySelector('input[name="answer"]:checked').value;
    const currentQuizData = quizData[currentQuiz];
    if (answer) {
        if (answer === currentQuizData.correct) {
            score++;
        };

        currentQuiz++;

        if (currentQuiz < quizData.length) {
            loadQuiz();
        } else {
            card.innerHTML = `<h1>Congratulations! You passed all quiz questions! You answered correctly at ${score}/${quizData.length} questions.</h1>`;
        };
    };
};

// const checkAnswer = () => {
//     try {
//         const answer = document.querySelector('input[name="answer"]:checked').value;
//         const currentQuizData = quizData[currentQuiz];
//         const correctAnswer = currentQuizData.correct;

//     if (answer === correctAnswer) {
//         currentQuiz++;
//         if (currentQuiz < quizData.length) {   
//             loadQuiz();    
//         } else {
//             card.innerHTML = `<h1>Congratulations! You passed all quiz questions!</h1>`;
//         };
//     } else {
//         alert(`Your answer isn't correct. The correct answer is '${currentQuizData[correctAnswer]}'`)
//         };     
//     } catch (error) {
//         alert('You need to chose same answer!');
//     };
// };

submitBtn.addEventListener('click', checkAnswer);