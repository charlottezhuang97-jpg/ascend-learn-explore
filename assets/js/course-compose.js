(() => {
  function node(tag, className, value) {
    const item = document.createElement(tag);
    if (className) item.className = className;
    if (value !== undefined) item.textContent = value;
    return item;
  }

  window.createCourseCompose = (outline, onComplete = () => {}) => {
    const wrapper = node('div', 'compose-shell');
    const header = node('div', 'compose-header');
    const title = node('strong', '', '正在编写课程预览');
    const status = node('span', 'compose-status', '正在整理课程结构…');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    const skip = node('button', '', '跳过打字动画');
    skip.type = 'button';
    header.append(title, status, skip);
    const progress = node('div', 'compose-progress');
    progress.setAttribute('aria-hidden', 'true');
    const progressFill = node('span');
    progress.append(progressFill);
    const grid = node('div', 'compose-grid');
    const paperArea = node('div', 'paper-area');
    const paper = node('div', 'paper-sheet');
    paper.setAttribute('aria-label', '逐字写入的课程草稿纸张');
    const paperHeading = node('div', 'paper-heading');
    paperHeading.append(node('span', '', 'ASCEND · COURSE DRAFT'), node('span', '', '学习方案探索'));
    const paperText = node('div', 'paper-text');
    paperText.setAttribute('aria-hidden', 'true');
    const paperContent = document.createTextNode('');
    const caret = node('span', 'paper-caret');
    caret.setAttribute('aria-hidden', 'true');
    paperText.append(paperContent, caret);
    paper.append(paperHeading, paperText);
    paperArea.append(paper, node('div', 'typewriter-base'));

    const preview = node('section', 'course-preview');
    preview.setAttribute('aria-label', '课程预览');
    const hero = node('div', 'preview-hero');
    const cover = node('div', 'preview-cover');
    cover.append(node('span', '', '✦'));
    const heroBody = node('div');
    heroBody.append(node('span', 'preview-kicker', '课程内容预览'));
    heroBody.append(node('h3', '', outline.goal));
    heroBody.append(node('p', 'preview-description', `围绕“${outline.goal}”安排循序渐进的学习内容：先理解关键概念，再完成练习与复盘。课程结构以你确认的大纲为准。`));
    const tags = node('div', 'preview-tags');
    [`# ${outline.units.length} 个单元`, '# 昇腾学习', '# 实践课程'].forEach(tag => tags.append(node('span', '', tag)));
    heroBody.append(tags);
    hero.append(cover, heroBody);
    const unitList = node('div', 'preview-unit-list');
    preview.append(hero, unitList);
    grid.append(paperArea, preview);
    wrapper.append(header, progress, grid);

    const lines = [
      `课程名称：${outline.goal}`,
      '',
      '学习目标：从核心概念出发，结合练习完成一次可复盘的实践。',
      `课程结构：${outline.units.length} 个单元，${outline.units.reduce((sum, unit) => sum + unit.chapters.length, 0)} 个讲次。`,
      ''
    ];
    outline.units.forEach((unit, index) => {
      lines.push(`单元 ${String(index + 1).padStart(2, '0')}｜${unit.title}`);
      unit.chapters.forEach((chapter, chapterIndex) => {
        lines.push(`  讲次 ${String(chapterIndex + 1).padStart(2, '0')}｜${chapter.title}（${chapter.difficulty}）`);
      });
      lines.push('');
    });
    lines.push('课程草稿完成。请在右侧预览单元与讲次。');
    const text = lines.join('\n');
    let typed = 0;
    let shownUnits = 0;
    let timer = null;
    let finished = false;

    function appendLesson(lecture, number, kind, icon, title, duration) {
      const lesson = node('div', 'preview-lesson');
      const main = node('div', 'preview-lesson-main');
      main.append(node('span', '', `课节 ${number}`));
      const type = node('span', 'preview-lesson-kind');
      type.append(node('i', '', icon), document.createTextNode(kind));
      main.append(type, node('span', '', title));
      lesson.append(main, node('em', '', duration));
      lecture.append(lesson);
    }

    function appendUnit(unit, index) {
      const row = node('section', 'preview-unit');
      row.append(node('div', 'preview-unit-number', `单元\n${String(index + 1).padStart(2, '0')}`));
      const content = node('div');
      content.append(node('h4', '', unit.title));
      content.append(node('p', '', `本单元包含 ${unit.chapters.length} 个讲次，按确认的大纲逐步学习并完成练习。`));
      unit.chapters.forEach((chapter, chapterIndex) => {
        const lecture = node('div', 'preview-lecture');
        const head = node('div', 'preview-lecture-head');
        head.append(node('span', '', `讲次 ${chapterIndex + 1}`), document.createTextNode(chapter.title));
        lecture.append(head);
        appendLesson(lecture, 1, '课程', '▣', `${chapter.difficulty}与示例`, '20 分钟');
        if (chapter.difficulty === '基础理解') appendLesson(lecture, 2, '文档', '▤', '关键概念与 API 阅读', '10 分钟');
        else appendLesson(lecture, 2, '实践', '⌘', '练习与复盘', '25 分钟');
        if (chapterIndex === unit.chapters.length - 1) appendLesson(lecture, 3, '测验', '✓', '单元掌握度检查', '10 分钟');
        content.append(lecture);
      });
      row.append(content);
      unitList.append(row);
    }
    function updatePreview() {
      const target = Math.min(outline.units.length, Math.floor(typed / text.length * outline.units.length) + (typed > 0 ? 1 : 0));
      while (shownUnits < target) {
        appendUnit(outline.units[shownUnits], shownUnits);
        shownUnits++;
        status.textContent = `课程预览已展开 ${shownUnits} / ${outline.units.length} 个单元`;
      }
    }
    function finish() {
      if (finished) return;
      finished = true;
      if (timer) clearInterval(timer);
      timer = null;
      typed = text.length;
      paperContent.data = text;
      paper.scrollTop = paper.scrollHeight;
      progressFill.style.width = '100%';
      while (shownUnits < outline.units.length) {
        appendUnit(outline.units[shownUnits], shownUnits);
        shownUnits++;
      }
      caret.hidden = true;
      title.textContent = '课程预览已完成';
      status.textContent = '可以查看下方的单元与讲次';
      skip.textContent = '查看课程内容 ↓';
      onComplete();
      skip.addEventListener('click', () => preview.scrollIntoView({ behavior: 'smooth', block: 'start' }), { once: true });
    }
    skip.addEventListener('click', () => { if (!finished) finish(); });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
    } else {
      timer = setInterval(() => {
        typed = Math.min(text.length, typed + 1);
        paperContent.data = text.slice(0, typed);
        paper.scrollTop = paper.scrollHeight;
        progressFill.style.width = `${typed / text.length * 100}%`;
        updatePreview();
        if (typed === text.length) finish();
      }, 18);
    }
    return {
      element: wrapper,
      cancel() { if (timer) clearInterval(timer); timer = null; }
    };
  };
})();
