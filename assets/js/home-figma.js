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
  const quizBackButton = document.getElementById('quizBack');
  const quizDialog = quiz.querySelector('.quiz-dialog');
  const quizStage = document.getElementById('quizStage');
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
    { question: '你的昇腾技术经验', description: '简单三步助你快速开启昇腾学习之旅，请选择你的昇腾技术经验。', options: ['初学者', '具备生产基础知识', '有生产平台开发经验'], avatars: true },
    { question: '感兴趣的技术领域', description: '很好，您对以下哪些技术领域感兴趣？', options: ['CANN', '算子开发', '模型训练', '模型推理', '应用开发', '平台和工具', '其他'] },
    { question: '你的学习目标', description: '很好，请问你的学习目标是？', options: ['了解产品', '提升开发能力', '获取认证'] }
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
    courseTab?.setAttribute('aria-selected', String(course));
    askTab?.setAttribute('aria-selected', String(!course));
    document.getElementById('courseFirstFloor').hidden = !course;
    document.getElementById('problemFirstFloor').hidden = course;
    input.placeholder = course ? '今天你想学点什么？使用/获取快捷选项' : '输入正在解决的开发问题，使用/获取常见问题';
    quizHelper.hidden = !course;
    hint.textContent = course ? '' : '输入 / 可调出常见开发问题；也可描述报错、环境与预期结果。';
    clearSelectedShortcut();
    renderQuickOptions();
  }

  courseTab?.addEventListener('click', () => setMode('course'));
  askTab?.addEventListener('click', () => setMode('ask'));
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

  const quizRecommendations = {
    training: { title: '昇腾算力与 MindSpore 框架：大语言模型开发与深度调优全栈指南', description: '从昇腾计算栈出发，完成模型训练、分布式并行与性能调优。', duration: '约 20 小时', path: '大模型分布式训练学习路径', pathDescription: '从框架基础到分布式训练实践，逐步建立训练开发能力。', cert: '训练开发认证' },
    inference: { title: '大模型推理服务部署', description: '完成模型准备、推理适配、服务部署与性能验证。', duration: '约 11 小时', path: '推理与部署学习路径', pathDescription: '从推理环境搭建到服务部署与性能优化，循序进阶。', cert: '推理开发者认证' },
    operator: { title: 'Ascend C 算子开发', description: '从算子分析与实现出发，完成部署和性能验收。', duration: '约 13 小时', path: 'Ascend C 算子开发学习路径', pathDescription: '从编程模型到算子工程化与调优，逐步完成开发实践。', cert: '算子开发认证' },
    agent: { title: 'RAG 智能体应用开发', description: '从知识库构建到工具调用，完成可评估的智能体应用。', duration: '约 8 小时', path: 'AI 应用与智能体学习路径', pathDescription: '从模型接入到应用编排与评估，逐步完成项目实践。', cert: 'AI应用开发者认证' }
  };

  function quizCourseKey() {
    const interests = quizAnswers[1] || [];
    if (interests.includes('模型推理')) return 'inference';
    if (interests.includes('应用开发')) return 'agent';
    if (interests.includes('算子开发') || interests.includes('CANN')) return 'operator';
    return 'training';
  }

  let quizTimer = 0;
  function renderQuiz() {
    window.clearTimeout(quizTimer);
    const isGenerating = quizIndex === quizSteps.length;
    const isSummary = quizIndex > quizSteps.length;
    quizDialog.classList.toggle('quiz-dialog-results', isSummary);
    quizDialog.classList.toggle('quiz-dialog-generating', isGenerating);
    if (isGenerating) {
      const tags = quizAnswers.slice(0, quizSteps.length);
      const avatarIndex = quizSteps[0].options.indexOf(quizAnswers[0]);
      quizStage.innerHTML = `<div class="quiz-generating" role="status" aria-live="polite"><h2>AI 正在为你生成学习路径</h2><div class="quiz-loading" aria-hidden="true"><i></i><i></i><i></i></div><div class="quiz-answer-tags"><span class="quiz-answer-profile"><span class="quiz-avatar quiz-avatar--small" data-avatar="${avatarIndex}" aria-hidden="true"></span><span>${tags[0]}</span></span>${tags.slice(1).map(answer => `<span>${answer}</span>`).join('')}</div><ul class="quiz-generation-checks"><li>分析你的角色与基础...</li><li>匹配适合的学习任务...</li><li>检查前置依赖知识...</li></ul></div>`;
      quizTimer = window.setTimeout(() => { quizIndex += 1; renderQuiz(); quizDialog.focus(); }, 1800);
      return;
    }
    if (isSummary) {
      const [experience, interests, goal] = quizAnswers;
      const course = quizCourseKey();
      const rec = quizRecommendations[course];
      const profile = encodeURIComponent(`${experience}，关注${interests.join('、')}，希望${goal}`);
      const base = `course-preview.html?course=${course}&source=quiz&profile=${profile}`;
      const cards = [
        { type: '课程', title: rec.title, description: rec.description, duration: rec.duration, relevance: 96, href: base, action: '查看课程', pattern: 'course' },
        { type: '学习路径', title: rec.path, description: rec.pathDescription, duration: rec.duration, relevance: 93, href: base, action: '查看学习路径', pattern: 'path' },
        { type: '认证', title: rec.cert, description: '通过认证学习与能力验证，检验并证明你的开发能力。', duration: '待确定', relevance: 89, href: `${base}&certification=ACDA`, action: '查看认证', pattern: 'cert' }
      ];
      quizStage.innerHTML = `<div class="quiz-results"><div class="quiz-results-heading"><span class="quiz-results-kicker">YOUR LEARNING PLAN</span><h2>为你推荐的学习方案</h2><p>根据你的学习目标，匹配适合的学习内容。</p></div><div class="quiz-goal"><span>你的学习目标</span><strong>${goal}</strong><small>${experience} · ${interests.join("、")}</small></div><div class="quiz-result-grid">${cards.map(card => `<article class="quiz-result-card"><div class="quiz-card-art quiz-card-art--${card.pattern}"><span>${card.type}</span><i aria-hidden="true"></i></div><div class="quiz-card-body"><h3>${card.title}</h3><p>${card.description}</p><div class="quiz-card-meta"><span>${card.type === '认证' ? '预计备考时长' : '学习时长'}</span><strong>${card.duration}</strong></div><div class="quiz-card-relevance"><span>与你的目标相关性</span><strong>${card.relevance}%</strong></div><div class="quiz-card-track" aria-hidden="true"><span style="width:${card.relevance}%"></span></div><a href="${card.href}">${card.action}<span aria-hidden="true">↗</span></a></div></article>`).join('')}</div><button class="quiz-edit" type="button">← 修改测评答案</button></div>`;
      quizStage.querySelector('.quiz-edit').addEventListener('click', () => { quizIndex = 0; renderQuiz(); quizDialog.focus(); });
      return;
    }
    const step = quizSteps[quizIndex];
    const chosen = quizAnswers[quizIndex];
    quizStage.innerHTML = `<div class="quiz-content"><div class="quiz-prompt"><h2 aria-label="${step.question}">${step.description}</h2></div><div class="quiz-options ${step.avatars?'quiz-options--avatars':'quiz-options--numbered'} quiz-options--count-${step.options.length}">${step.options.map((option,index) => `<button class="quiz-option" type="button" data-answer="${option}" aria-pressed="${chosen===option}">${step.avatars?`<span class="quiz-avatar" data-avatar="${index}" aria-hidden="true"></span>`:`<span class="quiz-option-number" aria-hidden="true">${index+1}</span>`}<span class="quiz-option-label">${option}</span><span class="quiz-option-check" aria-hidden="true">✓</span></button>`).join('')}</div></div>`;
    quizStage.querySelectorAll('.quiz-option').forEach(button => {
      button.addEventListener('click', () => {
        quizStage.querySelectorAll('.quiz-option').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
        quizAnswers[quizIndex] = button.dataset.answer;
        window.clearTimeout(quizTimer);
        quizTimer = window.setTimeout(() => { quizIndex += 1; renderQuiz(); quizDialog.focus(); }, 160);
      });
    });
  }

  function openQuiz() {
    lastFocus = document.activeElement;
    quizIndex = 0;
    quizAnswers = [];
    renderQuiz();
    quiz.hidden = false;
    [document.querySelector('.october-nav'), document.querySelector('main'), document.querySelector('footer')].forEach(element => { if (element) element.inert = true; });
    quizDialog.focus();
  }

  function closeQuiz() {
    window.clearTimeout(quizTimer);
    quiz.hidden = true;
    [document.querySelector('.october-nav'), document.querySelector('main'), document.querySelector('footer')].forEach(element => { if (element) element.inert = false; });
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  openQuizButton.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    openQuiz();
  });
  quizBackButton.addEventListener('click', () => {
    if (quizIndex > 0 && quizIndex <= quizSteps.length) {
      window.clearTimeout(quizTimer);
      quizIndex -= 1;
      renderQuiz();
      quizDialog.focus();
      return;
    }
    closeQuiz();
  });
  quiz.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); closeQuiz(); }
    if (event.key === 'Tab') {
      const focusables = [...quiz.querySelectorAll('button:not([disabled]), a[href]')];
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
