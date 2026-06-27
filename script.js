// ===== STUDYBLOOM AI - COMPLETE SCRIPT 💾🌸 =====

// State 💾
let cards = JSON.parse(localStorage.getItem('studybloom-cards') || '[]');
let reviewed = new Set(JSON.parse(localStorage.getItem('studybloom-reviewed') || '[]'));
let pomodoroTime = 25 * 60;
let pomodoroInterval;
let isPomodoroRunning = false;

// Elements
const grid = document.getElementById('cardsGrid');
const empty = document.getElementById('empty');
const modal = document.getElementById('modal');
const progress = document.getElementById('progress');
const reviewedSpan = document.getElementById('reviewed');
const totalSpan = document.getElementById('total');
const search = document.getElementById('search');

// ===== BUBBLES BACKGROUND 🎀 =====
function createBubbles() {
  const colors = ['bg-pink-300', 'bg-purple-300', 'bg-sky-300', 'bg-yellow-200'];
  const bubbleContainer = document.getElementById('bubbles');
  if (!bubbleContainer) return;

  for(let i=0; i<15; i++) {
    const b = document.createElement('div');
    const size = Math.random() * 60 + 20;
    b.className = `bubble ${colors[Math.floor(Math.random()*4)]}`;
    b.style.width = size + 'px';
    b.style.height = size + 'px';
    b.style.left = Math.random() * 100 + '%';
    b.style.top = Math.random() * 100 + '%';
    b.style.animationDelay = Math.random() * 5 + 's';
    bubbleContainer.appendChild(b);
  }
}

// ===== RENDER CARDS 📚 =====
function renderCards(filter = '') {
  const categoryFilter = document.getElementById('categoryFilter')?.value || '';
  const filtered = cards.filter(c => {
    const matchSearch = c.front.toLowerCase().includes(filter.toLowerCase()) ||
                       c.back.toLowerCase().includes(filter.toLowerCase());
    const matchCategory =!categoryFilter || (c.category || 'General') === categoryFilter;
    return matchSearch && matchCategory;
  });

  grid.innerHTML = '';
  empty.style.display = filtered.length? 'none' : 'block';

  filtered.forEach((card) => {
    const isReviewed = reviewed.has(card.id);
    const category = card.category || 'General';
    const cardEl = document.createElement('div');
    cardEl.className = 'flip-card cursor-pointer';
    cardEl.innerHTML = `
      <div class="flip-inner">
        <div class="front bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-3xl p-4 shadow-lg border-2 ${isReviewed? 'border-green-400' : 'border-pink-200 dark:border-purple-700'} flex items-center justify-center text-center relative">
          <span class="category-badge category-${category}">${category}</span>
          <div>
            <p class="font-bold text-lg text-purple-600 dark:text-pink-300">${card.front}</p>
            ${isReviewed? '<div class="absolute top-2 right-2 text-green-500 text-xl">✓</div>' : ''}
          </div>
        </div>
        <div class="back bg-gradient-to-br from-pink-200 to-purple-200 dark:from-purple-800 dark:to-pink-900 rounded-3xl p-4 shadow-lg border-2 border-purple-300 flex items-center justify-center text-center">
          <p class="text-gray-700 dark:text-gray-200">${card.back}</p>
        </div>
      </div>
    `;

    cardEl.addEventListener('click', () => {
      cardEl.classList.toggle('flipped');
      if(!isReviewed) {
        reviewed.add(card.id);
        saveData();
        updateProgress();
        updateStats();
        if(reviewed.size === cards.length && cards.length > 0) celebrate();
      }
    });

    grid.appendChild(cardEl);
  });

  updateProgress();
  updateStats();
}

// ===== SAVE DATA 💾 =====
function saveData() {
  localStorage.setItem('studybloom-cards', JSON.stringify(cards));
  localStorage.setItem('studybloom-reviewed', JSON.stringify([...reviewed]));
}

// ===== PROGRESS BAR 📊 =====
function updateProgress() {
  const percent = cards.length? (reviewed.size / cards.length) * 100 : 0;
  progress.style.width = percent + '%';
  reviewedSpan.textContent = reviewed.size;
  totalSpan.textContent = cards.length;
}

// ===== STATS UPDATE 📈 =====
function updateStats() {
  if(document.getElementById('totalCards')) {
    document.getElementById('totalCards').textContent = cards.length;
    document.getElementById('reviewedCards').textContent = reviewed.size;
    document.getElementById('accuracy').textContent = cards.length? Math.round((reviewed.size/cards.length)*100)+'%' : '0%';
  }
}

// ===== CONFETTI 🎉 =====
function celebrate() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#f9a8d4', '#c084fc', '#7dd3fc']
  });
}

// ===== THEME TOGGLE 🌙 =====
document.getElementById('themeToggle').onclick = () => {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  document.getElementById('themeToggle').textContent = isDark? '☀️' : '🌙';
  localStorage.setItem('theme', isDark? 'dark' : 'light');
};

// ===== ADD CARD ➕ =====
document.getElementById('addBtn').onclick = () => modal.classList.remove('hidden');
document.getElementById('closeModal').onclick = () => modal.classList.add('hidden');

document.getElementById('saveCard').onclick = () => {
  const front = document.getElementById('frontInput').value.trim();
  const back = document.getElementById('backInput').value.trim();
  const category = document.getElementById('categoryInput').value;

  if(front && back) {
    cards.push({ id: Date.now(), front, back, category });
    saveData();
    updateCategoryFilter();
    renderCards(search.value);
    document.getElementById('frontInput').value = '';
    document.getElementById('backInput').value = '';
    modal.classList.add('hidden');
  } else {
    alert('Pookie! Front aur Back dono bhar 😤');
  }
};

// ===== SEARCH 🎯 =====
search.oninput = (e) => renderCards(e.target.value);

// ===== EXPORT 📤 =====
document.getElementById('exportBtn').onclick = () => {
  if(cards.length === 0) {
    alert('Pookie! Pehle cards add kar 😭');
    return;
  }
  const text = cards.map(c => `Q: ${c.front}\nA: ${c.back}\nCategory: ${c.category || 'General'}\n---`).join('\n');
  const blob = new Blob([text], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'studybloom-cards.txt';
  a.click();
  URL.revokeObjectURL(url);
};

// ===== IMPORT 📥 =====
document.getElementById('importBtn').onclick = () => document.getElementById('fileInput').click();

document.getElementById('fileInput').onchange = (e) => {
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    const lines = ev.target.result.split('\n');
    let front = '', back = '', category = 'General';
    let imported = 0;

    lines.forEach(line => {
      if(line.startsWith('Q: ')) front = line.slice(3).trim();
      else if(line.startsWith('A: ')) back = line.slice(3).trim();
      else if(line.startsWith('Category: ')) category = line.slice(10).trim();
      else if(line === '---' && front && back) {
        cards.push({ id: Date.now() + Math.random(), front, back, category });
        front = ''; back = ''; category = 'General';
        imported++;
      }
    });

    if(imported > 0) {
      saveData();
      updateCategoryFilter();
      renderCards();
      alert(`${imported} cards import ho gaye! 🎉`);
    }
  };
  reader.readAsText(file);
  e.target.value = '';
};

// ===== CATEGORIES 📁 =====
function updateCategoryFilter() {
  const categories = ['General',...new Set(cards.map(c => c.category || 'General'))];
  const filter = document.getElementById('categoryFilter');
  if(!filter) return;

  const currentValue = filter.value;
  filter.innerHTML = '<option value="">All Categories 🌸</option>';
  categories.forEach(cat => {
    filter.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
  filter.value = currentValue;
}

document.getElementById('categoryFilter')?.addEventListener('change', () => renderCards(search.value));

// ===== POMODORO TIMER 🍅 =====
document.getElementById('pomodoroBtn').onclick = () => {
  if(!document.getElementById('pomodoroModal')) createPomodoroModal();
  document.getElementById('pomodoroModal').classList.remove('hidden');
  setupPomodoro();
};

function createPomodoroModal() {
  const modal = document.createElement('div');
  modal.id = 'pomodoroModal';
  modal.className = 'hidden fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 w-11/12 max-w-md text-center">
      <h2 class="title-font text-2xl mb-4 text-red-500">Pomodoro Timer 🍅</h2>
      <div class="pomodoro-timer text-red-500 mb-4" id="timerDisplay">25:00</div>
      <div class="flex gap-3 justify-center">
        <button id="startPomodoro" class="px-6 py-2 bg-green-400 hover:bg-green-500 text-white rounded-2xl font-semibold">Start</button>
        <button id="resetPomodoro" class="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-2xl">Reset</button>
        <button id="closePomodoro" class="px-6 py-2 bg-red-400 hover:bg-red-500 text-white rounded-2xl">Close</button>
      </div>
      <p class="text-sm mt-4 text-gray-600 dark:text-gray-300">25 min study + 5 min break 💪</p>
    </div>
  `;
  document.body.appendChild(modal);
}

function setupPomodoro() {
  const display = document.getElementById('timerDisplay');
  const startBtn = document.getElementById('startPomodoro');
  const resetBtn = document.getElementById('resetPomodoro');
  const closeBtn = document.getElementById('closePomodoro');

  function updateDisplay() {
    const mins = Math.floor(pomodoroTime / 60);
    const secs = pomodoroTime % 60;
    display.textContent = `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
  }

  startBtn.onclick = () => {
    if(isPomodoroRunning) {
      clearInterval(pomodoroInterval);
      startBtn.textContent = 'Start';
      isPomodoroRunning = false;
    } else {
      pomodoroInterval = setInterval(() => {
        pomodoroTime--;
        updateDisplay();
        if(pomodoroTime <= 0) {
          clearInterval(pomodoroInterval);
          confetti({particleCount: 50, spread: 60});
          alert('Break time Pookie! 🍅✨ 5 min rest kar');
          pomodoroTime = 5 * 60;
          updateDisplay();
          startBtn.textContent = 'Start';
          isPomodoroRunning = false;
        }
      }, 1000);
      startBtn.textContent = 'Pause';
      isPomodoroRunning = true;
    }
  };

  resetBtn.onclick = () => {
    clearInterval(pomodoroInterval);
    pomodoroTime = 25 * 60;
    updateDisplay();
    startBtn.textContent = 'Start';
    isPomodoroRunning = false;
  };

  closeBtn.onclick = () => {
    document.getElementById('pomodoroModal').classList.add('hidden');
  };

  updateDisplay();
}

// ===== AI QUIZ GENERATOR 🤖 =====
document.getElementById('quizBtn').onclick = () => {
  if(cards.length < 4) {
    alert('Quiz ke liye kam se kam 4 cards chahiye Pookie! 📚');
    return;
  }
  startQuiz();
};

function startQuiz() {
  const quizCards = [...cards].sort(() => 0.5 - Math.random()).slice(0, Math.min(5, cards.length));
  let score = 0;
  let currentQ = 0;

  function showQuestion() {
    if(currentQ >= quizCards.length) {
      confetti({particleCount: 100, spread: 70});
      alert(`Quiz Complete! 🎉\nScore: ${score}/${quizCards.length}\nPookie you smart! 🧠💖`);
      return;
    }

    const card = quizCards[currentQ];
    const options = [card.back];
    while(options.length < 4) {
      const randomCard = cards[Math.floor(Math.random() * cards.length)];
      if(!options.includes(randomCard.back)) options.push(randomCard.back);
    }
    options.sort(() => 0.5 - Math.random());

    const answer = prompt(`Q${currentQ+1}: ${card.front}\n\n1. ${options[0]}\n2. ${options[1]}\n3. ${options[2]}\n4. ${options[3]}\n\nEnter 1-4:`);

    if(answer && options[parseInt(answer)-1] === card.back) {
      score++;
      alert('Correct! ✅🎉');
    } else {
      alert(`Wrong! 😭 Correct: ${card.back}`);
    }
    currentQ++;
    setTimeout(showQuestion, 100);
  }
  showQuestion();
}

// ===== LEADERBOARD 🏆 =====
document.getElementById('leaderboardBtn').onclick = () => {
  const fakeUsers = [
    {name: localStorage.getItem('currentUser') || 'Pookie', score: reviewed.size * 10, streak: parseInt(localStorage.getItem('streak') || '0')},
    {name: 'StudyQueen', score: 450, streak: 12},
    {name: 'BookWorm', score: 380, streak: 5},
    {name: 'TopperBhai', score: 520, streak: 15},
    {name: 'CSE_Wala', score: 300, streak: 8},
  ].sort((a,b) => b.score - a.score);

  let leaderboardHTML = fakeUsers.map((u,i) => `
    <div class="leaderboard-item flex justify-between items-center p-3 bg-white/50 dark:bg-black/30 rounded-2xl mb-2">
      <div class="flex items-center gap-3">
        <span class="text-2xl">${i===0?'🥇':i===1?'🥈':i===2?'🥉':'🏅'}</span>
        <span class="font-bold ${u.name === (localStorage.getItem('currentUser') || 'Pookie')? 'text-purple-600' : ''}">${u.name}</span>
      </div>
      <div class="text-right">
        <div class="font-bold text-purple-600">${u.score} pts</div>
        <div class="text-xs text-gray-600 dark:text-gray-400">🔥 ${u.streak} day streak</div>
      </div>
    </div>
  `).join('');

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 w-11/12 max-w-md">
      <h2 class="title-font text-2xl mb-4 text-yellow-500 text-center">Leaderboard 🏆</h2>
      ${leaderboardHTML}
      <button onclick="this.parentElement.parentElement.remove()" class="w-full mt-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-2xl">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
};

// ===== STREAK COUNTER 🔥 =====
function updateStreak() {
  const today = new Date().toDateString();
  const lastLogin = localStorage.getItem('lastLogin');
  let streak = parseInt(localStorage.getItem('streak') || '0');

  if(lastLogin!== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if(lastLogin === yesterday.toDateString()) {
      streak++;
    } else if(lastLogin) {
      streak = 1;
    } else {
      streak = 1;
    }
    localStorage.setItem('streak', streak);
    localStorage.setItem('lastLogin', today);
  }

  if(document.getElementById('streak')) {
    document.getElementById('streak').textContent = streak;
  }
}

// ===== LOGOUT =====
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
});

// ===== CHECK AUTH =====
if(!localStorage.getItem('currentUser')) {
  window.location.href = 'index.html';
}

// ===== INIT 🚀 =====
createBubbles();
updateCategoryFilter();
updateStreak();
updateStats();
renderCards();

// Load theme
const savedTheme = localStorage.getItem('theme');
if(savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
  document.getElementById('themeToggle').textContent = '☀️';
}