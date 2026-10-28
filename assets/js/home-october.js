(() => {
  const art = 'assets/images/october-home/';
  const featuredIllustration = `${art}operator-art.webp`;
  const scenes = [
    {title:'Ascend C算子开发',topic:'模型训练 / CANN',course:'operator',image:featuredIllustration,tags:['编程模型','编程范式','SIMD模型','矩阵计算'],units:'6单元 | 18讲',steps:['Ascend C 入门简单Vector算子开发','Ascend C 进阶泛化Vector算子开发','Ascend C 高级Cube算子开发','Ascend C 高级CV融合算子']},
    {title:'大模型分布式训练',topic:'训练开发 / MindSpore',course:'training',tags:['模型构建','训练编排','混合精度','分布式训练'],units:'7单元 | 22讲',steps:['昇腾算力与 MindSpore 框架入门','数据处理与模型训练实践','分布式并行训练与通信优化','大模型混合精度与性能调优']},
    {title:'大模型推理服务部署',topic:'推理与部署 / MindIE',course:'inference',image:featuredIllustration,tags:['模型转换','推理适配','服务部署','性能验证'],units:'5单元 | 16讲',steps:['模型转换与昇腾推理环境搭建','模型适配与推理验证','MindIE 推理服务化部署','推理时延与吞吐性能优化']},
    {title:'昇腾开发调试与调优',topic:'调试与性能调优 / CANN',course:'operator',image:featuredIllustration,tags:['问题定位','精度分析','性能采集','优化验证'],units:'6单元 | 18讲',steps:['开发环境检查与常见问题定位','算子精度分析与调试实践','性能数据采集与瓶颈分析','Tiling 策略与执行效率优化']},
    {title:'RAG 智能体应用开发',topic:'AI应用与智能体',course:'agent',image:featuredIllustration,tags:['模型接入','知识检索','工具调用','应用评估'],units:'5单元 | 14讲',steps:['大模型接入与应用开发基础','知识库构建与 RAG 检索实践','工具调用与智能体工作流编排','AI 应用部署与效果评估']}
  ];
  const tags = list => `<div class="small-tags">${list.map(t=>`<span>${t}</span>`).join('')}</div>`;
  function renderScene(index){
    const s=scenes[index];
    document.getElementById('scenarioContent').innerHTML=`<a class="scenario-course" href="course-preview.html?course=${s.course}"><img src="${s.image||'assets/images/figma-home/continue-course.png'}" alt=""><div class="scenario-course-info"><small><b>◈ 微认证</b>${s.topic}</small><h3>${s.title}</h3>${tags(s.tags)}</div><div class="scenario-course-meta"><span>▤ ${s.units}</span><span>▣ 标准实践</span></div></a><div class="scenario-path">${s.steps.map((t,i)=>`<a class="path-step" href="course-preview.html?course=${s.course}"><span>${['初级','中级','高级','高级'][i]}</span>${t}</a>`).join('')}<a class="path-step" href="course-preview.html?course=${s.course}"><span>实践</span>完成以上课程，将所学知识应用到真实场景，开始你的开发任务 <b aria-hidden="true">›</b></a></div>`;
  }
  const sceneTabs=[...document.querySelectorAll('[data-scene]')];
  const featured=[...document.querySelectorAll('[data-featured]')];
  sceneTabs.forEach((b,i)=>b.addEventListener('click',()=>{sceneTabs.forEach(t=>t.setAttribute('aria-selected',String(t===b)));document.getElementById('featuredTabs').hidden=i!==0;renderScene(Number(b.dataset.scene));featured.forEach((t,j)=>t.setAttribute('aria-selected',String(j===0)));}));
  featured.forEach(b=>b.addEventListener('click',()=>{featured.forEach(t=>t.setAttribute('aria-selected',String(t===b)));renderScene(Number(b.dataset.featured));}));
  const certs=[['算子开发认证','算子开发','代码 算子 调优','掌握Ascend、Triton与CANN算子开发，完成基础算子实现和调优。','operator'],['训练开发认证','训练开发','训练 并行 性能','掌握模型训练、分布式并行与性能优化，构建稳定的训练工程。','training'],['推理开发者认证','推理与部署 / 生成式AI与大模型','转换 推理 部署','掌握模型转换、推理部署与性能调优，完成端到端推理服务。','inference'],['AI应用开发者认证','AI应用与智能体 / 生成式AI与大模型','应用 服务 部署','掌握模型调用、应用编排与服务部署，构建可交付的AI应用。','agent']];
  function renderCert(level){
    const label={ACDA:'入门级',ACDP:'工作级',ACDE:'专家级'}[level];
    document.getElementById('certGrid').innerHTML=certs.map((c,i)=>`<a class="cert-card" href="course-preview.html?course=${c[4]}&certification=${level}"><small>${c[1]} <em>${label}·${level}</em></small><h3>${c[0]}</h3>${tags(c[2].split(' '))}<img src="${art}cert-${i}.webp" alt="" loading="lazy"><p>${level==='ACDA'?c[3]:level==='ACDP'?['深入算子工程开发与调优，完成复杂算子的设计、实现和验证。','掌握分布式训练策略与工程优化，提升训练稳定性与效率。','掌握推理服务性能优化，完成生产场景的部署与验证。','掌握智能体编排与应用工程化，交付完整的AI应用服务。'][i]:['面向复杂业务设计高性能算子，解决系统级计算瓶颈。','构建大规模训练方案，完成系统级架构设计与性能优化。','设计高可用推理架构，解决大规模服务的性能与资源问题。','设计复杂智能体系统，建立应用评估与持续优化体系。'][i]}</p><span class="cert-action">查看${label}学习路径 →</span></a>`).join('');
  }
  document.querySelectorAll('[data-cert]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-cert]').forEach(t=>t.setAttribute('aria-selected',String(t===b)));renderCert(b.dataset.cert);}));
  // Public events are illustrative; personal entries are saved only in this browser.
  const communityEvents=[
    {date:'2026-10-03',kind:'会议',title:'CANN SIG 会议',time:'10:00–12:00',desc:'CANN 算子开发与社区议题交流',place:'线上会议'},
    {date:'2026-10-06',kind:'活动',title:'Ascend C 算子开发训练营',time:'14:00–16:00',desc:'从基础算子实现到性能分析，动手完成开发实践',place:'线上训练营'},
    {date:'2026-10-11',kind:'会议',title:'MindSpore 开发者交流',time:'10:00–11:30',desc:'模型训练与分布式实践经验分享',place:'线上会议'},
    {date:'2026-10-12',kind:'峰会',title:'CANN Developer Day 2026',time:'09:00–17:00',desc:'开发者技术分享、社区共建与现场交流',place:'线下活动'},
    {date:'2026-10-18',kind:'活动',title:'MindIE 推理部署实战',time:'14:00–16:00',desc:'推理服务部署、性能采集与优化实践',place:'线上训练营'},
    {date:'2026-10-25',kind:'活动',title:'AI 应用与智能体工作坊',time:'14:00–17:00',desc:'从 RAG 到工具调用，搭建完整的智能体应用',place:'线上工作坊'}
  ];
  const sampleLearning=[
    {date:'2026-10-27',kind:'课程学习',title:'昇腾算力与 MindSpore 框架',chapter:'章节一：建立训练基线',time:'09:00–10:30',sample:true,href:'course-preview.html?course=training'},
    {date:'2026-10-28',kind:'AI 学伴复习',title:'昇腾算力与 MindSpore 框架',chapter:'章节一：建立训练基线',time:'19:00–19:30',sample:true,href:'course-preview.html?course=training'},
    {date:'2026-10-30',kind:'认证考试',title:'训练开发认证 ACDA',time:'14:00–16:00',mode:'线下考试',place:'深圳市南山区认证考试中心',sample:true}
  ];
  const learningStorageKey='ascend-personal-learning-calendar-v1';
  const allowedKinds=new Set(['课程学习','AI 学伴复习','认证考试']);
  const escapeCalendarText=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const validDate=value=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const [y,m,d]=value.split('-').map(Number),date=new Date(y,m-1,d);return date.getFullYear()===y&&date.getMonth()===m-1&&date.getDate()===d;};
  let learningEvents=[];
  try{const saved=JSON.parse(localStorage.getItem(learningStorageKey)||'[]');if(Array.isArray(saved))learningEvents=saved.filter(e=>e&&validDate(e.date)&&allowedKinds.has(e.kind)&&typeof e.title==='string').slice(0,100);}catch{}
  const persistLearning=()=>{try{localStorage.setItem(learningStorageKey,JSON.stringify(learningEvents));}catch{}};
  const board=document.querySelector('.events-board');
  const filters=board.querySelector('.event-filters');
  filters.innerHTML='<button type="button" data-scope="全部" aria-pressed="true">全部</button><button type="button" data-scope="开发者活动" aria-pressed="false">开发者活动</button><button type="button" data-scope="我的学习" aria-pressed="false">我的学习</button>';
  board.querySelector('.schedule-label').innerHTML='活动日程 <small>社区与个人</small>';
  const addButton=document.createElement('button');addButton.type='button';addButton.className='add-learning-event';addButton.textContent='＋ 添加学习安排';board.querySelector('.events-toolbar').append(addButton);
  const legend=document.createElement('div');legend.className='calendar-legend';legend.innerHTML='<span><i class="legend-dot community"></i>开发者活动</span><span><i class="legend-dot course"></i>课程学习</span><span><i class="legend-dot review"></i>AI 学伴复习</span><span><i class="legend-dot exam"></i>认证考试</span>';
  board.querySelector('.calendar').append(legend);
  const dialog=document.createElement('dialog');dialog.className='learning-event-dialog';dialog.innerHTML=`<form method="dialog" id="learningEventForm"><div class="learning-dialog-head"><h3>添加学习安排</h3><button type="button" class="dialog-close" aria-label="关闭">×</button></div><p class="learning-dialog-note">安排仅保存在当前浏览器中。</p><label>安排类型<select name="kind"><option>课程学习</option><option>AI 学伴复习</option><option>认证考试</option></select></label><label>日期<input name="date" type="date" required></label><div class="learning-time-row"><label>开始时间<input name="start" type="time" required></label><label>结束时间<input name="end" type="time" required></label></div><div data-learning-fields><label>课程名称<input name="course" maxlength="80" required placeholder="例如：昇腾算力与 MindSpore 框架"></label><label>章节<input name="chapter" maxlength="80" required placeholder="例如：章节一：建立训练基线"></label></div><div data-exam-fields hidden><label>考试名称<input name="exam" maxlength="80" placeholder="例如：训练开发认证 ACDA"></label><label>考试方式<select name="mode"><option>线上考试</option><option>线下考试</option></select></label><label data-exam-place hidden>考试地点<input name="place" maxlength="120" placeholder="请输入线下考试地点"></label></div><p class="learning-form-error" role="alert" hidden></p><div class="learning-dialog-actions"><button type="button" class="dialog-cancel">取消</button><button type="submit">保存安排</button></div></form>`;
  document.body.append(dialog);
  const form=dialog.querySelector('form');
  const updateFields=()=>{const exam=form.elements.kind.value==='认证考试',offline=form.elements.mode.value==='线下考试';form.querySelector('[data-learning-fields]').hidden=exam;form.querySelector('[data-exam-fields]').hidden=!exam;form.querySelector('[data-exam-place]').hidden=!exam||!offline;form.elements.course.required=!exam;form.elements.chapter.required=!exam;form.elements.exam.required=exam;form.elements.place.required=exam&&offline;};
  form.elements.kind.addEventListener('change',updateFields);form.elements.mode.addEventListener('change',updateFields);
  addButton.addEventListener('click',()=>{form.reset();const day=Math.min(selected||new Date().getDate(),new Date(year,month+1,0).getDate());form.elements.date.value=`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;form.querySelector('.learning-form-error').hidden=true;updateFields();dialog.showModal();});
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.querySelector('.dialog-cancel').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  let year=2026,month=9,scope='全部',selected=null;
  const personalItems=()=>learningEvents.length?learningEvents:sampleLearning;
  function monthEvents(){const prefix=`${year}-${String(month+1).padStart(2,'0')}-`;return [...(scope==='我的学习'?[]:communityEvents),...(scope==='开发者活动'?[]:personalItems())].filter(e=>e.date.startsWith(prefix)).sort((a,b)=>(a.sample||a.id?0:1)-(b.sample||b.id?0:1)||a.date.localeCompare(b.date));}
  function renderEvent(e,i){
    const personal=allowedKinds.has(e.kind),safe=escapeCalendarText,meta=`${e.date.replaceAll('-','/')}　${safe(e.time)}　|　${safe(e.kind)}`;
    const body=personal?(e.kind==='认证考试'?`<p>考试名称　${safe(e.title)}</p><p>考试时间　${safe(e.date.replaceAll('-','/'))} ${safe(e.time)}</p><p>考试方式　${safe(e.mode||'线上考试')}</p>${e.mode==='线下考试'?`<p>考试地点　${safe(e.place||'待确认')}</p>`:''}`:`<p>课程名称　${safe(e.title)}</p><p>学习章节　${safe(e.chapter||'待安排')}</p><p>学习时间　${safe(e.time)}</p>${e.kind==='AI 学伴复习'?'<p>建议来源　AI 学伴复习提醒</p>':''}${e.href?.startsWith('course-preview.html?course=')?`<a href="${safe(e.href)}">查看课程 →</a>`:''}`):`<p>活动内容　${safe(e.desc)}</p><p>参与方式　${safe(e.place)}</p><p>日程说明　设计演示，正式活动以社区公告为准。</p><a href="catalog.html">探索相关学习资源 →</a>`;
    return `<details class="event-item ${personal?'personal-event':''}" ${i===0?'open':''}><summary><span class="event-type" data-kind="${safe(e.kind)}">${safe(e.kind)}</span>${safe(e.title)}${e.sample?'<small class="sample-mark">示例</small>':''}</summary><p class="event-time">${meta}</p><div class="event-detail">${body}${e.id?`<button type="button" class="remove-learning-event" data-remove-learning="${safe(e.id)}">删除安排</button>`:''}</div></details>`;
  }
  function renderCalendar(){
    document.getElementById('calendarMonth').textContent=`${year}年${month+1}月`;
    const first=new Date(year,month,1).getDay(),days=new Date(year,month+1,0).getDate(),count=Math.ceil((first+days)/7)*7,items=monthEvents();
    const grid=document.getElementById('calendarGrid');grid.innerHTML='';
    for(let i=0;i<count;i++){
      const day=i-first+1,date=new Date(year,month,day),outside=day<1||day>days,dayKey=`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`,ev=outside?[]:items.filter(e=>e.date===dayKey),b=document.createElement('button');b.type='button';
      b.className=outside?'other-month':ev.length?'has-event':'';b.setAttribute('aria-label',`${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日${ev.length?'，'+ev.map(e=>e.title).join('、'):'，暂无安排'}`);b.setAttribute('aria-pressed',String(!outside&&selected===day));
      b.innerHTML=`<span>${date.getDate()}</span><span class="event-dots" aria-hidden="true">${ev.map(e=>`<i class="event-dot" data-kind="${escapeCalendarText(e.kind)}"></i>`).join('')}</span>`;
      b.addEventListener('click',()=>{if(outside){year=date.getFullYear();month=date.getMonth();}selected=date.getDate();renderCalendar();document.querySelector('#calendarGrid button[aria-pressed="true"]')?.focus({preventScroll:true});});grid.append(b);
    }
    const shown=items.filter(e=>selected===null||Number(e.date.slice(-2))===selected);
    document.getElementById('eventList').innerHTML=shown.length?shown.map(renderEvent).join(''):`<p class="empty-events">${selected?`${month+1}月${selected}日`:'本月'}暂无${scope==='全部'?'':scope}安排<br>可切换日期或添加自己的学习安排。</p>`;
  }
  form.addEventListener('submit',event=>{
    event.preventDefault();const data=new FormData(form),start=data.get('start'),end=data.get('end'),date=data.get('date'),kind=data.get('kind');const error=form.querySelector('.learning-form-error');
    if(!validDate(date)||end<=start){error.textContent='请检查日期和时间，结束时间应晚于开始时间。';error.hidden=false;return;}
    const exam=kind==='认证考试',offline=data.get('mode')==='线下考试';
    const item={id:crypto.randomUUID(),date,kind,title:String(data.get(exam?'exam':'course')).trim(),chapter:exam?'':String(data.get('chapter')).trim(),time:`${start}–${end}`,mode:exam?String(data.get('mode')):'',place:exam&&offline?String(data.get('place')).trim():''};
    if(!item.title||(!exam&&!item.chapter)||(exam&&offline&&!item.place)){error.textContent='请填写完整的课程、章节或考试信息。';error.hidden=false;return;}
    learningEvents.push(item);persistLearning();year=Number(date.slice(0,4));month=Number(date.slice(5,7))-1;selected=Number(date.slice(8,10));scope='我的学习';filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scope===scope)));renderCalendar();dialog.close();
  });
  document.getElementById('eventList').addEventListener('click',event=>{const button=event.target.closest('[data-remove-learning]');if(!button)return;learningEvents=learningEvents.filter(e=>e.id!==button.dataset.removeLearning);persistLearning();renderCalendar();});
  function moveMonth(delta){month+=delta;if(month<0){month=11;year--;}if(month>11){month=0;year++;}selected=null;renderCalendar();}
  document.getElementById('previousMonth').addEventListener('click',()=>moveMonth(-1));document.getElementById('nextMonth').addEventListener('click',()=>moveMonth(1));
  filters.addEventListener('click',event=>{const button=event.target.closest('button[data-scope]');if(!button)return;scope=button.dataset.scope;selected=null;filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderCalendar();});
  document.getElementById('showAllEvents').addEventListener('click',()=>{selected=null;renderCalendar();});
  document.querySelector('.nav-search')?.addEventListener('click',()=>{document.getElementById('top').scrollIntoView({behavior:'smooth'});document.getElementById('heroInput').focus({preventScroll:true});});
  // Roving focus follows the WAI-ARIA tab keyboard convention.
  document.querySelectorAll('.pill-tabs,.scenario-subtabs').forEach(group=>{const tabs=[...group.querySelectorAll('[role=tab]')];function sync(){tabs.forEach(t=>t.tabIndex=t.getAttribute('aria-selected')==='true'?0:-1);}sync();tabs.forEach((b,i)=>{b.addEventListener('click',sync);b.addEventListener('keydown',e=>{let j;if(e.key==='ArrowRight')j=(i+1)%tabs.length;else if(e.key==='ArrowLeft')j=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')j=0;else if(e.key==='End')j=tabs.length-1;else return;e.preventDefault();tabs[j].click();tabs[j].focus();});});});
  renderScene(0);renderCert('ACDA');renderCalendar();
})();

// A single decorative particle field; springs return every point to its grid.
(() => {
  const hero = document.querySelector('.dlc-hero');
  if (!hero) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-particles';
  canvas.setAttribute('aria-hidden', 'true');
  hero.prepend(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return; }
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = { x: 0, y: 0, active: false };
  let width = 0, height = 0, points = [], frame = 0, visible = true;
  let glow = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    if (glow > .005) {
      const radius = Math.min(240, width * .38);
      const light = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius);
      light.addColorStop(0, `rgba(255,255,255,${.34 * glow})`);
      light.addColorStop(.4, `rgba(246,250,255,${.17 * glow})`);
      light.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = light;
      ctx.fillRect(0, 0, width, height);
    }
    for (const p of points) {
      const distance = Math.hypot(p.x - pointer.x, p.y - pointer.y);
      const lit = Math.max(0, 1 - distance / 200) * glow;
      const fade = Math.max(.08, 1 - p.by / (height * 1.12));
      ctx.fillStyle = `rgba(255,255,255,${Math.min(1, .68 * fade + lit * .55)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.25 + lit * .85, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function animate() {
    frame = 0;
    if (!visible || document.hidden) return;
    const targetGlow = pointer.active && !motion.matches ? 1 : 0;
    glow += (targetGlow - glow) * .09;
    let moving = Math.abs(targetGlow - glow) > .005;
    const radius = Math.min(240, width * .38);
    for (const p of points) {
      let tx = p.bx, ty = p.by;
      if (pointer.active && !motion.matches) {
        const dx = pointer.x - p.bx, dy = pointer.y - p.by;
        const distance = Math.hypot(dx, dy);
        const strength = Math.max(0, 1 - distance / radius);
        // Keep a spread of particles around the pointer rather than one white dot.
        const attraction = .68 * strength * strength;
        tx += dx * attraction;
        ty += dy * attraction;
      }
      p.vx = (p.vx + (tx - p.x) * .035) * .79;
      p.vy = (p.vy + (ty - p.y) * .035) * .79;
      p.x += p.vx;
      p.y += p.vy;
      if (Math.abs(tx - p.x) + Math.abs(ty - p.y) + Math.abs(p.vx) + Math.abs(p.vy) > .04) moving = true;
    }
    draw();
    if (moving) frame = requestAnimationFrame(animate);
  }
  function wake() { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(animate); }
  function reset() {
    const box = hero.getBoundingClientRect();
    width = box.width; height = box.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    points = [];
    for (let y = 10; y < height; y += 26) {
      for (let x = 10; x < width; x += 26) points.push({bx:x, by:y, x, y, vx:0, vy:0});
    }
    glow = 0;
    draw();
    wake();
  }
  hero.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch' || motion.matches) return;
    const box = hero.getBoundingClientRect();
    pointer.x = e.clientX - box.left; pointer.y = e.clientY - box.top;
    pointer.active = true;
    wake();
  }, {passive:true});
  hero.addEventListener('pointerleave', () => { pointer.active = false; wake(); });
  hero.addEventListener('pointercancel', () => { pointer.active = false; wake(); });
  motion.addEventListener('change', () => { pointer.active = false; reset(); });
  document.addEventListener('visibilitychange', () => { pointer.active = false; if (document.hidden) { cancelAnimationFrame(frame); frame=0; } else wake(); });
  new ResizeObserver(reset).observe(hero);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) wake(); else { pointer.active=false; cancelAnimationFrame(frame); frame=0; }
  }).observe(hero);
})();
