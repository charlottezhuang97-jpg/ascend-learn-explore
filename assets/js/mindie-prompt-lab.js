/* Prompt-driven MindIE lab card. The progress is a visual demo, not a host operation. */
(() => {
  if (!location.pathname.endsWith('/learn.html') || new URLSearchParams(location.search).get('course') !== 'mindie') return;
  const assistant = window.AscendCompanion;
  const panel = document.getElementById('unifiedCompanion');
  if (!assistant || !panel) return;

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('../css/mindie-prompt-lab.css?v=1', document.currentScript.src).href;
  document.head.append(stylesheet);

  const check = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m6 16 7 7L27 8" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const loading = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M26 12a11 11 0 0 0-18-5M6 12a11 11 0 0 0 18 13M26 20a11 11 0 0 0 1-8M6 20a11 11 0 0 0 0-8" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>';
  const waiting = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="10" y="10" width="12" height="12" rx="3" stroke="currentColor" stroke-width="2.5"/></svg>';
  const steps = ['环境准备', '模型权重与镜像一键获取', '模型推理配置', '实验执行'];
  let activeRun = 0;

  function matchesPrompt(value) {
    const prompt = value.replace(/[\s，。、“”‘’!！?？]/g, '').toLowerCase();
    return prompt.includes('实验手册') && prompt.includes('逐步引导') && prompt.includes('mindie') && prompt.includes('文本生成实验');
  }

  function card(id, phase) {
    return `<section class="mindie-prompt-lab" data-mindie-prompt-lab="${id}" aria-label="MindIE 文本生成实验进度">
      <h3>MindIE 文本生成实验</h3>
      <div class="mindie-prompt-lab-card"><div class="mindie-prompt-lab-heading"><span aria-hidden="true">⌘</span><b>实验 1 - 基于 MindIE 文本生成实验</b><span aria-hidden="true">⌃</span></div>
      <ol>${steps.map((label, index) => {
        const state = index < phase ? 'done' : index === phase && phase < 3 ? 'loading' : 'waiting';
        const icon = state === 'done' ? check : state === 'loading' ? loading : waiting;
        return `<li class="${state}" aria-label="${label}：${state === 'done' ? '演示完成' : state === 'loading' ? '正在准备' : '待开始'}"><span class="mindie-prompt-lab-status">${icon}</span><span class="mindie-prompt-lab-label">${label}</span><span class="mindie-prompt-lab-chevron" aria-hidden="true">›</span></li>`;
      }).join('')}</ol>
      ${phase >= 2 ? `<div class="mindie-prompt-lab-detail"><p><b>实验目标：</b><br>向执行请求所在实验环境的 127.0.0.1:1025/generate 发一次请求。</p><p><b>执行要点：</b><br>1、确认提示词与生成参数<br>2、发送一次请求<br>3、展示文本与检查响应</p><p><b>命令示例：</b></p><pre>curl -H "Accept: application/json" \\\n+  -H "Content-type: application/json" \\\n+  -X POST -d '{"prompt":"介绍下Qwen2-7B","max_tokens":500}' \\\n+  http://127.0.0.1:1025/generate</pre></div>` : ''}
      </div><small class="mindie-prompt-lab-note">页面演示进度，未连接 HiDevLab 或运行模型请求。</small>
    </section>`;
  }

  function submit(event) {
    if (event.target.id !== 'uacForm') return;
    const input = event.target.querySelector('#uacQuestion');
    const prompt = input?.value.trim() || '';
    if (!matchesPrompt(prompt)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    document.querySelector('.fixed1030-footer [data-fixed-view="ide"]')?.click();
    const id = String(++activeRun);
    const messageId = assistant.beginIsolatedTool(prompt, card(id, 0));
    const session = assistant.getSessionId();
    const advance = (phase, delay) => setTimeout(() => {
      if (id !== String(activeRun) || assistant.getSessionId() !== session || !panel.querySelector(`[data-mindie-prompt-lab="${id}"]`)) return;
      assistant.updateToolMessage(messageId, card(id, phase));
    }, delay);
    advance(1, 400);
    advance(2, 850);
    advance(3, 2350);
  }

  panel.addEventListener('submit', submit, true);
})();
