const courses = {
  training: {
    title: '昇腾算力与 MindSpore 框架：大语言模型开发与深度调优全栈指南',
    summary: '从昇腾计算栈与 MindSpore 机制出发，完成大模型分布式训练、适配、微调、诊断与深度调优。',
    previewTitle: '完成一次可验证的分布式训练',
    outcomeTitle: '独立完成一次可验证的分布式训练',
    intro: '沿着“理解计算栈—搭建训练工程—启动规模化训练—完成模型适配—诊断并优化”的链路，逐步完成可复现的大语言模型训练任务。',
    meta: ['10 单元', '50 课节', '约 20 小时', '适合：有 Python 与深度学习基础'],
    outcome: '保存训练脚本、指标对比与异常诊断记录，沉淀为可复用的能力证明。',
    stages: [
      {title:'建立训练基线',unitRange:'单元 1–2',reason:'先理解昇腾计算栈与 MindSpore 的运行方式，再建立后续训练可比较的共同基线。',units:[
        {number:1,title:'昇腾计算架构与 CANN 软件栈深度解构',description:'看懂训练任务如何从框架下发到 NPU，并明确各层的职责边界。',lessons:[['课程','昇腾 NPU 与 Da Vinci 计算架构','22 分钟'],['课程','CANN 软件栈与训练任务执行链','24 分钟'],['实践','追踪一次训练任务的下发路径','32 分钟'],['课程','片上内存、数据搬运与算力单元','26 分钟'],['测验','架构与软件栈理解测验','12 分钟']]},
        {number:2,title:'MindSpore 核心机制：动静统一与图模式切换',description:'理解网络、计算图与自动微分的关系，建立可复现的单卡运行基线。',lessons:[['课程','动态图、静态图与动静统一','24 分钟'],['课程','Cell、计算图与执行生命周期','26 分钟'],['实践','把动态图训练脚本切换为图模式','36 分钟'],['课程','自动微分与参数更新链路','23 分钟'],['测验','MindSpore 运行机制测验','12 分钟']]}
      ]},
      {title:'搭建训练工程',unitRange:'单元 3–4',reason:'先用 MindFormers 组织可维护的训练配置，再为模型规模选择匹配的并行组合。',units:[
        {number:3,title:'MindFormers 生态：模块化配置与 YAML 控制流',description:'用统一配置组织模型、数据、训练器与运行环境。',lessons:[['课程','MindFormers 组件与训练入口','22 分钟'],['课程','YAML 配置的继承与覆盖规则','24 分钟'],['实践','搭建可复用的大模型训练配置','38 分钟'],['课程','Tokenizer、数据集与 Checkpoint 装配','26 分钟'],['测验','MindFormers 工程配置测验','13 分钟']]},
        {number:4,title:'分布式并行策略：从 DP 到混合并行',description:'理解数据、张量、流水线与序列并行的适用边界。',lessons:[['课程','数据并行与梯度同步','25 分钟'],['课程','张量并行、流水线并行与序列并行','30 分钟'],['实践','为 7B 模型计算并行切分方案','40 分钟'],['课程','混合并行配置与通信代价','28 分钟'],['测验','并行策略选择测验','14 分钟']]}
      ]},
      {title:'启动规模化训练',unitRange:'单元 5–6',reason:'先跑通 MindSpeed-LLM 多卡启动，再用稳定的数据流水线持续供给训练任务。',units:[
        {number:5,title:'MindSpeed-LLM 与大规模分布式启动实战',description:'完成多机多卡参数配置、集合通信初始化与首轮训练启动。',lessons:[['课程','MindSpeed-LLM 工程结构与启动器','24 分钟'],['课程','Rank Table、通信域与启动参数','28 分钟'],['实践','启动双机八卡训练任务','46 分钟'],['实践','从 HCCL 日志确认设备协同','34 分钟'],['测验','分布式启动流程测验','13 分钟']]},
        {number:6,title:'LLM 数据工程：MindRecord 与二进制索引格式',description:'把原始语料转成可切分、可复现并能持续供给训练的数据集。',lessons:[['课程','大模型语料处理流水线','24 分钟'],['课程','MindRecord 与二进制索引格式','27 分钟'],['实践','转换并校验一份训练语料','42 分钟'],['课程','数据分片、打乱与流式读取','26 分钟'],['测验','训练数据工程测验','13 分钟']]}
      ]},
      {title:'完成模型适配与微调',unitRange:'单元 7–8',reason:'先完成异构框架权重对齐，再选择全量微调或 LoRA 获得目标任务能力。',units:[
        {number:7,title:'异构算力适配：权重转换、精度对齐与校验',description:'把已有模型可靠迁移到昇腾环境，并留下精度一致性的证据。',lessons:[['课程','异构迁移中的结构与算子差异','25 分钟'],['课程','权重映射、切分与合并规则','28 分钟'],['实践','转换并加载一份模型权重','44 分钟'],['课程','Logits、Loss 与精度对齐方法','27 分钟'],['测验','异构适配与校验测验','14 分钟']]},
        {number:8,title:'大模型微调实战：从 SFT 到高效 LoRA 适配',description:'围绕目标数据集完成微调配置、运行、评估与结果保存。',lessons:[['课程','SFT 数据组织与训练目标','24 分钟'],['课程','LoRA 原理与关键超参数','26 分钟'],['实践','配置一组 LoRA 微调任务','36 分钟'],['实践','运行微调并比较基础模型结果','45 分钟'],['测验','SFT 与 LoRA 方案测验','14 分钟']]}
      ]},
      {title:'诊断并优化训练',unitRange:'单元 9–10',reason:'先用日志和指标定位故障与收敛问题，再结合 Profiling 提升 NPU 利用率。',units:[
        {number:9,title:'工程诊断：分布式训练故障排查与收敛优化',description:'从启动、通信、数值和收敛四层定位训练失败的真正原因。',lessons:[['课程','分布式训练故障分层诊断法','25 分钟'],['课程','Loss 异常、溢出与梯度问题','28 分钟'],['实践','定位一次 HCCL 初始化失败','42 分钟'],['课程','收敛曲线与超参数联合分析','27 分钟'],['测验','训练故障诊断测验','14 分钟']]},
        {number:10,title:'深度调优：NPU 性能分析与硬件利用率提升',description:'用 Profiling 数据定位空闲、等待与通信瓶颈，完成可验证的性能优化。',lessons:[['课程','吞吐、时延、显存与利用率指标','24 分钟'],['课程','MindSpore Profiler 与时间线分析','28 分钟'],['实践','读取并标注一份性能时间线','38 分钟'],['实践','优化计算通信重叠与数据供给','46 分钟'],['测验','性能调优与课程结业测验','16 分钟']]}
      ]}
    ],
    peers:[['NPU_Leo','搭建训练工程',35,'male'],['林深见鹿','启动规模化训练',60,'female-left'],['KernelCat','诊断并优化训练',78,'female-right']],
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
  navItem.innerHTML=`<button type="button" data-stage-index="${index}" aria-controls="courseRoute" aria-pressed="${selected}" ${selected?'aria-current="step"':''}><span class="stage-number">${index+1}</span><span><strong>${escapeHtml(stage.title)}</strong><small>${escapeHtml(stage.unitRange)}</small></span><span class="stage-chevron" aria-hidden="true">›</span></button>`;
  nav.append(navItem);
});

const normalizeUnit=(raw,fallbackNumber)=>Array.isArray(raw)
  ? {number:fallbackNumber,title:raw[1].replace(/^单元\s*\d+[：:]\s*/,''),description:'完成本单元内容并进入对应课节学习。',lessons:[raw]}
  : raw;

const renderStage=index=>{
  const stage=course.stages[index];
  const previousUnits=course.stages.slice(0,index).reduce((count,item)=>count+item.units.length,0);
  const units=stage.units.map((unit,unitIndex)=>normalizeUnit(unit,previousUnits+unitIndex+1));
  setText('[data-active-stage-title]',`阶段 ${index+1} · ${stage.title}`);
  setText('[data-stage-reason]',stage.reason);
  const lessonTotal=units.reduce((count,unit)=>count+unit.lessons.length,0);
  setText('[data-stage-count]',`${units.length} 个单元 · ${lessonTotal} 个课节`);
  route.innerHTML=units.map(unit=>{
    const lessons=unit.lessons.map(([kind,title,duration],lessonIndex)=>`<li class="stage-unit lesson-row" data-kind="${escapeHtml(kind)}"><span class="unit-kind-icon" aria-hidden="true"></span><span class="kind-label">${escapeHtml(kind)}</span><span class="unit-title">${escapeHtml(title)}</span><span class="unit-duration">${escapeHtml(duration)}</span><a class="unit-play" href="learn.html?course=${encodeURIComponent(courseKey)}&unit=${unit.number}-${lessonIndex+1}" aria-label="开始课节：${escapeHtml(title)}">▶</a></li>`).join('');
    return `<li class="unit-card"><div class="unit-card-head"><span class="unit-card-number">${unit.number}</span><div><span class="unit-card-kicker">单元 ${unit.number}</span><h4>${escapeHtml(unit.title)}</h4><p>${escapeHtml(unit.description)}</p></div><span class="unit-card-meta">${unit.lessons.length} 个课节</span></div><ol class="lesson-list" aria-label="单元 ${unit.number} 的课节">${lessons}</ol></li>`;
  }).join('');
};

const avatarMap={
  male:['assets/images/avatars/avatar-male.png','avatar-single'],
  'female-left':['assets/images/avatars/avatar-female.png','avatar-single'],
  'female-right':['assets/images/avatars/avatar-female.png','avatar-single']
};
const peerList=document.querySelector('#peerList');
peerList.innerHTML=course.peers.map(([name,stage,progress,avatarKey])=>{const [src,className]=avatarMap[avatarKey]||avatarMap.male;return `<article class="peer-row"><span class="peer-avatar"><img src="${src}" class="${className}" alt="${escapeHtml(name)} 的头像"></span><div><b class="peer-name">${escapeHtml(name)}</b><p class="peer-stage">课程进度 ${Number(progress)}% · 正在学习“${escapeHtml(stage)}”</p><div class="peer-progress" role="progressbar" aria-label="${escapeHtml(name)} 的课程进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Number(progress)}"><span class="peer-progress-track"><span class="peer-progress-fill" style="width:${Number(progress)}%"></span></span></div></div></article>`;}).join('');
document.querySelector('#proofMetrics').innerHTML=course.proof.map(([value,label,icon])=>`<div class="proof-metric"><span class="metric-icon" aria-hidden="true">${escapeHtml(icon)}</span><span><b>${escapeHtml(value)}</b><span>${escapeHtml(label)}</span></span></div>`).join('');

const activateStage=index=>{
  document.querySelectorAll('[data-stage-index]').forEach(button=>{
    const active=Number(button.dataset.stageIndex)===index;
    button.toggleAttribute('aria-current',active);
    button.setAttribute('aria-pressed',String(active));
  });
  renderStage(index);
};

document.querySelectorAll('[data-stage-index]').forEach(button=>button.addEventListener('click',()=>{
  const index=Number(button.dataset.stageIndex);
  activateStage(index);
  if(window.innerWidth<980)document.querySelector('.stage-roadmap')?.scrollIntoView({behavior:'smooth',block:'start'});
}));

renderStage(0);

document.querySelector('#planButton')?.addEventListener('click',event=>{
  const button=event.currentTarget;
  const joined=button.dataset.joined==='true';
  button.dataset.joined=String(!joined);
  button.innerHTML=joined?'＋ <span>加入计划</span>':'✓ <span>已加入计划</span>';
  button.setAttribute('aria-pressed',String(!joined));
});
