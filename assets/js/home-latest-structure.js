(() => {
  const pathList = document.getElementById('pathList');
  const pathDetail = document.getElementById('pathDetail');
  if (!pathList || !pathDetail) return;

  const paths = [
    { category:'算子开发', featured:true, name:'Ascend C 算子开发', label:'算子开发 · 精选路径', desc:'从开发环境和编程模型开始，逐步完成算子实现、调试与性能优化。', courses:['面向昇腾 Ascend C 算子开发入门','Ascend C 编程模型与核函数实现','算子编译、运行与精度验证','算子调试与问题定位','GEMM 类算子性能优化'] },
    { category:'模型训练', name:'大模型训练全流程', label:'模型训练 · LLM', desc:'覆盖数据准备、分布式训练、精度验证与训练性能分析。', courses:['大模型训练全流程','基于 Qwen2.5-7B 模型的开发实践','LLM 训练框架和特性介绍','大模型训练性能调优'] },
    { category:'模型训练', name:'多模态模型训练', label:'模型训练 · 多模态', desc:'围绕多模态数据、训练框架与微调实践逐步学习。', courses:['多模态训练微调','多模态训练框架和特性介绍','多模态模型训练实践'] },
    { category:'推理与部署', name:'MindIE 推理部署', label:'推理与部署 · 服务化', desc:'从模型权重和运行环境准备，到服务启动、请求验证与性能调优。', courses:['vLLM-Ascend 推理部署与调优','MindIE 服务部署与模型推理','基于 vLLM-Ascend 的 Profiling 性能分析','部署 vLLM 大规模推理服务'] },
    { category:'算子开发', name:'Triton 算子开发', label:'算子开发 · Triton', desc:'通过入门、进阶到综合实践，掌握昇腾 Triton 算子开发。', courses:['面向昇腾 Triton 算子开发入门','面向昇腾 Triton 算子开发进阶','面向昇腾 Triton 算子开发'] },
    { category:'调试与性能优化', name:'算子调试与调优', label:'调试与性能优化', desc:'学习调试工具使用，并进一步完成算子性能分析与优化。', courses:['MindStudio 实战精讲 - 算子调试工具','GEMM 类算子调优','MindStudio 实战精讲 - 性能调优工具'] },
    { category:'AI应用与智能体', name:'大模型应用开发', label:'AI 应用与智能体', desc:'从模型接入到知识检索、工具调用，逐步构建可用的大模型应用。', courses:['构建基于大语言模型的应用','RAG 检索增强生成实践','智能体工具调用与工作流'] }
  ];
  const categories = ['精选','模型训练','推理与部署','算子开发','调试与性能优化','AI应用与智能体'];
  let selectedPath = paths[0];
  function renderPathList(category) {
    const filtered = category === '精选' ? paths.filter(item => item.featured || item.category === '推理与部署' || (item.category === '模型训练' && item.name === '大模型训练全流程')) : paths.filter(item => item.category === category);
    if (!filtered.some(item => item === selectedPath)) selectedPath = filtered[0] || paths[0];
    pathList.innerHTML = filtered.map((item, index) => `<button class="path-choice" type="button" role="option" aria-selected="${item === selectedPath}" data-path="${paths.indexOf(item)}"><span>${item.label}</span><strong>${item.name}</strong><small>${item.courses.length} 门课程 · 按顺序学习</small></button>`).join('');
    pathList.querySelectorAll('.path-choice').forEach(button => button.addEventListener('click', () => {
      selectedPath = paths[Number(button.dataset.path)];
      pathList.querySelectorAll('.path-choice').forEach(choice => choice.setAttribute('aria-selected', String(choice === button)));
      renderPathDetail();
    }));
    renderPathDetail();
  }
  function renderPathDetail() {
    const hrefs = selectedPath.category === '算子开发' ? ['course-preview.html?course=operator'] : selectedPath.category === '推理与部署' ? ['course-preview.html?course=mindie'] : selectedPath.category === '模型训练' ? ['course-preview.html?course=training'] : ['catalog.html'];
    const visibleCourses = selectedPath.courses.slice(0, 3);
    const hasMore = selectedPath.courses.length > visibleCourses.length;
    pathDetail.innerHTML = `<div class="path-detail-head"><div><h3>${selectedPath.name}</h3><p>${selectedPath.desc}</p></div><span>${selectedPath.courses.length} 门课程</span></div><div class="path-courses">${visibleCourses.map((name, index) => `<a class="path-course" href="${hrefs[0]}"><span class="path-course-index">${String(index + 1).padStart(2, '0')}</span><span><b>${name}</b><small>${index === 0 ? '路径起点 · 建立基础认知' : index === visibleCourses.length - 1 && !hasMore ? '路径进阶 · 完成综合实践' : '循序渐进 · 课程与实践结合'}</small></span><em>${index === 0 ? '开始学习 →' : '课程预览 →'}</em></a>`).join('')}</div>${hasMore ? `<a class="path-more-link" href="knowledge-map.html?view=all&amp;source=overview">查看完整课程链路 · 还有 ${selectedPath.courses.length - visibleCourses.length} 门 →</a>` : ''}`;
  }
  document.querySelectorAll('.scene-tabs [data-filter]').forEach(button => button.addEventListener('click', () => renderPathList(button.dataset.filter)));
  renderPathList('精选');

  const certs = {
    '入门级': [
      ['算子开发者认证','Ascend C · Triton 入门实践','从算子基础开始，完成首个昇腾算子开发。','算子开发'],
      ['训练开发者认证','MindSpore · 训练基础','掌握模型训练与常见训练任务实践。','模型训练'],
      ['推理开发者认证','MindIE · 服务部署','完成模型部署、服务启动和推理验证。','推理开发'],
      ['AI 应用开发者认证','大模型 · 应用开发','掌握模型接入、RAG 与应用构建基础。','AI 应用']
    ],
    '工程师级': [
      ['算子开发工程师认证','Ascend C · 调试与优化','完成复杂算子开发、调试和性能优化实践。','算子开发'],
      ['训练开发工程师认证','分布式训练 · 性能优化','完成多卡训练开发、验证和性能调优。','模型训练'],
      ['推理开发工程师认证','vLLM-Ascend · 高性能推理','完成高并发服务部署与性能分析。','推理开发'],
      ['AI 应用开发工程师认证','智能体 · 应用工程','设计并实现可评估的大模型应用流程。','AI 应用']
    ],
    '专家级': [
      ['算子开发专家认证','算子架构 · 深度调优','面向复杂算子场景完成架构设计和极致调优。','算子开发'],
      ['训练开发专家认证','大模型训练 · 系统工程','规划大规模训练方案并解决系统级瓶颈。','模型训练'],
      ['推理开发专家认证','推理系统 · 架构优化','构建面向生产的大规模推理系统。','推理开发'],
      ['AI 应用开发专家认证','大模型应用 · 生产落地','完成复杂业务场景的大模型应用设计与交付。','AI 应用']
    ]
  };
  const certGrid = document.getElementById('certGrid');
  const certImg = 'assets/images/figma-home/course-orb.png';
  function renderCerts(level) {
    const code = level === '入门级' ? 'ACDA' : level === '工程师级' ? 'ACDP' : 'ACDE';
    certGrid.innerHTML = certs[level].map(([name, description, detail, category]) => `<article class="cert-card"><div class="cert-art"><img src="${certImg}" alt=""><span class="cert-badge">${code}</span></div><div class="cert-meta"><span>${category}</span><span class="cert-level">${level}</span></div><h3>${name}</h3><p>${description}。${detail}</p><a href="catalog.html">查看学习内容 <span aria-hidden="true">→</span></a></article>`).join('');
  }
  document.querySelectorAll('[data-cert-level]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-cert-level]').forEach(tab => tab.setAttribute('aria-selected', String(tab === button)));
    renderCerts(button.dataset.certLevel);
  }));
  renderCerts('入门级');

  const calendarDays = document.getElementById('calendarDays');
  const agendaItems = document.getElementById('agendaItems');
  const monthLabel = document.getElementById('calendarMonth');
  const agendaDate = document.getElementById('agendaDate');
  const weekDays = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
  const events = {
    '2026-10-20': [{time:'09:30',kind:'我的学习',title:'完成 Ascend C 算子开发课程',detail:'学习记录 · 向量计算实践'}],
    '2026-10-21': [{time:'19:00',kind:'名师讲堂',title:'昇腾算子性能优化实战',detail:'官方活动 · 在线直播'}],
    '2026-10-22': [{time:'14:00',kind:'训练',title:'昇腾大模型推理训练营',detail:'官方活动 · 报名参加'}],
    '2026-10-23': [{time:'19:30',kind:'Meetup特辑',title:'开发者 Meetup：推理服务实践',detail:'官方活动 · 社区交流'}],
    '2026-10-26': [{time:'10:00',kind:'我的学习',title:'MindIE 服务部署与模型推理',detail:'继续学习 · 预计 35 分钟'},{time:'15:00',kind:'新课程',title:'Triton 算子开发进阶上线',detail:'官方活动 · 新课发布'}],
    '2026-10-28': [{time:'20:00',kind:'我的学习',title:'完成本周学习计划',detail:'学习记录 · 推理部署路径'}]
  };
  let shownMonth = new Date(2026, 9, 1);
  let selectedDate = new Date(2026, 9, 26);
  let calendarFilter = '全部';
  const dateKey = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  function visibleEvents(date) { return (events[dateKey(date)] || []).filter(event => calendarFilter === '全部' || (calendarFilter === '官方活动' ? event.kind !== '我的学习' : event.kind === '我的学习')); }
  function renderAgenda() {
    const items = visibleEvents(selectedDate);
    agendaDate.textContent = `${selectedDate.getMonth()+1} 月 ${selectedDate.getDate()} 日 · ${weekDays[selectedDate.getDay()]}`;
    agendaItems.innerHTML = items.length ? items.map(item => `<article class="agenda-item"><span class="agenda-time">${item.time}</span><span><b>${item.title}</b><small>${item.detail}</small></span><span class="agenda-kind ${item.kind === '我的学习' ? 'learning' : ''}">${item.kind}</span></article>`).join('') : '<div class="agenda-empty">这一天暂无安排，选个日期看看吧。</div>';
  }
  function renderCalendar() {
    const year = shownMonth.getFullYear(), month = shownMonth.getMonth();
    monthLabel.textContent = `${year} 年 ${month+1} 月`;
    const first = new Date(year, month, 1), mondayOffset = (first.getDay()+6)%7, totalDays = new Date(year, month+1, 0).getDate();
    const previousDays = new Date(year, month, 0).getDate();
    const cells = Array.from({length:42}, (_, index) => {
      const number = index - mondayOffset + 1;
      const date = number < 1 ? new Date(year, month-1, previousDays + number) : number > totalDays ? new Date(year, month+1, number-totalDays) : new Date(year, month, number);
      const dayEvents = visibleEvents(date), inMonth = date.getMonth() === month;
      return `<button class="calendar-day ${inMonth ? '' : 'outside'} ${dateKey(date)===dateKey(selectedDate) ? 'selected' : ''} ${dateKey(date)==='2026-10-26' ? 'today' : ''}" type="button" aria-pressed="${dateKey(date)===dateKey(selectedDate)}" data-date="${dateKey(date)}"><span>${date.getDate()}</span>${dateKey(date)==='2026-10-26' ? '<i class="today-marker" aria-hidden="true"></i>' : ''}<span class="day-dots">${dayEvents.slice(0,3).map(event => `<i class="${event.kind==='我的学习'?'learning':''}" aria-label="${event.kind}"></i>`).join('')}</span></button>`;
    }).join('');
    calendarDays.innerHTML = cells;
    calendarDays.querySelectorAll('.calendar-day').forEach(button => button.addEventListener('click', () => { selectedDate = new Date(`${button.dataset.date}T12:00:00`); renderCalendar(); renderAgenda(); }));
    renderAgenda();
  }
  document.getElementById('calendarPrev').addEventListener('click', () => { shownMonth = new Date(shownMonth.getFullYear(), shownMonth.getMonth()-1, 1); renderCalendar(); });
  document.getElementById('calendarNext').addEventListener('click', () => { shownMonth = new Date(shownMonth.getFullYear(), shownMonth.getMonth()+1, 1); renderCalendar(); });
  document.getElementById('calendarToday').addEventListener('click', () => { shownMonth = new Date(2026,9,1); selectedDate = new Date(2026,9,26); renderCalendar(); });
  document.querySelectorAll('[data-calendar-filter]').forEach(button => button.addEventListener('click', () => {
    calendarFilter = button.dataset.calendarFilter;
    document.querySelectorAll('[data-calendar-filter]').forEach(tab => tab.setAttribute('aria-selected', String(tab === button)));
    renderCalendar();
  }));
  renderCalendar();
})();
