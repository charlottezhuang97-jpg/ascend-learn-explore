(() => {
  const trainingQuestions = [
    {
      title: '你目前对 AI 训练和昇腾生态的了解程度如何？',
      type: '多选题',
      multiple: true,
      options: [
        ['深度学习基础', '了解神经网络基本原理，能使用 Python 编写基础脚本。'],
        ['框架经验', '熟悉 PyTorch 或 TensorFlow，有训练模型的实际经验。'],
        ['昇腾初探', '听说过 MindSpore 或 CANN，尚未在昇腾硬件上完成训练。'],
        ['算子与底层', '了解算子开发和底层硬件加速，想进一步优化性能。']
      ]
    },
    {
      title: '你更倾向于哪种训练环境和技术栈？',
      type: '单选题',
      options: [
        ['MindSpore 原生开发', '使用华为原生 AI 框架，了解昇腾硬件的适配和性能。'],
        ['PyTorch / TensorFlow 迁移', '将现有模型通过适配快速迁移到昇腾平台。'],
        ['华为云 ModelArts 实践', '在云端环境下进行训练流程和资源管理。']
      ]
    },
    {
      title: '学完本课程后，你希望达到什么掌握程度？',
      type: '单选题',
      options: [
        ['流程走通', '独立搭建环境并运行一个完整的训练 Demo。'],
        ['生产级迁移与调优', '处理复杂模型迁移，并提升训练效率。'],
        ['系统级架构能力', '理解底层架构，针对硬件特性进行深度优化。']
      ]
    },
    {
      title: '你希望课程的体量和深度如何安排？',
      type: '单选题',
      options: [
        ['轻量速览', '3–4 个单元，快速掌握环境搭建和基础训练闭环。'],
        ['标准深度', '5–7 个单元，覆盖数据、模型和并行训练常见技巧。'],
        ['系统精通', '8–10 个单元，从硬件底层到云端大规模训练。']
      ]
    }
  ];

  const sharedDepth = trainingQuestions[3];
  const topicQuestions = {
    operator: [
      {
        title: '你目前对昇腾算子开发的了解程度如何？',
        type: '多选题',
        multiple: true,
        options: [
          ['编程基础', '能使用 Python 或 C++ 完成基础开发任务。'],
          ['计算框架经验', '了解模型计算图，使用过常见深度学习框架。'],
          ['昇腾初探', '听说过 CANN 或 Ascend C，尚未独立开发算子。'],
          ['优化经验', '做过算子调试或性能分析，希望深入底层实现。']
        ]
      },
      {
        title: '你更希望从哪种算子开发实践入手？',
        type: '单选题',
        options: [
          ['Ascend C 入门', '从基础语法和算子样例开始，完成一次编译与运行。'],
          ['已有算子迁移', '围绕现有计算需求，理解如何适配昇腾平台。'],
          ['调试与性能分析', '从具体问题出发，学习定位和优化执行瓶颈。']
        ]
      },
      {
        title: '学完后，你希望达成什么成果？',
        type: '单选题',
        options: [
          ['写出第一个算子', '独立完成一个可运行的简单算子。'],
          ['解决开发问题', '能排查编译、精度或运行中的常见问题。'],
          ['优化性能', '能够分析计算和内存访问，尝试提高执行效率。']
        ]
      },
      sharedDepth
    ],
    inference: [
      {
        title: '你目前对模型推理与部署的了解程度如何？',
        type: '多选题',
        multiple: true,
        options: [
          ['模型基础', '了解模型输入输出，能够运行本地推理样例。'],
          ['部署经验', '曾将模型封装为服务或接入应用。'],
          ['昇腾初探', '了解昇腾推理平台，尚未完成部署。'],
          ['性能分析', '关注吞吐、时延和资源使用等指标。']
        ]
      },
      {
        title: '你更希望从哪种推理实践入手？',
        type: '单选题',
        options: [
          ['单机模型运行', '先完成模型转换、加载和一次推理调用。'],
          ['服务化部署', '把模型接入服务接口，验证端到端调用链路。'],
          ['性能调优', '从实际指标出发，定位瓶颈并尝试优化。']
        ]
      },
      {
        title: '学完后，你希望达成什么成果？',
        type: '单选题',
        options: [
          ['流程走通', '能够独立完成一个可复现的推理 Demo。'],
          ['稳定部署', '梳理服务调用、运行状态和常见问题排查。'],
          ['优化关键指标', '理解吞吐与时延，形成性能优化思路。']
        ]
      },
      sharedDepth
    ]
  };
  let questions = trainingQuestions;
  const flow = document.getElementById('courseFlow');
  const stage = document.getElementById('flowStage');
  const goalElement = document.getElementById('flowGoal');
  const closeButton = document.getElementById('flowClose');
  const background = [document.querySelector('.site-nav'), document.querySelector('main'), document.querySelector('footer'), document.getElementById('panelBackdrop'), document.getElementById('aiPanel')];
  let answers = questions.map(() => ({ selected: [], custom: '' }));
  let revealed = 1;
  let goal = '';
  let returnFocus = null;
  let composition = null;
  let stepTimer = null;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function createStep(title, number, state = 'done', id) {
    const entry = element('section', 'flow-step');
    if (id) entry.id = id;
    entry.dataset.state = state;
    entry.setAttribute('aria-label', `${title}，第 ${number} 步，共 4 步`);
    const titleRow = element('div', 'flow-step-title');
    titleRow.append(
      element('h2', '', title),
      element('span', 'flow-step-count', `｜第 ${number} 步，共 4 步`),
      element('span', 'flow-step-state')
    );
    entry.append(titleRow);
    return entry;
  }

  function sourceRow(title, url, official = true) {
    const source = element('div', 'flow-process-source');
    source.append(
      element('span', 'flow-process-source-icon'),
      element('span', 'flow-process-source-title', title),
      element('span', 'flow-process-url', url)
    );
    if (official) source.append(element('span', 'flow-process-official', '官方'));
    return source;
  }

  function createSearchEvidence() {
    const entry = createStep('正在搜索相关资料', 1, 'done', 'searchStep');
    entry.classList.add('flow-search-step');
    const tech = element('div', 'flow-process-tech');
    ['Ascend C', '模型训练', '算子开发'].forEach(name => tech.append(element('span', '', name)));
    const sources = [
      ['Ascend C 算子开发指南', 'hiascend.com'],
      ['Ascend C 编程模型说明', 'hiascend.com'],
      ['CANN 算子开发流程', 'hiascend.com'],
      ['算子工程化实践课程', 'hiascend.com'],
      ['Ascend C API 参考', 'hiascend.com'],
      ['算子编译与运行指南', 'hiascend.com'],
      ['算子调试工具使用说明', 'hiascend.com'],
      ['算子性能分析指南', 'hiascend.com'],
      ['昇腾社区精选案例', 'hiascend.com']
    ];
    const sourceList = element('div', 'flow-source-list');
    sources.forEach(([title, url]) => sourceList.append(sourceRow(title, url)));
    const more = element('button', 'flow-more-sources', '查看更多资料');
    more.type = 'button';
    more.setAttribute('aria-expanded', 'false');
    const morePanel = element('div', 'flow-more-panel');
    morePanel.hidden = true;
    [
      ['CANN 版本适配说明', 'hiascend.com'],
      ['算子开发常见问题', 'hiascend.com'],
      ['MindSpore 算子样例', 'mindspore.cn']
    ].forEach(([title, url]) => morePanel.append(sourceRow(title, url)));
    more.addEventListener('click', () => {
      const expanded = more.getAttribute('aria-expanded') === 'true';
      more.setAttribute('aria-expanded', String(!expanded));
      more.textContent = expanded ? '查看更多资料' : '收起资料';
      morePanel.hidden = expanded;
    });
    entry.append(tech, sourceList, more, morePanel);
    return entry;
  }

  function renderQuestions(count = 1, focusIndex = 0) {
    removeComposition();
    window.clearTimeout(stepTimer);
    stage.replaceChildren();
    revealed = count;
    let heading;
    let progressLabel;
    let fill;
    const searchStep = createSearchEvidence();
    stage.append(searchStep);
    flow.scrollTop = 0;

    stepTimer = window.setTimeout(() => {
      appendPlanningStep();
      if (focusIndex > 0) scrollToQuestion(focusIndex);
      else heading.focus({ preventScroll: true });
    }, 500);

    function appendPlanningStep() {
    const planningStep = createStep('构思学习路径', 2, 'active', 'planningStep');
    const intro = element('div', 'flow-intro');
    heading = element('h2', '', '让学习方案更适合你');
    heading.id = 'flowHeading';
    heading.tabIndex = -1;
    intro.append(heading, element('p', '', '四个问题会依次出现在同一页。回答后继续向下查看；已选答案可以随时返回修改。'));
    const progress = element('div', 'flow-progress');
    progressLabel = element('span');
    progress.append(progressLabel);
    const track = element('div', 'flow-track');
    track.setAttribute('aria-hidden', 'true');
    fill = element('span');
    track.append(fill);
    progress.append(track);
    planningStep.append(intro, progress);
    stage.append(planningStep);
    for (let index = 0; index < count; index++) appendQuestion(index);
    updateProgress();
    if (count > 1) {
      [...stage.querySelectorAll('.flow-question-block')].slice(0, -1).forEach(block => { block.querySelector('.flow-actions').hidden = true; });
    }
    }

    function updateProgress() {
      progressLabel.textContent = `第 ${revealed} 题，共 ${questions.length} 题`;
      fill.style.width = `${revealed / questions.length * 100}%`;
    }
    function scrollToQuestion(index) {
      const block = stage.querySelector(`#flowQuestion${index + 1}`);
      if (!block) return;
      block.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      block.querySelector('h3').focus({ preventScroll: true });
    }
    function revealNext(index) {
      if (index === questions.length - 1) { renderResult(); return; }
      const current = stage.querySelector(`#flowQuestion${index + 1}`);
      current.querySelector('.flow-actions').hidden = true;
      if (revealed < index + 2) {
        revealed = index + 2;
        appendQuestion(index + 1);
        updateProgress();
      }
      scrollToQuestion(index + 1);
    }
    function appendQuestion(index) {
      const question = questions[index];
      const answer = answers[index];
      const block = element('section', 'flow-question-block');
      block.id = `flowQuestion${index + 1}`;
      block.setAttribute('aria-labelledby', `flowQuestionTitle${index + 1}`);
    const head = element('div', 'flow-question-head');
      const questionTitle = element('h3', '', question.title);
      questionTitle.id = `flowQuestionTitle${index + 1}`;
      questionTitle.tabIndex = -1;
      head.append(element('span', 'flow-number', `Q${index + 1}`), questionTitle, element('span', 'flow-type', question.type));
    const options = element('div', 'flow-options');
    question.options.forEach(([label, detail]) => {
      const button = element('button', 'flow-option');
      button.type = 'button';
      button.setAttribute('role', question.multiple ? 'checkbox' : 'radio');
      button.setAttribute('aria-checked', String(answer.selected.includes(label)));
      button.append(element('strong', '', label), element('span', '', detail));
      button.addEventListener('click', () => {
        if (question.multiple) {
          answer.selected = answer.selected.includes(label) ? answer.selected.filter(item => item !== label) : [...answer.selected, label];
        } else {
          answer.selected = [label];
        }
        updateOptions();
        if (!question.multiple && index < questions.length - 1) revealNext(index);
      });
      options.append(button);
    });
    const customButton = element('button', 'flow-option custom');
    customButton.type = 'button';
    customButton.setAttribute('role', question.multiple ? 'checkbox' : 'radio');
    customButton.setAttribute('aria-checked', String(answer.selected.includes('其他')));
    customButton.append(element('strong', '', '都不太对？写下自己的情况'), element('span', '', '用自己的话补充，帮助调整学习方向。'));
    customButton.addEventListener('click', () => {
      if (question.multiple) {
        answer.selected = answer.selected.includes('其他') ? answer.selected.filter(item => item !== '其他') : [...answer.selected, '其他'];
      } else {
        answer.selected = answer.selected.includes('其他') ? [] : ['其他'];
      }
      updateOptions();
      if (answer.selected.includes('其他')) customInput.focus();
    });
    options.append(customButton);
    const customInput = element('textarea', 'flow-custom');
    customInput.placeholder = '例如：我只想先了解基本概念，暂时不做实操';
    customInput.setAttribute('aria-label', '补充自己的情况');
    customInput.value = answer.custom;
    customInput.hidden = !answer.selected.includes('其他');
    customInput.addEventListener('input', () => { answer.custom = customInput.value; invalidateResult(); updateContinue(); });
    const actions = element('div', 'flow-actions');
    const left = element('div');
    const skip = element('button', 'flow-skip', '跳过');
    skip.type = 'button';
      skip.addEventListener('click', () => { answer.selected = []; answer.custom = ''; customInput.value = ''; updateOptions(); revealNext(index); });
    left.append(skip);
      const continueButton = element('button', 'flow-primary', index === questions.length - 1 ? '查看选题大纲 →' : '继续到下一题 →');
    continueButton.type = 'button';
      continueButton.addEventListener('click', () => revealNext(index));
    actions.append(left, continueButton);
      block.append(head, options, customInput, actions);
      stage.append(block);

    function updateOptions() {
      invalidateResult();
      [...options.children].forEach((button, index) => {
        const label = index === question.options.length ? '其他' : question.options[index][0];
        button.setAttribute('aria-checked', String(answer.selected.includes(label)));
      });
      customInput.hidden = !answer.selected.includes('其他');
      updateContinue();
    }
    function updateContinue() {
      continueButton.disabled = !answer.selected.length || (answer.selected.includes('其他') && !answer.custom.trim() && answer.selected.length === 1);
    }
    updateContinue();
    }
  }

  function describe(index) {
    const answer = answers[index];
    return answer.selected.map(label => label === '其他' ? answer.custom.trim() : label).filter(Boolean).join('、') || '未指定';
  }

  function invalidateResult() {
    if (!stage.querySelector('#outlineTurn')) return;
    removeComposition();
    stage.querySelector('#outlineTurn')?.remove();
    flow.classList.remove('outline-expanded');
    stage.querySelector('#courseBuildStep')?.remove();
    const lastActions = stage.querySelector('#flowQuestion4 .flow-actions');
    if (lastActions) lastActions.hidden = false;
  }

  function renderResult() {
    if (stage.querySelector('#outlineTurn')) return;
    stage.querySelector('#flowQuestion4 .flow-actions').hidden = true;
    stage.querySelector('#planningStep')?.setAttribute('data-state', 'done');
    const buildStep = createStep('打造课程', 3, 'active', 'courseBuildStep');
    const turn = assistantTurn('outlineTurn', 'AI 正在组织课程大纲', '这是为你整理的选题大纲', '先在画布中查看单元和章节；需要调整时，点击节点即可编辑。确认后我会生成课程预览。');
    turn.body.append(window.createCourseOutline({
      goal,
      topic: questions === topicQuestions.operator ? 'operator' : questions === topicQuestions.inference ? 'inference' : 'training',
      depth: describe(3),
      direction: describe(1),
      onBack: () => {
        removeComposition();
        buildStep.remove();
        flow.classList.remove('outline-expanded');
        stage.querySelector('#flowQuestion4 .flow-actions').hidden = false;
        scrollToTurn(stage.querySelector('#flowQuestion4'));
      },
      onClose: close,
      onChange: removeComposition,
      onConfirm: appendCourseTurn
    }));
    buildStep.append(turn.element);
    stage.append(buildStep);
    scrollToTurn(buildStep);
  }

  function assistantTurn(id, label, title, lead) {
    const item = element('section', 'assistant-turn');
    item.id = id;
    const body = element('div', 'assistant-turn-body');
    body.append(element('p', 'assistant-label', label));
    const heading = element('h2', '', title);
    heading.tabIndex = -1;
    body.append(heading, element('p', 'assistant-lead', lead));
    item.append(body);
    return { element: item, body, heading };
  }

  function scrollToTurn(item) {
    if (!item) return;
    item.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    item.querySelector('h2,h3')?.focus({ preventScroll: true });
  }

  function removeComposition() {
    composition?.cancel();
    composition = null;
    stage.querySelector('#courseTurn')?.remove();
  }

  function appendCourseTurn(outline) {
    removeComposition();
    stage.querySelector('#courseBuildStep')?.setAttribute('data-state', 'done');
    const previewStep = createStep('查看课程预览', 4, 'active', 'coursePreviewStep');
    const turn = assistantTurn('courseTurn', 'AI 正在生成课程预览', '正在为你编写这门课程', '下方纸张会逐字写入课程草稿，课程卡片同时逐步展开单元和讲次。当前是探索版示例演示。');
    composition = window.createCourseCompose(outline, () => previewStep.setAttribute('data-state', 'done'));
    turn.body.append(composition.element);
    const actions = element('div', 'preview-action-panel');
    const start = element('button', 'preview-start', '开始学习');
    start.type = 'button';
    start.addEventListener('click', () => { window.location.href = `detail.html?title=${encodeURIComponent(outline.goal)}`; });
    const plan = element('button', 'preview-plan', '＋ 加入学习计划');
    plan.type = 'button';
    plan.setAttribute('aria-pressed', 'false');
    plan.addEventListener('click', () => {
      const added = plan.getAttribute('aria-pressed') === 'true';
      plan.setAttribute('aria-pressed', String(!added));
      plan.textContent = added ? '＋ 加入学习计划' : '✓ 已加入学习计划';
    });
    actions.append(start, plan);
    previewStep.append(turn.element, actions);
    stage.append(previewStep);
    scrollToTurn(previewStep);
  }

  function close() {
    removeComposition();
    flow.hidden = true;
    flow.classList.remove('outline-expanded');
    background.forEach(node => { node.inert = false; });
    document.body.style.overflow = '';
    if (returnFocus) returnFocus.focus();
  }

  window.openCourseFlow = value => {
    goal = value;
    goalElement.textContent = value;
    questions = /算子|Ascend\s*C/i.test(value) ? topicQuestions.operator : /推理|部署|服务化/i.test(value) ? topicQuestions.inference : trainingQuestions;
    answers = questions.map(() => ({ selected: [], custom: '' }));
    revealed = 1;
    returnFocus = document.activeElement;
    flow.hidden = false;
    flow.classList.remove('outline-expanded');
    background.forEach(node => { node.inert = true; });
    document.body.style.overflow = 'hidden';
    renderQuestions();
  };

  closeButton.addEventListener('click', close);
  flow.addEventListener('keydown', event => {
    if (event.key === 'Escape') { close(); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...flow.querySelectorAll('button:not([disabled]),textarea:not([hidden])')];
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
})();
