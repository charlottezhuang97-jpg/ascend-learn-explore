/* Certification path from the supplied Pixso frame 451:71447 (1920 × 2556). */
(() => {
  const canvas=document.getElementById('pathCanvas'),viewport=document.getElementById('pathViewport');
  const nodes=document.getElementById('pathNodes'),connections=document.getElementById('branchConnections');
  const dialog=document.getElementById('pathDialog'),dialogTitle=document.getElementById('pathDialogTitle'),dialogBody=document.getElementById('pathDialogBody');
  const planButton=document.getElementById('addPathPlan'),toastNode=document.getElementById('pathToast');
  const planKey='ascend-certification-inference-acdp-plan-v1',orderKey='ascend-certification-inference-acdp-order-v1';
  const courses=[
    {id:'vllm-deploy',title:'vLLM-ascend推理部署与调优',url:'https://www.hiascend.com/developer/courses/detail/2071428481241497602'},
    {id:'vllm-profiling',title:'基于vLLM-ascend的Profiling采集及推理性能分析',url:'https://www.hiascend.com/developer/courses/detail/2060174102022684674'},
    {id:'mindie-motor',title:'基于MindIE Motor部署vLLM大EP推理服务',url:'https://www.hiascend.com/developer/courses/detail/2089543475602636802'}
  ];
  const chapters=[
    {title:'0.1 整体架构与关键技术',description:'VLLM与vLLM-ascend 的整体架构 · 推理引擎与昇腾执行层的协作'},
    {title:'0.2 推理部署流程',description:'准备软件栈与模型权重 · 完成推理服务部署与调用'},
    {title:'0.3 测试与迁移适配',description:'检查推理输出与精度 · 开展性能测试与模型适配'},
    {title:'案例实践',description:'完成模型部署并验证推理结果',practice:true}
  ];
  let order=courses.map(course=>course.id),draftOrder=[],savedPlan=false,toastTimer;
  try {
    const stored=JSON.parse(localStorage.getItem(orderKey)||'null');
    if(Array.isArray(stored)&&stored.length===3&&new Set(stored).size===3&&stored.every(id=>courses.some(course=>course.id===id)))order=stored;
    savedPlan=!!localStorage.getItem(planKey);
  } catch {}
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon=name=>`<span class="path-icon icon-${name}" aria-hidden="true"></span>`;
  function resize(){
    const width=document.documentElement.clientWidth;
    const scale=width<768?1:Math.min(1,width/1920);
    canvas.style.setProperty('--path-scale',scale);
    viewport.style.height=width<768?'auto':`${2556*scale}px`;
  }
  function toast(message){clearTimeout(toastTimer);toastNode.textContent=message;toastNode.hidden=false;toastTimer=setTimeout(()=>{toastNode.hidden=true;},3200);}
  function showDialog(title,html){dialogTitle.textContent=title;dialogBody.innerHTML=html;dialog.showModal();}
  function branches(side,y,indices,courseId){
    return `<div class="path-branches ${side}" style="--branch-offset:${y}px">${indices.map(index=>{
      const item=chapters[index];
      return `<button type="button" class="path-chapter ${item.practice?'practice':''}" data-chapter="${index}" data-course="${courseId}" aria-label="${esc(item.title)}：${esc(item.description)}"><span class="path-chapter-heading">${icon(item.practice?'code':'play')}<strong>${item.title}</strong>${icon('chevron')}</span><p>${item.description}</p></button>`;
    }).join('')}</div>`;
  }
  function branchLines(side,groupY,indices,centerY){
    const edge=side==='left'?745:1176,branchEdge=side==='left'?637:1284,mid=(edge+branchEdge)/2;
    return indices.map((_,index)=>{
      const targetY=groupY+35+index*81,delta=targetY-centerY;
      const sign=Math.sign(delta)||1,r=Math.min(20,Math.abs(delta)/2);
      const direction=side==='left'?-1:1;
      return `<path class="branch-line" d="M${edge} ${centerY}H${mid-direction*r}Q${mid} ${centerY} ${mid} ${centerY+sign*r}V${targetY-sign*r}Q${mid} ${targetY} ${mid+direction*r} ${targetY}H${branchEdge}"/><circle class="branch-dot" cx="${branchEdge}" cy="${targetY}" r="3"/>`;
    }).join('');
  }
  function render(){
    let lines='';
    const courseRows=order.map((id,index)=>{
      const course=courses.find(item=>item.id===id),y=[541,811,1083][index],side=index===1?'right':'left',branchY=index===2?999:y-90;
      lines+=branchLines(side,branchY,[0,1,2,3],y+67);
      return `<section class="path-row" style="--row-y:${y}px" aria-label="课程 ${index+1}：${esc(course.title)}"><article class="path-node"><div class="path-node-label">${icon('course')}<span class="path-course-tag">课程0${index+1}</span></div><h3>${course.title}</h3><div class="path-node-meta"><span>时长：20mins</span><button type="button" data-view-course="${id}">查看课程</button></div></article>${branches(side,branchY-y,[0,1,2,3],id)}</section>`;
    }).join('');
    lines+=branchLines('left',1464,[0,1,2],1580)+branchLines('right',1504,[1,2],1580);
    lines+=branchLines('left',1919,[0],1954)+branchLines('right',1919,[0],1954);
    nodes.innerHTML=courseRows+`<section class="path-row" data-kind="theory" data-phase="理论考试" style="--row-y:1525px" aria-label="理论考试"><article class="path-node path-exam node-theory"><div class="path-node-label">${icon('theory')}<h3>理论考试</h3></div><div class="path-node-meta"><span>时长：20mins</span><button type="button" data-exam="theory">查看考试</button></div></article>${branches('left',-61,[0,1,2],'theory')}${branches('right',-21,[1,2],'theory')}</section><section class="path-row" data-kind="programming" data-phase="编程考试" style="--row-y:1899px" aria-label="编程考试"><article class="path-node path-exam node-programming"><div class="path-node-label">${icon('programming')}<h3>编程考试</h3></div><div class="path-node-meta"><span>时长：20mins</span><button type="button" data-exam="programming">预约链接</button></div></article>${branches('left',20,[0],'programming')}${branches('right',20,[0],'programming')}</section><section class="path-row" data-kind="certificate" style="--row-y:2107px" aria-label="认证证书"><article class="path-node path-exam node-certificate"><div class="path-node-label">${icon('certificate')}<h3>推理开发者认证（工作级）</h3></div><div class="path-node-meta"><span>时长：20mins</span><button type="button" data-exam="certificate">查看证书</button></div></article></section>`;
    connections.innerHTML=lines;
  }
  function updatePlanButton(){
    planButton.setAttribute('aria-pressed',String(savedPlan));
    planButton.querySelector('span:last-child').textContent=savedPlan?'已加入学习计划':'加入学习计划';
  }
  planButton.addEventListener('click',()=>{
    try {
      if(savedPlan)localStorage.removeItem(planKey);
      else localStorage.setItem(planKey,JSON.stringify({title:'推理开发者认证（工作级）',level:'ACDP',track:'inference',courses:order,addedAt:new Date().toISOString()}));
      savedPlan=!savedPlan;updatePlanButton();toast(savedPlan?'已加入学习计划，再次打开时可继续查看。':'已从学习计划移除。');
    } catch {toast('当前浏览器无法保存学习计划，请允许本地存储后重试。');}
  });
  function editor(){
    dialogBody.innerHTML=`<p>调整理论学习中三门课程的先后顺序。</p><ol class="path-editor-list">${draftOrder.map((id,index)=>`<li><span>${index+1}. ${courses.find(course=>course.id===id).title}</span><button type="button" data-move="${index}" data-direction="-1" aria-label="上移第 ${index+1} 门课程" ${index===0?'disabled':''}>↑</button><button type="button" data-move="${index}" data-direction="1" aria-label="下移第 ${index+1} 门课程" ${index===2?'disabled':''}>↓</button></li>`).join('')}</ol><div class="path-dialog-actions"><button type="button" data-reset-order>恢复原路径</button><button type="button" data-save-order class="primary">保存路径</button></div>`;
  }
  document.getElementById('editPath').addEventListener('click',()=>{draftOrder=[...order];showDialog('编辑认证路径','');editor();});
  dialogBody.addEventListener('click',event=>{
    const move=event.target.closest('[data-move]');
    if(move){const from=Number(move.dataset.move),to=from+Number(move.dataset.direction);if(to>=0&&to<3){[draftOrder[from],draftOrder[to]]=[draftOrder[to],draftOrder[from]];editor();}return;}
    if(event.target.closest('[data-reset-order]')){draftOrder=courses.map(course=>course.id);editor();return;}
    if(event.target.closest('[data-save-order]')){
      try {
        localStorage.setItem(orderKey,JSON.stringify(draftOrder));
        if(savedPlan){const plan=JSON.parse(localStorage.getItem(planKey));plan.courses=draftOrder;localStorage.setItem(planKey,JSON.stringify(plan));}
        order=[...draftOrder];render();dialog.close();toast('学习路径已保存。');
      } catch {toast('当前浏览器无法保存路径，请允许本地存储后重试。');}
    }
  });
  nodes.addEventListener('click',event=>{
    const courseButton=event.target.closest('[data-view-course]'),chapterButton=event.target.closest('[data-chapter]'),examButton=event.target.closest('[data-exam]');
    if(courseButton){
      const course=courses.find(item=>item.id===courseButton.dataset.viewCourse);
      showDialog(course.title,`<p>认证路径 · 理论学习 · 课程设计时长 20mins</p><ol class="path-detail-list">${chapters.map(item=>`<li><strong>${item.title}</strong><small>${item.description}</small></li>`).join('')}</ol><div class="path-dialog-actions"><a class="primary" href="${course.url}" target="_blank" rel="noopener noreferrer">前往课程</a></div>`);
    } else if(chapterButton){
      const chapter=chapters[Number(chapterButton.dataset.chapter)];
      const course=courses.find(item=>item.id===chapterButton.dataset.course);
      showDialog(chapter.title,`<p>${chapter.description}</p><p>${chapter.practice?'在推理学习环境中完成部署，并核对输出。':'从推理课程中查看相关讲解和实践资料。'}</p><div class="path-dialog-actions"><a class="primary" href="${course?.url||'https://www.hiascend.com/edu/developer-certification/detail/583e838e9cfd4417b0c0f5e88eed6740'}" target="_blank" rel="noopener noreferrer">查看相关课程</a></div>`);
    } else if(examButton){
      const key=examButton.dataset.exam;
      const title=key==='certificate'?'推理开发者认证（工作级）':key==='theory'?'理论考试':'编程考试';
      const description=key==='certificate'?'完成认证并通过考核后，可在昇腾社区个人中心查看已获得的证书。':key==='theory'?'复习整体架构、推理部署流程与测试迁移适配，再前往认证详情页了解正式考试要求。':'前往昇腾社区认证详情页，按官方流程查看编程考试安排。';
      showDialog(title,`<p>${description}</p><p>路径中的“20mins”为设计稿示例，正式考试安排以昇腾社区公布的信息为准。</p><div class="path-dialog-actions"><a class="primary" href="https://www.hiascend.com/edu/developer-certification/detail/583e838e9cfd4417b0c0f5e88eed6740" target="_blank" rel="noopener noreferrer">前往昇腾社区认证页</a></div>`);
    }
  });
  window.addEventListener('resize',resize);
  resize();render();updatePlanButton();
})();
