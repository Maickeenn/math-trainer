let timeLeft = 600;
let timerInterval;
let score = { acertos: 0, erros: 0 };
let currentQuestion;
let currentStartTime;
let sessionData = [];
let questoesGeradas = new Set();
let nivelAtual = 'A1';

const tempoIdealPorNivel = {
    'A1': 3, 'A2': 3,
    'B1': 6, 'B2': 6,
    'C1': 7, 'C2': 7,
    'D1': 12, 'D2': 12,
    'E1': 20
};

function startSession() {
    timeLeft = 600;
    score = { acertos: 0, erros: 0 };
    sessionData = [];
    questoesGeradas.clear();
    nivelAtual = 'A1';
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

function gerarQuestaoPorNivel(nivel) {
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    function gerarSoma(min, max) {
        const a = randInt(min, max), b = randInt(min, max);
        return { enunciado: `${a} + ${b}`, resposta: a + b };
    }

    function gerarSub(min, max) {
        const a = randInt(min, max), b = randInt(min, a);
        return { enunciado: `${a} - ${b}`, resposta: a - b };
    }

    function gerarMult(min, max) {
        const a = randInt(min, max), b = randInt(min, max);
        return { enunciado: `${a} × ${b}`, resposta: a * b };
    }

    function gerarDiv(min, max) {
        const b = randInt(min, max), r = randInt(min, max), a = b * r;
        return { enunciado: `${a} ÷ ${b}`, resposta: r };
    }

    switch(nivel) {
        case 'A1': return gerarSoma(1, 10);
        case 'A2': return gerarSub(1, 10);
        case 'B1': return gerarSoma(10, 100);
        case 'B2': return gerarSub(10, 100);
        case 'C1': return gerarMult(2, 12);
        case 'C2': return gerarDiv(2, 12);
        case 'D1': return gerarSoma(100, 999);
        case 'D2': return gerarSub(100, 999);
        case 'E1': {
            const q1 = gerarSoma(10, 100), q2 = gerarSub(1, 50);
            return { enunciado: `(${q1.enunciado}) - (${q2.enunciado})`, resposta: eval(q1.resposta + '-' + q2.resposta) };
        }
        default: return gerarSoma(1, 10);
    }
}

function gerarQuestaoUnica(nivel) {
    let tentativa = 0;
    while (tentativa < 10) {
        const q = gerarQuestaoPorNivel(nivel);
        if (!questoesGeradas.has(q.enunciado)) {
            questoesGeradas.add(q.enunciado);
            return q;
        }
        tentativa++;
    }
    return gerarQuestaoPorNivel(nivel);
}

function nextQuestion() {
    currentQuestion = gerarQuestaoUnica(nivelAtual);
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

    ajustarNivel(correta, tempoGasto);
    nextQuestion();
}

function ajustarNivel(correta, tempoGasto) {
    const ideal = tempoIdealPorNivel[nivelAtual] || 10;
    if (correta && tempoGasto <= ideal) {
        nivelAtual = proximoNivel(nivelAtual);
    } else if (!correta || tempoGasto > ideal * 2) {
        nivelAtual = nivelAnterior(nivelAtual);
    }
}

function proximoNivel(nivel) {
    const niveis = ['A1','A2','B1','B2','C1','C2','D1','D2','E1'];
    const i = niveis.indexOf(nivel);
    return i < niveis.length - 1 ? niveis[i+1] : nivel;
}

function nivelAnterior(nivel) {
    const niveis = ['A1','A2','B1','B2','C1','C2','D1','D2','E1'];
    const i = niveis.indexOf(nivel);
    return i > 0 ? niveis[i-1] : nivel;
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
