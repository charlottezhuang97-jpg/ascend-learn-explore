(() => {
  const levels = ['基础理解', '标准实践', '深入掌握'];
  const templates = {
    training: [
      ['训练目标与环境', ['认识昇腾训练流程', '准备开发环境与数据']],
      ['模型与数据基础', ['理解模型结构和输入输出', '构建与检查训练数据']],
      ['完成第一次训练', ['启动一个模型训练任务', '观察训练结果与日志']],
      ['定位训练问题', ['排查 Loss 与精度问题', '调整参数并复盘结果']],
      ['扩展训练规模', ['认识并行训练方式', '验证多设备训练流程']],
      ['迁移与适配', ['梳理现有模型迁移步骤', '检查算子与框架适配']],
      ['性能分析', ['认识吞吐和资源指标', '尝试训练性能优化']],
      ['项目复盘', ['整理训练实践记录', '形成可复用的训练方案']]
    ],
    operator: [
      ['算子开发入门', ['理解算子在计算图中的作用', '准备 Ascend C 开发环境']],
      ['基础计算与数据', ['认识张量、形状和数据类型', '理解数据搬运与计算流程']],
      ['第一个算子', ['编写基础算子逻辑', '完成编译与运行验证']],
      ['正确性检查', ['设计输入输出测试', '定位精度与边界问题']],
      ['调试与排错', ['阅读运行信息', '复盘常见编译与执行问题']],
      ['性能优化', ['观察计算与访存瓶颈', '尝试调整执行策略']],
      ['真实场景适配', ['整理现有计算需求', '完成一次算子适配实践']],
      ['项目复盘', ['沉淀调试记录', '整理可复用的开发流程']]
    ],
    inference: [
      ['推理任务与环境', ['理解模型推理链路', '准备部署与调用环境']],
      ['模型输入输出', ['检查模型格式与输入', '完成一次本地推理调用']],
      ['服务化入门', ['设计服务接口', '验证端到端调用']],
      ['稳定性与排错', ['观察运行日志', '处理常见部署问题']],
      ['性能指标', ['理解时延、吞吐与资源指标', '建立性能基线']],
      ['性能优化实践', ['定位关键瓶颈', '比较优化前后结果']],
      ['场景接入', ['将推理服务接入应用', '验证调用与异常处理']],
      ['项目复盘', ['整理部署方案', '形成可复现的实践记录']]
    ]
  };

  function node(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  window.createCourseOutline = ({ goal, topic, depth, direction, onBack, onClose, onConfirm, onChange }) => {
    const flow = document.getElementById('courseFlow');
    const stage = node('div', 'outline-stage');
    const source = templates[topic] || templates.training;
    const unitCount = depth === '轻量速览' ? 4 : depth === '系统精通' ? 8 : depth === '标准深度' ? 6 : 5;
    const units = source.slice(0, unitCount).map(([title, chapters], index) => ({
      id: `u-${index}`,
      title,
      chapters: chapters.map((chapterTitle, chapterIndex) => ({
        id: `c-${index}-${chapterIndex}`,
        title: chapterTitle,
        difficulty: chapterIndex === 0 ? '基础理解' : '标准实践'
      }))
    }));
    let nextChapterId = 100;
    let editing = false;
    let expanded = false;
    let selected = null;
    let confirmed = false;

    function chapterTotal() {
      return units.reduce((total, unit) => total + unit.chapters.length, 0);
    }
    function selectedNode() {
      if (!selected) return null;
      const unit = units.find(item => item.id === selected.unitId);
      if (!unit) return null;
      return selected.chapterId ? { unit, chapter: unit.chapters.find(item => item.id === selected.chapterId) } : { unit };
    }
    function select(unitId, chapterId) {
      selected = { unitId, chapterId };
      editing = true;
      render();
      stage.querySelector('.outline-inspector input')?.focus();
    }
    function addChapter(unit) {
      const chapter = {
        id: `c-new-${nextChapterId++}`,
        title: `新增章节 ${unit.chapters.length + 1}`,
        difficulty: '标准实践'
      };
      unit.chapters.push(chapter);
      confirmed = false;
      onChange?.();
      render();
      stage.querySelector(`[data-node-id="${chapter.id}"]`)?.scrollIntoView({ block: 'nearest' });
    }
    function makeNode(kind, unit, chapter) {
      const button = node('button', 'outline-node');
      button.type = 'button';
      const item = chapter || unit;
      button.dataset.nodeId = item.id;
      if (selected?.unitId === unit.id && (selected.chapterId || null) === (chapter?.id || null)) button.classList.add('selected');
      button.setAttribute('aria-label', chapter ? `编辑章节：${chapter.title}` : `编辑单元：${unit.title}`);
      button.append(node('small', '', chapter ? `章节 ${String(unit.chapters.indexOf(chapter) + 1).padStart(2, '0')}` : `单元 ${String(units.indexOf(unit) + 1).padStart(2, '0')}`), node('strong', '', item.title));
      if (chapter) button.append(node('span', 'outline-level', chapter.difficulty));
      else button.append(node('em', '', `${unit.chapters.length} 个章节 · 点击编辑`));
      button.addEventListener('click', () => select(unit.id, chapter?.id || null));
      return button;
    }
    function renderInspector(container) {
      const inspector = node('aside', 'outline-inspector');
      const item = selectedNode();
      if (!item) {
        inspector.append(node('h3', '', '编辑课程大纲'), node('p', '', '点击左侧的单元或章节，调整结构与学习难度。'));
        container.append(inspector);
        return;
      }
      const { unit, chapter } = item;
      inspector.append(node('h3', '', chapter ? '编辑章节' : '编辑单元'), node('p', '', chapter ? '修改章节名称和学习深浅难度。' : '修改单元名称，或增加这个单元下的章节。'));
      const label = node('label', '', chapter ? '章节名称' : '单元名称');
      const input = node('input');
      input.type = 'text';
      input.value = chapter ? chapter.title : unit.title;
      input.maxLength = 80;
      input.id = 'outlineTitleInput';
      label.htmlFor = input.id;
      input.addEventListener('input', () => {
        const value = input.value.trim();
        if (!value) return;
        (chapter || unit).title = value;
        confirmed = false;
        onChange?.();
        const confirmButton = stage.querySelector('.outline-footer button.primary');
        if (confirmButton) { confirmButton.disabled = false; confirmButton.textContent = '确认大纲'; }
        const status = stage.querySelector('.outline-footer p');
        if (status) { status.textContent = '当前为可编辑的探索版选题大纲。'; status.classList.remove('outline-confirmed'); }
        const card = stage.querySelector(`[data-node-id="${(chapter || unit).id}"]`);
        if (card) {
          card.querySelector('strong').textContent = value;
          card.setAttribute('aria-label', chapter ? `编辑章节：${value}` : `编辑单元：${value}`);
        }
      });
      input.addEventListener('blur', () => { if (!input.value.trim()) input.value = (chapter || unit).title; });
      inspector.append(label, input);
      if (chapter) {
        inspector.append(node('label', '', '学习深浅难度'));
        const difficulty = node('div', 'outline-difficulty');
        difficulty.setAttribute('role', 'radiogroup');
        difficulty.setAttribute('aria-label', '学习深浅难度');
        levels.forEach(level => {
          const choice = node('button', '', level);
          choice.type = 'button';
          choice.setAttribute('role', 'radio');
          choice.setAttribute('aria-checked', String(chapter.difficulty === level));
          choice.addEventListener('click', () => {
            if (chapter.difficulty === level) return;
            chapter.difficulty = level;
            confirmed = false;
            onChange?.();
            render();
          });
          difficulty.append(choice);
        });
        inspector.append(difficulty);
      } else {
        inspector.append(node('label', '', '章节数目'));
        const count = node('div', 'outline-chapter-count');
        count.append(node('span', '', `当前 ${unit.chapters.length} 章`), node('strong', '', `增加后 ${unit.chapters.length + 1} 章`));
        const add = node('button', 'outline-add-button', '+ 增加一个章节');
        add.type = 'button';
        add.addEventListener('click', () => addChapter(unit));
        inspector.append(count, add);
      }
      container.append(inspector);
    }
    function render() {
      const oldBoard = stage.querySelector('.outline-board');
      const boardPosition = oldBoard ? [oldBoard.scrollLeft, oldBoard.scrollTop] : [0, 0];
      stage.replaceChildren();
      const top = node('div', 'outline-top');
      const intro = node('div');
      intro.append(node('p', 'outline-kicker', '课程选题大纲 · 探索版预览'));
      const heading = node('h2', '', '查看并调整你的课程结构');
      heading.id = 'outlineHeading';
      heading.tabIndex = -1;
      intro.append(heading, node('p', 'outline-description', '先全屏查看单元与章节，再点击节点编辑。你可以增加单元下的章节，也可以调整每章的学习深浅难度。'));
      const toolbar = node('div', 'outline-toolbar');
      const expand = node('button', '', expanded ? '退出全屏' : '全屏查看大纲');
      expand.type = 'button';
      expand.addEventListener('click', () => {
        expanded = !expanded;
        flow.classList.toggle('outline-expanded', expanded);
        render();
        flow.scrollTop = 0;
      });
      const edit = node('button', editing ? 'primary' : '', editing ? '完成编辑' : '编辑大纲');
      edit.type = 'button';
      edit.addEventListener('click', () => { editing = !editing; if (!editing) selected = null; render(); });
      toolbar.append(expand, edit);
      top.append(intro, toolbar);
      const shell = node('div', 'outline-shell');
      const summary = node('div', 'outline-summary');
      summary.append(node('div', 'outline-summary-label', '课程讲解结构'));
      summary.append(node('h3', '', `${goal} · 学习选题大纲`));
      summary.append(node('p', '', `面向当前目标，按“${direction === '未指定' ? '适合你的实践方向' : direction}”组织。以下内容可在当前页面修改。`));
      const meta = node('div', 'outline-meta');
      meta.append(node('span', 'outline-count', `${units.length} 个单元 · ${chapterTotal()} 个章节`), node('span', '', '课节深度'));
      levels.forEach(level => meta.append(node('span', 'outline-depth-key', level)));
      summary.append(meta);
      summary.append(node('p', 'outline-scroll-hint', '在手机上左右滑动画布，查看单元和章节。'));
      const content = node('div', editing ? 'outline-content editing' : 'outline-content');
      const board = node('div', 'outline-board');
      board.setAttribute('aria-label', '课程单元与章节结构');
      let drag = null;
      board.addEventListener('pointerdown', event => {
        if (event.target.closest('button')) return;
        drag = { x: event.clientX, y: event.clientY, left: board.scrollLeft, top: board.scrollTop };
        board.setPointerCapture(event.pointerId);
        board.classList.add('dragging');
      });
      board.addEventListener('pointermove', event => {
        if (!drag) return;
        board.scrollLeft = drag.left - (event.clientX - drag.x);
        board.scrollTop = drag.top - (event.clientY - drag.y);
      });
      const stopDrag = () => { drag = null; board.classList.remove('dragging'); };
      board.addEventListener('pointerup', stopDrag);
      board.addEventListener('pointercancel', stopDrag);
      const tree = node('div', 'outline-tree');
      const root = node('div', 'outline-root', goal);
      root.append(node('small', '', `${units.length} 个单元 · ${chapterTotal()} 个章节`));
      tree.append(root);
      const unitList = node('div', 'outline-units');
      units.forEach(unit => {
        const row = node('div', 'outline-unit-row');
        row.append(makeNode('unit', unit));
        const chapterList = node('div', 'outline-chapters');
        unit.chapters.forEach(chapter => {
          const wrapper = node('div', 'outline-chapter');
          wrapper.append(makeNode('chapter', unit, chapter));
          chapterList.append(wrapper);
        });
        if (editing) {
          const add = node('button', 'outline-add-inline', '+ 增加章节');
          add.type = 'button';
          add.setAttribute('aria-label', `为${unit.title}增加章节`);
          add.addEventListener('click', () => { selected = { unitId: unit.id, chapterId: null }; addChapter(unit); });
          chapterList.append(add);
        }
        row.append(chapterList);
        unitList.append(row);
      });
      tree.append(unitList);
      board.append(tree);
      content.append(board);
      if (editing) renderInspector(content);
      shell.append(summary, content);
      const footer = node('div', 'outline-footer');
      const status = node('p', confirmed ? 'outline-confirmed' : '', confirmed ? '大纲已在当前页面确认。' : '当前为可编辑的探索版选题大纲。');
      const actions = node('div', 'outline-footer-actions');
      const back = node('button', '', '返回修改选项');
      back.type = 'button';
      back.addEventListener('click', () => {
        flow.classList.remove('outline-expanded');
        onBack();
      });
      const confirm = node('button', 'primary', confirmed ? '已确认大纲 ✓' : '确认大纲');
      confirm.type = 'button';
      confirm.disabled = confirmed;
      confirm.addEventListener('click', () => {
        confirmed = true;
        expanded = false;
        flow.classList.remove('outline-expanded');
        render();
        onConfirm?.({
          goal,
          units: units.map(unit => ({
            title: unit.title,
            chapters: unit.chapters.map(chapter => ({ title: chapter.title, difficulty: chapter.difficulty }))
          }))
        });
      });
      const close = node('button', '', '返回首页');
      close.type = 'button';
      close.addEventListener('click', onClose);
      actions.append(back, confirm, close);
      footer.append(status, actions);
      stage.append(top, shell, footer);
      board.scrollLeft = boardPosition[0];
      board.scrollTop = boardPosition[1];
    }
    render();
    stage.querySelector('#outlineHeading')?.focus();
    return stage;
  };
})();
