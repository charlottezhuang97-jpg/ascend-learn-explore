(() => {
  const params = new URLSearchParams(window.location.search);
  const courseName = params.get('title') || '昇腾学习课程';
  document.getElementById('courseName').textContent = courseName;
  document.title = `${courseName} · 学习`;
  let selectedMode = 'board';
  const overlay = document.getElementById('modeOverlay');
  const enter = document.getElementById('enterLearning');
  document.querySelectorAll('.mode-option').forEach(button => button.addEventListener('click', () => {
    selectedMode = button.dataset.mode;
    document.querySelectorAll('.mode-option').forEach(item => {
      const active = item === button;
      item.classList.toggle('selected', active);
      item.setAttribute('aria-checked', String(active));
    });
    enter.textContent = selectedMode === 'board' ? '进入白板学习' : '进入视频学习';
  }));
  enter.addEventListener('click', () => {
    overlay.hidden = true;
    if (selectedMode === 'video') document.querySelector('.board-subtitle').textContent = '视频学习模式已就绪；本探索版先展示与视频内容同步的板书和字幕。';
  });

  const tabs = document.querySelectorAll('.companion-tabs button');
  const chat = document.getElementById('chatPanel');
  const notes = document.getElementById('notesPanel');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    const isNotes = tab.dataset.tab === 'notes';
    tabs.forEach(item => item.classList.toggle('active', item === tab));
    chat.hidden = isNotes; notes.hidden = !isNotes;
  }));
  const board = document.getElementById('whiteboard');
  const tip = document.getElementById('selectionTip');
  const addNote = document.getElementById('addNote');
  let held = false;
  let holdTimer;
  board.addEventListener('pointerdown', () => { held = false; holdTimer = window.setTimeout(() => { held = true; }, 520); });
  board.addEventListener('pointerup', event => {
    window.clearTimeout(holdTimer);
    const text = window.getSelection().toString().trim();
    if (!held || !text) return;
    tip.style.left = `${Math.min(event.clientX, window.innerWidth - 170)}px`;
    tip.style.top = `${Math.max(60, event.clientY - 48)}px`;
    tip.hidden = false;
  });
  board.addEventListener('pointerleave', () => window.clearTimeout(holdTimer));
  addNote.addEventListener('click', () => {
    const text = window.getSelection().toString().trim();
    if (!text) return;
    notes.querySelector('.empty-note')?.remove();
    const item = document.createElement('p'); item.className = 'note-item'; item.textContent = text; notes.append(item);
    const count = document.getElementById('noteCount'); count.textContent = String(Number(count.textContent) + 1);
    tip.hidden = true; window.getSelection().removeAllRanges();
  });
  document.getElementById('companionForm').addEventListener('submit', event => { event.preventDefault(); });
})();
