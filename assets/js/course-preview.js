const courses = {
  training: {
    title: '大模型分布式训练',
    summary: '完成从全局认识、设备协同到稳定调优与实战验收的完整链路。',
    previewTitle: '完成一次可验证的分布式训练',
    outcomeTitle: '独立完成一次可验证的分布式训练',
    intro: '分布式训练通过多设备协同处理模型与数据，提升训练效率；本课程将带你掌握并行策略、通信同步、训练调优与任务验证。',
    meta: ['8 单元', '约 14 小时', '3 个实战', '适合：有单卡训练经验'],
    outcome: '保存训练脚本、指标对比与异常诊断记录，沉淀为可复用的能力证明。',
    stages: [
      {title:'建立训练基线', unitRange:'单元 1–2', reason:'先得到可重复的单卡结果，再判断扩展训练是否真正带来收益。', units:[['课程','单元 1：分布式训练任务全景','28 分钟'],['实践','单元 2：建立单卡性能基线','36 分钟']]},
      {title:'选择并行策略', unitRange:'单元 3–4', reason:'理解数据并行与模型切分的边界后，才能为当前模型选择合适的扩展方式。', units:[['课程','单元 3：数据并行与模型切分','34 分钟'],['课程','单元 4：通信域与梯度同步','31 分钟']]},
      {title:'完成设备协同', unitRange:'单元 5–6', reason:'先让集合通信稳定工作，再用混合精度与计算通信重叠提升吞吐。', units:[['实践','单元 5：HCCL 双卡通信配置','42 分钟'],['课程','单元 6：混合精度与通信重叠','38 分钟']]},
      {title:'稳定并优化训练', unitRange:'单元 7', reason:'对齐 Loss、显存与吞吐指标，定位扩展效率下降的原因。', units:[['测验','单元 7：稳定性与性能诊断','30 分钟']]},
      {title:'实战验收', unitRange:'单元 8', reason:'把配置、协同和调优方法放进真实任务中，留下可复现的训练证据。', units:[['实践','单元 8：双卡图像分类训练验收','55 分钟']]}
    ],
    peers:[['NPU_Leo','选择并行策略',35,'male'],['林深见鹿','完成设备协同',60,'female-left'],['KernelCat','稳定并优化训练',78,'female-right']],
    peerTotal:'1000+',
    proofIntro:'已在 Ascend 910B、MindSpore 2.4 环境复现双卡训练流程。',
    proof:[['18','个真实复现案例','▤'],['12','项关键指标已核验','▥']],
    proofVersion:'适用 MindSpore 2.4 · 最近验证 2026.09'
  },
  operator: {
    title:'Ascend C 算子开发', summary:'完成从任务分析、Kernel 与 Tiling 实现，到工程部署和性能验收的完整链路。', previewTitle:'完成一次可运行的自定义算子开发', intro:'依据官方工程化流程，从输入输出分析开始，逐步完成 Kernel、Host 侧 Tiling、编译部署、单算子调用与入图验证。', meta:['9 单元','约 13 小时','4 个实践','适合：有 C/C++ 基础'], outcome:'提交可运行的自定义算子、正确性测试与性能对比，形成可复用的工程记录。',
    stages:[
      {title:'明确算子边界',unitRange:'单元 1–2',reason:'先确认输入输出、数据类型和计算图位置，避免在 Kernel 实现后反复修改接口。',units:[['课程','单元 1：算子任务分析与规格定义','28 分钟'],['课程','单元 2：Ascend C 编程模型与流水任务','36 分钟']]},
      {title:'完成 Kernel 实现',unitRange:'单元 3–4',reason:'先掌握 CopyIn、Compute、CopyOut 的职责，再完成可运行的矢量算子。',units:[['实践','单元 3：Add 矢量算子 Kernel','48 分钟'],['课程','单元 4：Queue、Pipe 与 Double Buffer','35 分钟']]},
      {title:'适配动态输入',unitRange:'单元 5–6',reason:'Local Memory 无法容纳全部数据，需要由 Host 侧 Tiling 指导多核与分块计算。',units:[['课程','单元 5：Host 侧 Tiling 与 TilingData','38 分钟'],['实践','单元 6：多核与尾块切分','52 分钟']]},
      {title:'工程化与入图',unitRange:'单元 7–8',reason:'完成编译部署和单算子验证后，再接入图执行流程并定位工程问题。',units:[['实践','单元 7：工程创建、编译与单算子调用','46 分钟'],['课程','单元 8：算子入图与框架调用','32 分钟']]},
      {title:'性能验收',unitRange:'单元 9',reason:'正确性通过后，用 Profiling 结果验证数据搬运、并行切分与吞吐收益。',units:[['实践','单元 9：自定义算子性能优化挑战','60 分钟']]}
    ],
    peers:[['NPU_Leo','完成 Kernel 实现',35,'male'],['林深见鹿','适配动态输入',60,'female-left'],['KernelCat','工程化与入图',78,'female-right']],peerTotal:'860+',proofIntro:'已在 CANN 8.0.RC3、Ascend 910B 环境复现 Kernel、Tiling、编译与单算子调用流程。',proof:[['16','个真实复现案例','▤'],['10','项关键指标已核验','▥']],proofVersion:'适用 CANN 8.0.RC3 · 最近验证 2026.09'
  },
  inference:{
    title:'大模型推理服务部署',summary:'完成从模型准备、推理适配到服务化部署、压测调优与上线验收的完整链路。',previewTitle:'完成一次可上线的推理服务部署',intro:'围绕 MindIE 服务化场景，逐步完成模型检查、量化适配、服务配置、并发压测、性能定位和异常恢复。',meta:['8 单元','约 11 小时','3 个实战','适合：了解模型推理基础'],outcome:'部署可调用的推理服务，保存精度、吞吐、时延和异常诊断证据。',
    stages:[
      {title:'准备模型与环境',unitRange:'单元 1–2',reason:'先明确模型结构、硬件与软件版本，才能选择转换、量化和服务配置。',units:[['课程','单元 1：大模型推理服务全景','26 分钟'],['实践','单元 2：模型与 Ascend 环境检查','34 分钟']]},
      {title:'完成推理适配',unitRange:'单元 3–4',reason:'模型转换与量化效果通过校验后，服务端才能稳定加载并返回可信结果。',units:[['课程','单元 3：模型转换、量化与精度校验','38 分钟'],['实践','单元 4：MindIE 模型加载与首请求','45 分钟']]},
      {title:'部署在线服务',unitRange:'单元 5–6',reason:'先完成服务配置和健康检查，再用真实请求验证并发、流式输出和容错。',units:[['课程','单元 5：MindIE Service 配置与接口','32 分钟'],['实践','单元 6：并发请求与流式输出','46 分钟']]},
      {title:'定位性能瓶颈',unitRange:'单元 7',reason:'采集关键过程时间点后，结合吞吐、首 Token 时延和显存判断瓶颈位置。',units:[['课程','单元 7：服务化 Profiling 与性能分析','40 分钟']]},
      {title:'压测与上线验收',unitRange:'单元 8',reason:'在目标并发下完成指标、异常恢复与配置归档，形成可复现的上线依据。',units:[['实践','单元 8：推理服务压测与故障演练','58 分钟']]}
    ],
    peers:[['NPU_Leo','完成推理适配',35,'male'],['林深见鹿','部署在线服务',60,'female-left'],['KernelCat','定位性能瓶颈',78,'female-right']],peerTotal:'730+',proofIntro:'已在 Ascend 910B、MindIE 2.1 环境复现模型加载、服务请求与性能采集流程。',proof:[['21','个真实复现案例','▤'],['14','项关键指标已核验','▥']],proofVersion:'适用 MindIE 2.1 · 最近验证 2026.09'
  },
  agent:{
    title:'RAG 智能体应用开发',summary:'完成从知识库构建、工具调用到应用评估纠错的完整链路。',previewTitle:'完成一个可评估的 RAG 智能体应用',intro:'先区分检索、生成和工具调用，再搭建可评估、可纠错的应用工作流。',meta:['6 单元','约 8 小时','1 个项目','适合：有 Python 基础'],outcome:'构建可检索、可调用工具并能够评估纠错的 RAG 应用。',
    stages:[{title:'明确系统边界',unitRange:'单元 1',reason:'先确认检索和生成的职责，才能准备合适的数据。',units:[['课程','单元 1：RAG 应用全景','24 分钟']]},{title:'建立知识库',unitRange:'单元 2–3',reason:'召回内容可靠后，生成回答才有依据。',units:[['课程','单元 2：知识库构建与检索','36 分钟'],['实践','单元 3：召回效果评估','40 分钟']]},{title:'编排工作流',unitRange:'单元 4–5',reason:'工作流运行后，再系统评估工具调用和回答质量。',units:[['课程','单元 4：提示词与工具调用','32 分钟'],['测验','单元 5：应用评估','20 分钟']]},{title:'评估与交付',unitRange:'单元 6',reason:'达到评估标准后，整理并交付可维护的应用。',units:[['实践','单元 6：RAG 应用项目','50 分钟']]}],
    peers:[['NPU_Leo','建立知识库',35,'male'],['林深见鹿','编排工作流',60,'female-left'],['KernelCat','评估与交付',78,'female-right']],peerTotal:'680+',proofIntro:'关键检索与工具调用示例经过运行验证，并标注适用框架版本。',proof:[['13','个真实复现案例','▤'],['9','项关键指标已核验','▥']],proofVersion:'适用框架版本已标注 · 最近验证 2026.09'
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

const avatarMap={
  male:['assets/images/avatars/course-peer-male.png','avatar-single'],
  'female-left':['assets/images/avatars/course-peers-female.png','avatar-double avatar-left'],
  'female-right':['assets/images/avatars/course-peers-female.png','avatar-double avatar-right']
};
const peerList=document.querySelector('#peerList');
peerList.innerHTML=course.peers.map(([name,stage,progress,avatarKey])=>{const [src,className]=avatarMap[avatarKey]||avatarMap.male;return `<article class="peer-row"><span class="peer-avatar"><img src="${src}" class="${className}" alt="${escapeHtml(name)} 的头像"></span><div><b class="peer-name">${escapeHtml(name)}</b><p class="peer-stage">课程进度 ${Number(progress)}% · 正在学习“${escapeHtml(stage)}”</p><div class="peer-progress" role="progressbar" aria-label="${escapeHtml(name)} 的课程进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Number(progress)}"><span class="peer-progress-track"><span class="peer-progress-fill" style="width:${Number(progress)}%"></span></span></div></div></article>`;}).join('');
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
