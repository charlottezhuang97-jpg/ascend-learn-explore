(()=>{
  const app=document.querySelector('.km-app');
  const shell=document.querySelector('#canvasShell');
  const canvas=document.querySelector('#knowledgeCanvas');
  const output=document.querySelector('#zoomValue');
  const tabs=[...document.querySelectorAll('.km-view-tabs button')];
  const views={map:document.querySelector('#globalMap'),network:document.querySelector('#networkMap')};
  const title=document.querySelector('#inspectorTitle');
  const meta=document.querySelector('#inspectorMeta');
  const reason=document.querySelector('#inspectorReason');
  const currentNode=document.querySelector('#currentNode');
  const status=document.querySelector('#inspectorStatus');
  const scopeNote=document.querySelector('#scopeNote');
  const scopeMeta=document.querySelector('#resourceScopeMeta');
  const resourceTitle=document.querySelector('#primaryResourceTitle');
  const resourceMeta=document.querySelector('#primaryResourceMeta');
  const evidenceCopy=document.querySelector('#evidenceCopy');
  let scale=1,x=0,y=0,dragging=false,startX=0,startY=0;

  const domainCopy={
    'CANN':{
      meta:'9 个知识节点 · 算子开发与调优',
      reason:'把昇腾计算架构、Ascend C、算子实现与性能复现组织成可验证的底层开发能力。',
      node:'昇腾计算架构 → Ascend C → 算子调优',
      status:'已有实践证据'
    },
    '生成式 AI 与大语言模型':{
      meta:'14 个知识节点 · 训练与推理',
      reason:'训练开发、推理开发和生成式 AI 应用部署共享框架、模型与工程基础，但可以按目标形成不同路线。',
      node:'MindSpore → MindFormers → 推理开发部署',
      status:'当前学习领域'
    },
    '智能体':{
      meta:'7 个知识节点 · Agent 与 RAG',
      reason:'在模型服务之上连接任务编排、检索增强、评测和部署，形成可运行、可验证的智能体应用。',
      node:'RAG 核心机制 → RAG 应用开发部署',
      status:'推荐路线中的下一步'
    }
  };

  const nodeCopy={
    'MindSpore 核心机制':'理解动态图、静态图与执行机制，为训练和推理开发提供统一框架基础。',
    'MindFormers':'用模块化配置管理大模型训练、推理与任务流程，是官方课程和实践的关键工具节点。',
    '推理开发部署':'把模型产物转换成可调用服务，并验证运行环境、精度和性能。',
    'RAG 核心机制':'理解检索、上下文构造与生成之间的关系，避免只会调用组件而无法判断结果质量。',
    'RAG 应用开发部署':'把检索、生成、评测和部署连成可验证闭环，是当前学习目标的核心实践节点。',
    'RAG 效果验证':'使用命中率、忠实度和可追溯证据验证系统是否真正解决目标问题。'
  };

  function render(){
    canvas.style.transform=`translate(${x}px,${y}px) scale(${scale})`;
    output.value=`${Math.round(scale*100)}%`;
    output.textContent=output.value;
  }
  function fit(){
    const r=shell.getBoundingClientRect();
    scale=Math.min((r.width-48)/1180,(r.height-48)/720,1);
    x=-590*scale;
    y=-360*scale;
    render();
  }
  function zoom(next,cx=shell.clientWidth/2,cy=shell.clientHeight/2){
    const prev=scale;
    scale=Math.max(.55,Math.min(1.8,next));
    x=cx-(cx-x)*(scale/prev);
    y=cy-(cy-y)*(scale/prev);
    render();
  }
  function openView(key){
    tabs.forEach(tab=>tab.setAttribute('aria-selected',String(tab.dataset.view===key)));
    Object.entries(views).forEach(([viewKey,view])=>view.hidden=viewKey!==key);
    document.querySelector('#mapCrumb').textContent=key==='map'?'领域全景':'分区聚类知识网络';
    fit();
  }
  function updateInspector({name,domain,type,depth,copy,trail,statusText}){
    title.textContent=name;
    meta.textContent=[domain,type,depth].filter(Boolean).join(' · ');
    reason.textContent=copy||`${name}与知识节点、学习资源和能力证据使用同一份学习状态。`;
    currentNode.textContent=trail||name;
    status.textContent=statusText||'已定位到知识网络';
  }

  shell.addEventListener('pointerdown',event=>{
    if(event.target.closest('button,a'))return;
    dragging=true;
    startX=event.clientX-x;
    startY=event.clientY-y;
    shell.setPointerCapture(event.pointerId);
  });
  shell.addEventListener('pointermove',event=>{
    if(!dragging)return;
    x=event.clientX-startX;
    y=event.clientY-startY;
    render();
  });
  shell.addEventListener('pointerup',()=>dragging=false);
  shell.addEventListener('pointercancel',()=>dragging=false);
  shell.addEventListener('wheel',event=>{
    event.preventDefault();
    const r=shell.getBoundingClientRect();
    zoom(scale*(event.deltaY>0?.9:1.1),event.clientX-r.left,event.clientY-r.top);
  },{passive:false});
  shell.addEventListener('keydown',event=>{
    const step=36;
    if(event.key==='ArrowLeft')x+=step;
    else if(event.key==='ArrowRight')x-=step;
    else if(event.key==='ArrowUp')y+=step;
    else if(event.key==='ArrowDown')y-=step;
    else if(event.key==='+'||event.key==='=')zoom(scale+.1);
    else if(event.key==='-')zoom(scale-.1);
    else if(event.key==='Home')fit();
    else return;
    event.preventDefault();
    render();
  });

  document.querySelector('[data-zoom="in"]').addEventListener('click',()=>zoom(scale+.1));
  document.querySelector('[data-zoom="out"]').addEventListener('click',()=>zoom(scale-.1));
  document.querySelector('#fitCanvas').addEventListener('click',fit);
  tabs.forEach(tab=>tab.addEventListener('click',()=>openView(tab.dataset.view)));

  document.querySelectorAll('[data-layer]').forEach(button=>button.addEventListener('click',()=>{
    const pressed=button.getAttribute('aria-pressed')!=='true';
    button.setAttribute('aria-pressed',String(pressed));
    app.classList.toggle(`hide-${button.dataset.layer}`,!pressed);
  }));

  document.querySelectorAll('[data-resource-scope]').forEach(button=>button.addEventListener('click',()=>{
    const trusted=button.dataset.resourceScope==='trusted';
    document.querySelectorAll('[data-resource-scope]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    app.classList.toggle('resource-expanded',trusted);
    document.querySelectorAll('[data-official-resources]').forEach(node=>{
      node.dataset.resourceLabel=trusted?`${node.dataset.trustedResources} 资源`:`课 ${node.dataset.officialResources}`;
    });
    scopeNote.textContent=trusted
      ?'AI 可在官方课程之外检索经过来源、版本、复现和许可验证的可信资源。'
      :'AI 在官方课程与单元中重新组合路线，不改变知识结构。';
    scopeMeta.textContent=trusted
      ?'规划态：官方课程与通过验证的外部资源共同参与路线组合。'
      :'当前只检索经过产品配置与验证的官方课程。';
    resourceTitle.textContent=trusted?'官方课程 + 可信资源组合':'昇腾算力与 MindSpore 框架';
    resourceMeta.textContent=trusted?'课程、文档与复现实验 · 来源可追溯':'官方课程 · 7 个关联课节';
  }));

  document.querySelectorAll('.knowledge-domain [data-domain]').forEach(button=>button.addEventListener('click',()=>{
    const domain=button.dataset.domain;
    const copy=domainCopy[domain];
    updateInspector({name:domain,domain:'领域分区',depth:copy.meta,copy:copy.reason,trail:copy.node,statusText:copy.status});
    openView('network');
  }));

  document.querySelectorAll('[data-node]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('[data-node]').forEach(item=>item.classList.remove('selected-node'));
    button.classList.add('selected-node');
    const depth=button.querySelector('small')?.textContent||'';
    updateInspector({
      name:button.dataset.node,
      domain:button.dataset.domain,
      type:button.dataset.type,
      depth,
      copy:nodeCopy[button.dataset.node],
      trail:button.dataset.node,
      statusText:button.classList.contains('route-node')?'位于当前推荐路线':'已定位到知识网络'
    });
    evidenceCopy.textContent=button.dataset.type==='验证证据'
      ?'该节点记录真实环境、版本、过程与结果，可用于点亮能力状态并回填社区。'
      :`完成与“${button.dataset.node}”关联的实践与验证后，学习状态会从了解逐步进入掌握、实践和贡献。`;
  }));

  document.querySelector('.km-inspector-head button').addEventListener('click',()=>{
    document.querySelectorAll('[data-node]').forEach(item=>item.classList.remove('selected-node'));
    updateInspector({
      name:'RAG 应用开发部署',domain:'智能体',type:'实践任务',depth:'待实践',
      copy:'把检索、生成、评测和部署连成可验证闭环，是当前学习目标的核心实践节点。',
      trail:'RAG 核心机制 → 向量检索 API',statusText:'推荐路线中的下一步'
    });
  });
  addEventListener('resize',fit);
  requestAnimationFrame(()=>openView(new URLSearchParams(location.search).get('view')==='network'?'network':'map'));
})();
