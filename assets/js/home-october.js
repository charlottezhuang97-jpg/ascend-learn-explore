(() => {
  const art = 'assets/images/october-home/';
  const scenes = [
    {title:'Ascend C算子开发',topic:'模型训练 / CANN',course:'operator',tags:['编程模型','编程范式','SIMD模型','矩阵计算'],units:'6单元 | 18讲',steps:['Ascend C 入门简单Vector算子开发','Ascend C 进阶泛化Vector算子开发','Ascend C 高级Cube算子开发','Ascend C 高级CV融合算子']},
    {title:'大模型分布式训练',topic:'训练开发 / MindSpore',course:'training',tags:['模型构建','训练编排','混合精度','分布式训练'],units:'7单元 | 22讲',steps:['昇腾算力与 MindSpore 框架入门','数据处理与模型训练实践','分布式并行训练与通信优化','大模型混合精度与性能调优']},
    {title:'大模型推理服务部署',topic:'推理与部署 / MindIE',course:'inference',tags:['模型转换','推理适配','服务部署','性能验证'],units:'5单元 | 16讲',steps:['模型转换与昇腾推理环境搭建','模型适配与推理验证','MindIE 推理服务化部署','推理时延与吞吐性能优化']},
    {title:'昇腾开发调试与调优',topic:'调试与性能调优 / CANN',course:'operator',tags:['问题定位','精度分析','性能采集','优化验证'],units:'6单元 | 18讲',steps:['开发环境检查与常见问题定位','算子精度分析与调试实践','性能数据采集与瓶颈分析','Tiling 策略与执行效率优化']},
    {title:'RAG 智能体应用开发',topic:'AI应用与智能体',course:'agent',tags:['模型接入','知识检索','工具调用','应用评估'],units:'5单元 | 14讲',steps:['大模型接入与应用开发基础','知识库构建与 RAG 检索实践','工具调用与智能体工作流编排','AI 应用部署与效果评估']}
  ];
  const tags = list => `<div class="small-tags">${list.map(t=>`<span>${t}</span>`).join('')}</div>`;
  function renderScene(index){
    const s=scenes[index];
    document.getElementById('scenarioContent').innerHTML=`<a class="scenario-course" href="course-preview.html?course=${s.course}"><img src="${index===0?art+'operator-art.webp':'assets/images/figma-home/continue-course.png'}" alt=""><div class="scenario-course-info"><small><b>◈ 微认证</b>${s.topic}</small><h3>${s.title}</h3>${tags(s.tags)}</div><div class="scenario-course-meta"><span>▤ ${s.units}</span><span>▣ 标准实践</span></div></a><div class="scenario-path">${s.steps.map((t,i)=>`<a class="path-step" href="course-preview.html?course=${s.course}"><span>${['初级','中级','高级','高级'][i]}</span>${t}</a>`).join('')}<a class="path-step" href="course-preview.html?course=${s.course}"><span>实践</span>完成以上课程，将所学知识应用到真实场景，开始你的开发任务 <b aria-hidden="true">›</b></a></div>`;
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
  // Reference activities are illustrative; no live calendar service is implied.
  const events=[{day:3,kind:'会议',title:'CANN SIG 会议',time:'10:00–12:00',desc:'CANN 算子开发与社区议题交流',place:'线上会议'},{day:6,kind:'活动',title:'Ascend C 算子开发训练营',time:'14:00–16:00',desc:'从基础算子实现到性能分析，动手完成开发实践',place:'线上训练营'},{day:11,kind:'会议',title:'MindSpore 开发者交流',time:'10:00–11:30',desc:'模型训练与分布式实践经验分享',place:'线上会议'},{day:12,kind:'峰会',title:'CANN Developer Day 2026',time:'09:00–17:00',desc:'开发者技术分享、社区共建与现场交流',place:'线下活动'},{day:18,kind:'活动',title:'MindIE 推理部署实战',time:'14:00–16:00',desc:'推理服务部署、性能采集与优化实践',place:'线上训练营'},{day:25,kind:'活动',title:'AI 应用与智能体工作坊',time:'14:00–17:00',desc:'从 RAG 到工具调用，搭建完整的智能体应用',place:'线上工作坊'}];
  let year=2026,month=9,kind='全部',selected=null;
  function monthEvents(){return year===2026&&month===9?events.filter(e=>kind==='全部'||e.kind===kind):[];}
  function renderCalendar(){
    document.getElementById('calendarMonth').textContent=`${year}年${month+1}月`;
    const first=new Date(year,month,1).getDay(),days=new Date(year,month+1,0).getDate(),count=Math.ceil((first+days)/7)*7,items=monthEvents();
    const grid=document.getElementById('calendarGrid');grid.innerHTML='';
    for(let i=0;i<count;i++){
      const day=i-first+1,date=new Date(year,month,day),outside=day<1||day>days,ev=outside?[]:items.filter(e=>e.day===day),b=document.createElement('button');b.type='button';
      b.className=outside?'other-month':ev.length?'has-event':'';b.setAttribute('aria-label',`${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日${ev.length?'，'+ev.map(e=>e.title).join('、'):'，暂无活动'}`);b.setAttribute('aria-pressed',String(!outside&&selected===day));
      b.innerHTML=`<span>${date.getDate()}</span><span class="event-dots" aria-hidden="true">${ev.map(e=>`<i class="event-dot" data-kind="${e.kind}"></i>`).join('')}</span>`;
      b.addEventListener('click',()=>{if(outside){year=date.getFullYear();month=date.getMonth();}selected=date.getDate();renderCalendar();document.querySelector(`#calendarGrid button[aria-pressed="true"]`)?.focus({preventScroll:true});});grid.append(b);
    }
    const shown=items.filter(e=>selected===null||e.day===selected);
    document.getElementById('eventList').innerHTML=shown.length?shown.map((e,i)=>`<details class="event-item" ${i===0?'open':''}><summary>${e.title}</summary><p class="event-time">2026/10/${String(e.day).padStart(2,'0')}　${e.time}　|　${e.kind}</p><div class="event-detail"><p>活动内容　${e.desc}</p><p>参与方式　${e.place}</p><p>日程说明　设计演示，正式活动以社区公告为准。</p><a href="catalog.html">探索相关学习资源 →</a></div></details>`).join(''):`<p class="empty-events">${selected?`${month+1}月${selected}日`:'本月'}暂无${kind==='全部'?'':kind}活动安排<br>可切换日期或查看本月全部活动。</p>`;
  }
  function moveMonth(delta){month+=delta;if(month<0){month=11;year--;}if(month>11){month=0;year++;}selected=null;renderCalendar();}
  document.getElementById('previousMonth').addEventListener('click',()=>moveMonth(-1));document.getElementById('nextMonth').addEventListener('click',()=>moveMonth(1));
  document.querySelectorAll('[data-kind]').forEach(b=>{if(b.tagName!=='BUTTON')return;b.addEventListener('click',()=>{kind=b.dataset.kind;selected=null;document.querySelectorAll('.event-filters button').forEach(t=>t.setAttribute('aria-pressed',String(t===b)));renderCalendar();});});
  document.getElementById('showAllEvents').addEventListener('click',()=>{selected=null;renderCalendar();});
  document.querySelector('.nav-search').addEventListener('click',()=>{document.getElementById('top').scrollIntoView({behavior:'smooth'});document.getElementById('heroInput').focus({preventScroll:true});});
  // Roving focus follows the WAI-ARIA tab keyboard convention.
  document.querySelectorAll('.pill-tabs,.scenario-subtabs').forEach(group=>{const tabs=[...group.querySelectorAll('[role=tab]')];function sync(){tabs.forEach(t=>t.tabIndex=t.getAttribute('aria-selected')==='true'?0:-1);}sync();tabs.forEach((b,i)=>{b.addEventListener('click',sync);b.addEventListener('keydown',e=>{let j;if(e.key==='ArrowRight')j=(i+1)%tabs.length;else if(e.key==='ArrowLeft')j=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')j=0;else if(e.key==='End')j=tabs.length-1;else return;e.preventDefault();tabs[j].click();tabs[j].focus();});});});
  renderScene(0);renderCert('ACDA');renderCalendar();
})();
