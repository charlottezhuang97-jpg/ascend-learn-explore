(() => {
  const params = new URLSearchParams(window.location.search);
  const isTrainingCourse = params.get('course') === 'training';
  const courseName = params.get('title') || (isTrainingCourse ? '大模型分布式训练' : '昇腾学习课程');
  document.getElementById('courseName').textContent = courseName;
  document.getElementById('lessonTitle').textContent = '昇腾处理器的逻辑结构拆解';
  document.getElementById('videoLessonTitle').textContent = '昇腾处理器的逻辑结构拆解';
  document.title = `${courseName} · 学习`;
  if (isTrainingCourse) {
    document.getElementById('lessonTitle').textContent = '数据并行与梯度同步';
    document.getElementById('videoLessonTitle').textContent = '数据并行与梯度同步';
    document.getElementById('boardHeading').textContent = '数据并行：同一模型，拆分不同批次';
    document.getElementById('boardDescription').textContent = '每张 NPU 保留一份完整模型，各自计算局部梯度，再通过 AllReduce 得到一致更新。';
    document.getElementById('boardSubtitle').textContent = '这一节先跟踪一个批次从拆分、局部反向传播到全局梯度同步的完整过程。';
    const points = ['将一个 mini-batch 均匀拆分到 NPU 0–3','各设备独立完成前向与反向传播','AllReduce 汇总并平均所有局部梯度','每张设备使用相同全局梯度更新参数'];
    document.querySelectorAll('.board-points li').forEach((item, index) => { item.textContent = points[index]; });
    const anchor = document.querySelector('.learning-anchor span');
    anchor.lastChild.textContent = '板书 02 · 数据并行';
    const videoLink = document.getElementById('boardToVideo');
    videoLink.dataset.time = '06:20'; videoLink.lastChild.textContent = '对应视频 06:20–09:40';
    document.getElementById('openDocument').lastChild.textContent = '分布式并行指南 §3.2';
    document.querySelector('#chatPanel .companion-label').textContent = '✎ 数据并行';
    document.querySelectorAll('#chatPanel>p')[1].textContent = '这节课会沿着一个训练批次，观察四张 NPU 如何独立计算局部梯度，再通过 AllReduce 保持模型参数一致。';
    document.querySelectorAll('#chatPanel>p')[2].textContent = '你可以切换图解、GIF 动态演示和思维导图；每种形式都定位到视频 06:20–09:40 和分布式并行指南 §3.2。';
  }
  const typingTargets = ['boardHeading', 'boardDescription', 'boardSubtitle'].map(id => document.getElementById(id));
  const typingTexts = typingTargets.map(target => target.textContent);
  typingTargets.forEach((target, index) => {
    target.dataset.fullText = typingTexts[index];
    target.setAttribute('aria-label', typingTexts[index]);
    target.textContent = '';
  });
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typingTargets.forEach((target, index) => { target.textContent = typingTexts[index]; });
    document.querySelector('[data-board-page="1"]').classList.add('media-ready');
  } else {
    (async () => {
      for (let index = 0; index < typingTargets.length; index++) {
        const target = typingTargets[index];
        const chars = Array.from(typingTexts[index]);
        target.classList.add('typing');
        for (const char of chars) {
          target.textContent += char;
          await new Promise(resolve => window.setTimeout(resolve, 42));
        }
        target.classList.remove('typing');
        if (index === 1) document.querySelector('[data-board-page="1"]').classList.add('media-ready');
        await new Promise(resolve => window.setTimeout(resolve, 260));
      }
    })();
  }
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
  const timelineCurrentTime = document.getElementById('timelineCurrentTime');
  const backToTeacher = document.getElementById('backToTeacher');
  const ideMiniVideo = document.getElementById('ideMiniVideo');
  const miniVideoTime = document.getElementById('miniVideoTime');
  const fileVideoJump = document.getElementById('fileVideoJump');
  const videoIde = document.getElementById('videoIde');
  const miniVideoDragHandle = document.getElementById('miniVideoDragHandle');
  const ideAssistPanel = document.getElementById('ideAssistPanel');
  const openIdeAssist = document.getElementById('openIdeAssist');
  const ideEditor = document.getElementById('ideEditor');
  const ideGutter = document.getElementById('ideGutter');
  const ideLineHighlight = document.getElementById('ideLineHighlight');
  const ideFileContents = {
    'data_parallel.py': `# 节点 1｜把 mini-batch 分给不同的 NPU
import os
import torch
import torch.distributed as dist
from torch.utils.data import DataLoader, DistributedSampler

def make_loader(dataset, batch_size=32):
    rank = int(os.environ.get('RANK', '0'))
    world_size = int(os.environ.get('WORLD_SIZE', '4'))
    dist.init_process_group(backend='hccl')
    torch.npu.set_device(rank)

    # 每张 NPU 只读取自己的那份数据
    sampler = DistributedSampler(
        dataset, num_replicas=world_size, rank=rank,
        shuffle=True)
    loader = DataLoader(dataset, batch_size=batch_size,
                        sampler=sampler, drop_last=True)
    return loader, sampler

# 训练时记得在每个 epoch 调用 sampler.set_epoch(epoch)`,
    'gradient_sync.py': `# 节点 2｜聚合各设备算出的局部梯度
import torch
import torch.distributed as dist

def train_one_step(model, batch, optimizer):
    inputs, targets = batch
    inputs = inputs.npu(non_blocking=True)
    targets = targets.npu(non_blocking=True)

    optimizer.zero_grad(set_to_none=True)
    predictions = model(inputs)
    loss = torch.nn.functional.cross_entropy(
        predictions, targets)
    loss.backward()  # 每张 NPU 先得到局部梯度

    # AllReduce 求和，再按设备数取平均
    for parameter in model.parameters():
        if parameter.grad is not None:
            dist.all_reduce(parameter.grad,
                            op=dist.ReduceOp.SUM)
            parameter.grad /= dist.get_world_size()

    optimizer.step()  # 各设备执行相同的参数更新
    return float(loss.detach())`,
    'check_env.py': `# 实践节点｜检查 CANN 环境与可用设备
import acl

def check_runtime():
    ret = acl.init()
    assert ret == 0, 'ACL 初始化失败'

    count, ret = acl.rt.get_device_count()
    assert ret == 0, '无法读取设备数量'
    print(f'发现 {count} 个可用 NPU')

    if count > 0:
        ret = acl.rt.set_device(0)
        assert ret == 0, '设备 0 初始化失败'
        print('设备 0 已就绪')

    return count

if __name__ == '__main__':
    check_runtime()`,
    'README.md': `# 数据并行与梯度同步

本节演示两个视频节点对应的代码：

1. data_parallel.py：按 rank 拆分 mini-batch。
2. gradient_sync.py：对局部梯度执行 AllReduce。

练习时先理解拆分，再观察同步前后的梯度。`
  };
  const videoCodeNodes = {
    '03:20': {file: 'data_parallel.py', line: 14, topic: '数据并行：按 rank 拆分批次', subtitle: '每张 NPU 只读取自己的数据切片；重点看 DistributedSampler 如何按 rank 拆分。'},
    '05:05': {file: 'gradient_sync.py', line: 19, topic: '梯度同步：执行 AllReduce', subtitle: '每张 NPU 先算出局部梯度，再用 AllReduce 汇总并平均。'},
    '08:24': {file: 'check_env.py', line: 8, topic: 'IDE 实践：确认可用 NPU', subtitle: '进入实践前，先检查 CANN 运行环境与可用 NPU。'}
  };
  let currentIdeFile = 'data_parallel.py';
  let currentHighlightedLine = 14;
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
    if (video) setVideoPerspective('teacher');
    document.querySelectorAll('.learning-mode-tabs button').forEach(button => button.classList.toggle('active', button.dataset.view === view));
  }
  function setVideoPerspective(perspective) {
    const teacher = perspective === 'teacher';
    videoRoom.classList.toggle('teacher-mode', teacher);
    videoRoom.classList.toggle('ide-mode', !teacher);
    backToTeacher.hidden = teacher;
    ideMiniVideo.hidden = teacher;
    if (teacher) setIdeAssistOpen(false, false);
  }
  document.getElementById('enterIdePractice').addEventListener('click', () => {
    setVideoPerspective('ide');
    if (timelineCurrentTime.textContent === '00:00') seekVideo('03:20');
    ideEditor.focus();
  });
  document.getElementById('enterIdeFromBackdrop').addEventListener('click', () => {
    setVideoPerspective('ide');
    if (timelineCurrentTime.textContent === '00:00') seekVideo('03:20');
    ideEditor.focus();
  });
  backToTeacher.addEventListener('click', () => {
    setVideoPerspective('teacher');
    document.getElementById('teacherPlay').focus();
  });
  document.getElementById('teacherPlay').addEventListener('click', () => {
    showToast('当前使用封面图示意；接入课程视频后即可播放');
  });
  document.getElementById('miniVideoPlay').addEventListener('click', () => {
    showToast('当前使用封面图示意；接入课程视频后即可播放');
  });
  document.getElementById('closeMiniVideo').addEventListener('click', () => {
    ideMiniVideo.hidden = true;
    fileVideoJump.focus();
  });
  fileVideoJump.addEventListener('click', () => {
    seekVideo('08:24');
    ideMiniVideo.hidden = false;
    document.getElementById('closeMiniVideo').focus();
  });
  function clampMiniVideoPosition(left, top) {
    const parentRect = videoIde.getBoundingClientRect();
    const videoRect = ideMiniVideo.getBoundingClientRect();
    const minLeft = 8;
    const minTop = 62;
    const reservedRight = ideAssistPanel.hidden ? 8 : ideAssistPanel.offsetWidth + 8;
    return {
      left: Math.max(minLeft, Math.min(left, parentRect.width - videoRect.width - reservedRight)),
      top: Math.max(minTop, Math.min(top, parentRect.height - videoRect.height - 36))
    };
  }
  function moveMiniVideo(left, top) {
    const next = clampMiniVideoPosition(left, top);
    ideMiniVideo.style.left = `${next.left}px`;
    ideMiniVideo.style.top = `${next.top}px`;
  }
  let miniVideoDrag = null;
  miniVideoDragHandle.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    const parentRect = videoIde.getBoundingClientRect();
    const videoRect = ideMiniVideo.getBoundingClientRect();
    miniVideoDrag = {pointerId:event.pointerId, startX:event.clientX, startY:event.clientY, left:videoRect.left-parentRect.left, top:videoRect.top-parentRect.top};
    ideMiniVideo.classList.add('is-dragging');
    miniVideoDragHandle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  miniVideoDragHandle.addEventListener('pointermove', event => {
    if (!miniVideoDrag || miniVideoDrag.pointerId !== event.pointerId) return;
    moveMiniVideo(miniVideoDrag.left + event.clientX - miniVideoDrag.startX, miniVideoDrag.top + event.clientY - miniVideoDrag.startY);
  });
  function stopMiniVideoDrag(event) {
    if (!miniVideoDrag || miniVideoDrag.pointerId !== event.pointerId) return;
    miniVideoDrag = null;
    ideMiniVideo.classList.remove('is-dragging');
    if (miniVideoDragHandle.hasPointerCapture?.(event.pointerId)) miniVideoDragHandle.releasePointerCapture(event.pointerId);
  }
  miniVideoDragHandle.addEventListener('pointerup', stopMiniVideoDrag);
  miniVideoDragHandle.addEventListener('pointercancel', stopMiniVideoDrag);
  miniVideoDragHandle.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') {
      moveMiniVideo(57, 77);
      showToast('悬浮视频已回到默认位置');
      return;
    }
    const step = event.shiftKey ? 32 : 12;
    const left = parseFloat(ideMiniVideo.style.left) || ideMiniVideo.offsetLeft;
    const top = parseFloat(ideMiniVideo.style.top) || ideMiniVideo.offsetTop;
    moveMiniVideo(left + (event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0), top + (event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0));
  });
  window.addEventListener('resize', () => {
    if (!ideMiniVideo.hidden && ideMiniVideo.style.left) moveMiniVideo(parseFloat(ideMiniVideo.style.left), parseFloat(ideMiniVideo.style.top));
  });
  function setIdeAssistOpen(open, returnFocus = true) {
    ideAssistPanel.hidden = !open;
    openIdeAssist.setAttribute('aria-expanded', String(open));
    if (open) {
      if (!ideMiniVideo.hidden) moveMiniVideo(parseFloat(ideMiniVideo.style.left) || ideMiniVideo.offsetLeft, parseFloat(ideMiniVideo.style.top) || ideMiniVideo.offsetTop);
      document.querySelector('[data-ide-assist-tab="ai"]')?.focus();
    }
    else if (returnFocus) openIdeAssist.focus();
  }
  openIdeAssist.addEventListener('click', () => setIdeAssistOpen(ideAssistPanel.hidden));
  document.getElementById('closeIdeAssist').addEventListener('click', () => setIdeAssistOpen(false));
  document.querySelectorAll('[data-ide-assist-tab]').forEach(button => button.addEventListener('click', () => {
    const ai = button.dataset.ideAssistTab === 'ai';
    document.getElementById('ideAssistAi').hidden = !ai;
    document.getElementById('ideAssistResources').hidden = ai;
    document.querySelectorAll('[data-ide-assist-tab]').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
  }));
  function askIdeCompanion(question) {
    const messages = document.getElementById('ideAssistMessages');
    messages.insertAdjacentHTML('beforeend', `<div class="ide-assist-message user"><span>你</span><p>${question.replace(/[<>&]/g, character => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[character]))}</p></div><div class="ide-assist-message assistant"><span>AI 学伴</span><p>结合当前视频节点来看：数据拆分决定每张 NPU 处理哪些样本，AllReduce 则保证各设备最终使用同一份平均梯度更新模型。你可以切换 03:20 和 05:05，对照代码中的高亮行理解两者的衔接。</p></div>`);
    messages.scrollTop = messages.scrollHeight;
  }
  document.querySelectorAll('[data-assist-question]').forEach(button => button.addEventListener('click', () => askIdeCompanion(button.dataset.assistQuestion)));
  document.getElementById('ideAssistForm').addEventListener('submit', event => {
    event.preventDefault();
    const input = document.getElementById('ideAssistInput');
    const question = input.value.trim();
    if (!question) return;
    askIdeCompanion(question);
    input.value = '';
  });
  document.querySelectorAll('[data-assist-resource]').forEach(button => button.addEventListener('click', () => {
    const resourceMap = {code:'examples', errors:'errors', quiz:'quiz', docs:'docs'};
    const resourceButton = document.querySelector(`[data-resource="${resourceMap[button.dataset.assistResource]}"]`);
    resourceButton?.click();
    showToast(`已打开${button.querySelector('strong').textContent}`);
  }));
  if (isTrainingCourse) {
    overlay.hidden = true;
    setView('video');
  }
  function seekVideo(time) {
    const keepIdePerspective = videoRoom.classList.contains('ide-mode') && !videoRoom.hidden;
    setView('video');
    if (keepIdePerspective) setVideoPerspective('ide');
    const [minutes, seconds] = time.split(':').map(Number);
    const percent = Math.min(100, ((minutes * 60 + seconds) / 1120) * 100);
    videoCurrentTime.textContent = `${time} / 18:40`;
    timelineCurrentTime.textContent = time;
    miniVideoTime.textContent = time;
    videoPlayed.style.width = `${percent}%`;
    const node = videoCodeNodes[time];
    if (node) {
      openIdeFile(node.file, node.line);
      document.getElementById('ideLiveSubtitle').textContent = node.subtitle;
      document.querySelector('.mini-video-caption span:last-child').textContent = node.subtitle;
      document.getElementById('ideAssistTime').textContent = time;
      document.getElementById('ideAssistTopic').textContent = node.topic;
      document.getElementById('ideAssistFile').textContent = `${node.file} · 第 ${node.line} 行`;
    }
    document.querySelectorAll('.timeline-marker').forEach(marker => {
      const active = marker.dataset.seek === time;
      marker.classList.toggle('is-current', active);
      marker.setAttribute('aria-current', active ? 'true' : 'false');
    });
    document.getElementById('codePanelTime').textContent = time;
    document.querySelector('.code-panel-lead').textContent = `已从板书 01 定位到 ${time}；可继续查看对应代码和文档。`;
    referenceDrawer.classList.remove('open');
    referenceDrawer.setAttribute('aria-hidden', 'true');
    showToast(`已定位到视频 ${time}，板书位置已保留`);
  }
  document.querySelectorAll('.learning-mode-tabs button').forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
  document.getElementById('boardToVideo').addEventListener('click', event => seekVideo(event.currentTarget.dataset.time));
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
  const outlinePanel = document.getElementById('lessonOutline');
  const outlineToggle = document.getElementById('toggleLessonOutline');
  function setOutlineOpen(open) {
    outlinePanel.hidden = !open;
    outlinePanel.setAttribute('aria-hidden', String(!open));
    outlineToggle.setAttribute('aria-expanded', String(open));
    if (open) document.getElementById('closeLessonOutline').focus();
    else outlineToggle.focus();
  }
  outlineToggle.addEventListener('click', () => setOutlineOpen(outlinePanel.hidden));
  document.getElementById('closeLessonOutline').addEventListener('click', () => setOutlineOpen(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !outlinePanel.hidden) setOutlineOpen(false);
  });
  document.querySelectorAll('[data-seek]').forEach(button => button.addEventListener('click', () => seekVideo(button.dataset.seek)));

  const boardPages = [...document.querySelectorAll('[data-board-page]')];
  const boardPageValue = document.getElementById('boardPageValue');
  const previousBoardPage = document.getElementById('previousBoardPage');
  const nextBoardPage = document.getElementById('nextBoardPage');
  const boardPageContent = [
    {anchor:'板书 01 · 数据并行结构',time:'06:20',range:'对应视频 06:20–07:35',document:'分布式并行指南 §3.2',caption:'先看数据如何被拆分：同一模型保留在每张 NPU 上，每张设备只接收不同的数据切片。'},
    {anchor:'板书 02 · 梯度同步',time:'07:36',range:'对应视频 07:36–09:40',document:'集合通信指南 §4.1',caption:'局部梯度不能直接更新模型；AllReduce 先完成聚合和平均，再让每张设备执行一致更新。'},
    {anchor:'板书 03 · 知识总结',time:'09:41',range:'对应视频 09:41–11:10',document:'分布式训练总览 §1.4',caption:'把数据并行放回完整知识结构：下一步继续学习通信开销、计算通信重叠和训练稳定性。'},
    {anchor:'板书 04 · 计算通信重叠',time:'11:11',range:'对应视频 11:11–14:25',document:'性能调优指南 §5.3',caption:'反向计算与梯度同步可以交错执行，减少设备等待通信完成的空档。'},
    {anchor:'板书 05 · 训练验收',time:'14:26',range:'对应视频 14:26–18:40',document:'训练验收清单 §2.1',caption:'用正确性、性能、稳定性和可复现性四类证据，判断一次分布式训练是否完成。'}
  ];
  let currentBoardPage = 0;
  async function typeSupportingPage(page) {
    if (page.dataset.typed === 'true') return;
    page.dataset.typed = 'true';
    const targets = [...page.querySelectorAll('.board-page-intro h2,.board-page-intro p')];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      page.classList.add('media-ready');
      return;
    }
    for (const target of targets) {
      const fullText = target.textContent;
      target.setAttribute('aria-label', fullText);
      target.textContent = '';
      target.classList.add('typing');
      for (const char of Array.from(fullText)) {
        target.textContent += char;
        await new Promise(resolve => window.setTimeout(resolve, 24));
      }
      target.classList.remove('typing');
      await new Promise(resolve => window.setTimeout(resolve, 160));
    }
    page.classList.add('media-ready');
  }
  function renderBoardPage(index, announce = true) {
    currentBoardPage = Math.max(0, Math.min(boardPages.length - 1, index));
    boardPages.forEach((page, pageIndex) => { page.hidden = pageIndex !== currentBoardPage; });
    const content = boardPageContent[currentBoardPage];
    boardPageValue.textContent = `${currentBoardPage + 1} / ${boardPages.length}`;
    previousBoardPage.disabled = currentBoardPage === 0;
    nextBoardPage.disabled = currentBoardPage === boardPages.length - 1;
    document.querySelector('.learning-anchor span').lastChild.textContent = content.anchor;
    document.getElementById('boardToVideo').dataset.time = content.time;
    document.getElementById('boardToVideo').lastChild.textContent = content.range;
    document.getElementById('openDocument').lastChild.textContent = content.document;
    document.getElementById('boardSubtitle').textContent = content.caption;
    document.querySelectorAll('[data-board-jump]').forEach(button => {
      const active = Number(button.dataset.boardJump) === currentBoardPage;
      button.classList.toggle('active', active);
      button.setAttribute('aria-current', active ? 'step' : 'false');
    });
    if (currentBoardPage > 0) typeSupportingPage(boardPages[currentBoardPage]);
    if (announce) showToast(`已翻到板书第 ${currentBoardPage + 1} 页`);
  }
  previousBoardPage.addEventListener('click', () => renderBoardPage(currentBoardPage - 1));
  nextBoardPage.addEventListener('click', () => renderBoardPage(currentBoardPage + 1));
  renderBoardPage(0, false);
  const motionToggle = document.getElementById('toggleGradientMotion');
  motionToggle.addEventListener('click', () => {
    const demo = document.getElementById('gradientDemo');
    const paused = demo.classList.toggle('paused');
    motionToggle.textContent = paused ? '继续播放' : '暂停';
  });

  const tabs = document.querySelectorAll('.companion-tabs button');
  const chat = document.getElementById('chatPanel');
  const notes = document.getElementById('notesPanel');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    tabs.forEach(item => item.classList.toggle('active', item === tab));
    chat.hidden = target !== 'chat';
    notes.hidden = target !== 'notes';
  }));
  document.querySelectorAll('[data-board-jump]').forEach(button => button.addEventListener('click', () => {
    setView('board');
    renderBoardPage(Number(button.dataset.boardJump));
    setOutlineOpen(false);
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
  const editor = ideEditor;
  function updateCodeGutter() {
    ideGutter.innerHTML = ideEditor.value.split('\n').map((_, index) => `<span>${index + 1}</span>`).join('');
  }
  function updateLineHighlight() {
    const computed = getComputedStyle(ideEditor);
    const lineHeight = parseFloat(computed.lineHeight) || 22.1;
    const topPadding = parseFloat(computed.paddingTop) || 16;
    ideLineHighlight.style.top = `${topPadding + (currentHighlightedLine - 1) * lineHeight - ideEditor.scrollTop}px`;
    ideLineHighlight.style.height = `${lineHeight}px`;
    ideLineHighlight.hidden = currentHighlightedLine < 1 || currentHighlightedLine > ideEditor.value.split('\n').length;
  }
  function openIdeFile(file, line = 0) {
    if (currentIdeFile !== file) ideFileContents[currentIdeFile] = ideEditor.value;
    currentIdeFile = file;
    ideEditor.value = ideFileContents[file];
    currentHighlightedLine = line;
    ideEditor.scrollTop = 0;
    document.querySelectorAll('[data-ide-file]').forEach(button => {
      const active = button.dataset.ideFile === file;
      button.classList.toggle('active', active);
      if (button.getAttribute('role') === 'tab') button.setAttribute('aria-selected', String(active));
    });
    ideEditor.setAttribute('aria-label', `${file} 代码编辑器`);
    updateCodeGutter();
    updateLineHighlight();
    if (line) {
      const lineHeight = parseFloat(getComputedStyle(ideEditor).lineHeight) || 22.1;
      const lineTop = (line - 1) * lineHeight;
      if (lineTop > ideEditor.clientHeight - lineHeight * 3) ideEditor.scrollTop = Math.max(0, lineTop - ideEditor.clientHeight / 2);
      updateLineHighlight();
    }
  }
  document.querySelectorAll('[data-ide-file]').forEach(button => button.addEventListener('click', () => {
    openIdeFile(button.dataset.ideFile);
    ideEditor.focus();
  }));
  ideEditor.addEventListener('input', () => {
    ideFileContents[currentIdeFile] = ideEditor.value;
    updateCodeGutter();
    updateLineHighlight();
  });
  ideEditor.addEventListener('scroll', () => {
    ideGutter.scrollTop = ideEditor.scrollTop;
    updateLineHighlight();
  });
  openIdeFile('data_parallel.py', 14);
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
    openIdeFile('check_env.py');
    if (!editor.value.includes('CopyOut')) editor.value = `${editor.value.trim()}\n\n# 结果写回\nCopyOut()\n`;
    updateCodeGutter();
    updateLineHighlight();
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
  document.getElementById('runCode').addEventListener('click', () => {
    if (currentIdeFile !== 'check_env.py') {
      ideOutput.innerHTML = `<b>问题　输出　调试控制台　终端</b><div class="ide-success" role="status"><div><strong>课堂示例 · ${currentIdeFile}</strong><span>这是视频讲解用的示例代码；请选择 check_env.py 完成环境检查实践。</span></div></div>`;
      return;
    }
    fixApplied ? showRunSuccess() : showIdeError();
  });
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
    openIdeFile('check_env.py');
    previousCode = editor.value;
    if (editor.value.includes('CopyOut()')) editor.value = editor.value.replace('CopyOut()', 'CopyOut(output, result_length)');
    else editor.value = `${editor.value.trim()}\n\n# AI 建议：补充结果写回长度\nCopyOut(output, result_length)\n`;
    updateCodeGutter();
    updateLineHighlight();
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
  const videoDock = document.getElementById('videoDock');
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const workspaceLayoutKey = 'ascend-video-workbench-layout-v2';
  const workspaceWidthKey = 'ascend-video-workbench-video-width-v2';
  const defaultPanelLayout = { code: 'left', resources: 'right', task: 'right' };
  const dockZoneContent = zone => videoDock.querySelector(`[data-dock-zone="${zone}"] .dock-zone-content`);
  const currentPanelZone = panel => panel.closest('[data-dock-zone]')?.dataset.dockZone;
  function savePanelLayout() {
    const layout = {};
    videoDock.querySelectorAll('[data-panel-id]').forEach(panel => { layout[panel.dataset.panelId] = currentPanelZone(panel); });
    window.localStorage.setItem(workspaceLayoutKey, JSON.stringify(layout));
  }
  function updatePanelMoveAction(panel) {
    const current = currentPanelZone(panel);
    const target = current === 'left' ? 'right' : 'left';
    const button = panel.querySelector('[data-move-panel]');
    const name = panel.querySelector('.tool-panel-head strong')?.textContent || '面板';
    button.textContent = `移到${target === 'left' ? '左侧' : '右侧'}`;
    button.setAttribute('aria-label', `将${name}移到${target === 'left' ? '左侧' : '右侧'}辅助区`);
  }
  function movePanel(panel, zone, announce = true) {
    const target = dockZoneContent(zone);
    if (!panel || !target || currentPanelZone(panel) === zone) return;
    target.append(panel);
    updatePanelMoveAction(panel);
    savePanelLayout();
    if (announce) showToast(`${panel.querySelector('.tool-panel-head strong')?.textContent || '面板'}已移到${zone === 'left' ? '左侧' : '右侧'}辅助区`);
  }
  function restorePanelLayout(layout = defaultPanelLayout) {
    Object.entries({ ...defaultPanelLayout, ...layout }).forEach(([id, zone]) => {
      const panel = videoDock.querySelector(`[data-panel-id="${id}"]`);
      if (!panel) return;
      const target = zone === 'left' ? 'left' : 'right';
      dockZoneContent(target)?.append(panel);
      updatePanelMoveAction(panel);
    });
  }
  try {
    restorePanelLayout(JSON.parse(window.localStorage.getItem(workspaceLayoutKey) || '{}'));
  } catch {
    restorePanelLayout();
  }
  videoDock.querySelectorAll('[data-move-panel]').forEach(button => button.addEventListener('click', event => {
    event.stopPropagation();
    const panel = button.closest('[data-panel-id]');
    movePanel(panel, currentPanelZone(panel) === 'left' ? 'right' : 'left');
  }));
  videoDock.querySelectorAll('[data-drag-handle]').forEach(handle => {
    handle.addEventListener('dragstart', event => {
      if (event.target.closest('button')) { event.preventDefault(); return; }
      const panel = handle.closest('[data-panel-id]');
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', panel.dataset.panelId);
      panel.classList.add('dragging-panel');
    });
    handle.addEventListener('dragend', () => {
      handle.closest('[data-panel-id]').classList.remove('dragging-panel');
      videoDock.querySelectorAll('[data-dock-zone]').forEach(zone => zone.classList.remove('drag-over'));
    });
  });
  videoDock.querySelectorAll('[data-dock-zone]').forEach(zone => {
    zone.addEventListener('dragover', event => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', event => { if (!zone.contains(event.relatedTarget)) zone.classList.remove('drag-over'); });
    zone.addEventListener('drop', event => {
      event.preventDefault();
      zone.classList.remove('drag-over');
      movePanel(videoDock.querySelector(`[data-panel-id="${event.dataTransfer.getData('text/plain')}"]`), zone.dataset.dockZone);
    });
  });

  function resizeVideoPane(clientX, persist = true) {
    const bounds = videoDock.getBoundingClientRect();
    const width = clamp(clientX - bounds.left, 340, Math.max(340, bounds.width - 568));
    videoRoom.style.setProperty('--video-width', `${width}px`);
    if (persist) window.localStorage.setItem(workspaceWidthKey, String(width));
  }
  const savedVideoWidth = Number(window.localStorage.getItem(workspaceWidthKey));
  if (savedVideoWidth > 0 && window.innerWidth > 920) resizeVideoPane(videoDock.getBoundingClientRect().left + savedVideoWidth, false);
  videoDock.querySelectorAll('.dock-resizer').forEach(resizer => {
    resizer.addEventListener('pointerdown', event => {
      resizer.classList.add('dragging');
      resizer.setPointerCapture(event.pointerId);
    });
    resizer.addEventListener('pointermove', event => {
      if (!resizer.classList.contains('dragging')) return;
      resizeVideoPane(event.clientX);
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
      const videoWidth = videoDock.querySelector('.video-column').getBoundingClientRect().width;
      resizeVideoPane(videoDock.getBoundingClientRect().left + videoWidth + direction * step);
    });
  });
  document.getElementById('resetWorkspaceLayout').addEventListener('click', () => {
    restorePanelLayout(defaultPanelLayout);
    videoRoom.style.removeProperty('--video-width');
    window.localStorage.removeItem(workspaceLayoutKey);
    window.localStorage.removeItem(workspaceWidthKey);
    showToast('已恢复默认布局');
  });
  document.getElementById('openWorkspaceCompanion').addEventListener('click', () => {
    setVideoPerspective('ide');
    setIdeAssistOpen(true);
    document.querySelector('[data-ide-assist-tab="ai"]')?.click();
    showToast('AI 学伴已在 IDE 右侧展开');
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (!ideAssistPanel.hidden) setIdeAssistOpen(false);
    else if (aiFixPanel.classList.contains('open')) closeFixPanel();
    else if (referenceDrawer.classList.contains('open')) {
      referenceDrawer.classList.remove('open');
      referenceDrawer.setAttribute('aria-hidden', 'true');
      document.getElementById('openDocument').focus();
    } else if (!aiFixNudge.hidden) aiFixNudge.hidden = true;
  });
})();
