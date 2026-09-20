(() => {
  const courseTab = document.getElementById('courseTab');
  const askTab = document.getElementById('askTab');
  const form = document.getElementById('heroForm');
  const input = document.getElementById('heroInput');
  const hint = document.getElementById('searchFeedback');
  const quickMenu = document.getElementById('quickMenu');
  let mode = 'course';

  function setMode(nextMode) {
    mode = nextMode;
    const course = mode === 'course';
    courseTab.setAttribute('aria-selected', String(course));
    askTab.setAttribute('aria-selected', String(!course));
    input.placeholder = course ? '使用 / 获取快捷选项' : '输入正在解决的开发问题';
    hint.textContent = course ? '不知道如何开始？输入 / 选择开发任务，或直接描述你的学习目标' : '描述报错、环境与预期结果，AI 将从问题出发协助定位';
  }

  courseTab.addEventListener('click', () => setMode('course'));
  askTab.addEventListener('click', () => setMode('ask'));
  input.addEventListener('input', () => {
    quickMenu.hidden = !(input.value.trim() === '/' || input.value.trim() === '／');
  });
  input.addEventListener('keydown', event => {
    if (event.key === '/' && !input.value) requestAnimationFrame(() => { quickMenu.hidden = false; });
    if (event.key === 'Escape') quickMenu.hidden = true;
  });
  quickMenu.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      input.value = button.dataset.prompt || button.textContent.trim();
      quickMenu.hidden = true;
      input.focus();
    });
  });
  document.addEventListener('click', event => {
    if (!form.contains(event.target)) quickMenu.hidden = true;
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
