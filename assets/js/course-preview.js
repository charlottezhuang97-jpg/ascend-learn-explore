const courses = {
  training: {
    title: '大模型分布式训练',
    summary: '完成从全局认识、设备协同到稳定调优与实战验收的完整链路。',
    previewTitle: '完成一次可验证的分布式训练',
    outcomeTitle: '独立完成一次可验证的分布式训练',
    intro: '分布式训练通过多设备协同处理模型与数据，提升训练效率；本课程将带你掌握并行策略、通信同步、训练调优与任务验证。',
    meta: ['6 单元', '约 12 小时', '2 个实战', '适合：有单卡训练经验'],
    outcome: '保存训练脚本、指标对比与异常诊断记录，沉淀为可复用的能力证明。',
    stages: [
      {title:'建立全局认识', unitRange:'单元 1–2', reason:'先建立单卡基线并理解训练任务，再选择适合的并行策略。', units:[['课程','单元 1：分布式训练全景','28 分钟'],['课程','单元 2：模型与数据并行','34 分钟']]},
      {title:'完成设备协同', unitRange:'单元 3–4', reason:'模型和数据拆分后，再通过通信与梯度同步让多设备协同工作。', units:[['课程','单元 3：通信与梯度同步','26 分钟'],['实践','单元 4：混合精度与吞吐','32 分钟']]},
      {title:'稳定并优化训练', unitRange:'单元 5', reason:'先让训练过程稳定，才能用一致的环境完成实战验收。', units:[['测验','单元 5：训练稳定性测试','36 分钟']]},
      {title:'实战验收', unitRange:'单元 6', reason:'把前面学到的配置、协同和调优方法放进真实任务中验证。', units:[['实践','单元 6：双卡图像分类训练','24 分钟']]}
    ],
    peers:[['NPU_Leo','建立全局认识',35,'L'],['林深见鹿','建立全局认识',60,'林'],['KernelCat','建立全局认识',78,'K']],
    peerTotal:'1000+',
    proofIntro:'已在 Ascend 910B、MindSpore 2.4 环境复现双卡训练流程。',
    proof:[['18','个真实复现案例','▤'],['12','项关键指标已核验','▥']],
    proofVersion:'适用 MindSpore 2.4 · 最近验证 2026.09'
  },
  operator: {
    title:'Ascend C 算子开发', summary:'完成从计算图理解、算子编写、编译运行到实战验收的完整链路。', previewTitle:'完成一次可运行的自定义算子开发', intro:'从计算图和任务边界开始，逐步完成 Kernel 编写、编译运行、问题定位与性能验证。', meta:['6 单元','约 10 小时','2 个实战','适合：有 Python 基础'], outcome:'提交可运行的自定义算子、测试结果和性能对比，形成可复用的能力证明。',
    stages:[{title:'建立全局认识',unitRange:'单元 1',reason:'先明确算子在计算图中的位置和输入输出，再开始编写 Kernel。',units:[['课程','单元 1：算子开发与计算图','26 分钟']]},{title:'完成首个算子',unitRange:'单元 2–3',reason:'理解编程模型后，将计算逻辑写成可运行的 Kernel。',units:[['课程','单元 2：编程模型与 Kernel','32 分钟'],['实践','单元 3：矩阵计算实验','40 分钟']]},{title:'编译运行验证',unitRange:'单元 4–5',reason:'完成编译和测试后，再定位边界问题并开展性能调优。',units:[['课程','单元 4：工程化与编译运行','28 分钟'],['测验','单元 5：正确性与边界检查','24 分钟']]},{title:'实战验收',unitRange:'单元 6',reason:'用完整任务验证实现结果，并保存代码和性能记录。',units:[['实践','单元 6：算子优化挑战','50 分钟']]}],
    peers:[['NPU_Leo','完成首个算子',35,'L'],['林深见鹿','编译运行验证',60,'林'],['KernelCat','实战验收',78,'K']],peerTotal:'860+',proofIntro:'课程代码已在对应 CANN 环境运行，覆盖正确性和性能示例。',proof:[['16','个真实复现案例','▤'],['10','项关键指标已核验','▥']],proofVersion:'适用 CANN 8.0 · 最近验证 2026.09'
  },
  inference:{
    title:'大模型推理服务部署',summary:'完成从模型转换、推理适配到服务化部署验证的完整链路。',previewTitle:'完成一次可上线的推理服务部署',intro:'从确认模型和环境开始，逐步完成转换、服务封装、压测和上线验证。',meta:['6 单元','约 9 小时','2 个实战','适合：了解模型推理基础'],outcome:'部署可调用的推理服务，保存性能、精度和异常诊断证据。',
    stages:[{title:'确认输入基础',unitRange:'单元 1',reason:'先看清模型到服务的完整路径，明确运行环境和输入要求。',units:[['课程','单元 1：推理服务全景','25 分钟']]},{title:'完成模型转换',unitRange:'单元 2–3',reason:'获得目标模型格式后，推理引擎才能稳定加载并返回结果。',units:[['课程','单元 2：模型转换与量化','32 分钟'],['实践','单元 3：模型加载实验','35 分钟']]},{title:'部署在线服务',unitRange:'单元 4–5',reason:'服务可以访问后，再使用真实请求开展压测和性能分析。',units:[['课程','单元 4：推理引擎与服务化','30 分钟'],['测验','单元 5：部署检查','20 分钟']]},{title:'压测与上线',unitRange:'单元 6',reason:'完成指标和异常验证后，再交付可复用的服务配置。',units:[['实践','单元 6：推理服务部署验收','45 分钟']]}],
    peers:[['NPU_Leo','完成模型转换',35,'L'],['林深见鹿','部署在线服务',60,'林'],['KernelCat','压测与上线',78,'K']],peerTotal:'730+',proofIntro:'服务部署示例已在目标环境验证，覆盖模型加载、请求和性能指标。',proof:[['21','个真实复现案例','▤'],['14','项关键指标已核验','▥']],proofVersion:'适用 CANN 8.0 · 最近验证 2026.09'
  },
  agent:{
    title:'RAG 智能体应用开发',summary:'完成从知识库构建、工具调用到应用评估纠错的完整链路。',previewTitle:'完成一个可评估的 RAG 智能体应用',intro:'先区分检索、生成和工具调用，再搭建可评估、可纠错的应用工作流。',meta:['6 单元','约 8 小时','1 个项目','适合：有 Python 基础'],outcome:'构建可检索、可调用工具并能够评估纠错的 RAG 应用。',
    stages:[{title:'明确系统边界',unitRange:'单元 1',reason:'先确认检索和生成的职责，才能准备合适的数据。',units:[['课程','单元 1：RAG 应用全景','24 分钟']]},{title:'建立知识库',unitRange:'单元 2–3',reason:'召回内容可靠后，生成回答才有依据。',units:[['课程','单元 2：知识库构建与检索','36 分钟'],['实践','单元 3：召回效果评估','40 分钟']]},{title:'编排工作流',unitRange:'单元 4–5',reason:'工作流运行后，再系统评估工具调用和回答质量。',units:[['课程','单元 4：提示词与工具调用','32 分钟'],['测验','单元 5：应用评估','20 分钟']]},{title:'评估与交付',unitRange:'单元 6',reason:'达到评估标准后，整理并交付可维护的应用。',units:[['实践','单元 6：RAG 应用项目','50 分钟']]}],
    peers:[['NPU_Leo','建立知识库',35,'L'],['林深见鹿','编排工作流',60,'林'],['KernelCat','评估与交付',78,'K']],peerTotal:'680+',proofIntro:'关键检索与工具调用示例经过运行验证，并标注适用框架版本。',proof:[['13','个真实复现案例','▤'],['9','项关键指标已核验','▥']],proofVersion:'适用框架版本已标注 · 最近验证 2026.09'
  }
};

const courseKey = new URLSearchParams(location.search).get('course') || 'training';
const course = courses[courseKey] || courses.training;
const startLink=document.querySelector('.start-button');
if(startLink)startLink.href=`learn.html?course=${encodeURIComponent(courseKey)}&unit=1-1`;
const setText = (selector,value)=>document.querySelectorAll(selector).forEach(el=>el.textContent=value);
setText('[data-course-title]',course.title);
setText('[data-course-summary]',course.summary);
setText('[data-preview-title]',course.previewTitle);
setText('[data-outcome-title]',course.outcomeTitle||course.previewTitle);
setText('[data-unit-intro]',course.intro);
setText('[data-route-outcome]',course.outcome);
setText('[data-stage-count]',`${course.stages.length} 个阶段 · ${course.stages.reduce((count,stage)=>count+stage.units.length,0)} 个单元`);
setText('[data-peer-total]',course.peerTotal);
setText('[data-proof-intro]',course.proofIntro);

const escapeHtml = value => String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const meta=document.querySelector('.preview-meta');
if(meta)meta.replaceChildren(...course.meta.map(value=>{const chip=document.createElement('span');chip.textContent=value;return chip;}));

const nav=document.querySelector('#stageNav');
const route=document.querySelector('#courseRoute');
course.stages.forEach((stage,index)=>{
  const selected=index===0;
  const navItem=document.createElement('li');
  const unitButtons=stage.units.map((unit,unitIndex)=>`<li><button type="button" data-unit-nav="${index}-${unitIndex}"><span class="unit-doc" aria-hidden="true"></span>${escapeHtml(unit[1])}</button></li>`).join('');
  navItem.innerHTML=`<button type="button" data-stage-index="${index}" aria-expanded="${selected}" ${selected?'aria-current="step"':''}><span class="stage-number">${index+1}</span><span><strong>${escapeHtml(stage.title)}</strong><small>${escapeHtml(stage.unitRange)}</small></span><span class="stage-chevron" aria-hidden="true">⌄</span></button><ol class="stage-units" ${selected?'':'hidden'}>${unitButtons}</ol>`;
  nav.append(navItem);

  const units=stage.units.map(([kind,title,duration],unitIndex)=>`<div class="stage-unit" data-kind="${escapeHtml(kind)}"><span class="unit-kind-icon" aria-hidden="true"></span><span class="kind-label">${escapeHtml(kind)}</span><span class="unit-title">${escapeHtml(title)}</span><span class="unit-duration">${escapeHtml(duration)}</span><a class="unit-play" href="learn.html?course=${encodeURIComponent(courseKey)}&unit=${index+1}-${unitIndex+1}" aria-label="开始${escapeHtml(title)}">▶</a></div>`).join('');
  const routeItem=document.createElement('li');
  routeItem.className=`${selected?'is-current is-open':''}`;
  routeItem.innerHTML=`<div class="stage-entry"><button class="stage-toggle" type="button" data-route-index="${index}" aria-expanded="${selected}"><span class="roadmap-node">${index+1}</span><span class="stage-summary"><strong>${escapeHtml(stage.title)}</strong><small>${escapeHtml(stage.unitRange)}</small></span><span class="stage-chevron" aria-hidden="true">⌄</span></button><div class="stage-detail"><small class="stage-reason">${escapeHtml(stage.reason)}</small>${units}</div></div>`;
  route.append(routeItem);
});

const peerList=document.querySelector('#peerList');
peerList.innerHTML=course.peers.map(([name,stage,progress,initial])=>`<article class="peer-row"><span class="peer-avatar" aria-hidden="true">${escapeHtml(initial)}</span><div><b class="peer-name">${escapeHtml(name)}</b><p class="peer-stage">课程进度 ${Number(progress)}% · 正在学习“${escapeHtml(stage)}”</p><div class="peer-progress" role="progressbar" aria-label="${escapeHtml(name)} 的课程进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Number(progress)}"><span class="peer-progress-track"><span class="peer-progress-fill" style="width:${Number(progress)}%"></span></span></div></div></article>`).join('');
document.querySelector('#proofMetrics').innerHTML=course.proof.map(([value,label,icon])=>`<div class="proof-metric"><span class="metric-icon" aria-hidden="true">${escapeHtml(icon)}</span><span><b>${escapeHtml(value)}</b><span>${escapeHtml(label)}</span></span></div>`).join('');

const activateStage=index=>{
  document.querySelectorAll('[data-stage-index]').forEach(button=>{
    const active=Number(button.dataset.stageIndex)===index;
    button.toggleAttribute('aria-current',active);
    button.setAttribute('aria-expanded',String(active));
    const unitList=button.nextElementSibling;
    if(unitList)unitList.hidden=!active;
  });
  document.querySelectorAll('#courseRoute>li').forEach((item,itemIndex)=>{
    const active=itemIndex===index;
    item.classList.toggle('is-current',active);
    item.classList.toggle('is-open',active);
    item.querySelector('[data-route-index]')?.setAttribute('aria-expanded',String(active));
  });
};

document.querySelectorAll('[data-stage-index]').forEach(button=>button.addEventListener('click',()=>{
  const index=Number(button.dataset.stageIndex);
  const wasOpen=button.getAttribute('aria-expanded')==='true';
  if(wasOpen){button.setAttribute('aria-expanded','false');button.nextElementSibling.hidden=true;}
  else activateStage(index);
  document.querySelectorAll('#courseRoute>li')[index]?.scrollIntoView({behavior:'smooth',block:'nearest'});
}));
document.querySelectorAll('[data-route-index]').forEach(button=>button.addEventListener('click',()=>{
  const index=Number(button.dataset.routeIndex);
  const item=button.closest('li');
  const wasOpen=button.getAttribute('aria-expanded')==='true';
  if(wasOpen){button.setAttribute('aria-expanded','false');item.classList.remove('is-open');return;}
  activateStage(index);
  item.scrollIntoView({behavior:'smooth',block:'nearest'});
}));
document.querySelectorAll('[data-unit-nav]').forEach(button=>button.addEventListener('click',()=>{
  const [stageIndex,unitIndex]=button.dataset.unitNav.split('-').map(Number);
  activateStage(stageIndex);
  const item=document.querySelectorAll('#courseRoute>li')[stageIndex];
  item?.querySelectorAll('.stage-unit')[unitIndex]?.scrollIntoView({behavior:'smooth',block:'center'});
}));

document.querySelector('#planButton')?.addEventListener('click',event=>{
  const button=event.currentTarget;
  const joined=button.dataset.joined==='true';
  button.dataset.joined=String(!joined);
  button.innerHTML=joined?'＋ <span>加入计划</span>':'✓ <span>已加入计划</span>';
  button.setAttribute('aria-pressed',String(!joined));
});
