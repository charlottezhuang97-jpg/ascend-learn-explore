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
  const quickOptions = [...quickMenu.querySelectorAll('button')];
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

  function setQuickActive(nextIndex) {
    quickIndex = (nextIndex + quickOptions.length) % quickOptions.length;
    quickOptions.forEach((option, index) => option.setAttribute('aria-selected', String(index === quickIndex)));
  }

  function chooseShortcut(button) {
    selectedShortcut = button.dataset.label || button.textContent.trim();
    selectedPromptIndex = 0;
    selectedPromptText.textContent = selectedShortcut;
    selectedPrompt.hidden = false;
    form.classList.add('has-selection');
    input.value = shortcutPrompts[selectedShortcut]?.[0] || button.dataset.prompt || button.textContent.trim();
    setQuickMenu(false);
    input.focus();
  }

  function cycleShortcutPrompt() {
    const prompts = shortcutPrompts[selectedShortcut];
    if (!prompts || prompts.length < 2) return;
    selectedPromptIndex = (selectedPromptIndex + 1) % prompts.length;
    input.value = prompts[selectedPromptIndex];
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
    mode = nextMode;
    const course = mode === 'course';
    courseTab.setAttribute('aria-selected', String(course));
    askTab.setAttribute('aria-selected', String(!course));
    input.placeholder = course ? '今天你想学点什么？使用/获取快捷选项' : '输入正在解决的开发问题';
    quizHelper.hidden = !course;
    hint.textContent = course ? '' : '描述报错、环境与预期结果，AI 将从问题出发协助定位';
  }

  courseTab.addEventListener('click', () => setMode('course'));
  askTab.addEventListener('click', () => setMode('ask'));
  input.addEventListener('input', () => {
    const isShortcutQuery = mode === 'course' && (input.value.trim() === '/' || input.value.trim() === '／');
    setQuickMenu(isShortcutQuery);
    if (isShortcutQuery) setQuickActive(0);
  });
  input.addEventListener('keydown', event => {
    if (event.key === '/' && !input.value && mode === 'course') requestAnimationFrame(() => { setQuickMenu(true); setQuickActive(0); });
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
  quickMenu.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => chooseShortcut(button));
  });
  clearShortcut.addEventListener('click', clearSelectedShortcut);
  document.addEventListener('click', event => {
    if (!form.contains(event.target)) setQuickMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === '/' && mode === 'course' && !quiz.hidden && document.activeElement !== input) return;
    if (event.key === '/' && mode === 'course' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
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
    closeQuiz();
    if (window.openCourseFlow) window.openCourseFlow(generatedGoal);
  }

  openQuizButton.addEventListener('click', openQuiz);
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
  sceneButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      sceneButtons.forEach(item => item.setAttribute('aria-selected', String(item === button)));
      sceneCards.forEach(card => { card.hidden = filter !== '精选' && card.dataset.category !== filter; });
    });
  });

  const growthData = {
    '学习成长榜': [
      ['小林098321', '完成「分布式训练基础」学习路径并通过结课测验'],
      ['昇腾新手阿杰', '本周完成6个学习单元，首次掌握12个知识点'],
      ['笔记temmmy', '完成大模型训练入门课程及3次配套实验'],
      ['MindSpore小林', '完成模型训练学习路径并通过结课测验']
    ],
    '实战突破榜': [
      ['NPU调优手记', '定位并解决3个推理部署问题，方案均已验证'],
      ['算子工坊Leo', '完成Ascend C自定义算子的开发、运行与精度验证'],
      ['HCCL观察员', '解决多卡训练通信超时，使训练任务恢复运行'],
      ['部署巡检员', '完成模型转换与服务调用链路验证']
    ],
    '社区共建榜': [
      ['CANN捕虫者', '发现课程代码的版本兼容问题并推动完成修复'],
      ['文档修补匠', '贡献OOM排查最佳实践，已被官方知识库收录'],
      ['AI纠错员', '纠正AI回答中的接口版本错误，帮助更新引用来源'],
      ['社区观察员', '补充推理部署问题的可复现案例']
    ]
  };
  const growthButtons = [...document.querySelectorAll('.growth-tabs button')];
  const growthLists = [...document.querySelectorAll('.growth-list')];
  function renderGrowth(type) {
    const items = growthData[type];
    const halves = [items.slice(0, 2), items.slice(2, 4)];
    growthLists.forEach((list, listIndex) => {
      list.replaceChildren(...halves[listIndex].map((item, index) => {
        const row = document.createElement('article');
        row.className = 'growth-item';
        row.innerHTML = `<span class="growth-avatar a${listIndex * 2 + index + 1}" aria-hidden="true"></span><div class="growth-copy"><strong>${item[0]}</strong><span>${item[1]}</span></div>`;
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
