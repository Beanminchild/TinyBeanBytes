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
    // Drag and drop event listeners for swapping tiles
    tile.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', idx);
      tile.classList.add('dragging');
    });
    tile.addEventListener('dragover', (e) => {
      e.preventDefault();
      tile.classList.add('drag-over');
    });
    tile.addEventListener('dragleave', (e) => {
      tile.classList.remove('drag-over');
    });
    tile.addEventListener('drop', (e) => {
      e.preventDefault();
      tile.classList.remove('drag-over');
      const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
      const toIdx = idx;
      if (fromIdx !== toIdx) {
        let wordArr = area.querySelectorAll('.tile');
        let chars = Array.from(wordArr).map(t => t.textContent);
        // Swap the characters
        [chars[fromIdx], chars[toIdx]] = [chars[toIdx], chars[fromIdx]];
        renderWordArea(chars.join(''));
      }
    });
    tile.addEventListener('dragend', (e) => {
      tile.classList.remove('dragging');
      area.querySelectorAll('.tile').forEach(t => t.classList.remove('drag-over'));
    });
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
