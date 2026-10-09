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
    ],
    '真实任务反推': [
      '我想把单卡图像分类模型改成双卡训练，并验证吞吐是否提升',
      '请从一个真实开发任务反推我需要补齐的能力和学习步骤',
      '我有一个可运行的单卡脚本，希望完成多卡训练验收'
    ],
    '诊断补救': [
      'HCCL 初始化失败，训练无法启动，请根据错误码和日志定位知识缺口',
      '我的分布式训练任务出现通信超时，需要补齐相关知识并重新验证',
      '训练脚本运行失败，请从环境、配置和日志生成一条补救学习路径'
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
      ['真实任务反推', '把单卡模型改成双卡训练，从目标任务反推能力与学习步骤。'],
      ['诊断补救', '根据错误码、环境和日志定位知识缺口，补齐后回到原任务验证。'],
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
    document.getElementById('courseFirstFloor').hidden = !course;
    document.getElementById('problemFirstFloor').hidden = course;
    input.placeholder = course ? '今天你想学点什么？使用/获取快捷选项' : '输入正在解决的开发问题，使用/获取常见问题';
    quizHelper.hidden = !course;
    hint.textContent = course ? '' : '输入 / 可调出常见开发问题；也可描述报错、环境与预期结果。';
    clearSelectedShortcut();
    renderQuickOptions();
  }

  courseTab.addEventListener('click', () => setMode('course'));
  askTab.addEventListener('click', () => setMode('ask'));
  const problemSlides = Array.from(document.querySelectorAll('[data-problem-slide]'));
  const problemPrev = document.getElementById('problemPrev');
  const problemNext = document.getElementById('problemNext');
  let problemSlideIndex = 0;
  function renderProblemSlide() {
    problemSlides.forEach((slide, index) => {
      slide.hidden = index !== problemSlideIndex;
      slide.setAttribute('aria-current', String(index === problemSlideIndex));
    });
    if (problemPrev) problemPrev.hidden = problemSlideIndex === 0 || problemSlides.length < 2;
    if (problemNext) problemNext.hidden = problemSlides.length < 2;
  }
  problemPrev?.addEventListener('click', () => {
    problemSlideIndex = Math.max(0, problemSlideIndex - 1);
    renderProblemSlide();
  });
  problemNext?.addEventListener('click', () => {
    problemSlideIndex = (problemSlideIndex + 1) % problemSlides.length;
    renderProblemSlide();
  });
  renderProblemSlide();
  document.querySelectorAll('[data-problem-preview]').forEach(button => button.addEventListener('click', () => {
    input.value = button.dataset.problemPreview;
    document.getElementById('top').scrollIntoView({behavior:'smooth', block:'start'});
    input.focus();
  }));
  document.querySelectorAll('[data-problem-submit]').forEach(button => button.addEventListener('click', () => {
    input.value = button.dataset.problemSubmit;
    document.getElementById('top').scrollIntoView({behavior:'smooth', block:'start'});
    requestAnimationFrame(() => form.requestSubmit());
  }));
  if (new URLSearchParams(location.search).get('tab') === 'ask') setMode('ask');
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
    if (window.openCourseFlow) {
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

  setMode('course');
})();
