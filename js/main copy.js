/* ══════════════════════════════════
   main.js — The Archive / 謎解き
   ══════════════════════════════════ */

// ─────────────────────
// 問題の定義
// ─────────────────────
const puzzles = {
  1: { type: 'text',   answers: ['20020401'] },
  2: { type: 'select', answers: ['b'] },
  3: { type: 'text',   answers: ['すきよけ', 'すきけよ', 'よすきけ', 'すけよき', 'よきすけ', 'きよすけ'] }
};
const TOTAL = Object.keys(puzzles).length;

// ─────────────────────
// アコーディオン
// ─────────────────────
function toggleAccordion(id) {
  const el = document.getElementById(id);
  el.classList.toggle('open');
  const span = el.querySelector('.accordion-toggle span:first-child');
  const labels = {
    'acc-1': '手がかり画像を表示する',
    'acc-2': 'ノートの挿絵を確認する',
    'acc-3': '日記の最終ページを見る',
  };
  if (el.classList.contains('open')) {
    span.textContent = '▼ 閉じる';
  } else {
    span.textContent = '▶ ' + (labels[id] || '表示する');
  }
}

// ─────────────────────
// 回答チェック
// ─────────────────────
function checkAnswer(num) {
  const puzzle   = puzzles[num];
  const input    = document.getElementById('input-' + num);
  const feedback = document.getElementById('feedback-' + num);
  const card     = document.getElementById('puzzle-' + num);

  const val = puzzle.type === 'text'
    ? input.value.trim().toLowerCase().replace(/\s/g, '')
    : input.value;

  if (!val) {
    feedback.textContent = '— 答えを入力または選択してください';
    feedback.className = 'feedback wrong';
    return;
  }

  const correct = puzzle.answers.some(a => a.toLowerCase() === val);

  if (correct) {
    feedback.textContent = '✓  正解です';
    feedback.className = 'feedback correct';
    card.classList.add('solved');
    input.disabled = true;
    card.querySelector('.submit-btn').disabled = true;

    setTimeout(() => {
      // 正解後テキストを表示
      const cont = document.getElementById('cont-' + num);
      if (cont) {
        cont.style.display = 'block';
        cont.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      // 次ステップへ
      setTimeout(() => unlockNext(num), 600);
    }, 400);

  } else {
    feedback.textContent = '✗  違います。もう一度考えてみてください';
    feedback.className = 'feedback wrong';
    input.style.borderColor = '#8b2c2c';
    setTimeout(() => { input.style.borderColor = ''; }, 800);
  }
}

// ─────────────────────
// 次問題のアンロック
// ─────────────────────
function unlockNext(solvedNum) {
  if (solvedNum < TOTAL) {
    // 次の問題カードを表示
    const nextCard = document.getElementById('puzzle-' + (solvedNum + 1));
    if (nextCard) {
      nextCard.style.display = 'block';
      nextCard.style.animation = 'slideUp 0.55s ease both';
      setTimeout(() => {
        nextCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  } else {
    // 最終問題クリア → エピローグ二択を表示
    setTimeout(() => {
      const choice = document.getElementById('epilogue-choice');
      choice.style.display = 'block';
      choice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 400);
  }
}

// ─────────────────────
// エンド分岐
// ─────────────────────
function showEnd(type) {
  // 二択ボタンを無効化
  const choice = document.getElementById('epilogue-choice');
  choice.querySelectorAll('.choice-btn').forEach(btn => {
    btn.disabled = true;
    btn.style.opacity = '0.4';
    btn.style.cursor = 'not-allowed';
  });

  // 選ばれたエンドを表示
  const endEl = document.getElementById('end-' + type);
  endEl.style.display = 'block';
  setTimeout(() => {
    endEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// ─────────────────────
// Enterキー対応
// ─────────────────────
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const focused = document.activeElement;
  if (focused && focused.classList.contains('answer-input')) {
    checkAnswer(parseInt(focused.id.replace('input-', '')));
  }
});