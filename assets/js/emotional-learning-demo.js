(() => {
  if (!location.pathname.endsWith('/learn.html')) return;
  const surface = document.querySelector('.iv-surface');
  const companion = window.AscendCompanion;
  if (!surface || !companion) return;

  const remote = document.createElement('section');
  remote.className = 'emotion-remote';
  remote.setAttribute('aria-label', '学习陪伴情境演示');
  remote.innerHTML = `<button type="button" class="emotion-remote-toggle" aria-expanded="false" aria-controls="emotionRemoteOptions" title="打开情境遥控器"><span class="emotion-remote-icon" aria-hidden="true">▦</span><span class="emotion-remote-caption">情境演示</span><span aria-hidden="true">⌄</span></button><div id="emotionRemoteOptions" class="emotion-remote-options" hidden><p>选择一个学习情境</p><button type="button" data-emotion-scene="question"><b>02</b><span>提出问题，获得下一步</span></button><button type="button" data-emotion-scene="stuck"><b>03</b><span>停留较久，轻声询问</span></button><button type="button" data-emotion-scene="pause"><b>04</b><span>视频暂停，回顾刚才一段</span></button><button type="button" data-emotion-scene="reset" class="emotion-remote-reset">返回普通学习状态</button></div>`;
  document.body.append(remote);

  const nudge = document.createElement('aside');
  nudge.className = 'emotion-nudge';
  nudge.hidden = true;
  nudge.setAttribute('role', 'status');
  nudge.setAttribute('aria-live', 'polite');
  surface.append(nudge);
  const assistantIcon = '<span class="emotion-assistant-icon iv-source iv-logo" aria-hidden="true"></span>';

  const toggle = remote.querySelector('.emotion-remote-toggle');
  const options = remote.querySelector('.emotion-remote-options');
  const setExpanded = expanded => {
    remote.classList.toggle('is-expanded', expanded);
    toggle.setAttribute('aria-expanded', String(expanded));
    options.hidden = !expanded;
  };
  const setSelected = scene => {
    remote.querySelectorAll('[data-emotion-scene]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.emotionScene === scene));
    });
  };
  const locate = time => {
    document.dispatchEvent(new CustomEvent('learning:locate-video', {detail: {time}}));
    const cursor = surface.querySelector('.iv-timeline-cursor');
    const marker = surface.querySelector(`[data-iv-seek="${time}"]`);
    if (cursor && marker) cursor.style.left = marker.style.getPropertyValue('--at');
  };
  const show = scene => {
    setSelected(scene);
    nudge.hidden = true;
    surface.dataset.emotionScene = scene;
    if (scene === 'question') {
      locate('08:24');
      companion.beginIsolatedTool('为什么检查运行环境时要先初始化 ACL？', '<p>先初始化 ACL，运行时才能正确识别设备。接着调用设备检查代码，确认当前环境能看到 NPU。</p><p class="emotion-related">关联讲解 · 08:24 检查运行环境</p><button type="button" class="emotion-chat-action" data-emotion-action="seek">看 08:24 的讲解 →</button>');
    } else if (scene === 'stuck') {
      nudge.innerHTML = `<span class="emotion-nudge-source">${assistantIcon}学习助手</span><p>你目前是卡住了吗？</p><small>如果刚才的知识点不太清楚，我可以陪你回看。</small><div class="emotion-nudge-actions"><button type="button" data-emotion-action="explain">帮我理一下</button><button type="button" data-emotion-action="dismiss">我再看看</button><label><input type="checkbox" data-emotion-suppress>不再提示</label></div>`;
      nudge.hidden = localStorage.getItem('ascend-stuck-nudge-disabled') === '1';
    } else if (scene === 'pause') {
      locate('05:05');
      nudge.innerHTML = `<span class="emotion-nudge-source">${assistantIcon}学习助手 · 视频已暂停</span><p>要我帮你回顾刚才这一段吗？</p><small>05:05 · 同步局部梯度</small><div class="emotion-nudge-actions"><button type="button" data-emotion-action="review">回顾一下</button><button type="button" data-emotion-action="dismiss">继续观看</button><label><input type="checkbox" data-emotion-suppress>不再提示</label></div>`;
      nudge.hidden = localStorage.getItem('ascend-pause-nudge-disabled') === '1';
    } else {
      delete surface.dataset.emotionScene;
    }
    setExpanded(false);
    if (['stuck', 'pause'].includes(scene) && matchMedia('(max-width: 800px)').matches) {
      companion.close();
      setTimeout(() => { if (surface.dataset.emotionScene === scene) companion.close(); }, 250);
    }
  };
  toggle.addEventListener('click', event => { event.stopPropagation(); setExpanded(options.hidden); });
  remote.addEventListener('click', event => {
    event.stopPropagation();
    const button = event.target.closest('[data-emotion-scene]');
    if (button) show(button.dataset.emotionScene);
  });
  const act = event => {
    const button = event.target.closest('[data-emotion-action]');
    if (!button) return;
    event.stopPropagation();
    const action = button.dataset.emotionAction;
    if (action === 'seek') { locate('08:24'); return; }
    if (action === 'explain') companion.beginIsolatedTool('我卡在刚才的知识点了，帮我理一下', '<p>我们先只看一个关系：数据搬入后由计算单元处理，最后再搬出。可以从视频 04:12 的数据并行流程继续。</p><button type="button" class="emotion-chat-action" data-emotion-action="review-point">看 04:12 的讲解 →</button>');
    if (action === 'review') companion.beginIsolatedTool('帮我回顾刚才这一段', '<p>刚才讲的是同步局部梯度：每个设备先计算自己的梯度，再通过 AllReduce 汇总，确保下一轮训练从一致的参数状态继续。</p><button type="button" class="emotion-chat-action" data-emotion-action="review-point">从 04:12 再看一遍 →</button>');
    if (action === 'review-point') locate('04:12');
    nudge.hidden = true;
  };
  nudge.addEventListener('click', act);
  nudge.addEventListener('change', event => { if (event.target.matches('[data-emotion-suppress]')) localStorage.setItem(surface.dataset.emotionScene === 'stuck' ? 'ascend-stuck-nudge-disabled' : 'ascend-pause-nudge-disabled', event.target.checked ? '1' : '0'); });
  document.getElementById('unifiedCompanion')?.addEventListener('click', act);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !options.hidden) { setExpanded(false); toggle.focus(); }
  });
  const initialScene = new URLSearchParams(location.search).get('emotion');
  if (['question', 'stuck', 'pause'].includes(initialScene)) show(initialScene);
})();
