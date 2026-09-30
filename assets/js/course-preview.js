const courses = {
  operator: {title:'Ascend C 算子开发', author:'Ascend 学习中心', summary:'面向需要开发自定义算子、解决算子不支持和性能不足问题的开发者。', unitTitle:'单元 1：理解算子在计算图中的作用', intro:'从计算图、算子接口和执行路径入手，建立自定义算子开发的整体认知。', units:['算子开发入门与计算图','编程模型与编程范式','SIMD 编程与矩阵计算','算子工程化与编译运行','调试与性能调优','实战验收与能力测验'], unitReasons:[['先建立算子的任务边界与计算图位置','知道任务边界后，才能选择正确的实现方式'],['掌握 Kernel 结构、执行模型与基础语法','代码能运行后，才适合进入向量和矩阵优化'],['学习数据搬运、向量化与矩阵计算','完成核心计算后，需要把代码接入工程并验证'],['建立编译、运行和正确性检查的完整流程','程序正确运行后，才能定位真正的性能瓶颈'],['使用调试和性能工具完成针对性优化','优化结果需要通过真实任务统一验收'],['提交代码、运行结果与问题记录','验收结果将沉淀为可复用的能力证明']], prerequisites:[['完成 CANN 环境配置','确认驱动、CANN 与工具链版本兼容，并跑通第一个样例。'],['理解张量与计算图基础','掌握输入输出、张量形状和计算图中的算子职责。']], mapPath:'算子开发 / 入门路线', route:[['起点','前置基础','CANN 环境与计算图','环境可运行，才能判断后续问题来自代码而非配置'],['步骤 1','理解','明确算子职责与接口','先确定输入输出和任务边界，下一步才能正确编写 Kernel'],['步骤 2','编写','完成首个 Ascend C 算子','代码成形后，才能通过真实输入验证正确性'],['步骤 3','验证','编译运行与正确性检查','验证通过后，结果才可以成为可信的能力证明'],['结果','能力证明','通过算子实战验收','']], outcome:'完成一次可运行、可验证的算子开发闭环，并保存为能力证明。', practice:{learning:'先完成接口理解、Kernel 编写和基础运行',unlock:'完成“编写”步骤后解锁',title:'首个 Ascend C 算子开发',description:'在 IDE 中补全算子代码，用给定输入完成编译、运行和正确性检查。',evidence:'保存代码、运行日志、正确性结果与一次问题修复记录'}},
  training: {title:'大模型分布式训练', author:'MindSpore 官方课程', summary:'面向需要完成模型训练、扩展多卡并行并解决吞吐问题的开发者。', unitTitle:'单元 1：建立分布式训练的全局认识', intro:'先理解训练任务如何拆分到多个设备，再进入模型并行、数据并行与性能调优。', units:['分布式训练全景','模型与数据并行','通信与梯度同步','混合精度与吞吐优化','训练稳定性调试','训练实战与验收'], unitReasons:[['先理解多设备训练的完整结构','知道任务如何拆分，才能选择并行策略'],['比较数据并行与模型并行','并行策略确定后，才能配置设备协同'],['处理通信和梯度同步','协同正确后，性能优化才有意义'],['提高吞吐并控制精度损失','性能提升后，需要确认训练仍然稳定'],['定位溢出、抖动和收敛问题','稳定运行后再进入完整训练验收'],['提交配置、指标和诊断记录','验收结果沉淀为分布式训练能力']], prerequisites:[['完成 Python 与深度学习基础','能够阅读训练脚本，理解数据、模型、损失函数和优化器。'],['熟悉单卡训练流程','完成一次模型训练、保存和验证，建立训练结果判断方法。']], mapPath:'模型训练 / 分布式训练路线', route:[['起点','前置基础','Python 与单卡训练','先跑通单卡基线，才能比较分布式训练的收益'],['步骤 1','拆分','理解数据与模型并行','确定拆分方式后，才能设计设备间协同'],['步骤 2','协同','完成通信与梯度同步','通信正确后，才能用指标定位性能瓶颈'],['步骤 3','调优','提高吞吐并保持稳定','稳定达到目标后，才形成可复用的训练方案'],['结果','能力证明','通过多卡训练验收','']], outcome:'独立配置、运行并诊断一次分布式训练任务，形成可复用的训练记录。', practice:{learning:'先掌握并行策略、通信与性能指标',unlock:'完成“协同”步骤后解锁',title:'双卡图像分类训练',description:'把单卡脚本改为双卡训练，比较吞吐、收敛和设备利用率。',evidence:'保存训练脚本、指标对比、性能结论与异常诊断记录'}},
  inference: {title:'大模型推理服务部署', author:'MindIE 官方课程', summary:'面向需要完成模型转换、推理适配和服务化部署验证的开发者。', unitTitle:'单元 1：推理服务的完整路径', intro:'从模型转换到在线服务，理解推理引擎、硬件适配和服务验证之间的关系。', units:['推理服务全景','模型转换与量化','推理引擎配置','服务化部署','性能压测与调优','上线验证与排障'], unitReasons:[['先看清模型到服务的完整链路','明确输入输出后，才能正确转换模型'],['完成格式转换并控制量化误差','模型可用后，才能配置推理引擎'],['让模型在目标硬件上稳定运行','本地推理通过后，再封装在线服务'],['建立请求、并发和异常处理','服务可访问后，才能开展真实性能压测'],['定位延迟、吞吐和资源瓶颈','达到目标指标后进入上线验收'],['完成上线检查和故障演练','形成可复用的部署与排障证据']], prerequisites:[['理解模型推理的输入与输出','能够准备模型、样例数据，并验证基础推理结果。'],['完成基础 CANN 环境配置','确认运行环境与模型格式，跑通官方推理样例。']], mapPath:'模型推理 / 服务部署路线', route:[['起点','前置基础','模型与 CANN 环境','先确认模型和环境可用，才能排除部署之外的问题'],['步骤 1','转换','完成模型转换与量化','获得目标格式后，才能由推理引擎加载运行'],['步骤 2','部署','配置推理引擎与服务','服务可访问后，才能用真实请求验证性能'],['步骤 3','验证','压测性能并定位问题','指标和异常均通过后，才具备上线条件'],['结果','能力证明','通过服务上线验收','']], outcome:'完成从模型转换到在线服务验证的完整部署，并保存性能与排障证据。', practice:{learning:'先完成模型转换、引擎配置和服务封装',unlock:'完成“部署”步骤后解锁',title:'部署一个图像分类推理服务',description:'上传图片并调用自己部署的模型，核对类别、置信度和响应时间。',evidence:'保存服务配置、接口结果、性能指标与一次异常处理记录'}},
  agent: {title:'RAG 智能体应用开发', author:'Ascend 应用开发课程', summary:'面向希望构建知识问答、工具调用与智能体工作流的应用开发者。', unitTitle:'单元 1：构建第一个 RAG 应用', intro:'明确检索、生成和工具调用如何协作，再逐步搭建可评估的智能体工作流。', units:['RAG 应用全景','知识库构建与检索','提示词与上下文设计','工具调用与工作流','应用评估与纠错','端到端项目实战'], unitReasons:[['先理解检索、生成和工具的分工','明确系统边界后，才能准备知识数据'],['建立可检索的知识库','召回内容可靠后，才能设计生成上下文'],['控制提示词和上下文结构','回答稳定后，再接入工具和工作流'],['连接外部工具与多步任务','流程可运行后，必须建立评估方法'],['用样例发现并修正回答问题','质量达到标准后再完成端到端实战'],['交付应用、评估结果和问题记录','项目结果沉淀为智能体开发能力']], prerequisites:[['掌握 Python 与接口调用基础','可以读取配置、调用模型接口并处理返回结果。'],['了解大模型与知识检索概念','区分模型生成、向量检索和知识库在应用中的职责。']], mapPath:'应用开发 / RAG 智能体路线', route:[['起点','前置基础','Python 与模型接口','先能稳定调用模型，才能区分接口与业务链路问题'],['步骤 1','检索','建立知识库与召回','召回可靠内容后，生成回答才有依据'],['步骤 2','编排','连接提示词与工具调用','工作流可运行后，才能系统评估回答质量'],['步骤 3','评估','发现并修正回答问题','达到评估标准后，项目才具备交付价值'],['结果','能力证明','完成端到端智能体项目','']], outcome:'构建一个可检索、可调用工具并能够评估纠错的 RAG 智能体应用。', practice:{learning:'先完成知识库、提示词和工具工作流',unlock:'完成“编排”步骤后解锁',title:'搭建产品文档问答智能体',description:'导入文档、设置检索与工具，让智能体完成一组真实问题。',evidence:'保存应用配置、评估样例、改进记录与最终通过率'}}
};
const course = courses[new URLSearchParams(location.search).get('course')] || courses.operator;
const setText = (selector, value) => document.querySelectorAll(selector).forEach(el => el.textContent = value);
setText('[data-course-title]', course.title); setText('[data-course-author]', course.author); setText('[data-course-summary]', course.summary); setText('[data-unit-title]', course.unitTitle); setText('[data-unit-intro]', course.intro); setText('[data-course-action-title]', course.title);
setText('[data-map-path]', course.mapPath); setText('[data-route-outcome]', course.outcome);
setText('[data-practice-learning]', course.practice.learning); setText('[data-practice-unlock]', course.practice.unlock); setText('[data-practice-title]', course.practice.title); setText('[data-practice-description]', course.practice.description); setText('[data-practice-evidence]', course.practice.evidence);
const routeList = document.querySelector('#courseRoute');
routeList.replaceChildren(...course.route.map(([step, title, description, whyNext], index) => {
  const item = document.createElement('li');
  item.className = index === 1 ? 'current' : index === course.route.length - 1 ? 'outcome' : index === 0 ? 'ready' : '';
  item.innerHTML = `<button type="button" data-route-index="${index}"><span class="route-step">${step}</span><b>${title}</b><small>${description}</small></button>${whyNext ? `<p class="route-why"><span aria-hidden="true">→</span>${whyNext}</p>` : ''}`;
  return item;
}));
const list = document.querySelector('#unitList');
course.units.forEach((unit, index) => {
  const [purpose, whyNext] = course.unitReasons[index];
  const item = document.createElement('li');
  item.innerHTML = `<button type="button" ${index === 0 ? 'aria-current="true"' : ''}><span class="unit-number">${index + 1}</span><span class="unit-copy"><strong>${unit}</strong><small>${purpose}</small></span></button>${whyNext ? `<p class="unit-transition"><span aria-hidden="true">↓</span>${whyNext}</p>` : ''}`;
  list.append(item);
});
const prerequisiteList = document.querySelector('#prerequisiteList');
const prerequisites = course.prerequisites || [];
setText('[data-prerequisite-count]', `${prerequisites.length} 个步骤`);
prerequisiteList.replaceChildren(...prerequisites.map(([title, description], index) => {
  const item = document.createElement('li');
  item.innerHTML = `<span class="prerequisite-number">${index + 1}</span><span><b>${title}</b><small>${description}</small></span>`;
  return item;
}));

document.querySelectorAll('.sidebar-tabs [role="tab"]').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.sidebar-tabs [role="tab"]').forEach(item => item.setAttribute('aria-selected', String(item === tab)));
  const target = tab.dataset.panel;
  list.hidden = target !== 'units';
  document.querySelectorAll('.sidebar-panel').forEach(panel => panel.hidden = panel.id !== target);
}));
document.querySelectorAll('.unit-list button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.unit-list button').forEach(item => item.removeAttribute('aria-current')); button.setAttribute('aria-current', 'true');
}));
document.querySelectorAll('[data-route-index]').forEach(button => button.addEventListener('click', () => {
  const index = Number(button.dataset.routeIndex);
  const lessons = document.querySelectorAll('.lesson-card');
  const target = index === 0 ? document.querySelector('.prerequisite-card') : index === course.route.length - 1 ? lessons[lessons.length - 1] : lessons[Math.min(index - 1, lessons.length - 1)];
  target?.scrollIntoView({behavior:'smooth', block:'center'});
}));
document.querySelector('#planButton').addEventListener('click', event => { const pressed = event.currentTarget.getAttribute('aria-pressed') === 'true'; event.currentTarget.setAttribute('aria-pressed', String(!pressed)); event.currentTarget.textContent = pressed ? '＋ 加入学习计划' : '✓ 已加入学习计划'; });
