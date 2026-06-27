// State 💾
let cards = JSON.parse(localStorage.getItem('studybloom-cards') || '[]');
let reviewed = new Set(JSON.parse(localStorage.getItem('studybloom-reviewed') || '[]'));

// Elements
const grid = document.getElementById('cardsGrid');
const empty = document.getElementById('empty');
const modal = document.getElementById('modal');
const progress = document.getElementById('progress');
const reviewedSpan = document.getElementById('reviewed');
const totalSpan = document.getElementById('total');
const search = document.getElementById('search');

// Bubbles Background 🎀
function createBubbles() {
  const colors = ['bg-pink-300', 'bg-purple-300', 'bg-sky-300', 'bg-yellow-200'];
  for(let i=0; i<15; i++) {
    const b = document.createElement('div');
    const size = Math.random() * 60 + 20;
    b.className = `bubble ${colors[Math.floor(Math.random()*4)]}`;
    b.style.width = size + 'px';
    b.style.height = size + 'px';
    b.style.left = Math.random() * 100 + '%';
    b.style.top = Math.random() * 100 + '%';
    b.style.animationDelay = Math.random() * 5 + 's';
    document.getElementById('bubbles').appendChild(b);
  }
}

// Render Cards 📚
function renderCards(filter = '') {
  const filtered = cards.filter(c =>
    c.front.toLowerCase().includes(filter.toLowerCase()) ||
    c.back.toLowerCase().includes(filter.toLowerCase())
  );

  grid.innerHTML = '';
  empty.style.display = filtered.length? 'none' : 'block';

  filtered.forEach((card) => {
    const isReviewed = reviewed.has(card.id);
    const cardEl = document.createElement('div');
    cardEl.className = 'flip-card h-48 cursor-pointer';
    cardEl.innerHTML = `
      <div class="flip-inner">
        <div class="front bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-3xl p-4 shadow-lg border-2 ${isReviewed? 'border-green-400' : 'border-pink-200 dark:border-purple-700'} flex items-center justify-center text-center">
          <div>
            <p class="font-bold text-lg text-purple-600 dark:text-pink-300">${card.front}</p>
            ${isReviewed? '<div class="absolute top-2 right-2 text-green-500">✓</div>' : ''}
          </div>
        <div class="back bg-gradient-to-br from-pink-200 to-purple-200 dark:from-purple-800 dark:to-pink-900 rounded-3xl p-4 shadow-lg border-2 border-purple-300 flex items-center justify-center text-center">
          <p class="text-gray-700 dark:text-gray-200">${card.back}</p>
        </div>
      </div>
    `;
    cardEl.onclick = () => {
      cardEl.classList.toggle('flipped');
      if(!isReviewed) {
        reviewed.add(card.id);
        saveData();
        updateProgress();
        if(reviewed.size === cards.length && cards.length > 0) celebrate();
      }
    };
    grid.appendChild(cardEl);
  });

  updateProgress();
}

// Save 💾
function saveData() {
  localStorage.setItem('studybloom-cards', JSON.stringify(cards));
  localStorage.setItem('studybloom-reviewed', JSON.stringify([...reviewed]));
}

// Progress 📊
function updateProgress() {
  const percent = cards.length? (reviewed.size / cards.length) * 100 : 0;
  progress.style.width = percent + '%';
  reviewedSpan.textContent = reviewed.size;
  totalSpan.textContent = cards.length;
}

// Confetti 🎉
function celebrate() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#f9a8d4', '#c084fc', '#7dd3fc']
  });
}

// Theme 🌙
document.getElementById('themeToggle').onclick = () => {
  document.documentElement.classList.toggle('dark');
  document.getElementById('themeToggle').textContent =
    document.documentElement.classList.contains('dark')? '☀️' : '🌙';
  localStorage.setItem('theme', document.documentElement.classList.contains('dark')? 'dark' : 'light');
};

// Add Card ➕
document.getElementById('addBtn').onclick = () => modal.classList.remove('hidden');
document.getElementById('closeModal').onclick = () => modal.classList.add('hidden');
document.getElementById('saveCard').onclick = () => {
  const front = document.getElementById('frontInput').value.trim();
  const back = document.getElementById('backInput').value.trim();
  if(front && back) {
    cards.push({ id: Date.now(), front, back });
    saveData();
    renderCards(search.value);
    document.getElementById('frontInput').value = '';
    document.getElementById('backInput').value = '';
    modal.classList.add('hidden');
  }
};

// Search 🎯
search.oninput = (e) => renderCards(e.target.value);

// Export 📤
document.getElementById('exportBtn').onclick = () => {
  const text = cards.map(c => `Q: ${c.front}\nA: ${c.back}\n---`).join('\n');
  const blob = new Blob([text], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'studybloom-cards.txt'; a.click();
  URL.revokeObjectURL(url);
};

// Import 📥
document.getElementById('importBtn').onclick = () => document.getElementById('fileInput').click();
document.getElementById('fileInput').onchange = (e) => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const lines = ev.target.result.split('\n');
    let front = '', back = '';
    lines.forEach(line => {
      if(line.startsWith('Q: ')) front = line.slice(3);
      else if(line.startsWith('A: ')) back = line.slice(3);
      else if(line === '---' && front && back) {
        cards.push({ id: Date.now() + Math.random(), front, back });
        front = ''; back = '';
      }
    });
    saveData();
    renderCards();
  };
  reader.readAsText(file);
  e.target.value = '';
};

// Init 🚀
createBubbles();
renderCards();

// Load theme
const savedTheme = localStorage.getItem('theme');
if(savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
  document.getElementById('themeToggle').textContent = '☀️';
}