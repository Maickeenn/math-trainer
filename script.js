let timeLeft = 600;
let timerInterval;
let score = { acertos: 0, erros: 0 };
let currentQuestion;
let currentStartTime;
let level = 1;
let sessionData = [];

function startSession() {
    timeLeft = 600;
    score = { acertos: 0, erros: 0 };
    sessionData = [];
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('review-section').style.display = 'none';
    updateTimer();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) endSession();
    }, 1000);
    nextQuestion();
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    document.getElementById('timer').innerText = `Tempo restante: ${minutes}:${seconds}`;
}

function generateQuestion() {
    const max = 10 + level * 10;
    const a = Math.floor(Math.random() * max) + 1;
    const b = Math.floor(Math.random() * max) + 1;
    const op = ['+', '-', '*'][Math.floor(Math.random() * 3)];
    let result;
    switch(op) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
    }
    return { enunciado: `${a} ${op} ${b}`, resposta: result };
}

function nextQuestion() {
    currentQuestion = generateQuestion();
    document.getElementById('question-text').innerText = currentQuestion.enunciado;
    document.getElementById('answer').value = '';
    document.getElementById('feedback').innerText = '';
    currentStartTime = Date.now();
}

function submitAnswer() {
    const respostaDada = parseInt(document.getElementById('answer').value);
    const tempoGasto = ((Date.now() - currentStartTime) / 1000).toFixed(1);
    const correta = respostaDada === currentQuestion.resposta;
    if (correta) {
        score.acertos++;
        document.getElementById('feedback').innerText = `Correto! Tempo: ${tempoGasto}s`;
    } else {
        score.erros++;
        document.getElementById('feedback').innerText = `Errado. Resposta correta: ${currentQuestion.resposta} | Tempo: ${tempoGasto}s`;
    }
    document.getElementById('score').innerText = `Acertos: ${score.acertos} | Erros: ${score.erros}`;
    sessionData.push({
        enunciado: currentQuestion.enunciado,
        respostaDada,
        respostaCorreta: currentQuestion.resposta,
        tempo: tempoGasto,
        correta
    });
    nextQuestion();
}

function endSession() {
    clearInterval(timerInterval);
    document.getElementById('question-text').innerText = 'Sessão encerrada!';
    document.getElementById('start-button').style.display = 'block';
    showReview();
}

function showReview() {
    const tableBody = document.querySelector('#review-table tbody');
    tableBody.innerHTML = '';
    sessionData.forEach((q, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${q.enunciado}</td>
            <td>${q.respostaDada}</td>
            <td>${q.respostaCorreta}</td>
            <td>${q.tempo}s</td>
            <td>${q.correta ? '✅' : '❌'}</td>
        `;
        tableBody.appendChild(row);
    });
    document.getElementById('review-section').style.display = 'block';
}