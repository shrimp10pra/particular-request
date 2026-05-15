// =========================================
// main.js
// =========================================

const puzzles = {

  1: {
    answers: ['20020401']
  },

  2: {
    answers: ['b']
  },

  3: {
    combo: true,
    answer: { a: '息子', b: '両親', c: '騙した' }
  },

  final: {
    answers: ['a', 'b']
  }

};

const TOTAL = 3;

let currentLoaded = 0;

// =========================================
// 初期ロード
// =========================================

window.addEventListener(
  'DOMContentLoaded',
  () => {
    loadNextPuzzle();
  }
);

// =========================================
// 次のメールを読み込む
// =========================================

async function loadNextPuzzle() {

  const nextNum = currentLoaded + 1;

  if (nextNum > TOTAL) {
    return;
  }

  const container = document.getElementById('puzzle-container');

  try {

    const response = await fetch(`puzzle/puzzle${nextNum}.html`);
    const html = await response.text();

    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    container.appendChild(wrapper);

    currentLoaded = nextNum;

    // 少し遅らせてスクロール
    setTimeout(() => {
      wrapper.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 120);

    // 新着演出
    playMailEffect();

  } catch (e) {
    console.error(e);
  }

}

// =========================================
// 回答チェック
// =========================================

function checkAnswer(num) {

  const msgEl   = document.getElementById('msg-' + num);
  const cardEl  = document.getElementById('puzzle-' + num);
  const puzzle  = puzzles[num];

  let isCorrect = false;
  let allInputs = [];

  // =========================
  // combo型（puzzle3など）
  // =========================

  if (puzzle.combo) {

    const aEl = document.getElementById('input-' + num + 'a');
    const bEl = document.getElementById('input-' + num + 'b');
    const cEl = document.getElementById('input-' + num + 'c');

    // 未選択チェック
    if (!aEl.value || !bEl.value || !cEl.value) {
      msgEl.textContent = 'すべての項目を選択してください。';
      msgEl.style.color = '#d46b6b';
      return;
    }

    isCorrect =
      aEl.value === puzzle.answer.a &&
      bEl.value === puzzle.answer.b &&
      cEl.value === puzzle.answer.c;

    allInputs = [aEl, bEl, cEl];

  // =========================
  // 通常型（input / select）
  // =========================

  } else {

    const inputEl = document.getElementById('input-' + num);
    const userInput = inputEl.value.trim().toLowerCase();
    isCorrect = puzzle.answers.includes(userInput);
    allInputs = [inputEl];

  }

  const buttonEl = cardEl.querySelector('.reply-area button');

  // =========================
  // 正解
  // =========================

  if (isCorrect) {

    cardEl.classList.remove('unread');
    cardEl.classList.add('solved');
    cardEl.style.borderColor = '#1e8c4a';

    msgEl.textContent = '新しいメールを受信しました。';
    msgEl.style.color = '#1e8c4a';

    // 無効化
    allInputs.forEach(el => el.disabled = true);
    updateUnreadCount();
    buttonEl.disabled = true;

    // 次へ
    if (num < TOTAL) {
      setTimeout(() => { loadNextPuzzle(); }, 900);
    } else {
      setTimeout(() => { showFinalChoice(); }, 900);
    }

  // =========================
  // 不正解
  // =========================

  } else {

    cardEl.style.borderColor = '#c0392b';

    msgEl.textContent = '送信に失敗しました。';
    msgEl.style.color = '#c0392b';

    shakeElement(cardEl);

  }

}

// =========================================
// FINAL CHOICE
// =========================================

async function showFinalChoice() {

  const container = document.getElementById('puzzle-container');

  try {

    const response = await fetch('end/choice.html');
    const html = await response.text();

    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    container.appendChild(wrapper);

    wrapper.scrollIntoView({ behavior: 'smooth' });

    playMailEffect();

  } catch (e) {
    console.error(e);
  }

}

// =========================================
// エンド分岐
// =========================================

function submitFinalDecision() {

  const selectEl = document.getElementById('final-select');
  const btnEl    = selectEl.closest('.answer-area').querySelector('button');
  const decision = selectEl.value;

  if (!decision) {
    alert('決断を選択してください。');
    return;
  }

  // 連打防止
  selectEl.disabled = true;
  btnEl.disabled    = true;

  showEnd(decision);

}

// =========================================
// エンド表示
// =========================================

async function showEnd(type) {

  const container = document.getElementById('puzzle-container');

  try {

    const response = await fetch(`end/end${type}.html`);
    const html = await response.text();

    const wrapper = document.createElement('div');
    wrapper.className = 'end-result';
    wrapper.innerHTML = html;

    container.appendChild(wrapper);

    wrapper.scrollIntoView({ behavior: 'smooth' });

  } catch (e) {
    console.error(e);
  }

}

// =========================================
// アコーディオン
// =========================================

function toggleAccordion(id) {
  const el = document.getElementById(id);
  el.classList.toggle('open');
}

// =========================================
// メール受信演出
// =========================================

function playMailEffect() {
  document.body.classList.add('mail-arrived');
  setTimeout(() => {
    document.body.classList.remove('mail-arrived');
  }, 500);
}

// =========================================
// シェイク演出
// =========================================

function shakeElement(el) {
  el.animate(
    [
      { transform: 'translateX(0)'  },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(4px)'  },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(0)'  }
    ],
    { duration: 300 }
  );
}

// =========================================
// アンリード件数更新
// =========================================

function updateUnreadCount() {
  const badge = document.getElementById('unread-count');
  if (!badge) return;
  const count = document.querySelectorAll('.mail-card.unread').length;
  badge.textContent = count > 0 ? count : '';
}