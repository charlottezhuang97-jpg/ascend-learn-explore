(() => {
  const params = new URLSearchParams(window.location.search);
  const courseName = params.get('title') || '昇腾学习课程';
  document.getElementById('courseName').textContent = courseName;
  document.getElementById('lessonTitle').textContent = '昇腾处理器的逻辑结构拆解';
  document.getElementById('videoLessonTitle').textContent = '昇腾处理器的逻辑结构拆解';
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
    setView(selectedMode);
  });

  const boardRoom = document.getElementById('learningRoom');
  const videoRoom = document.getElementById('videoWorkspace');
  function setView(view) {
    const video = view === 'video';
    boardRoom.hidden = video;
    videoRoom.hidden = !video;
    document.querySelectorAll('.learning-mode-tabs button').forEach(button => button.classList.toggle('active', button.dataset.view === view));
  }
  document.querySelectorAll('.learning-mode-tabs button').forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));

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

  const resourceCopy = {
    examples: ['代码全览', '按视频章节查看本节的环境检查、设备初始化与版本确认代码。'],
    errors: ['常见错误码', '聚合 ACL 初始化失败、设备不可见与版本不匹配等高频问题。'],
    quiz: ['随堂测试', '完成 3 道题，检查是否理解运行时初始化和设备选择。'],
    docs: ['相关文档', '查看 CANN 运行时、ACL API 与环境检查的官方文档。']
  };
  const resourceContent = document.getElementById('videoResourceContent');
  document.querySelectorAll('.video-resource-tabs button').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.video-resource-tabs button').forEach(item => item.classList.toggle('active', item === button));
    const [title, content] = resourceCopy[button.dataset.resource];
    resourceContent.replaceChildren(Object.assign(document.createElement('strong'), { textContent: title }), Object.assign(document.createElement('p'), { textContent: content }));
  }));
  const editor = document.getElementById('ideEditor');
  document.querySelectorAll('.video-code-card').forEach(card => card.addEventListener('click', event => {
    const action = event.target.dataset.action;
    if (!action) {
      document.querySelectorAll('.video-code-card').forEach(item => item.classList.toggle('selected', item === card));
      document.querySelector('.video-meta span').textContent = `${card.querySelector('span').textContent} / 18:40`;
      return;
    }
    const code = card.dataset.code;
    if (action === 'explain') card.querySelector('.code-explanation').hidden = !card.querySelector('.code-explanation').hidden;
    if (action === 'insert') { editor.value = `${editor.value.trim()}\n\n# 来自视频 ${card.querySelector('span').textContent}\n${code}\n`; editor.focus(); }
    if (action === 'copy') { navigator.clipboard?.writeText(code); event.target.textContent = '已复制'; window.setTimeout(() => { event.target.textContent = '复制'; }, 1000); }
  }));
  document.getElementById('ideCollapse').addEventListener('click', event => {
    videoRoom.classList.toggle('ide-collapsed');
    event.currentTarget.setAttribute('aria-expanded', String(!videoRoom.classList.contains('ide-collapsed')));
    event.currentTarget.textContent = videoRoom.classList.contains('ide-collapsed') ? '展开 IDE ‹' : '收起 IDE ›';
  });

  const videoDock = document.getElementById('videoDock');
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const paneWidth = name => {
    const raw = getComputedStyle(videoRoom).getPropertyValue(name).trim();
    return raw.endsWith('%') ? parseFloat(raw) / 100 * videoDock.clientWidth : parseFloat(raw);
  };
  function resizePane(kind, clientX) {
    const bounds = videoDock.getBoundingClientRect();
    const minVideo = 320;
    const minCode = 250;
    const minIde = 360;
    if (kind === 'video') {
      const maxVideo = bounds.width - paneWidth('--code-width') - minIde - 16;
      const width = clamp(clientX - bounds.left, minVideo, maxVideo);
      videoRoom.style.setProperty('--video-width', `${width}px`);
    } else {
      const videoWidth = videoDock.querySelector('.video-column').getBoundingClientRect().width;
      const maxCode = bounds.width - videoWidth - minIde - 16;
      const width = clamp(clientX - bounds.left - videoWidth - 8, minCode, maxCode);
      videoRoom.style.setProperty('--code-width', `${width}px`);
    }
  }
  document.querySelectorAll('.dock-resizer').forEach(resizer => {
    resizer.addEventListener('pointerdown', event => {
      if (videoRoom.classList.contains('ide-collapsed') && resizer.dataset.resize === 'code') {
        document.getElementById('ideCollapse').click();
        return;
      }
      resizer.classList.add('dragging');
      resizer.setPointerCapture(event.pointerId);
    });
    resizer.addEventListener('pointermove', event => {
      if (!resizer.classList.contains('dragging')) return;
      resizePane(resizer.dataset.resize, event.clientX);
    });
    const stopResize = event => {
      resizer.classList.remove('dragging');
      if (resizer.hasPointerCapture?.(event.pointerId)) resizer.releasePointerCapture(event.pointerId);
    };
    resizer.addEventListener('pointerup', stopResize);
    resizer.addEventListener('pointercancel', stopResize);
    resizer.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const step = event.shiftKey ? 40 : 16;
      const direction = event.key === 'ArrowLeft' ? -1 : 1;
      const bounds = resizer.getBoundingClientRect();
      resizePane(resizer.dataset.resize, bounds.left + direction * step);
    });
  });
})();
