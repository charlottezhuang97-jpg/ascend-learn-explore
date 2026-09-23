const courses = {
  operator: {title:'Ascend C 算子开发', author:'Ascend 学习中心', summary:'面向需要开发自定义算子、解决算子不支持和性能不足问题的开发者。', unitTitle:'单元 1：理解算子在计算图中的作用', intro:'从计算图、算子接口和执行路径入手，建立自定义算子开发的整体认知。', units:['算子开发入门与计算图','编程模型与编程范式','SIMD 编程与矩阵计算','算子工程化与编译运行','调试与性能调优','实战验收与能力测验']},
  training: {title:'大模型分布式训练', author:'MindSpore 官方课程', summary:'面向需要完成模型训练、扩展多卡并行并解决吞吐问题的开发者。', unitTitle:'单元 1：建立分布式训练的全局认识', intro:'先理解训练任务如何拆分到多个设备，再进入模型并行、数据并行与性能调优。', units:['分布式训练全景','模型与数据并行','通信与梯度同步','混合精度与吞吐优化','训练稳定性调试','训练实战与验收']},
  inference: {title:'大模型推理服务部署', author:'MindIE 官方课程', summary:'面向需要完成模型转换、推理适配和服务化部署验证的开发者。', unitTitle:'单元 1：推理服务的完整路径', intro:'从模型转换到在线服务，理解推理引擎、硬件适配和服务验证之间的关系。', units:['推理服务全景','模型转换与量化','推理引擎配置','服务化部署','性能压测与调优','上线验证与排障']},
  agent: {title:'RAG 智能体应用开发', author:'Ascend 应用开发课程', summary:'面向希望构建知识问答、工具调用与智能体工作流的应用开发者。', unitTitle:'单元 1：构建第一个 RAG 应用', intro:'明确检索、生成和工具调用如何协作，再逐步搭建可评估的智能体工作流。', units:['RAG 应用全景','知识库构建与检索','提示词与上下文设计','工具调用与工作流','应用评估与纠错','端到端项目实战']}
};
const course = courses[new URLSearchParams(location.search).get('course')] || courses.operator;
const setText = (selector, value) => document.querySelectorAll(selector).forEach(el => el.textContent = value);
setText('[data-course-title]', course.title); setText('[data-course-author]', course.author); setText('[data-course-summary]', course.summary); setText('[data-unit-title]', course.unitTitle); setText('[data-unit-intro]', course.intro); setText('[data-course-action-title]', course.title);
const list = document.querySelector('#unitList');
course.units.forEach((unit, index) => { const item = document.createElement('li'); item.innerHTML = `<button type="button" ${index === 0 ? 'aria-current="true"' : ''}><span class="unit-number">${index + 1}</span><span>${unit}</span></button>`; list.append(item); });

document.querySelectorAll('.sidebar-tabs [role="tab"]').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.sidebar-tabs [role="tab"]').forEach(item => item.setAttribute('aria-selected', String(item === tab)));
  const target = tab.dataset.panel;
  list.hidden = target !== 'units';
  document.querySelectorAll('.sidebar-panel').forEach(panel => panel.hidden = panel.id !== target);
}));
document.querySelectorAll('.unit-list button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.unit-list button').forEach(item => item.removeAttribute('aria-current')); button.setAttribute('aria-current', 'true');
}));
document.querySelector('#planButton').addEventListener('click', event => { const pressed = event.currentTarget.getAttribute('aria-pressed') === 'true'; event.currentTarget.setAttribute('aria-pressed', String(!pressed)); event.currentTarget.textContent = pressed ? '＋ 加入学习计划' : '✓ 已加入学习计划'; });
