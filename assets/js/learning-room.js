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
  const referenceDrawer = document.getElementById('referenceDrawer');
  const videoCurrentTime = document.getElementById('videoCurrentTime');
  const videoPlayed = document.getElementById('videoPlayed');
  const toastNode = document.getElementById('learningToast');
  let toastTimer;
  function showToast(message) {
    toastNode.textContent = message;
    toastNode.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => { toastNode.hidden = true; }, 2400);
  }
  function setView(view) {
    const video = view === 'video';
    boardRoom.hidden = video;
    videoRoom.hidden = !video;
    document.querySelectorAll('.learning-mode-tabs button').forEach(button => button.classList.toggle('active', button.dataset.view === view));
  }
  function seekVideo(time) {
    setView('video');
    const [minutes, seconds] = time.split(':').map(Number);
    const percent = Math.min(100, ((minutes * 60 + seconds) / 1120) * 100);
    videoCurrentTime.textContent = `${time} / 18:40`;
    videoPlayed.style.width = `${percent}%`;
    document.querySelector('.video-code-panel>header span').textContent = time;
    document.querySelector('.code-panel-lead').textContent = `已从板书 01 定位到 ${time}；可继续查看对应代码和文档。`;
    referenceDrawer.classList.remove('open');
    referenceDrawer.setAttribute('aria-hidden', 'true');
    showToast(`已定位到视频 ${time}，板书位置已保留`);
  }
  document.querySelectorAll('.learning-mode-tabs button').forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
  document.getElementById('boardToVideo').addEventListener('click', event => seekVideo(event.currentTarget.dataset.time));
  document.getElementById('returnToBoard').addEventListener('click', () => { setView('board'); showToast('已返回板书 01'); });
  document.getElementById('openDocument').addEventListener('click', () => {
    referenceDrawer.classList.add('open');
    referenceDrawer.setAttribute('aria-hidden', 'false');
    document.getElementById('closeDocument').focus();
  });
  document.getElementById('closeDocument').addEventListener('click', () => {
    referenceDrawer.classList.remove('open');
    referenceDrawer.setAttribute('aria-hidden', 'true');
    document.getElementById('openDocument').focus();
  });
  document.querySelectorAll('[data-seek]').forEach(button => button.addEventListener('click', () => seekVideo(button.dataset.seek)));

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
  function renderResource(type) {
    const [title, content] = resourceCopy[type];
    resourceContent.replaceChildren(Object.assign(document.createElement('strong'), { textContent: title }), Object.assign(document.createElement('p'), { textContent: content }));
    if (type === 'docs') {
      resourceContent.insertAdjacentHTML('beforeend', '<div class="resource-list"><div class="resource-item"><div><b>Ascend C 编程指南 §2.3</b><br><span>数据搬运与结果写回</span></div><button type="button" data-resource-action="board-doc">查看对应板书</button></div><div class="resource-item"><div><b>CopyOut 参数说明</b><br><span>对应视频 05:05</span></div><button type="button" data-resource-action="seek" data-time="05:05">定位视频</button></div></div>');
    }
    if (type === 'errors') {
      resourceContent.insertAdjacentHTML('beforeend', '<div class="resource-list"><div class="resource-item"><div><b>E-DEMO-102</b><br><span>演示：结果写回参数不完整</span></div><button type="button" data-resource-action="fix">查看修复</button></div><div class="resource-item"><div><b>ACL_INIT_FAILED</b><br><span>运行环境初始化失败</span></div><button type="button">查看文档</button></div></div>');
    }
  }
  document.querySelectorAll('.video-resource-tabs button').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.video-resource-tabs button').forEach(item => item.classList.toggle('active', item === button));
    renderResource(button.dataset.resource);
  }));
  const editor = document.getElementById('ideEditor');
  const ideOutput = document.getElementById('ideOutput');
  const aiFixPanel = document.getElementById('aiFixPanel');
  const aiFixNudge = document.getElementById('aiFixNudge');
  let fixApplied = false;
  let previousCode = editor.value;
  function openFixPanel() {
    aiFixPanel.classList.add('open');
    aiFixPanel.setAttribute('aria-hidden', 'false');
    aiFixNudge.hidden = true;
    document.getElementById('closeFixPanel').focus();
  }
  function closeFixPanel(returnFocus = true) {
    aiFixPanel.classList.remove('open');
    aiFixPanel.setAttribute('aria-hidden', 'true');
    if (returnFocus) document.getElementById('runCode').focus();
  }
  function locateError() {
    if (!editor.value.includes('CopyOut')) editor.value = `${editor.value.trim()}\n\n# 结果写回\nCopyOut()\n`;
    const start = editor.value.indexOf('CopyOut');
    editor.focus();
    editor.setSelectionRange(start, start + editor.value.slice(start).split('\n')[0].length);
    showToast('已定位到 CopyOut 调用');
  }
  function showIdeError() {
    ideOutput.innerHTML = '<b>问题　输出　调试控制台　终端</b><div class="ide-error" role="alert" tabindex="-1"><div><span class="status-icon" aria-hidden="true">!</span><div><strong>运行失败 · E-DEMO-102</strong><p>check_env.py 第 8 行：CopyOut 缺少结果长度参数。</p></div></div><footer><button type="button" data-ide-action="locate">定位代码</button><button type="button" data-ide-action="evidence">查看依据</button><button type="button" class="primary" data-ide-action="fix">AI 建议修复</button></footer></div>';
    ideOutput.querySelector('[role="alert"]').focus();
    aiFixNudge.hidden = false;
  }
  function showPendingVerification() {
    ideOutput.innerHTML = '<b>问题　输出　调试控制台　终端</b><div class="ide-success"><div><strong>已应用 AI 建议 · 待验证</strong><span>修改已写入当前文件，请重新运行确认。</span></div><div><button type="button" data-ide-action="undo">撤销</button><button type="button" data-ide-action="rerun">重新运行</button></div></div>';
  }
  function showRunSuccess() {
    ideOutput.innerHTML = '<b>问题　输出　调试控制台　终端</b><div class="ide-success" role="status"><div><strong>运行成功</strong><span>结果已写回，E-DEMO-102 已解除。</span></div></div>';
    showToast('重新运行成功，修复结果已验证');
  }
  document.getElementById('runCode').addEventListener('click', () => fixApplied ? showRunSuccess() : showIdeError());
  ideOutput.addEventListener('click', event => {
    const action = event.target.dataset.ideAction;
    if (action === 'locate') locateError();
    if (action === 'evidence') {
      document.querySelector('[data-resource="docs"]').click();
      seekVideo('05:05');
      showToast('已打开官方文档和对应视频位置');
    }
    if (action === 'fix') openFixPanel();
    if (action === 'rerun') showRunSuccess();
    if (action === 'undo') {
      editor.value = previousCode;
      fixApplied = false;
      showIdeError();
      showToast('已撤销 AI 建议');
    }
  });
  document.getElementById('showFixPanel').addEventListener('click', openFixPanel);
  document.getElementById('dismissFixNudge').addEventListener('click', () => { aiFixNudge.hidden = true; });
  document.getElementById('closeFixPanel').addEventListener('click', () => closeFixPanel());
  document.getElementById('copyFix').addEventListener('click', () => {
    navigator.clipboard?.writeText('CopyOut(output, result_length)');
    showToast('修复代码已复制，当前文件未修改');
  });
  document.getElementById('applyFix').addEventListener('click', () => {
    previousCode = editor.value;
    if (editor.value.includes('CopyOut()')) editor.value = editor.value.replace('CopyOut()', 'CopyOut(output, result_length)');
    else editor.value = `${editor.value.trim()}\n\n# AI 建议：补充结果写回长度\nCopyOut(output, result_length)\n`;
    fixApplied = true;
    closeFixPanel(false);
    showPendingVerification();
    showToast('已应用建议，请重新运行验证');
  });
  document.querySelectorAll('[data-fix-source]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const source = link.dataset.fixSource;
    closeFixPanel(false);
    if (source === 'board') {
      setView('board');
      referenceDrawer.classList.add('open');
      referenceDrawer.setAttribute('aria-hidden', 'false');
    } else {
      seekVideo(source === 'video' ? '05:05' : '04:10');
      document.querySelector('[data-resource="docs"]').click();
    }
  }));
  resourceContent.addEventListener('click', event => {
    const action = event.target.dataset.resourceAction;
    if (action === 'seek') seekVideo(event.target.dataset.time);
    if (action === 'board-doc') {
      setView('board');
      referenceDrawer.classList.add('open');
      referenceDrawer.setAttribute('aria-hidden', 'false');
    }
    if (action === 'fix') openFixPanel();
  });
  document.querySelectorAll('.video-code-card').forEach(card => card.addEventListener('click', event => {
    const action = event.target.dataset.action;
    if (!action) {
      document.querySelectorAll('.video-code-card').forEach(item => item.classList.toggle('selected', item === card));
      seekVideo(card.querySelector('span').textContent);
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
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (aiFixPanel.classList.contains('open')) closeFixPanel();
    else if (referenceDrawer.classList.contains('open')) {
      referenceDrawer.classList.remove('open');
      referenceDrawer.setAttribute('aria-hidden', 'true');
      document.getElementById('openDocument').focus();
    } else if (!aiFixNudge.hidden) aiFixNudge.hidden = true;
  });
})();
