// core/sessionManager.test.js

let timeLeft = 600;
let timerInterval;
let isPaused = false;
let currentLevel = 1;

const idealTimePerLevel = {
  1: 3, 2: 3, 3: 4, 4: 4, 5: 5,
  6: 6, 7: 7, 8: 8, 9: 10, 10: 12,
  11: 14, 12: 15
};

function resetTimer() {
  clearInterval(timerInterval);
  timeLeft = 600;
}

function startTimer(onTick, onFinish) {
  timerInterval = setInterval(() => {
    if (!isPaused) {
      timeLeft--;
      onTick(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        onFinish();
      }
    }
  }, 1000);
}

function togglePause() {
  isPaused = !isPaused;
  return isPaused;
}

function getFormattedTime() {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function adjustLevel(isCorrect, timeSpent) {
  const ideal = idealTimePerLevel[currentLevel] || 10;
  if (isCorrect && timeSpent <= ideal) currentLevel++;
  else if (!isCorrect || timeSpent > ideal * 2) currentLevel = Math.max(1, currentLevel - 1);
  return currentLevel;
}

function getCurrentLevel() {
  return currentLevel;
}

function setCurrentLevel(level) {
  currentLevel = level;
}

export {
  resetTimer,
  startTimer,
  togglePause,
  getFormattedTime,
  adjustLevel,
  getCurrentLevel,
  setCurrentLevel
};
