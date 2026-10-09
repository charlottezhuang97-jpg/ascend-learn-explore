(()=>{
  const shell=document.querySelector('#canvasShell');
  const canvas=document.querySelector('#knowledgeCanvas');
  const output=document.querySelector('#zoomValue');
  const tabs=[...document.querySelectorAll('.km-view-tabs button')];
  const views={map:document.querySelector('#globalMap'),network:document.querySelector('#networkMap')};
  let scale=1,x=0,y=0,dragging=false,startX=0,startY=0;
  function fit(){const r=shell.getBoundingClientRect();scale=Math.min((r.width-48)/1180,(r.height-48)/720,1);x=-590*scale;y=-360*scale;render()}
  function render(){canvas.style.transform=`translate(${x}px,${y}px) scale(${scale})`;output.value=`${Math.round(scale*100)}%`;output.textContent=output.value}
  function zoom(next,cx=shell.clientWidth/2,cy=shell.clientHeight/2){const prev=scale;scale=Math.max(.55,Math.min(1.8,next));x=cx-(cx-x)*(scale/prev);y=cy-(cy-y)*(scale/prev);render()}
  shell.addEventListener('pointerdown',e=>{if(e.target.closest('button,a'))return;dragging=true;startX=e.clientX-x;startY=e.clientY-y;shell.setPointerCapture(e.pointerId)});
  shell.addEventListener('pointermove',e=>{if(!dragging)return;x=e.clientX-startX;y=e.clientY-startY;render()});
  shell.addEventListener('pointerup',()=>dragging=false);shell.addEventListener('pointercancel',()=>dragging=false);
  shell.addEventListener('wheel',e=>{e.preventDefault();const r=shell.getBoundingClientRect();zoom(scale*(e.deltaY>0?.9:1.1),e.clientX-r.left,e.clientY-r.top)},{passive:false});
  document.querySelector('[data-zoom="in"]').addEventListener('click',()=>zoom(scale+0.1));document.querySelector('[data-zoom="out"]').addEventListener('click',()=>zoom(scale-0.1));document.querySelector('#fitCanvas').addEventListener('click',fit);
  tabs.forEach(tab=>tab.addEventListener('click',()=>{tabs.forEach(t=>t.setAttribute('aria-selected',String(t===tab)));Object.entries(views).forEach(([key,view])=>view.hidden=key!==tab.dataset.view);document.querySelector('#mapCrumb').textContent=tab.dataset.view==='map'?'全局知识版图':'模型训练 / 二维知识网络';fit()}));
  document.querySelectorAll('.km-switch button').forEach(button=>button.addEventListener('click',()=>button.setAttribute('aria-pressed',String(button.getAttribute('aria-pressed')!=='true'))));
  const title=document.querySelector('#inspectorTitle'),meta=document.querySelector('#inspectorMeta'),reason=document.querySelector('#inspectorReason'),node=document.querySelector('#currentNode');
  const domainCopy={模型训练:['当前学习方向 · 68%','掌握训练任务拆分、设备协同和稳定调优，是完成大模型训练的关键基础。','梯度同步'],模型推理:['3 个知识点已掌握','把训练产物转换成可验证、可部署的推理服务。','模型转换'],算子开发:['待探索','理解底层计算与内存调度，解决算子缺失和性能瓶颈。','Ascend C 编程'],推荐开发:['待探索','从召回、排序到部署，建立推荐系统在昇腾上的完整开发链路。','召回排序优化']};
  document.querySelectorAll('[data-domain]').forEach(button=>button.addEventListener('click',()=>{const d=button.dataset.domain,[m,r,n]=domainCopy[d];title.textContent=d;meta.textContent=m;reason.textContent=r;node.textContent=n;tabs[1].click()}));
  document.querySelectorAll('[data-node]').forEach(button=>button.addEventListener('click',()=>{title.textContent=button.dataset.node;meta.textContent='模型训练 · 知识节点';reason.textContent=`${button.dataset.node}与当前课程、实践任务和能力证据使用同一份学习状态。`;node.textContent=button.dataset.node}));
  addEventListener('resize',fit);requestAnimationFrame(()=>{fit();if(new URLSearchParams(location.search).get('view')==='network')tabs[1].click()});
})();
