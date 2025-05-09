// State variables
import { LocalStorageManager } from './storage/LocalStorageManager.js';
import { generateQuestionByLevel } from './core/questionGenerator.js';
import {
    resetTimer,
    startTimer,
    togglePause,
    getFormattedTime,
    adjustLevel,
    getCurrentLevel,
    setCurrentLevel
} from './core/sessionManager.js';
import {
    setElementText,
    setInputValue,
    setElementVisibility,
    setBlockVisibility,
    appendRowToTable,
    clearTable
} from './utils/domUtils.js';

let score = { correct: 0, incorrect: 0 };
let currentQuestion;
let currentStartTime;
let sessionData = [];
let generatedQuestions = new Set();

const storage = new LocalStorageManager();

export function startSession() {
    resetTimer();
    setBlockVisibility('answer-area', true);
    score = { correct: 0, incorrect: 0 };
    sessionData = [];
    generatedQuestions.clear();
    const history = storage.getAllSessions();
    setCurrentLevel(history.at(-1)?.finalLevel || 1);
    toggleInterface(true);
    updateTimer();
    startTimer(updateTimer, endSession);
    nextQuestion();
}

function toggleInterface(running) {
    setElementVisibility('start-button', !running);
    setElementVisibility('pause-button', running);
    setElementVisibility('stop-button', running);
    setBlockVisibility('review-section', false);
}

function updateTimer() {
    setElementText('timer', `Time left: ${getFormattedTime()}`);
}

function generateUniqueQuestion(level) {
    for (let i = 0; i < 10; i++) {
        const q = generateQuestionByLevel(level);
        if (!generatedQuestions.has(q.question)) {
            generatedQuestions.add(q.question);
            return q;
        }
    }
    return generateQuestionByLevel(level);
}

function nextQuestion() {
    const level = getCurrentLevel();
    currentQuestion = generateUniqueQuestion(level);
    setElementText('question-text', currentQuestion.question);
    setInputValue('answer');
    setElementText('feedback', '');
    currentStartTime = Date.now();
}

export function submitAnswer() {
    const input = document.getElementById('answer').value.trim();
    if (input === '') return alert('Please enter an answer.');

    const givenAnswer = parseFloat(input);
    const timeSpent = ((Date.now() - currentStartTime) / 1000).toFixed(1);
    const isCorrect = Math.abs(givenAnswer - currentQuestion.answer) < 0.01;

    score[isCorrect ? 'correct' : 'incorrect']++;
    setElementText('feedback', isCorrect
        ? `Correct! Time: ${timeSpent}s`
        : `Incorrect. Correct answer: ${currentQuestion.answer} | Time: ${timeSpent}s`);

    setElementText('score', `Correct: ${score.correct} | Incorrect: ${score.incorrect}`);

    sessionData.push({
        question: currentQuestion.question,
        givenAnswer,
        correctAnswer: currentQuestion.answer,
        time: timeSpent,
        isCorrect
    });

    const newLevel = adjustLevel(isCorrect, timeSpent);
    setCurrentLevel(newLevel);
    nextQuestion();
}

export function onPauseClick() {
    const paused = togglePause();
    const pauseBtn = document.getElementById('pause-button');
    if (paused) {
        pauseBtn.innerHTML = '<i class="fa fa-play"></i> Retomar';
        pauseBtn.classList.add('resume');
    } else {
        pauseBtn.innerHTML = '<i class="fa fa-pause"></i> Pausar';
        pauseBtn.classList.remove('resume');
    }
}

export function endSession() {
    resetTimer();
    setElementText('question-text', 'Session ended!');
    toggleInterface(false);
    saveSession();
    setBlockVisibility('answer-area', false);
    showReview();
}

function saveSession() {
    const [min, sec] = getFormattedTime().split(':').map(Number);
    const newSession = {
        id: new Date().toLocaleString(),
        finalLevel: getCurrentLevel(),
        score: { ...score },
        totalTime: 600 - (min * 60 + sec),
        questions: sessionData
    };
    storage.saveSession(newSession);
}

function showReview() {
    clearTable('review-table');
    sessionData.forEach((q, i) => {
        const resultadoClasse = q.isCorrect ? 'acerto' : 'erro';
        const resultadoTexto = q.isCorrect ? '✅ Correta' : '❌ Incorreta';
        appendRowToTable('review-table', `
          <tr>
            <td>${i + 1}</td>
            <td>${q.question}</td>
            <td>${q.givenAnswer}</td>
            <td>${q.correctAnswer}</td>
            <td>${parseFloat(q.time).toFixed(1)}s</td>
            <td class="${resultadoClasse}">${resultadoTexto}</td>
          </tr>`);
    });
    setBlockVisibility('review-section', true);
}

export function stopSession() {
    setElementText('question-text', 'Session stopped!');
    toggleInterface(false);
    saveSession();
    setBlockVisibility('answer-area', false);
    resetTimer();
    showReview();
}

function mostrarHistorico() {
    const historico = storage.getAllSessions();
    const container = document.getElementById('historico-sessoes');
    if (historico.length === 0) {
        container.innerHTML = '<p>Nenhuma sessão registrada.</p>';
        return;
    }

    let html = '<h3>Histórico de Sessões</h3><ul id="lista-historico">';
    historico.forEach((s, i) => {
        const [data, hora] = s.id.split(', ');
        html += `
          <li data-index="${i}">
            <div class="session-title">
              🧠 Sessão ${i + 1}
              <button class="delete-btn" onclick="deletarSessao(${i})" title="Excluir sessão">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
            <div class="stats">
              <span>📅 ${data} às ${hora}</span>
              <span>✅ ${s.score.correct} acertos</span>
              <span>❌ ${s.score.incorrect} erros</span>
            </div>
          </li>`;

    });
    html += '</ul><div id="detalhes-sessao"></div>';
    container.innerHTML = html;

    document.querySelectorAll('#lista-historico li').forEach(li => {
        li.addEventListener('click', function() {
            const idx = this.getAttribute('data-index');
            const sessao = historico[idx];
            let detalhes = `
                <h4>Questões da Sessão ${parseInt(idx) + 1}</h4>
                <table class="historico-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Questão</th>
                            <th>Resposta Dada</th>
                            <th>Correta</th>
                            <th>Tempo</th>
                            <th>Resultado</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            sessao.questions.forEach((q, j) => {
                detalhes += `
                    <tr>
                        <td>${j + 1}</td>
                        <td>${q.question}</td>
                        <td>${q.givenAnswer}</td>
                        <td>${q.correctAnswer}</td>
                        <td>${q.time}s</td>
                        <td>${q.isCorrect ? '✅' : '❌'}</td>
                    </tr>
                `;
            });
            detalhes += `
                    </tbody>
                </table>
            `;
            document.getElementById('detalhes-sessao').innerHTML = detalhes;
        });
    });
}


document.getElementById('answer')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') submitAnswer();
});

document.getElementById('pause-button')?.addEventListener('click', onPauseClick);

// expose to global scope
window.startSession = startSession;
window.submitAnswer = submitAnswer;
window.onPauseClick = onPauseClick;
window.endSession = endSession;
window.mostrarHistorico = mostrarHistorico;
window.deletarSessao = function(index) {
    if (!confirm("Tem certeza que deseja excluir esta sessão?")) return;

    const historico = JSON.parse(localStorage.getItem('allSessions')) || [];
    historico.splice(index, 1);
    localStorage.setItem('allSessions', JSON.stringify(historico));
    mostrarHistorico();
};

document.getElementById('start-button').addEventListener('click', startSession);
document.getElementById('pause-button').addEventListener('click', onPauseClick);
document.getElementById('stop-button').addEventListener('click', stopSession);
document.getElementById('history-button').addEventListener('click', mostrarHistorico)
document.getElementById('answer-button').addEventListener('click', submitAnswer)