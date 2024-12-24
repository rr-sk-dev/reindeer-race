// src/main.ts
import './style.css';

interface GameState {
  player1Position: number;
  player2Position: number;
  isGameOver: boolean;
  winner: number | null;
  finishLine: number;
}

const state: GameState = {
  player1Position: 0,
  player2Position: 0,
  isGameOver: false,
  winner: null,
  finishLine: 0,
};

const MOVE_STEP = 10;

function updateFinishLine() {
  const track = document.querySelector('.track');
  if (track) {
    state.finishLine = track.clientWidth - 100; // Subtract reindeer width
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateFinishLine();
  window.addEventListener('resize', updateFinishLine);
  setupControls();
});

function setupControls() {
  document.addEventListener('keydown', (e) => {
    if (state.isGameOver) return;
    if (e.key.toLowerCase() === 'a') movePlayer(1);
    else if (e.key.toLowerCase() === 'l') movePlayer(2);
  });

  const player1Button = document.getElementById('player1Button');
  const player2Button = document.getElementById('player2Button');

  const handleTouch = (playerNum: number) => {
    if (!state.isGameOver) movePlayer(playerNum);
  };

  if (player1Button && player2Button) {
    ['touchstart', 'mousedown'].forEach((eventType) => {
      player1Button.addEventListener(eventType, (e) => {
        e.preventDefault();
        handleTouch(1);
      });
      player2Button.addEventListener(eventType, (e) => {
        e.preventDefault();
        handleTouch(2);
      });
    });
  }
}

function movePlayer(playerNum: number) {
  const position = playerNum === 1 ? 'player1Position' : 'player2Position';
  state[position] += MOVE_STEP;

  const reindeer = document.getElementById(`reindeer${playerNum}`);
  if (reindeer) {
    reindeer.style.left = `${state[position]}px`;
    animateReindeer(reindeer);
  }

  if (state[position] >= state.finishLine && !state.isGameOver) {
    state.isGameOver = true;
    state.winner = playerNum;
    celebrateWinner(playerNum);
  }
}

function animateReindeer(element: HTMLElement) {
  element.classList.add('run');
  setTimeout(() => element.classList.remove('run'), 100);
}

function celebrateWinner(playerNum: number) {
  const winner = document.getElementById(`reindeer${playerNum}`);
  if (winner) winner.classList.add('winner');

  const message = document.createElement('div');
  message.className = 'winner-message';
  message.textContent = `Player ${playerNum} Wins! 🎄`;
  document.body.appendChild(message);
}
