(() => {
  const courseTab = document.getElementById('courseTab');
  const askTab = document.getElementById('askTab');
  const form = document.getElementById('heroForm');
  const input = document.getElementById('heroInput');
  const hint = document.getElementById('searchFeedback');
  const quickMenu = document.getElementById('quickMenu');
  const selectedPrompt = document.getElementById('selectedPrompt');
  const selectedPromptText = document.getElementById('selectedPromptText');
  const clearShortcut = document.getElementById('clearShortcut');
  const quizHelper = document.getElementById('quizHelper');
  const openQuizButton = document.getElementById('openQuiz');
  const quiz = document.getElementById('learningQuiz');
  const quizClose = document.getElementById('quizClose');
  const quizDialog = quiz.querySelector('.quiz-dialog');
  const quizStage = document.getElementById('quizStage');
  const quizProgress = document.getElementById('quizProgress');
  let quickOptions = [...quickMenu.querySelectorAll('button')];
  let mode = 'course';
  let quickIndex = -1;
  let lastFocus = null;
  let quizIndex = 0;
  let quizAnswers = [];
  let selectedShortcut = null;
  let selectedPromptIndex = 0;

  const shortcutPrompts = {
    '新手入门': [
      '我刚接触昇腾，希望从基础开始学习',
      '我想先完成昇腾环境配置并运行第一个模型',
      '我有深度学习基础，想了解如何使用昇腾进行开发'
    ],
    '算子开发': [
      '我想学习 Ascend C 算子开发',
      '我想开发一个自定义算子，并完成编译、运行和验证',
      '我需要排查算子精度或性能问题'
    ],
    '训练开发': [
      '我想学习模型训练并完成一次分布式训练',
      '我想在昇腾环境完成大模型训练和混合精度配置',
      '我需要优化训练吞吐和多卡通信效率'
    ],
    '推理开发': [
      '我想把模型部署到昇腾并完成推理服务验证',
      '我需要完成模型转换、推理适配和服务部署',
      '我想优化推理时延和吞吐，并完成上线验证'
    ],
    '生成式AI应用开发与部署': [
      '我想开发一个 RAG 智能体应用，并部署到昇腾环境',
      '我想学习大模型应用、知识库构建与工具调用',
      '我想完成生成式 AI 应用的部署、评估与持续优化'
    ],
    '环境问题': [
      '我的 CANN 环境安装失败，需要排查依赖或版本兼容问题',
      '运行示例时找不到 Ascend 工具链或环境变量',
      '我需要确认当前驱动、固件与 CANN 版本是否兼容'
    ],
    '模型迁移': [
      '模型转换失败，我需要排查模型迁移和算子支持问题',
      '模型转换后推理精度异常，需要定位适配问题',
      '我想确认模型迁移到昇腾时的版本和依赖要求'
    ],
    '训练异常': [
      '训练出现 OOM 或 loss 不收敛，我该如何定位？',
      '分布式训练吞吐低，需要排查并行策略和通信配置',
      '混合精度训练出现溢出或精度下降，如何处理？'
    ],
    '部署异常': [
      '推理服务启动失败，需要排查模型、环境和服务配置',
      '部署后时延或吞吐不达标，如何做性能分析？',
      '推理结果精度异常，如何验证模型转换和运行时适配？'
    ],
    '算子问题': [
      'AscendC 算子编译失败，需要定位编译或依赖问题',
      '自定义算子运行结果异常，需要排查精度问题',
      '算子性能不足，如何分析 Tiling 和执行效率？'
    ],
    '性能调优': [
      '多卡训练出现通信超时，需要定位 HCCL 问题',
      '程序运行报错或异常退出，需要从错误码开始排查',
      '我想定位训练或推理的性能瓶颈并验证优化结果'
    ]
  };

  const quickMenuConfig = {
    course: [
      ['新手入门', '从环境搭建开始，完成首个昇腾开发任务。'],
      ['算子开发', '开发、调试和优化昇腾自定义算子。'],
      ['训练开发', '完成模型训练、分布式训练和性能优化。'],
      ['推理开发', '学习模型转换、推理适配与部署的上线流程。'],
      ['生成式AI应用开发与部署', '学习大模型、RAG 和智能体应用开发与部署。']
    ],
    ask: [
      ['环境问题', 'CANN 安装、环境变量、驱动与版本兼容。'],
      ['模型迁移', '模型转换失败、算子支持或推理精度异常。'],
      ['训练异常', 'OOM、loss 不收敛、混合精度与吞吐问题。'],
      ['部署异常', '服务启动、时延吞吐和推理结果异常。'],
      ['算子问题', '算子编译、运行、精度与性能问题。'],
      ['性能调优', '错误码、通信超时与性能瓶颈排查。']
    ]
  };

  const quizSteps = [
    { question: '你是什么角色？', options: ['AI 初学者', '高校学生', '算法工程师', '应用开发者', '推理部署', '算子开发', '随便看看'] },
    { question: '你的目标是？', options: ['掌握基础知识', '训练开发', '推理开发', '调试优化', '获取认证', '开发 AI 应用'] },
    { question: '你当前的水平是？', options: ['零基础', '熟悉 Python', '熟悉 Triton', '熟悉 C++', '熟悉 CUDA / Ascend C'] }
  ];

  function setQuickMenu(open) {
    quickMenu.hidden = !open;
    input.setAttribute('aria-expanded', String(open));
    if (!open) quickIndex = -1;
  }

  function renderQuickOptions() {
    const options = quickMenuConfig[mode];
    quickMenu.setAttribute('aria-label', mode === 'course' ? '学习快捷选项' : '常见开发问题');
    quickMenu.innerHTML = options.map(([label, description]) => `<button type="button" role="option" data-label="${label}" data-prompt="${shortcutPrompts[label][0]}"><span class="quick-menu-mark" aria-hidden="true"></span><span><b>${label}</b><small>${description}</small></span></button>`).join('');
    quickOptions = [...quickMenu.querySelectorAll('button')];
    quickOptions.forEach(button => button.addEventListener('click', () => chooseShortcut(button)));
  }

  function setQuickActive(nextIndex) {
    quickIndex = (nextIndex + quickOptions.length) % quickOptions.length;
    quickOptions.forEach((option, index) => option.setAttribute('aria-selected', String(index === quickIndex)));
  }

  function updateShortcutActionPosition() {
    if (!selectedShortcut) return;
    const style = window.getComputedStyle(input);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const inputStart = input.offsetLeft + Number.parseFloat(style.paddingLeft);
    const targetLeft = inputStart + context.measureText(input.value).width + 14;
    const maxLeft = form.clientWidth - 214;
    form.style.setProperty('--shortcut-action-left', `${Math.round(Math.min(maxLeft, Math.max(365, targetLeft)))}px`);
  }

  function chooseShortcut(button) {
    selectedShortcut = button.dataset.label || button.textContent.trim();
    selectedPromptIndex = 0;
    selectedPromptText.textContent = selectedShortcut;
    selectedPrompt.hidden = false;
    form.classList.add('has-selection');
    input.value = shortcutPrompts[selectedShortcut]?.[0] || button.dataset.prompt || button.textContent.trim();
    setQuickMenu(false);
    updateShortcutActionPosition();
    input.focus();
  }

  function cycleShortcutPrompt() {
    const prompts = shortcutPrompts[selectedShortcut];
    if (!prompts || prompts.length < 2) return;
    selectedPromptIndex = (selectedPromptIndex + 1) % prompts.length;
    input.value = prompts[selectedPromptIndex];
    updateShortcutActionPosition();
    input.select();
  }

  function clearSelectedShortcut() {
    selectedPrompt.hidden = true;
    form.classList.remove('has-selection');
    selectedShortcut = null;
    selectedPromptIndex = 0;
    input.value = '';
    input.focus();
  }

  function setMode(nextMode) {
    if (mode === nextMode) return;
    mode = nextMode;
    const course = mode === 'course';
    courseTab.setAttribute('aria-selected', String(course));
    askTab.setAttribute('aria-selected', String(!course));
    input.placeholder = course ? '今天你想学点什么？使用/获取快捷选项' : '输入正在解决的开发问题，使用/获取常见问题';
    quizHelper.hidden = !course;
    hint.textContent = course ? '' : '输入 / 可调出常见开发问题；也可描述报错、环境与预期结果。';
    clearSelectedShortcut();
    renderQuickOptions();
  }

  courseTab.addEventListener('click', () => setMode('course'));
  askTab.addEventListener('click', () => setMode('ask'));
  input.addEventListener('input', () => {
    const isShortcutQuery = input.value.trim() === '/' || input.value.trim() === '／';
    setQuickMenu(isShortcutQuery);
    if (isShortcutQuery) setQuickActive(0);
    if (!isShortcutQuery) updateShortcutActionPosition();
  });
  input.addEventListener('keydown', event => {
    if (event.key === '/' && !input.value) requestAnimationFrame(() => { setQuickMenu(true); setQuickActive(0); });
    if (!quickMenu.hidden && event.key === 'ArrowDown') { event.preventDefault(); setQuickActive(quickIndex + 1); }
    if (!quickMenu.hidden && event.key === 'ArrowUp') { event.preventDefault(); setQuickActive(quickIndex - 1); }
    if (!quickMenu.hidden && event.key === 'Enter') {
      event.preventDefault();
      chooseShortcut(quickOptions[quickIndex < 0 ? 0 : quickIndex]);
    }
    if (event.key === 'Tab' && selectedShortcut && quickMenu.hidden) {
      event.preventDefault();
      cycleShortcutPrompt();
    }
    if (event.key === 'Enter' && quickMenu.hidden && input.value.trim()) {
      event.preventDefault();
      form.requestSubmit();
    }
    if (event.key === 'Escape') setQuickMenu(false);
  });
  renderQuickOptions();
  clearShortcut.addEventListener('click', clearSelectedShortcut);
  document.addEventListener('click', event => {
    if (!form.contains(event.target)) setQuickMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !quiz.hidden && document.activeElement !== input) return;
    if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      event.preventDefault();
      input.focus();
      input.value = '/';
      setQuickMenu(true);
      setQuickActive(0);
    }
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value || value === '/' || value === '／') {
      hint.textContent = '先写下学习目标或开发问题。';
      input.focus();
      return;
    }
    if (mode === 'course' && window.openCourseFlow) {
      window.openCourseFlow(value);
      return;
    }
    hint.textContent = `已记录问题「${value}」。快速问答将在后续版本接入。`;
  });

  function renderQuiz() {
    const isSummary = quizIndex === quizSteps.length;
    quizProgress.style.width = `${isSummary ? 100 : (quizIndex / quizSteps.length) * 100}%`;
    if (isSummary) {
      quizStage.innerHTML = `<div class="quiz-summary"><div class="quiz-summary-mark" aria-hidden="true">✓</div><h2>为你整理好了学习方向</h2><p>将以官方内容为主，为你生成可继续调整的专属课程。</p><div class="quiz-answer-tags">${quizAnswers.map(answer => `<span>${answer}</span>`).join('')}</div><button class="quiz-primary" id="quizComplete" type="button">查看专属课程</button></div>`;
      document.getElementById('quizComplete').addEventListener('click', completeQuiz);
      return;
    }
    const step = quizSteps[quizIndex];
    quizStage.innerHTML = `<div class="quiz-content"><p class="quiz-step">第 ${quizIndex + 1} 步 / 共 ${quizSteps.length} 步</p><h2>${step.question}</h2><p>选择最符合你当前情况的一项。</p><div class="quiz-options">${step.options.map(option => `<button class="quiz-option" type="button" data-answer="${option}" aria-pressed="false">${option}</button>`).join('')}</div></div>`;
    quizStage.querySelectorAll('.quiz-option').forEach(button => {
      button.addEventListener('click', () => {
        quizStage.querySelectorAll('.quiz-option').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
        quizAnswers[quizIndex] = button.dataset.answer;
        window.setTimeout(() => { quizIndex += 1; renderQuiz(); quizDialog.focus(); }, 140);
      });
    });
  }

  function openQuiz() {
    lastFocus = document.activeElement;
    quizIndex = 0;
    quizAnswers = [];
    renderQuiz();
    quiz.hidden = false;
    [document.querySelector('.site-nav'), document.querySelector('main'), document.querySelector('footer')].forEach(element => { if (element) element.inert = true; });
    quizDialog.focus();
  }

  function closeQuiz() {
    quiz.hidden = true;
    [document.querySelector('.site-nav'), document.querySelector('main'), document.querySelector('footer')].forEach(element => { if (element) element.inert = false; });
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function completeQuiz() {
    const [role, goal, level] = quizAnswers;
    const generatedGoal = `${role}，希望${goal}，当前${level}`;
    const profile = `${role || ''} ${goal || ''} ${level || ''}`;
    const course = /推理/.test(profile) ? 'inference' : /应用/.test(profile) ? 'agent' : /算子|Ascend C|Triton|CUDA/.test(profile) ? 'operator' : 'training';
    closeQuiz();
    window.location.assign(`course-preview.html?course=${course}&source=quiz&profile=${encodeURIComponent(generatedGoal)}`);
  }

  openQuizButton.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    openQuiz();
  });
  quizClose.addEventListener('click', closeQuiz);
  quiz.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); closeQuiz(); }
    if (event.key === 'Tab') {
      const focusables = [...quiz.querySelectorAll('button:not([disabled])')];
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  const sceneButtons = [...document.querySelectorAll('.scene-tabs button')];
  const sceneCards = [...document.querySelectorAll('.scene-card')];
  document.querySelectorAll('a.scene-card, a.continue-card').forEach(card => {
    card.addEventListener('click', event => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const href = card.getAttribute('href');
      if (!href) return;
      event.preventDefault();
      window.location.assign(href);
    });
  });
  sceneButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      sceneButtons.forEach(item => item.setAttribute('aria-selected', String(item === button)));
      sceneCards.forEach(card => { card.hidden = filter !== '精选' && card.dataset.category !== filter; });
    });
  });

  const growthData = {
    '学习成长榜': [
      ['小林098321', '通过分布式训练能力验证', '完成 <b>4</b> 项训练任务，关键实验结果均已验证。'],
      ['昇腾新手阿杰', '首次跑通推理部署链路', '完成模型转换、服务启动与调用验证，留下 <b>1</b> 份可运行成果。'],
      ['笔记temmmy', '获得模型训练实践徽章', '完成 <b>3</b> 次有效实验，并将结果整理进个人学习档案。'],
      ['MindSpore小林', '完成学习方案的实战验收', '通过 <b>1</b> 组标准化任务，下一步可挑战更高难度的实践。'],
      ['并行训练小杜', '掌握混合精度训练方法', '完成 <b>2</b> 次精度验证，训练脚本已收录至学习档案。'],
      ['迁移练习生', '完成模型迁移学习路径', '跑通 <b>3</b> 个关键环节，形成可复用的迁移检查清单。']
    ],
    '实战突破榜': [
      ['NPU调优手记', '闭环推理部署性能问题', '定位根因并完成修复验证，端到端时延降低 <b>28%</b>。'],
      ['算子工坊Leo', '交付可运行的 AscendC 算子', '通过正确性与精度验证，代码已被置入 <b>12</b> 次 IDE 实践。'],
      ['HCCL观察员', '恢复多卡训练任务', '解决通信超时问题，沉淀 <b>1</b> 份可复现实战案例。'],
      ['部署巡检员', '通过推理部署 Benchmark', '完成 <b>5</b> 项标准任务验证，获得推理部署能力记录。'],
      ['精度排查员', '定位模型迁移精度异常', '完成前后对比验证，关键指标偏差收敛至 <b>1%</b> 以内。'],
      ['显存优化师', '解决训练 OOM 问题', '重构数据与并行配置，稳定完成 <b>8</b> 小时训练任务。']
    ],
    '社区共建榜': [
      ['CANN捕虫者', '推动课程版本问题完成修复', '提交的兼容性问题已采纳，帮助 <b>86</b> 位学习者避开环境阻塞。'],
      ['文档修补匠', '贡献 OOM 排查最佳实践', '案例已收录至知识库，被引用 <b>24</b> 次。'],
      ['AI纠错员', '纠正 AI 回答中的接口错误', '补充可信来源并完成审核，相关回答准确率持续更新。'],
      ['社区观察员', '发布可复现的推理部署案例', '已有 <b>17</b> 位开发者复用该案例完成排查。'],
      ['版本守护者', '补充 CANN 兼容性说明', '官方文档变更已同步，减少 <b>6</b> 类环境配置疑问。'],
      ['案例整理员', '维护错误码复现模板', '模板被 <b>19</b> 位开发者用于提交可复现问题。']
    ]
  };
  const growthButtons = [...document.querySelectorAll('.growth-tabs button')];
  const growthLists = [...document.querySelectorAll('.growth-list')];
  function renderGrowth(type) {
    const items = growthData[type];
    const halves = [items.slice(0, 3), items.slice(3, 6)];
    growthLists.forEach((list, listIndex) => {
      list.replaceChildren(...halves[listIndex].map((item, index) => {
        const row = document.createElement('article');
        row.className = 'growth-item';
        const rank = listIndex * 3 + index + 1;
        const medalClass = rank === 1 ? 'medal gold' : rank === 2 ? 'medal silver' : rank === 3 ? 'medal bronze' : '';
        row.innerHTML = `<span class="growth-rank ${medalClass}" aria-label="第 ${rank} 名">${String(rank).padStart(2, '0')}</span><div class="growth-copy"><span class="growth-user">${item[0]}</span><span class="growth-achievement">${item[1]}</span><span class="growth-description">${item[2]}</span></div><button class="growth-follow" type="button" aria-pressed="false">关注</button>`;
        const follow = row.querySelector('.growth-follow');
        follow.addEventListener('click', () => {
          const isFollowing = follow.getAttribute('aria-pressed') === 'true';
          follow.setAttribute('aria-pressed', String(!isFollowing));
          follow.textContent = isFollowing ? '关注' : '已关注';
        });
        return row;
      }));
    });
  }
  growthButtons.forEach(button => {
    button.addEventListener('click', () => {
      growthButtons.forEach(item => item.setAttribute('aria-selected', String(item === button)));
      renderGrowth(button.dataset.type);
    });
  });
  renderGrowth('学习成长榜');
  setMode('course');
})();
