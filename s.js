const exerciseInput = document.getElementById('exerciseTime');
const restInput = document.getElementById('restTime');
const setsInput = document.getElementById('sets');

const phaseDisplay = document.getElementById('phase');
const timerDisplay = document.getElementById('timer');

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

let exerciseTime, restTime, totalSets;
let currentSet = 0;
let inExercise = true;
let timerInterval;
let remainingTime;
let isPaused = false;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function updateTimer() {
  if (remainingTime > 0) {
    remainingTime--;
    timerDisplay.textContent = formatTime(remainingTime);
  } else {
    // Passage à la phase suivante
    clearInterval(timerInterval);

    if (inExercise) {
      // Fin exercice, début repos
      inExercise = false;
      phaseDisplay.textContent = `Repos - Série ${currentSet} / ${totalSets}`;
      remainingTime = restTime;
      timerDisplay.textContent = formatTime(remainingTime);
      timerInterval = setInterval(updateTimer, 1000);
    } else {
      // Fin repos, nouvelle série ou fin
      currentSet++;
      if (currentSet > totalSets) {
        phaseDisplay.textContent = 'Terminé ! ';
        timerDisplay.textContent = '00:00';
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = false;
        return;
      } else {
        inExercise = true;
        phaseDisplay.textContent = `Exercice - Série ${currentSet} / ${totalSets}`;
        remainingTime = exerciseTime;
        timerDisplay.textContent = formatTime(remainingTime);
        timerInterval = setInterval(updateTimer, 1000);
      }
    }
  }
}

startBtn.addEventListener('click', () => {
  // Récupérer les valeurs
  exerciseTime = parseInt(exerciseInput.value, 10);
  restTime = parseInt(restInput.value, 10);
  totalSets = parseInt(setsInput.value, 10);

  if (isNaN(exerciseTime) || isNaN(restTime) || isNaN(totalSets) ||
      exerciseTime <= 0 || restTime <= 0 || totalSets <= 0) {
    alert('Merci de saisir des nombres positifs valides.');
    return;
  }

  currentSet = 1;
  inExercise = true;
  remainingTime = exerciseTime;
  phaseDisplay.textContent = `Exercice - Série ${currentSet} / ${totalSets}`;
  timerDisplay.textContent = formatTime(remainingTime);

  startBtn.disabled = true;
  pauseBtn.disabled = false;
  resetBtn.disabled = false;

  timerInterval = setInterval(updateTimer, 1000);
  isPaused = false;
});

pauseBtn.addEventListener('click', () => {
  if (!isPaused) {
    clearInterval(timerInterval);
    pauseBtn.textContent = 'Reprendre';
    isPaused = true;
  } else {
    timerInterval = setInterval(updateTimer, 1000);
    pauseBtn.textContent = 'Pause';
    isPaused = false;
  }
});

resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  phaseDisplay.textContent = 'Prêt ?';
  timerDisplay.textContent = '00:00';
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  pauseBtn.textContent = 'Pause';
  resetBtn.disabled = true;
  isPaused = false;
});
