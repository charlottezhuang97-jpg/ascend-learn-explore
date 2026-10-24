/* User-supplied course names and order. No invented syllabus or course URLs. */
(() => {
  const paths = [
    ['triton','cann',null,'Triton算子开发',[
      ['初级','面向昇腾Triton算子开发入门'],['中级','面向昇腾Triton算子开发进阶'],['高级','面向昇腾Triton算子开发']]],
    ['catlass','cann',null,'CATLASS算子开发',[
      ['初级','CATLASS算子开发入门'],['中级','CATLASS算子开发进阶'],['高级','CATLASS算子开发']]],
    ['tuning','cann',null,'算子开发调试调优',[
      ['初级','MindStudio实战精讲-算子调试工具'],['中级','MindStudio实战精讲-算子调试工具'],['中级','GEMM类算子调优']]],
    ['llm-training','gen','training','LLM训练',[
      ['初级','大模型许涟全流程'],['中级','基于Qwen2.5-7B模型的开发实践'],['中级','LLM训练框架和特性介绍'],['中级','LLM压缩技术详解']]],
    ['mm-training','gen','training','MM训练',[
      ['初级','多模态训练微调'],['中级','多模态训练框架和特性介绍']]],
    ['rl-training','gen','training','强化学习训练',[
      ['初级','强化学习训练全流程'],['中级','强化学习框架和特性介绍']]],
    ['llm-inference','gen','inference','LLM推理',[
      ['初级','vLLM-ascend推理部署与调优'],['中级','基于vLLM-ascend的profiling性能分析'],['中级','部署vLLM大规模推理服务'],['中级','vLLM推理引擎特性介绍'],['高级','构建基于大语言模型的应用']]],
    ['mm-inference','gen','inference','MM推理',[
      ['初级','多模态模型部署推理'],['中级','多模态模型高性能推理适配和调优'],['高级','构建基于多模态模型的应用']]],
    ['model-tuning','gen',null,'模型训/推调试调优',[
      ['中级','Mindstudio实战精讲-精度调试工具'],['中级','Mindstudio实战精讲-性能调优工具']]]
  ].map(([id,scene,parent,title,items])=>({id,scene,parent,title,courses:items.map(([level,title],i)=>({
    id:`${id}-${i+1}`,scene,path:id,title,level,source:'用户提供',modules:[],href:null,
    description:'课程名称、等级和学习顺序由用户指定；课程目录及正式学习链接待补充。'
  }))}));
  window.AscendKnowledgeCurriculum = {version:2,paths,courses:paths.flatMap(p=>p.courses),
    groups:{training:'训练开发',inference:'推理开发'},
    levels:{'初级':'beginner','中级':'intermediate','高级':'advanced'}};
})();
