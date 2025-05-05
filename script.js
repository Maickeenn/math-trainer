let timeLeft = 600;
let timerInterval;
let isPaused = false;
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
    const historico = JSON.parse(localStorage.getItem('todasAsSessoes')) || [];
    if (historico.length > 0) {
        nivelAtual = historico[historico.length - 1].nivelFinal || 'A1';
    } else {
        nivelAtual = 'A1';
    }
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('pause-button').style.display = 'inline-block';
    document.getElementById('stop-button').style.display = 'inline-block';
    document.getElementById('review-section').style.display = 'none';
    updateTimer();
    timerInterval = setInterval(timerTick, 1000);
    nextQuestion();
}

function timerTick() {
    if (!isPaused) {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) endSession();
    }
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
    const inputEl = document.getElementById('answer');
    const input = inputEl.value.trim();

    if (input === '') {
        alert('Por favor, insira uma resposta.');
        return;
    }

    const respostaDada = parseInt(input);
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

function togglePause() {
    const pauseBtn = document.getElementById('pause-button');
    isPaused = !isPaused;
    pauseBtn.innerText = isPaused ? 'Continuar' : 'Pausar';
}

function endSession() {
    clearInterval(timerInterval);
    document.getElementById('question-text').innerText = 'Sessão encerrada!';
    document.getElementById('start-button').style.display = 'block';
    document.getElementById('pause-button').style.display = 'none';
    document.getElementById('stop-button').style.display = 'none';
    salvarSessao();
    showReview();
}

function salvarSessao() {
    const novaSessao = {
        id: new Date().toLocaleString(),
        nivelInicial: 'A1',
        nivelFinal: nivelAtual,
        score: { ...score },
        tempoTotal: 600 - timeLeft,
        questoes: sessionData
    };

    const historico = JSON.parse(localStorage.getItem('todasAsSessoes')) || [];
    historico.push(novaSessao);
    localStorage.setItem('todasAsSessoes', JSON.stringify(historico));
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

function mostrarHistorico() {
    const historico = JSON.parse(localStorage.getItem('todasAsSessoes')) || [];
    if (historico.length === 0) {
        alert("Nenhuma sessão registrada.");
        return;
    }

    let html = '<h3>Histórico de Sessões</h3><ul>';
    historico.forEach((s, i) => {
        html += `<li>
            <button onclick="verSessao(${i})">Sessão ${i + 1} - ${s.id} | ${s.score.acertos}✅ ${s.score.erros}❌</button>
        </li>`;
    });
    html += '</ul>';
    document.getElementById('historico-sessoes').innerHTML = html;
}

function verSessao(index) {
    const historico = JSON.parse(localStorage.getItem('todasAsSessoes')) || [];
    const sessao = historico[index];

    const tableBody = document.querySelector('#review-table tbody');
    tableBody.innerHTML = '';
    sessao.questoes.forEach((q, i) => {
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

document.getElementById('answer').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        submitAnswer();
    }
});