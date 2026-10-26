(() => {
  'use strict';
  const $=s=>document.querySelector(s);
  const icons={book:'<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Z"/><path d="M12 5v15"/>',list:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',flask:'<path d="M9 3h6M10 3v7L4 20h16l-6-10V3M8 15h8"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',certificate:'<path d="M13 20H5V3h14v10M8 7h8M8 11h6"/><circle cx="17" cy="16" r="4"/><path d="m15 19-1 4 3-2 3 2-1-4"/>',chip:'<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 1v5M15 1v5M9 18v5M15 18v5M1 9h5M1 15h5M18 9h5M18 15h5"/>',brain:'<path d="M12 4c-4-5-8 0-6 3-6 0-5 8-2 9-1 5 5 7 8 3 3 4 9 2 8-3 3-1 4-9-2-9 2-3-2-8-6-3Zm0 0v15M7 8l2 3-2 3M17 8l-2 3 2 3"/>',robot:'<rect x="3" y="7" width="18" height="13" rx="4"/><path d="M12 3v4M9 16h6"/><circle cx="8" cy="12" r="1"/><circle cx="16" cy="12" r="1"/>',terminal:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/>'};
  const icon=name=>'<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">'+icons[name]+'</svg>';
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const courses=[
    {id:'cert-inference-vllm',title:'vLLM-ascend推理部署与调优',description:'认识 vLLM 与 vLLM-ascend 的整体架构、关键技术和部署流程，学习推理精度与性能测试以及模型迁移适配。',preview:'整体架构与关键技术 · 推理部署流程 · 精度与性能测试…',caseTitle:'完成模型部署并验证推理结果',modules:[['整体架构与关键技术','vLLM 与 vLLM-ascend 的整体架构','推理引擎与昇腾执行层的协作'],['推理部署流程','准备软件栈与模型权重','完成推理服务部署与调用'],['测试与迁移适配','检查推理输出与精度','开展性能测试与模型适配']],steps:['检查软件栈与模型权重的配套关系','部署服务并发送一条推理请求','对比预期输出，记录精度与性能测试结果'],outcome:'形成可复现的推理服务部署步骤和验证记录。'},
    {id:'cert-inference-profiling',title:'基于vLLM-ascend的Profiling采集及推理性能分析',description:'学习 vLLM-ascend 框架的 Profiling 数据采集与性能分析方法，定位大模型推理过程中的性能瓶颈并形成优化思路。',preview:'Profiling数据采集 · 推理性能分析 · 瓶颈定位与优化…',caseTitle:'采集推理任务，分析性能瓶颈',modules:[['Profiling 数据采集','明确采集目标与性能指标','配置并执行一次数据采集'],['推理性能分析','阅读时间线与关键性能数据','分析计算、通信与调度开销'],['瓶颈定位与优化','定位影响推理性能的主要环节','提出优化方案并对比结果']],steps:['选定一组可重复执行的推理请求','采集 Profiling 数据并观察时间线','定位主要瓶颈，记录优化前后的变化'],outcome:'形成一份包含采集过程、瓶颈定位和优化建议的分析记录。'},
    {id:'cert-inference-motor',title:'基于MindIE Motor部署vLLM大EP推理服务',description:'学习在昇腾平台完成大规模推理的集群部署、调度和推理服务，理解 MindIE Motor 与 vLLM 大 EP 服务的协同。',preview:'集群部署 · 任务调度 · 大规模推理服务…',caseTitle:'部署大EP服务并验证调用',modules:[['集群部署','检查节点环境与版本配套','准备模型权重与部署配置'],['任务调度','理解大 EP 部署与负载均衡','检查节点和服务的运行状态'],['大规模推理服务','调用推理服务并验证输出','记录运行过程与服务表现']],steps:['检查集群环境、模型权重与部署配置','部署大 EP 推理服务并检查状态','发送推理请求，记录调用与验证结果'],outcome:'形成集群部署配置、服务调用步骤和运行验证记录。'}
  ];
  const topics=[
    {title:'推理开发概述',percent:10,summary:['定位与生态、软件栈与版本配套','部署选型与典型应用'],goals:['vLLM-Ascend 定位与开源生态','vLLM-Ascend 软件栈与版本配套','vLLM-Ascend 与 MindIE Motor 部署选型','推理场景与典型应用']},
    {title:'基础理论与架构',percent:10,summary:['vLLM核心机制原理','昇腾执行层优化'],goals:['vLLM 核心机制原理','昇腾执行层优化']},
    {title:'推理开发关键特性',percent:20,summary:['PD分离与混部、大EP部署与负载均衡','调度优化、推测解码、量化与扩展'],goals:['PD 分离与混部','大 EP 部署与负载均衡','计算调度优化','推测解码','量化与扩展特性']},
    {title:'推理部署与开发',percent:30,summary:['环境准备、权重管理、离线与在线推理','MindIE Motor大规模推理部署'],goals:['环境准备','权重管理','离线推理','在线推理','MindIE Motor 大规模推理部署']},
    {title:'推理性能调优',percent:30,summary:['性能指标体系、Profiling采集与分析','瓶颈定位、综合调优实践'],goals:['性能指标体系','Profiling 工具与采集','Profiling 瓶颈分析','综合调优实践']}
  ];
  const practices=[{title:'部署与验证',goals:['版本配套检查与升级','权重文件正确性校验']},{title:'服务与调优',goals:['模型推理服务部署与精度验证','模型推理性能调优']}];
  const params=new URLSearchParams(location.search);
  const searchEntry=params.get('flow')==='search';
  const certificationLevel=['入门级','工作级','开发级'].includes(params.get('level'))?params.get('level'):'工作级';
  const selectionKey='ascend-cert-map-v2-courses';
  let selected=courses.map(c=>c.id), domain='gen', legacy=null, plan=null, resizeObserver=null, returnFocus=null;
  try{const v=JSON.parse(localStorage.getItem(selectionKey));if(Array.isArray(v))selected=courses.filter(c=>v.includes(c.id)).map(c=>c.id);}catch{}
  const dialog=$('#detailsDialog');
  document.querySelectorAll('[data-domain]').forEach(b=>{const id=b.dataset.domain;b.innerHTML=icon(id==='cann'?'chip':id==='gen'?'brain':'robot')+'<span>'+({cann:'CANN',gen:'生成式AI',agent:'智能体'})[id]+'</span>';b.addEventListener('click',()=>setDomain(id));});
  function courseCard(c){const directory=c.modules.map((m,i)=>'<span class="directory-preview-row"><small>0'+(i+1)+'</small><span><b>'+m[0]+'</b><em>'+m.slice(1).join(' · ')+'</em></span></span>').join('');return '<article class="course-card" data-course="'+c.id+'"><header class="course-heading"><span class="icon-tile">'+icon('book')+'</span><h4>'+c.title+'</h4></header><button type="button" class="content-module directory-module" data-directory="'+c.id+'" aria-label="查看'+c.title+'的全部目录">'+icon('list')+'<span class="module-text"><span class="module-line"><strong>课程目录</strong><span class="module-action">查看全部目录 →</span></span><span class="module-preview-list">'+directory+'</span></span></button><button type="button" class="content-module case" data-case="'+c.id+'" aria-label="查看案例：'+c.caseTitle+'">'+icon('flask')+'<span class="module-text"><span class="module-line"><strong>案例实践</strong><span class="chevron" aria-hidden="true">›</span></span><span class="module-summary">'+c.caseTitle+'</span></span></button><footer class="course-foot"><span class="duration">'+icon('clock')+'时长：20min</span><button type="button" class="text-button" data-course-detail="'+c.id+'">查看课程 →</button></footer></article>'; }
  function topicCard(t,i){return '<button class="topic-card" type="button" data-topic="'+i+'"><span class="topic-head">'+icon('list')+'<strong>'+t.title+'</strong><span class="percent">'+t.percent+'%</span></span><p>'+t.summary.join('<br>')+'</p></button>';}
  function practiceCard(p,i){return '<button class="practice-card" type="button" data-practice="'+i+'"><span class="topic-head">'+icon('terminal')+'<strong>'+p.title+'</strong></span><p>'+p.goals.join('<br>')+'</p></button>';}
  function stage(n,title,subtitle,left,right,cls=''){return '<section class="route-stage '+cls+'" aria-labelledby="stage'+n+'"><header class="stage-head"><span class="stage-count">0'+n+'</span><h3 id="stage'+n+'">'+title+'</h3><p>'+subtitle+'</p></header><div class="stage-grid"><svg class="stage-lines" aria-hidden="true"></svg><div class="stage-column left">'+left+'</div><div class="spine-node"><b>0'+n+'</b><strong>'+title+'</strong><small>'+subtitle+'</small></div><div class="stage-column right">'+right+'</div></div></section>';}
  function renderRoute(){
    resizeObserver?.disconnect();
    const shown=courses.filter(c=>selected.includes(c.id)), left=shown.filter((c,i)=>i%2===0),right=shown.filter((c,i)=>i%2===1);
    $('#route').innerHTML=stage(1,'理论学习','课程目录与案例',left.map(courseCard).join('')||'<p class="empty-courses">尚未选择课程。点击“编辑学习内容”添加课程。</p>',right.map(courseCard).join(''),'course-stage')+stage(2,'理论考试','按知识领域检验所学',[0,2,4].map(i=>topicCard(topics[i],i)).join(''),[1,3].map(i=>topicCard(topics[i],i)).join(''),'theory-stage')+stage(3,'编程考试','线下预约考试',practiceCard(practices[0],0),practiceCard(practices[1],1),'practice-stage')+'<section class="route-stage certificate-stage" aria-labelledby="stage4"><header class="stage-head"><span class="stage-count">04</span><h3 id="stage4">获取证书</h3><p>完成考试后获取认证</p></header><div class="certificate-card">'+icon('certificate')+'<div><h4>推理开发者认证（'+certificationLevel+'）</h4><p>完成学习与考试，检验推理开发能力</p><button type="button" data-certificate>查看证书 →</button></div></div></section>';
    $('#planAll').disabled=!shown.length;
    resizeObserver=new ResizeObserver(()=>requestAnimationFrame(drawLines));
    document.querySelectorAll('.stage-grid').forEach(e=>resizeObserver.observe(e));
    requestAnimationFrame(drawLines);
  }
  function drawLines(){
    document.querySelectorAll('.stage-grid').forEach(grid=>{
      const svg=grid.querySelector('.stage-lines');if(!svg||innerWidth<=700)return;
      const g=grid.getBoundingClientRect(),n=grid.querySelector('.spine-node').getBoundingClientRect();
      svg.setAttribute('viewBox','0 0 '+g.width+' '+g.height);let paths='';
      grid.querySelectorAll('.stage-column').forEach(col=>{const left=col.classList.contains('left');const cards=col.querySelectorAll('.course-card,.topic-card,.practice-card');cards.forEach(card=>{const c=card.getBoundingClientRect();const x1=left?c.right-g.left:c.left-g.left,y1=c.top-g.top+Math.min(c.height/2,65),x2=left?n.left-g.left:n.right-g.left,y2=n.top-g.top+n.height/2,mid=(x1+x2)/2;paths+='<path d="M '+x1+' '+y1+' C '+mid+' '+y1+', '+mid+' '+y2+', '+x2+' '+y2+'"/><circle cx="'+x1+'" cy="'+y1+'" r="3"/>';});});svg.innerHTML=paths;
    });
  }
  function showDetails(kicker,title,body,actions=[]){
    returnFocus=document.activeElement;$('#detailsKicker').textContent=kicker;$('#detailsTitle').textContent=title;$('#detailsBody').innerHTML=body;$('#detailsActions').replaceChildren();
    actions.forEach(({label,primary,run})=>{const b=document.createElement('button');b.type='button';b.textContent=label;if(primary)b.className='primary';b.onclick=run;$('#detailsActions').append(b);});
    if(!dialog.open)dialog.showModal();$('#closeDetails').focus();
  }
  function closeDetails(){dialog.close();returnFocus?.focus({preventScroll:true});}
  $('#closeDetails').onclick=closeDetails;dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDetails();}});
  dialog.addEventListener('close',()=>returnFocus?.focus({preventScroll:true}));
  function courseActions(c){return [{label:'安排这门课程',primary:true,run:()=>{closeDetails();showPlan([c]);}}];}
  function showDirectory(c){showDetails('课程目录 · 内容示意',c.title,'<p>'+c.description+'</p>'+c.modules.map((m,i)=>'<details '+(!i?'open':'')+'><summary>模块 '+(i+1)+' · '+m[0]+'</summary><ol>'+m.slice(1).map(t=>'<li>'+t+'</li>').join('')+'</ol></details>').join('')+'<p class="notice">以上为根据参考课程描述整理的目录示意，实际课程目录以正式课程为准。课程卡片展示时长：20min。</p>',courseActions(c));}
  function showCase(c){showDetails('案例实践 · 学习示意',c.caseTitle,'<p>关联课程：'+c.title+'</p><h3>实践步骤</h3><ol>'+c.steps.map(t=>'<li>'+t+'</li>').join('')+'</ol><h3>预期成果</h3><p>'+c.outcome+'</p><p class="notice">本页展示案例说明；学习与实践入口在课程学习计划中。</p>',courseActions(c));}
  $('#route').addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    const c=courses.find(c=>c.id===(b.dataset.directory||b.dataset.case||b.dataset.courseDetail));
    if(b.dataset.directory)showDirectory(c);
    else if(b.dataset.case)showCase(c);
    else if(b.dataset.courseDetail)showDetails('课程 · 20min',c.title,'<p>'+c.description+'</p><h3>你能学到什么</h3><ul>'+c.modules.map(m=>'<li>'+m[0]+'</li>').join('')+'</ul><h3>案例实践</h3><p>'+c.caseTitle+'</p>',[{label:'查看全部目录',run:()=>showDirectory(c)},...courseActions(c)]);
    else if(b.dataset.topic!==undefined){const t=topics[Number(b.dataset.topic)];showDetails('理论考试 · 占比 '+t.percent+'%',t.title,'<p>学习与复习时重点关注以下知识内容。</p><ul>'+t.goals.map(g=>'<li>'+g+'</li>').join('')+'</ul><p class="notice">考试内容与占比来自提供的认证参考截图。本页为知识地图预览，不进行考试报名或提交。</p>');}
    else if(b.dataset.practice!==undefined){const p=practices[Number(b.dataset.practice)];showDetails('编程考试 · 线下预约考试',p.title,'<p>通过实际操作检验以下能力：</p><ul>'+p.goals.map(g=>'<li>'+g+'</li>').join('')+'</ul><p class="notice">预约与考试安排以正式认证页面为准。</p>');}
    else if(b.hasAttribute('data-certificate'))showDetails('认证成果','推理开发者认证（工作级）','<p>完成课程学习，并通过理论考试与编程考试后，可获取对应认证。</p><h3>认证路径</h3><ol><li>学习推荐课程与案例</li><li>完成理论考试</li><li>完成编程考试</li><li>获取并查看认证证书</li></ol><p class="notice">当前为证书说明，未代表已通过考试或获得证书。</p>');
  });
  function editCourses(){showDetails('自定义学习内容','选择这条路径中的课程','<p>勾选需要学习的课程，课程选择会保存在当前浏览器。理论和编程考试要求保持呈现。</p>'+courses.map(c=>'<label class="edit-choice"><input type="checkbox" value="'+c.id+'" '+(selected.includes(c.id)?'checked':'')+'><span>'+c.title+'</span></label>').join(''),[{label:'取消',run:closeDetails},{label:'保存课程选择',primary:true,run:()=>{selected=[...dialog.querySelectorAll('input:checked')].map(e=>e.value);let saved=true;try{localStorage.setItem(selectionKey,JSON.stringify(selected));}catch{saved=false;}closeDetails();renderRoute();$('#editStatus').textContent=saved?'已保存课程选择 · '+selected.length+' 门课程':'已更新当前页面，浏览器未允许保存';}}]);}
  $('#editCourses').onclick=editCourses;
  function showPlan(list){
    if(!list.length)return;
    $('#route').hidden=true;$('#legacyHost').hidden=true;$('.map-intro').hidden=true;$('#planHost').hidden=false;resizeObserver?.disconnect();
    plan?.destroy?.();const planned=list.map(c=>({...c,lessonMinutes:20,modules:[['课程学习',c.title]]}));
    plan=window.createLearningPlan({courses:planned,goal:'完成推理开发者认证（工作级）的课程学习',onBack:()=>{plan?.destroy?.();$('#planHost').replaceChildren();$('#planHost').hidden=true;$('.map-intro').hidden=false;setDomain(domain);}});$('#planHost').replaceChildren(plan);window.scrollTo({top:0});
  }
  if(searchEntry){document.documentElement.classList.add('cert-map-search-entry');$('#genNavigation h2').innerHTML='推理开发者认证<span>（'+certificationLevel+'）</span>';$('#planAll').innerHTML='查看课程预览 <span aria-hidden="true">→</span>';$('#planAll').onclick=()=>parent.postMessage({type:'cert-map:preview',level:certificationLevel},location.origin);}
  else $('#planAll').onclick=()=>showPlan(courses.filter(c=>selected.includes(c.id)));
  function reportFrameHeight(){if(parent!==window)parent.postMessage({type:'cert-map:resize',height:document.documentElement.scrollHeight},location.origin);}
  if(searchEntry){window.addEventListener('load',reportFrameHeight);window.addEventListener('resize',reportFrameHeight);new ResizeObserver(()=>requestAnimationFrame(reportFrameHeight)).observe(document.body);window.addEventListener('message',e=>{if(e.origin===location.origin&&e.data?.type==='cert-map:measure')reportFrameHeight();});}
  function setDomain(id){
    domain=id;document.querySelectorAll('[data-domain]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.domain===id)));legacy?.destroy?.();legacy=null;$('#legacyHost').replaceChildren();
    $('#genNavigation').hidden=id!=='gen';$('#route').hidden=id!=='gen';$('#legacyHost').hidden=id==='gen';document.body.classList.toggle('legacy-mode',id!=='gen');
    if(id==='gen'){renderRoute();return;}
    resizeObserver?.disconnect();legacy=window.createKnowledgeOutline({goal:id==='cann'?'我要学习算子开发':'我要学习智能体应用开发',workflow:true,onStart:(course,list)=>showPlan(list||[course])});$('#legacyHost').append(legacy);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{legacy.querySelector('[data-scene="'+id+'"]').click();legacy.querySelector('.kmap-sidebar').hidden=true;}));
  }
  window.addEventListener('resize',drawLines);document.fonts?.ready.then(drawLines);renderRoute();
})();
