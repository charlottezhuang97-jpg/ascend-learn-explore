(() => {
  'use strict';
  const KEY = 'ascend-learning-calendar-v1';
  const DAY = 86400000;
  const make = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  };
  const button = (text, cls, click, label) => {
    const b = make('button', cls, text);
    b.type = 'button';
    if (click) b.onclick = click;
    if (label) b.setAttribute('aria-label', label);
    return b;
  };
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const key = d => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
  const fromKey = v => { const p = v.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); };
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  // Compare civil dates in UTC so daylight saving changes do not affect the day count.
  const daysBetween = (a, b) => Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / DAY);
  const addMonths = (d, n) => {
    const last = new Date(d.getFullYear(), d.getMonth() + n + 1, 0).getDate();
    return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), last));
  };
  const format = d => d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
  const shortDate = d => (d.getMonth() + 1) + '月' + d.getDate() + '日';
  const week = ['日', '一', '二', '三', '四', '五', '六'];

  window.createLearningPlan = ({courses = [], goal = '我要学习算子开发', onStart, onBack, restore = false} = {}) => {
    const root = make('section', 'study-plan');
    root.setAttribute('aria-label', '我的学习计划');
    let selectedCourses = courses.filter(c => c && c.title && Array.isArray(c.modules));
    let plan = null, dialog = null, selectedDay = today(), viewMonth = new Date(selectedDay.getFullYear(), selectedDay.getMonth(), 1);
    let deadline = addDays(today(), 6);
    let returnFocus = null, destroyed = false;
    const launch = (course, lesson) => {
      if (onStart) { onStart(course, lesson); return; }
      const q = new URLSearchParams({course: course.id?.startsWith('catalog-') ? course.id.slice(8) : 'operator', title: course.title});
      if (lesson) q.set('lesson', lesson);
      if (course.id) q.set('planCourse', course.id);
      location.href = 'learn.html?' + q;
    };
    function flattenCourses() {
      return selectedCourses.flatMap((course, ci) => course.modules.flatMap((module, mi) =>
        module.slice(1).map((title, li) => ({
          courseId: course.id || 'course-' + ci, courseTitle: course.title, courseIndex: ci,
          module: module[0], title, minutes: 25, order: ci + '-' + mi + '-' + li
        }))
      ));
    }
    function buildPlan(target) {
      const start = today(), days = daysBetween(start, target) + 1;
      const lessons = flattenCourses(), calendar = {};
      lessons.forEach((lesson, i) => {
        const offset = days <= lessons.length ? Math.floor(i * days / lessons.length) : lessons.length === 1 ? 0 : Math.round(i * (days - 1) / (lessons.length - 1));
        const date = key(addDays(start, offset));
        (calendar[date] ||= []).push(lesson);
      });
      plan = {version: 1, goal, start: key(start), deadline: key(target), courses: selectedCourses, calendar};
      deadline = target;
      selectedDay = start;
      viewMonth = new Date(start.getFullYear(), start.getMonth(), 1);
      let saved = true;
      try { localStorage.setItem(KEY, JSON.stringify(plan)); } catch (_) { saved = false; }
      renderPlan();
      const status = root.querySelector('.lp-status');
      status.textContent = saved ? '已为你生成学习计划，并保存在当前浏览器。' : '学习计划已生成；当前浏览器无法保存，离开页面后需重新设置。';
      root.querySelector('h1').focus({preventScroll: true});
    }
    function heading() {
      const header = make('header', 'lp-page-heading');
      const copy = make('div');
      copy.append(make('p', 'lp-eyebrow', '我的学习计划'), make('h1', '', '把目标变成每天的学习安排'), make('p', 'lp-lead', goal));
      copy.querySelector('h1').tabIndex = -1;
      const actions = make('div', 'lp-heading-actions');
      if (onBack) actions.append(button('返回知识地图', 'lp-text-button', onBack));
      actions.append(button('调整计划', 'lp-outline-button', () => openDeadline(true)));
      header.append(copy, actions);
      return header;
    }
    function renderPlan() {
      root.replaceChildren(heading());
      const all = Object.values(plan.calendar).flat();
      const days = daysBetween(fromKey(plan.start), fromKey(plan.deadline)) + 1;
      const summary = make('div', 'lp-summary');
      [
        ['已选课程', selectedCourses.length + ' 门'],
        ['学习内容', all.length + ' 个课节'],
        ['学习周期', days + ' 天'],
        ['学会日期', shortDate(fromKey(plan.deadline))]
      ].forEach(([label, value]) => { const item = make('div'); item.append(make('span', '', label), make('strong', '', value)); summary.append(item); });
      root.append(summary);
      const status = make('p', 'lp-status'); status.setAttribute('role', 'status'); root.append(status);
      const calendar = make('section', 'lp-calendar');
      calendar.setAttribute('aria-label', '课程学习日历');
      const toolbar = make('div', 'lp-calendar-toolbar');
      const nav = make('div', 'lp-month-nav');
      const label = make('h2', 'lp-month-title');
      nav.append(
        button('‹', 'lp-icon-button', () => changeMonth(-1), '上个月'),
        label,
        button('›', 'lp-icon-button', () => changeMonth(1), '下个月'),
        button('今天', 'lp-today-button', () => selectDay(today()))
      );
      toolbar.append(nav, make('span', 'lp-target-note', format(fromKey(plan.start)) + ' — ' + format(fromKey(plan.deadline))));
      const split = make('div', 'lp-calendar-split');
      const left = make('div', 'lp-month-pane');
      const weekdays = make('div', 'lp-weekdays');
      week.forEach(d => weekdays.append(make('span', '', d)));
      const grid = make('div', 'lp-day-grid');
      grid.setAttribute('aria-label', '选择日期查看当天课程');
      left.append(weekdays, grid, make('p', 'lp-calendar-note', '圆点表示当天有学习安排，点击日期查看课程。'));
      const right = make('section', 'lp-agenda');
      right.setAttribute('aria-label', '当天课程');
      right.setAttribute('aria-live', 'polite');
      split.append(left, right);
      calendar.append(toolbar, split);
      root.append(calendar);
      const workload = Math.max(...Object.values(plan.calendar).map(list => list.length * 25), 0);
      const note = make('p', 'lp-estimate-note', '学习时长按每课节约 25 分钟估算，你可以随时调整学会日期。' + (workload > 120 ? '当前安排较集中，单日最多约 ' + workload + ' 分钟，可延长周期以减轻学习负担。' : ''));
      root.append(note);
      renderMonth();
      renderAgenda();
    }
    function changeMonth(delta) {
      viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + delta, 1);
      renderMonth();
    }
    function selectDay(date) {
      selectedDay = date;
      viewMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      renderMonth(); renderAgenda();
      root.querySelector('.lp-day[aria-pressed="true"]')?.focus({preventScroll:true});
    }
    function renderMonth() {
      root.querySelector('.lp-month-title').textContent = viewMonth.getFullYear() + ' 年 ' + (viewMonth.getMonth() + 1) + ' 月';
      const grid = root.querySelector('.lp-day-grid'); grid.replaceChildren();
      const start = addDays(viewMonth, -viewMonth.getDay());
      const rowCount = Math.ceil((viewMonth.getDay() + new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate()) / 7);
      for (let i = 0; i < rowCount * 7; i++) {
        const d = addDays(start, i), dateKey = key(d), lessons = plan.calendar[dateKey] || [];
        const b = button('', 'lp-day', () => selectDay(d));
        b.classList.toggle('is-outside', d.getMonth() !== viewMonth.getMonth());
        b.classList.toggle('is-today', dateKey === key(today()));
        b.classList.toggle('is-selected', dateKey === key(selectedDay));
        b.setAttribute('aria-pressed', String(dateKey === key(selectedDay)));
        b.setAttribute('aria-label', format(d) + (dateKey === key(today()) ? '，今天' : '') + '，' + lessons.length + '个课节');
        const top = make('span', 'lp-day-top');
        top.append(make('span', '', String(d.getDate())));
        if (dateKey === plan.deadline) top.append(make('small', 'lp-deadline-mark', '目标'));
        b.append(top);
        if (lessons.length) {
          const count = make('span', 'lp-day-count');
          count.append(make('i', 'lp-event-dot'), make('span', '', lessons.length + ' 课节'));
          b.append(count);
        }
        if (dateKey === key(today())) b.append(make('small', 'lp-today-mark', '今天'));
        grid.append(b);
      }
    }
    function renderAgenda() {
      const panel = root.querySelector('.lp-agenda'); panel.replaceChildren();
      const lessons = plan.calendar[key(selectedDay)] || [];
      const head = make('div', 'lp-agenda-heading');
      head.append(make('h2', '', shortDate(selectedDay) + (key(selectedDay) === key(today()) ? ' · 今天' : ' · 周' + week[selectedDay.getDay()])));
      panel.append(head);
      if (!lessons.length) {
        const empty = make('div', 'lp-empty');
        empty.append(make('div', 'lp-empty-icon', '○'), make('h3', '', '这一天没有安排课程'), make('p', '', '可以回顾已学内容，或选择带圆点的日期继续学习。'));
        const next = Object.keys(plan.calendar).sort().find(k => k > key(selectedDay));
        if (next) empty.append(button('查看下一次学习 · ' + shortDate(fromKey(next)), 'lp-outline-button', () => selectDay(fromKey(next))));
        else empty.append(button('回到今天', 'lp-outline-button', () => selectDay(today())));
        panel.append(empty); return;
      }
      const ids = [...new Set(lessons.map(l => l.courseId))];
      panel.append(make('p', 'lp-agenda-summary', ids.length + ' 门课程 · ' + lessons.length + ' 个课节 · 预计 ' + lessons.reduce((n, l) => n + l.minutes, 0) + ' 分钟'));
      const list = make('div', 'lp-course-list');
      ids.forEach(id => {
        const items = lessons.filter(l => l.courseId === id), course = selectedCourses[items[0].courseIndex];
        const card = make('article', 'lp-course-card');
        const top = make('div', 'lp-course-card-top'), icon = make('span', 'lp-course-icon');
        icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>';
        const copy = make('div');
        copy.append(make('h3', '', items[0].courseTitle), make('p', '', items.length + ' 个课节 · 预计 ' + items.reduce((n, l) => n + l.minutes, 0) + ' 分钟'));
        top.append(icon, copy); card.append(top);
        const ul = make('ol', 'lp-lessons');
        items.forEach(l => {
          const li = make('li');
          li.append(make('span', '', l.title), make('small', '', '约 ' + l.minutes + ' 分钟'));
          ul.append(li);
        });
        card.append(ul, button('开始学习 →', 'lp-course-start', () => launch(course, items[0].title)));
        list.append(card);
      });
      panel.append(list);
    }

    function openDeadline(adjusting) {
      if (dialog) return;
      returnFocus = document.activeElement;
      const start = today(), max = addMonths(start, 24);
      let draft = deadline < start ? addDays(start, 6) : deadline;
      let pickerMonth = new Date(draft.getFullYear(), draft.getMonth(), 1);
      let activePreset = adjusting ? 'custom' : 'week';
      dialog = make('dialog', 'lp-deadline-dialog');
      dialog.setAttribute('aria-labelledby', 'lpDeadlineTitle');
      const header = make('header', 'lp-dialog-heading');
      const copy = make('div');
      copy.append(make('p', 'lp-eyebrow', adjusting ? '调整学习安排' : '课程已确认 · 最后一步'), make('h2', '', adjusting ? '给学习计划换一个节奏' : '你希望什么时候学会？'));
      copy.querySelector('h2').id = 'lpDeadlineTitle';
      header.append(copy, button('×', 'lp-icon-button', () => dismiss(), '关闭日期设置'));
      dialog.append(header, make('p', 'lp-dialog-lead', '从今天开始，根据已选的 ' + selectedCourses.length + ' 门课程安排每天要学的内容。'));
      const form = make('form', 'lp-deadline-form');
      const presets = make('div', 'lp-presets');
      [['3 天', 'three'], ['1 周', 'week'], ['1 个月', 'month'], ['自定义', 'custom']].forEach(([text, id]) => {
        const b = button(text, '', () => {
          activePreset = id;
          if (id === 'three') draft = addDays(start, 2);
          if (id === 'week') draft = addDays(start, 6);
          if (id === 'month') draft = addDays(addMonths(start, 1), -1);
          duration.value = ''; error.textContent = '';
          pickerMonth = new Date(draft.getFullYear(), draft.getMonth(), 1);
          picker.hidden = id !== 'custom';
          updateSummary(); renderPicker();
        });
        b.dataset.preset = id;
        presets.append(b);
      });
      form.append(presets);
      const dates = make('div', 'lp-date-range');
      const startCopy = make('div'); startCopy.append(make('small', '', '开始日期'), make('strong', '', format(start)));
      const targetCopy = button('', 'lp-date-target', () => {
        activePreset = 'custom'; picker.hidden = !picker.hidden; updateSummary(); renderPicker();
      }, '选择学会日期');
      targetCopy.append(make('small', '', '学会日期'), make('strong'));
      dates.append(startCopy, make('span', 'lp-date-arrow', '→'), targetCopy);
      form.append(dates);
      const durationLabel = make('label', 'lp-duration-label', adjusting ? '重新输入学习周期' : '也可以直接输入学习周期');
      const duration = make('input', 'lp-duration-input'); duration.type = 'text'; duration.placeholder = '例如：2个月、8周、45天'; duration.autocomplete = 'off';
      durationLabel.append(duration); form.append(durationLabel);
      const error = make('p', 'lp-error'); error.setAttribute('role', 'alert'); form.append(error);
      const picker = make('section', 'lp-date-picker'); picker.hidden = true;
      picker.setAttribute('aria-label', '自定义学会日期');
      const controls = make('div', 'lp-picker-controls');
      const monthSelect = make('select'), yearSelect = make('select');
      monthSelect.setAttribute('aria-label', '月份'); yearSelect.setAttribute('aria-label', '年份');
      for (let m = 0; m < 12; m++) { const op = make('option', '', m + 1 + '月'); op.value = m; monthSelect.append(op); }
      for (let y = start.getFullYear(); y <= max.getFullYear(); y++) { const op = make('option', '', y + '年'); op.value = y; yearSelect.append(op); }
      monthSelect.onchange = () => { pickerMonth = new Date(pickerMonth.getFullYear(), Number(monthSelect.value), 1); renderPicker(); };
      yearSelect.onchange = () => { pickerMonth = new Date(Number(yearSelect.value), pickerMonth.getMonth(), 1); renderPicker(); };
      const previous = button('‹', 'lp-icon-button', () => { pickerMonth = new Date(pickerMonth.getFullYear(), pickerMonth.getMonth() - 1, 1); renderPicker(); }, '上个月');
      const next = button('›', 'lp-icon-button', () => { pickerMonth = new Date(pickerMonth.getFullYear(), pickerMonth.getMonth() + 1, 1); renderPicker(); }, '下个月');
      const selectors = make('div'); selectors.append(monthSelect, yearSelect);
      controls.append(previous, selectors, next);
      const weekdays = make('div', 'lp-weekdays'); week.forEach(d => weekdays.append(make('span', '', d)));
      const grid = make('div', 'lp-picker-grid');
      // Arrow keys move the focus through the actual civil dates.
      grid.onkeydown = e => {
        const delta = {ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7}[e.key];
        const current = e.target.dataset.date;
        if (!delta || !current) return;
        e.preventDefault();
        const d = addDays(fromKey(current), delta);
        if (d < start || d > max) return;
        pickerMonth = new Date(d.getFullYear(), d.getMonth(), 1); renderPicker();
        grid.querySelector('[data-date="' + key(d) + '"]')?.focus();
      };
      picker.append(controls, weekdays, grid); form.append(picker);
      const feedback = make('p', 'lp-date-feedback'); feedback.setAttribute('role', 'status'); form.append(feedback);
      const footer = make('footer', 'lp-dialog-footer');
      const cancel = button(adjusting ? '取消调整' : '返回选课', 'lp-text-button', () => {
        if (!picker.hidden) { picker.hidden = true; updateSummary(); presets.querySelector('[data-preset="custom"]').focus(); }
        else dismiss();
      });
      footer.append(cancel);
      const submit = make('button', 'lp-primary-button', adjusting ? '更新学习计划 →' : '生成学习计划 →'); submit.type = 'submit';
      footer.append(submit); form.append(footer); dialog.append(form);
      function updateSummary() {
        dialog.classList.toggle('has-picker', !picker.hidden);
        cancel.textContent = !picker.hidden ? '‹ 返回快捷周期' : adjusting ? '取消调整' : '返回选课';
        targetCopy.querySelector('strong').textContent = format(draft);
        presets.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.preset === activePreset)));
        feedback.textContent = '共 ' + (daysBetween(start, draft) + 1) + ' 天 · ' + flattenCourses().length + ' 个课节，将从今天开始安排。';
      }
      function renderPicker() {
        monthSelect.value = pickerMonth.getMonth(); yearSelect.value = pickerMonth.getFullYear();
        previous.disabled = pickerMonth <= new Date(start.getFullYear(), start.getMonth(), 1);
        next.disabled = pickerMonth >= new Date(max.getFullYear(), max.getMonth(), 1);
        grid.replaceChildren();
        const first = addDays(pickerMonth, -pickerMonth.getDay());
        const count = Math.ceil((pickerMonth.getDay() + new Date(pickerMonth.getFullYear(), pickerMonth.getMonth() + 1, 0).getDate()) / 7) * 7;
        for (let i = 0; i < count; i++) {
          const d = addDays(first, i);
          const b = button(String(d.getDate()), '', () => { draft = d; duration.value = ''; error.textContent = ''; updateSummary(); renderPicker(); grid.querySelector('[data-date="' + key(d) + '"]')?.focus(); });
          b.dataset.date = key(d); b.disabled = d < start || d > max;
          b.classList.toggle('is-outside', d.getMonth() !== pickerMonth.getMonth());
          b.classList.toggle('is-selected', key(d) === key(draft));
          b.setAttribute('aria-pressed', String(key(d) === key(draft))); b.setAttribute('aria-label', format(d));
          grid.append(b);
        }
      }
      function parseDuration() {
        if (!duration.value.trim()) { error.textContent = ''; return true; }
        const matched = duration.value.trim().match(/^(\d+)\s*(天|日|周|星期|个月|月)$/);
        if (!matched || Number(matched[1]) < 1) { error.textContent = '请输入有效周期，例如：2个月、8周或45天。'; return false; }
        const n = Number(matched[1]), unit = matched[2];
        const target = /月/.test(unit) ? addDays(addMonths(start, n), -1) : addDays(start, n * (/周|星期/.test(unit) ? 7 : 1) - 1);
        if (!Number.isFinite(target.getTime()) || target > max || target < start) { error.textContent = '请选择今天起两年以内的学会日期。'; return false; }
        draft = target; activePreset = 'custom'; pickerMonth = new Date(draft.getFullYear(), draft.getMonth(), 1);
        error.textContent = ''; updateSummary(); renderPicker(); return true;
      }
      duration.oninput = parseDuration;
      form.onsubmit = e => {
        e.preventDefault();
        if (!parseDuration()) { duration.focus(); return; }
        if (!selectedCourses.length || !flattenCourses().length) { error.textContent = '请先选择包含学习内容的课程。'; return; }
        closeDialog(); buildPlan(draft);
      };
      function dismiss() {
        closeDialog();
        if (!plan && onBack) onBack();
        else returnFocus?.isConnected && returnFocus.focus();
      }
      dialog.addEventListener('cancel', e => { e.preventDefault(); dismiss(); });
      document.body.append(dialog);
      updateSummary(); renderPicker(); dialog.showModal();
      presets.querySelector('button[aria-pressed="true"]').focus();
    }
    function closeDialog() {
      if (!dialog) return;
      const old = dialog; dialog = null; old.close(); old.remove();
    }
    if (restore) {
      try {
        const stored = JSON.parse(localStorage.getItem(KEY));
        if (stored?.version === 1 && Array.isArray(stored.courses) && stored.courses.length && stored.calendar && /^\d{4}-\d{2}-\d{2}$/.test(stored.deadline)) {
          plan = stored; selectedCourses = stored.courses; goal = stored.goal; deadline = fromKey(stored.deadline);
        }
      } catch (_) { /* The date picker remains available if storage is unavailable. */ }
    }
    if (plan) renderPlan();
    else {
      const intro = make('div', 'lp-pending');
      intro.append(make('p', 'lp-eyebrow', '课程已选好'), make('h1', '', '为学习目标定一个完成日期'), make('p', '', selectedCourses.length + ' 门课程，将根据你的时间生成学习安排。'), button('设置学会日期', 'lp-primary-button', () => openDeadline(false)));
      root.append(intro);
      requestAnimationFrame(() => { if (!destroyed && root.isConnected) openDeadline(false); });
    }
    root.destroy = () => { destroyed = true; closeDialog(); };
    return root;
  };
})();
