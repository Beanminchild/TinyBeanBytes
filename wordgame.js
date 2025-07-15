// Basic structure for the glassy word game
// TODO: Add a real dictionary and drag-drop logic
const DICTIONARY = [
  'computer', 'keyboard', 'elephant', 'umbrella', 'sandwich', 'triangle', 'mountain', 'language', 'hospital', 'backpack', 'dinosaur', 'airplane', 'building', 'calendar', 'diamond', 'festival', 'galaxy', 'holiday', 'internet', 'jewelry', 'kangaroo', 'laughter', 'magazine', 'notebook', 'operator', 'painting', 'question', 'railroad', 'sandwich', 'telescope', 'umbrella', 'vacation', 'whistle', 'xylophone', 'yesterday', 'zeppelin'
];

let currentWord = '';
let score = 0;

function pickRandomWord() {
  const filtered = DICTIONARY.filter(w => w.length >= 6 && w.length <= 12);
  return filtered[Math.floor(Math.random() * filtered.length)].toUpperCase();
}

function renderWordArea(word) {
  const area = document.getElementById('word-area');
  area.innerHTML = '';
  word.split('').forEach((ch, idx) => {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.textContent = ch;
    tile.draggable = true;
    tile.dataset.index = idx;
    // TODO: Add drag event listeners
    area.appendChild(tile);
  });
}

function renderLetterGrid() {
  const grid = document.getElementById('letter-grid');
  grid.innerHTML = '';
  const letters = [];
  while (letters.length < 8) {
    const ch = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    if (!letters.includes(ch)) letters.push(ch);
  }
  letters.forEach(ch => {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.textContent = ch;
    // TODO: Add click/drag event listeners for swapping
    grid.appendChild(tile);
  });
}

function startGame() {
  score = 0;
  document.getElementById('score').textContent = 'Score: 0';
  currentWord = pickRandomWord();
  renderWordArea(currentWord);
  renderLetterGrid();
}

document.getElementById('new-game').addEventListener('click', startGame);

window.onload = startGame;
