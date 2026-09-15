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
  let step = 0;
  let goal = '';
  let returnFocus = null;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function renderQuestion() {
    stage.replaceChildren();
    const question = questions[step];
    const answer = answers[step];
    const intro = element('div', 'flow-intro');
    const heading = element('h2', '', '让学习方案更适合你');
    heading.id = 'flowHeading';
    intro.append(heading, element('p', '', '先回答几个简短问题，再查看学习建议。你可以跳过不确定的选项。'));
    const progress = element('div', 'flow-progress');
    progress.append(element('strong', '', '构思学习路径'), element('span', '', `第 ${step + 1} 步，共 ${questions.length} 步`));
    const track = element('div', 'flow-track');
    track.setAttribute('aria-hidden', 'true');
    const fill = element('span');
    fill.style.width = `${(step + 1) / questions.length * 100}%`;
    track.append(fill);
    progress.append(track);
    const head = element('div', 'flow-question-head');
    head.append(element('span', 'flow-number', `Q${step + 1}`), element('h3', '', question.title), element('span', 'flow-type', question.type));
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
    customInput.addEventListener('input', () => { answer.custom = customInput.value; updateContinue(); });
    const actions = element('div', 'flow-actions');
    const left = element('div');
    if (step > 0) {
      const back = element('button', 'flow-back', '← 上一步');
      back.type = 'button';
      back.addEventListener('click', () => { step--; renderQuestion(); });
      left.append(back);
    }
    const skip = element('button', 'flow-skip', '跳过');
    skip.type = 'button';
    skip.addEventListener('click', () => { answer.selected = []; answer.custom = ''; advance(); });
    left.append(skip);
    const continueButton = element('button', 'flow-primary', step === questions.length - 1 ? '查看学习建议 →' : '继续 →');
    continueButton.type = 'button';
    continueButton.addEventListener('click', advance);
    actions.append(left, continueButton);
    stage.append(intro, progress, head, options, customInput, actions);

    function updateOptions() {
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
    flow.scrollTop = 0;
    heading.tabIndex = -1;
    heading.focus();
  }

  function advance() {
    if (step < questions.length - 1) {
      step++;
      renderQuestion();
    } else {
      renderResult();
    }
  }

  function describe(index) {
    const answer = answers[index];
    return answer.selected.map(label => label === '其他' ? answer.custom.trim() : label).filter(Boolean).join('、') || '未指定';
  }

  function renderResult() {
    stage.replaceChildren();
    const result = element('div', 'flow-result');
    const heading = element('h2', '', '你的学习路径建议');
    heading.id = 'flowHeading';
    heading.tabIndex = -1;
    result.append(heading, element('p', 'flow-result-lead', '根据你刚才选择的方向，先从基础概念进入实践，再按目标补充进阶内容。你可以返回修改选择。'));
    const summary = element('div', 'flow-summary');
    summary.append(element('strong', '', '学习目标'), element('p', '', goal), element('p', '', `当前基础：${describe(0)} · 实践方向：${describe(1)}`), element('p', '', `预期成果：${describe(2)} · 课程深度：${describe(3)}`));
    result.append(summary);
    const list = element('div', 'flow-steps');
    const direction = describe(1) === '未指定' ? '适合你的入门实践' : describe(1);
    const steps = questions === topicQuestions.operator ? [
      ['01 · 搭好基础', '了解昇腾算子开发流程、开发环境和基础计算概念。'],
      ['02 · 完成一次实践', `围绕“${goal}”，从${direction}开始完成一个可运行的小任务。`],
      ['03 · 调试与复盘', '记录编译、精度与性能问题，再按预期成果增加练习。']
    ] : questions === topicQuestions.inference ? [
      ['01 · 梳理推理链路', '确认模型输入输出、运行环境和调用方式。'],
      ['02 · 完成一次部署', `围绕“${goal}”，从${direction}开始验证一次端到端推理调用。`],
      ['03 · 观察与调优', '记录时延、吞吐和资源使用情况，整理后续优化方向。']
    ] : [
      ['01 · 搭好基础', '梳理昇腾训练环境、框架概念和数据准备，确认运行条件。'],
      ['02 · 完成一次实践', `围绕“${goal}”，从${direction}开始运行一个小规模训练任务，记录过程和问题。`],
      ['03 · 复盘与扩展', '根据希望达到的成果，继续补充模型迁移、并行训练或性能调优练习。']
    ];
    steps.forEach(([title, detail]) => {
      const card = element('div', 'flow-step');
      card.append(element('strong', '', title), element('p', '', detail));
      list.append(card);
    });
    result.append(list);
    const actions = element('div', 'flow-result-actions');
    const revise = element('button', 'secondary', '返回修改选择');
    revise.type = 'button';
    revise.addEventListener('click', () => { step = questions.length - 1; renderQuestion(); });
    const home = element('button', '', '返回首页');
    home.type = 'button';
    home.addEventListener('click', close);
    actions.append(revise, home);
    result.append(actions);
    stage.append(result);
    flow.scrollTop = 0;
    heading.focus();
  }

  function close() {
    flow.hidden = true;
    background.forEach(node => { node.inert = false; });
    document.body.style.overflow = '';
    if (returnFocus) returnFocus.focus();
  }

  window.openCourseFlow = value => {
    goal = value;
    goalElement.textContent = value;
    questions = /算子|Ascend\s*C/i.test(value) ? topicQuestions.operator : /推理|部署|服务化/i.test(value) ? topicQuestions.inference : trainingQuestions;
    answers = questions.map(() => ({ selected: [], custom: '' }));
    step = 0;
    returnFocus = document.activeElement;
    flow.hidden = false;
    background.forEach(node => { node.inert = true; });
    document.body.style.overflow = 'hidden';
    renderQuestion();
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
