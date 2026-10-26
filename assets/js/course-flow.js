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
        title: '你想开发哪一类算子？',
        type: '单选题',
        options: [
          ['Ascend C', '使用 Ascend C 编程模型开发昇腾原生算子，适合从入门到进阶实践。'],
          ['CATLASS', '基于高性能模板库开发矩阵类算子，适合关注 Cube 与性能优化。'],
          ['Triton', '使用 Triton 编写 GPU 风格的算子程序，适合探索跨平台算子开发。']
        ]
      },
      {
        title: '你最想先完成哪类算子任务？',
        type: '单选题',
        options: [
          ['简单 Vector 算子', '从向量加法开始，跑通实现、编译、运行与正确性验证。'],
          ['泛化 Vector 算子', '让算子适配不同输入形状，并学习 Tiling 与多核切分。'],
          ['Cube 矩阵算子', '围绕矩阵乘法学习 Cube 计算、数据布局与性能分析。'],
          ['CV 融合算子', '结合视觉计算场景，完成融合实现并比较性能收益。']
        ]
      },
      {
        title: '你目前的开发基础更接近哪种情况？',
        type: '单选题',
        options: [
          ['刚开始接触算子开发', '希望从概念和简单样例开始，边学边完成第一个算子。'],
          ['有 C/C++ 或 AI 框架基础', '了解编程或模型计算，希望补齐昇腾算子开发流程。'],
          ['做过算子，想提升性能', '已有实现经验，重点关注调试、性能分析和优化。']
        ]
      }
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
  let isInferenceCertification = false;
  let certificationLevel = '工作级';
  let returnFocus = null;
  let composition = null;
  let stepTimer = null;
  let sourceTimers = [];

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function clearSourceTimers() {
    sourceTimers.forEach(timer => window.clearTimeout(timer));
    sourceTimers = [];
  }

  const stepIcons = {
    1: 'assets/images/figma-home/flow-search.svg',
    2: 'assets/images/figma-home/flow-learning-path.svg',
    3: 'assets/images/figma-home/flow-course-outline.svg',
    4: 'assets/images/figma-home/flow-course-preview.svg'
  };

  function createStep(title, number, state = 'done', id) {
    const entry = element('section', 'flow-step');
    if (id) entry.id = id;
    entry.dataset.state = state;
    entry.setAttribute('aria-label', title + '，第 ' + number + ' 步，共 ' + (flow.dataset.flowSteps || '4') + ' 步');
    const titleRow = element('div', 'flow-step-title');
    const icon = document.createElement('img');
    icon.className = 'flow-step-icon';
    icon.src = stepIcons[number];
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');
    titleRow.append(
      icon,
      element('h2', '', title),
      element('span', 'flow-step-count', '｜第 ' + number + ' 步｜共 ' + (flow.dataset.flowSteps || '4') + ' 步'),
      element('span', 'flow-step-state')
    );
    entry.append(titleRow);
    return entry;
  }

  function sourceRow(title, url, official = true) {
    const source = element('div', 'flow-process-source');
    const icon = document.createElement('img');
    icon.className = 'flow-process-source-icon';
    icon.src = 'assets/images/figma-home/source-map.png';
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');
    source.append(
      icon,
      element('span', 'flow-process-source-title', title),
      element('span', 'flow-process-url', url)
    );
    if (official) source.append(element('span', 'flow-process-official', '官方'));
    return source;
  }

  function createSearchEvidence() {
    const entry = createStep('正在搜索相关资料', 1, 'active', 'searchStep');
    entry.classList.add('flow-search-step');
    const trustNotice = element('div', 'flow-trust-notice');
    const trustCopy = element('div', 'flow-trust-copy');
    trustCopy.append(
      element('strong', '', '结合可信资料，正在补齐你的学习内容'),
      element('p', '', 'AI 会对齐官方版本、可运行样例与已验证知识点，再组织成适合当前目标的课程内容。')
    );
    trustNotice.append(trustCopy);
    const evidenceTags = element('div', 'flow-evidence-tags');
    [
      ['官方文档', '版本已核对'],
      ['Sample 仓库', '示例可运行'],
      ['课程知识点', '结构化拆解'],
      ['社区案例', '方案已复现']
    ].forEach(([label, state]) => {
      const tag = element('span', 'flow-evidence-tag');
      tag.append(element('b', '', label), element('small', '', state));
      evidenceTags.append(tag);
    });
    trustNotice.append(evidenceTags);
    const tech = element('div', 'flow-process-tech');
    const topicTags = isInferenceCertification ? ['推理开发者认证', '认证知识点', '学习路径'] : /算子|Ascend\s*C|Triton|CATLASS/i.test(goal) ? ['CANN', '算子开发', '编程模型'] : ['昇腾生态', '课程知识点', '开发实践'];
    topicTags.forEach(name => tech.append(element('span', '', name)));
    const sources = isInferenceCertification ? [
      ['推理开发者认证考试说明', 'hiascend.com'], ['vLLM-Ascend 推理部署与调优', 'hiascend.com'], ['昇腾推理开发与性能分析', 'hiascend.com'],
      ['MindIE Motor 大规模推理服务', 'hiascend.com'], ['推理性能 Profiling 指南', 'hiascend.com'], ['推理开发者认证课程目录', 'hiascend.com']
    ] : [
      ['Ascend C 算子开发指南', 'hiascend.com'], ['Ascend C 编程模型说明', 'hiascend.com'], ['CANN 算子开发流程', 'hiascend.com'],
      ['算子工程化实践课程', 'hiascend.com'], ['Ascend C API 参考', 'hiascend.com'], ['算子编译与运行指南', 'hiascend.com'],
      ['算子调试工具使用说明', 'hiascend.com'], ['算子性能分析指南', 'hiascend.com'], ['昇腾社区精选案例', 'hiascend.com']
    ];
    const sourceList = element('div', 'flow-source-list');
    const visibleSources = sources.slice(0, 3);
    visibleSources.forEach(([title, url], index) => {
      const row = sourceRow(title, url);
      row.classList.add('source-pending');
      sourceList.append(row);
      sourceTimers.push(window.setTimeout(() => {
        row.classList.remove('source-pending');
        if (index === visibleSources.length - 1) entry.dataset.state = 'done';
      }, 420 * (index + 1)));
    });
    const more = element('button', 'flow-more-sources', '查看更多资料');
    more.type = 'button';
    more.setAttribute('aria-expanded', 'false');
    const morePanel = element('div', 'flow-more-panel');
    morePanel.hidden = true;
    sources.slice(3).forEach(([title, url]) => morePanel.append(sourceRow(title, url)));
    more.addEventListener('click', () => {
      const expanded = more.getAttribute('aria-expanded') === 'true';
      more.setAttribute('aria-expanded', String(!expanded));
      more.textContent = expanded ? '查看更多资料' : '收起资料';
      morePanel.hidden = expanded;
    });
    entry.append(trustNotice, tech, sourceList, more, morePanel);
    return entry;
  }

  function renderQuestions(count = 1, focusIndex = 0) {
    removeComposition();
    window.clearTimeout(stepTimer);
    clearSourceTimers();
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
    intro.append(heading);
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
        else if (!question.multiple && questions === topicQuestions.operator) renderOperatorMap();
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
    flow.classList.remove('outline-expanded', 'course-preview-expanded', 'knowledge-answer', 'certification-search-flow');
    delete flow.dataset.flowSteps;
    stage.querySelector('.kmap')?.destroy?.();
    stage.querySelector('#courseBuildStep')?.remove();
    const lastActions = stage.querySelector('.flow-question-block:last-of-type .flow-actions');
    if (lastActions) lastActions.hidden = false;
  }

  function renderResult() {
    if (isInferenceCertification) { renderInferenceCertificationSearch(); return; }
    if (questions === topicQuestions.operator) { renderOperatorMap(); return; }
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
      startExpanded: true,
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


  function renderCertificationLevel() {
    window.clearTimeout(stepTimer);
    clearSourceTimers();
    flow.dataset.flowSteps = '4';
    flow.classList.add('knowledge-answer', 'certification-search-flow');
    stage.replaceChildren();
    stage.setAttribute('aria-label', '选择推理开发者认证级别');
    const step = createStep('确认认证目标', 2, 'active', 'certificationLevelStep');
    const turn = assistantTurn('certificationLevelTurn', '先确认你的认证目标', '您目前想要考取的是？', '选择一个认证级别，我会据此整理对应的课程与考试学习路径。');
    const grid = element('div', 'certification-goal-options cert-level-options');
    const levels = [
      ['入门级', '建立推理开发基础，理解核心概念与入门实践。'],
      ['工作级', '掌握推理服务部署、开发流程与性能调优。'],
      ['开发级', '深入推理架构、关键特性与规模化性能优化。']
    ];
    levels.forEach(([label, detail]) => {
      const card = element('button', 'certification-goal-option cert-level-option');
      card.type = 'button';
      card.setAttribute('aria-label', label + '：' + detail);
      card.append(element('strong', '', label), element('span', '', detail));
      card.addEventListener('click', () => { certificationLevel = label; renderInferenceCertificationMap(); });
      grid.append(card);
    });
    turn.body.append(grid);
    step.append(turn.element);
    stage.append(step);
    scrollToTurn(step);
  }

  function renderInferenceCertificationMap() {
    window.clearTimeout(stepTimer);
    clearSourceTimers();
    flow.dataset.flowSteps = '4';
    flow.classList.add('knowledge-answer', 'certification-search-flow');
    stage.replaceChildren();
    stage.setAttribute('aria-label', '推理开发者认证学习方案');
    const mapStep = createStep('查看认证知识地图', 3, 'active', 'certificationMapStep');
    const turn = assistantTurn('certificationMapTurn', '结合您的目标，已为你生成专属的学习路径', '推理开发者认证（' + certificationLevel + '）', '先浏览理论学习、课程与案例，再查看对应考试内容；你可以编辑路径，也可以打开完整知识图谱。');
    const frame = element('iframe', 'certification-map-frame');
    frame.title = '推理开发者认证知识地图';
    frame.src = 'knowledge-map.html?version=v2&flow=search&level=' + encodeURIComponent(certificationLevel);
    frame.loading = 'eager';
    frame.addEventListener('load', () => { try { frame.contentWindow.postMessage({type:'cert-map:measure'}, location.origin); } catch {} });
    turn.body.append(frame);
    mapStep.append(turn.element);
    stage.append(mapStep);
    flow.scrollTop = 0;
  }

  window.addEventListener('message', event => {
    if (event.origin !== location.origin || !event.source) return;
    if (event.data?.type === 'cert-map:resize') {
      const frame = stage.querySelector('.certification-map-frame');
      if (frame?.contentWindow === event.source && Number.isFinite(event.data.height)) frame.style.height = `${Math.max(800, Math.min(5000, event.data.height))}px`;
    }
    if (event.data?.type === 'cert-map:preview') {
      const frame = stage.querySelector('.certification-map-frame');
      if (frame?.contentWindow !== event.source) return;
      const level = ['入门级','工作级','开发级'].includes(event.data.level) ? event.data.level : certificationLevel;
      const slug = level === '入门级' ? 'entry' : level === '开发级' ? 'developer' : 'work';
      const params = new URLSearchParams({course:'inference', certification:'inference-developer-' + slug, goal:'取得' + level + '推理开发者认证'});
      window.location.href = 'course-preview.html?' + params.toString();
    }
  });

  function renderInferenceCertificationSearch() {
    window.clearTimeout(stepTimer);
    clearSourceTimers();
    flow.dataset.flowSteps = '4';
    flow.classList.add('knowledge-answer', 'certification-search-flow');
    stage.replaceChildren();
    stage.setAttribute('aria-label', '推理开发者认证资料检索');
    const query = element('div', 'cert-search-user-query', goal || '我要进行推理开发者认证');
    const searchStep = createSearchEvidence();
    stage.append(query, searchStep);
    flow.scrollTop = 0;
    stepTimer = window.setTimeout(renderCertificationLevel, 1800);
  }

  function renderOperatorMap() {
    stage.querySelector('.study-plan')?.destroy?.();
    flow.setAttribute('aria-labelledby', 'flowHeading');
    flow.removeAttribute('aria-label');
    clearSourceTimers();
    window.clearTimeout(stepTimer);
    flow.dataset.flowSteps = '3';
    flow.classList.add('knowledge-answer');
    stage.replaceChildren();
    stage.setAttribute('aria-label', '算子开发学习方案');
    const selectedRoute = answers[0].selected[0] || 'Ascend C';
    const routeKey = selectedRoute === 'CATLASS' ? 'catlass' : selectedRoute === 'Triton' ? 'triton' : 'ascend';
    const tasks = {
      '简单 Vector 算子': ['ascend-0', 'Ascend C 入门简单Vector算子开发'],
      '泛化 Vector 算子': ['ascend-1', 'Ascend C进阶泛化Vector算子开发'],
      'Cube 矩阵算子': ['ascend-2', 'Ascend C高级Cube算子开发'],
      'CV 融合算子': ['ascend-3', 'Ascend C高级CV融合算子']
    };
    const selectedTask = tasks[answers[1].selected[0]] || tasks['简单 Vector 算子'];
    const step = createStep('确认并编辑你的知识地图', 3, 'active', 'courseBuildStep');
    const turn = assistantTurn('operatorMapTurn', '已根据你的选择生成学习知识地图', '从算子开发目标，整理出一条可编辑的学习路径', '你可以展开路径查看课程、增删课程或从课程库补充内容；确认课程后，设置学会日期，生成每天的学习安排。');
    const summary = element('div', 'operator-map-context');
    [
      ['开发类型', selectedRoute],
      ['目标任务', answers[1].selected[0] || '简单 Vector 算子'],
      ['当前基础', answers[2].selected[0] || '刚开始接触算子开发']
    ].forEach(([label, value]) => {
      const chip = element('span', 'operator-map-chip');
      chip.append(element('small', '', label), element('strong', '', value));
      summary.append(chip);
    });
    turn.body.append(summary);
    const map = window.createKnowledgeOutline({
      goal: goal,
      source: 'goal',
      workflow: true,
      initialPath: routeKey,
      initialCourseId: selectedTask[0],
      onStart: function(course, selectedCourses) {
        renderOperatorPlan(selectedCourses || [course]);
      }
    });
    turn.body.append(map);
    step.append(turn.element);
    stage.append(step);
    scrollToTurn(step);
  }

  function renderOperatorPlan(courses) {
    stage.querySelector('.kmap')?.destroy?.();
    stage.replaceChildren();
    flow.classList.add('knowledge-answer');
    flow.removeAttribute('aria-labelledby');
    flow.setAttribute('aria-label', '课程学习计划');
    const plan = window.createLearningPlan({
      courses,
      goal,
      onBack: renderOperatorMap,
      onStart: function(course, lesson) {
        const params = new URLSearchParams({course: course.id?.startsWith('catalog-') ? course.id.slice(8) : 'operator', title: course.title});
        if (lesson) params.set('lesson', lesson);
        if (course.id) params.set('planCourse', course.id);
        window.location.href = 'learn.html?' + params.toString();
      }
    });
    stage.append(plan);
    flow.scrollTop = 0;
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
    flow.classList.add('course-preview-expanded');
    const fullscreenHeader = element('div', 'course-preview-fullscreen-header');
    fullscreenHeader.append(element('strong', '', '课程预览'));
    const exitPreview = element('button', '', '退出全屏');
    exitPreview.type = 'button';
    exitPreview.addEventListener('click', () => { flow.classList.remove('course-preview-expanded'); scrollToTurn(previewStep); });
    fullscreenHeader.append(exitPreview);
    composition = window.createCourseCompose(outline, () => previewStep.setAttribute('data-state', 'done'), () => { window.location.href = `learn.html?title=${encodeURIComponent(outline.goal)}`; });
    turn.body.append(composition.element);
    const actions = element('div', 'preview-action-panel');
    const start = element('button', 'preview-start', '开始学习');
    start.type = 'button';
    start.addEventListener('click', () => { window.location.href = `learn.html?title=${encodeURIComponent(outline.goal)}`; });
    const plan = element('button', 'preview-plan', '＋ 加入学习计划');
    plan.type = 'button';
    plan.setAttribute('aria-pressed', 'false');
    plan.addEventListener('click', () => {
      const added = plan.getAttribute('aria-pressed') === 'true';
      plan.setAttribute('aria-pressed', String(!added));
      plan.textContent = added ? '＋ 加入学习计划' : '✓ 已加入学习计划';
    });
    actions.append(start, plan);
    previewStep.append(fullscreenHeader, turn.element, actions);
    stage.append(previewStep);
    fullscreenHeader.querySelector('button')?.focus({ preventScroll: true });
  }

  function close() {
    removeComposition();
    flow.hidden = true;
    clearSourceTimers();
    flow.classList.remove('outline-expanded', 'course-preview-expanded', 'knowledge-answer', 'certification-search-flow');
    delete flow.dataset.flowSteps;
    stage.querySelector('.kmap')?.destroy?.();
    stage.querySelector('.study-plan')?.destroy?.();
    background.forEach(node => { node.inert = false; });
    document.body.style.overflow = '';
    if (returnFocus) returnFocus.focus();
  }

  window.openCourseFlow = (value, options = {}) => {
    goal = value;
    goalElement.textContent = value;
    isInferenceCertification = /推理开发者认证/.test(value);
    certificationLevel = '工作级';
    questions = /算子|Ascend\s*C/i.test(value) ? topicQuestions.operator : /推理|部署|服务化/i.test(value) ? topicQuestions.inference : trainingQuestions;
    answers = questions.map(() => ({ selected: [], custom: '' }));
    revealed = 1;
    returnFocus = document.activeElement;
    flow.hidden = false;
    clearSourceTimers();
    flow.classList.remove('outline-expanded', 'course-preview-expanded', 'knowledge-answer', 'certification-search-flow');
    delete flow.dataset.flowSteps;
    if (questions === topicQuestions.operator) flow.dataset.flowSteps = '3';
    stage.querySelector('.kmap')?.destroy?.();
    stage.querySelector('.study-plan')?.destroy?.();
    background.forEach(node => { node.inert = true; });
    document.body.style.overflow = 'hidden';
    flow.setAttribute('aria-labelledby', 'flowHeading');
    flow.removeAttribute('aria-label');
    if (isInferenceCertification) { renderInferenceCertificationSearch(); return; }
    renderQuestions();
  };

  closeButton.addEventListener('click', close);
  flow.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (flow.classList.contains('course-preview-expanded')) { flow.classList.remove('course-preview-expanded'); scrollToTurn(stage.querySelector('#coursePreviewStep')); return; }
      if (flow.classList.contains('outline-expanded')) { flow.querySelector('.outline-toolbar button')?.click(); return; }
      close(); return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...flow.querySelectorAll('button:not([disabled]),textarea:not([hidden])')];
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
})();
