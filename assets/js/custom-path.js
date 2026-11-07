(() => {
  const params=new URLSearchParams(location.search);
  const operatorTrack=params.get('track')==='operator';
  const certificationTitle=operatorTrack?'算子开发者认证（工作级）':'推理开发者认证（工作级）';
  const domains = {
    CANN: {number:'01',summary:'昇腾计算架构、算子开发、应用与算子调优',tags:['昇腾计算架构','Ascend C','算子调优']},
    '生成式 AI': {number:'02',summary:'模型训练、推理部署、生成式 AI 应用开发',tags:['MindSpore','MindIE','训练 / 推理']},
    '智能体': {number:'03',summary:'Agent 与 RAG 应用开发、部署和效果验证',tags:['Agent','RAG','评测与防护']}
  };
  const catalog = [
    {id:'cann-base',domain:'CANN',title:'昇腾 AI 基础软硬件平台',description:'建立昇腾硬件与 CANN 软件栈的基础认识',type:'建议'},
    {id:'ascend-c',domain:'CANN',title:'Ascend C 算子开发基础',description:'理解算子编写、运行和调优的关键环节',type:'可选'},
    {id:'vector-intro',domain:'CANN',title:'Ascend C入门简单Vector算子开发',description:'完成简单Vector算子的开发与验证',type:'核心'},
    {id:'vector-advanced',domain:'CANN',title:'Ascend C进阶泛化Vector算子开发',description:'开发支持多种输入形状的泛化Vector算子',type:'核心'},
    {id:'cube-advanced',domain:'CANN',title:'Ascend C高级Cube算子开发',description:'实现并优化Cube矩阵计算算子',type:'核心'},
    {id:'mindspore',domain:'生成式 AI',title:'昇腾算力与 MindSpore 框架',description:'为模型训练与推理建立框架基础',type:'建议'},
    {id:'vllm-deploy',domain:'生成式 AI',title:'vLLM-ascend 推理部署与调优',description:'部署模型服务并核对推理结果',type:'核心'},
    {id:'vllm-profiling',domain:'生成式 AI',title:'基于 vLLM-ascend 的 Profiling 采集及推理性能分析',description:'定位性能问题并分析推理链路',type:'核心'},
    {id:'mindie-motor',domain:'生成式 AI',title:'基于 MindIE Motor 部署 vLLM 大 EP 推理服务',description:'实践多卡推理服务部署',type:'核心'},
    {id:'rag',domain:'智能体',title:'RAG 应用开发部署与效果验证',description:'将推理服务连接检索、应用与评测',type:'可选'},
    {id:'agent',domain:'智能体',title:'Agent 应用开发部署',description:'让模型能力进入任务编排流程',type:'可选'}
  ];
  const initial=operatorTrack?['vector-intro','vector-advanced','cube-advanced']:['cann-base','mindspore','vllm-deploy','vllm-profiling','mindie-motor','rag'];
  const key=`ascend-custom-path-${operatorTrack?'operator':'inference'}-acdp-v1`;
  const courseList=document.getElementById('courseList'),domainMap=document.getElementById('domainMap');
  const dialog=document.getElementById('courseDialog'),fields=document.getElementById('dialogFields'),form=document.getElementById('courseForm');
  const status=document.getElementById('saveStatus');
  const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fresh=()=>initial.map(id=>({...catalog.find(c=>c.id===id),instance:crypto.randomUUID()}));
  let courses=fresh(),suggestion=null,editing=null;
  try {const saved=JSON.parse(localStorage.getItem(key)||'null');if(Array.isArray(saved)&&saved.every(c=>c&&domains[c.domain]&&typeof c.title==='string'&&typeof c.instance==='string')){courses=saved;status.textContent='已恢复本机保存的路径';}}catch{}
  document.querySelector('.cp-eyebrow').textContent=operatorTrack?certificationTitle:params.get('title')?.includes('认证')?params.get('title').slice(0,80):certificationTitle;
  const back=document.getElementById('backToPath');back.search=new URLSearchParams({track:params.get('track')||'inference',level:params.get('level')||'ACDP',title:params.get('title')||certificationTitle});
  function render(){
    domainMap.innerHTML=Object.entries(domains).map(([name,d])=>{const count=courses.filter(c=>c.domain===name).length;return `<article class="cp-domain"><header><em>${d.number}</em><small>${count} 门课程 · ${count?'路径中':'可添加'}</small></header><h3>${name}</h3><p>${d.summary}</p><div class="cp-tags">${d.tags.map(t=>`<span>${t}</span>`).join('')}</div><progress value="${count}" max="4" aria-label="${name}路径课程数，${count}门"></progress></article>`}).join('');
    courseList.innerHTML=courses.length?courses.map((c,i)=>`<article class="cp-course" data-instance="${escape(c.instance)}"><span class="cp-order">${String(i+1).padStart(2,'0')}</span><div><div class="cp-course-meta"><b>${escape(c.domain)}</b><span>${escape(c.type||'自选')} · 课程</span></div><h3>${escape(c.title)}</h3><p>${escape(c.description)}</p></div><div class="cp-course-actions"><button type="button" data-action="up" aria-label="上移 ${escape(c.title)}" ${i===0?'disabled':''}>↑</button><button type="button" data-action="down" aria-label="下移 ${escape(c.title)}" ${i===courses.length-1?'disabled':''}>↓</button><button type="button" data-action="edit">编辑</button><button type="button" data-action="replace">替换</button><button type="button" data-action="ai">AI 调整</button><button type="button" data-action="remove" aria-label="移除 ${escape(c.title)}">移除</button></div>${suggestion?.instance===c.instance?`<div class="cp-ai-suggestion"><p>✦ ${escape(suggestion.text)}</p><button type="button" data-action="accept-ai">采用建议</button><button type="button" data-action="dismiss-ai">暂不采用</button></div>`:''}</article>`).join(''):'<div class="cp-empty">路径中还没有课程。请添加课程，三大领域仍保留在知识版图中。</div>';
    const included=[...new Set(courses.map(c=>c.domain))];document.getElementById('routeSummary').textContent=[...included,'认证证据'].join(' → ');
  }
  function dirty(){status.textContent='本次修改尚未保存';render();}
  function openDialog(kind,instance){editing={kind,instance};const current=courses.find(c=>c.instance===instance);document.getElementById('dialogTitle').textContent=kind==='edit'?'编辑课程':kind==='replace'?'替换课程':'添加课程';
    if(kind==='edit')fields.innerHTML=`<label>课程名称<input name="title" maxlength="100" required value="${escape(current.title)}"></label><label>所属领域<select name="domain">${Object.keys(domains).map(d=>`<option ${d===current.domain?'selected':''}>${d}</option>`).join('')}</select></label><label>这门课在路径中的作用<textarea name="description" maxlength="200" required>${escape(current.description)}</textarea></label>`;
    else fields.innerHTML=`<label>选择${kind==='replace'?'替代':'新增'}课程<select name="course">${catalog.filter(c=>kind==='add'||c.domain===current.domain).map(c=>`<option value="${c.id}" ${c.id===current?.id?'selected':''}>${escape(c.domain)} · ${escape(c.title)}</option>`).join('')}</select></label><p>${kind==='replace'?'只列出同领域课程，保持知识版图归属清晰。':'新课程会放到路径末尾，可用上下箭头调整顺序。'}</p>`;
    dialog.showModal();fields.querySelector('input,select')?.focus();
  }
  function closeDialog(){dialog.close();editing=null;}
  document.getElementById('closeDialog').onclick=closeDialog;document.getElementById('cancelDialog').onclick=closeDialog;
  form.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(form),idx=courses.findIndex(c=>c.instance===editing.instance);if(editing.kind==='edit'){courses[idx]={...courses[idx],title:String(data.get('title')).trim(),domain:String(data.get('domain')),description:String(data.get('description')).trim()};}else{const choice=catalog.find(c=>c.id===data.get('course'));if(!choice)return;const next={...choice,instance:editing.kind==='replace'?courses[idx].instance:crypto.randomUUID()};if(editing.kind==='replace')courses[idx]=next;else courses.push(next);}suggestion=null;closeDialog();dirty();});
  courseList.addEventListener('click',e=>{const button=e.target.closest('[data-action]');if(!button)return;const article=button.closest('[data-instance]'),instance=article.dataset.instance,index=courses.findIndex(c=>c.instance===instance),action=button.dataset.action,c=courses[index];if(action==='edit'||action==='replace'){openDialog(action,instance);return;}if(action==='up'||action==='down'){const to=index+(action==='up'?-1:1);if(to<0||to>=courses.length)return;[courses[index],courses[to]]=[courses[to],courses[index]];suggestion=null;dirty();return;}if(action==='remove'){courses.splice(index,1);suggestion=null;dirty();return;}if(action==='ai'){const alternatives=catalog.filter(x=>x.domain===c.domain&&x.id!==c.id);const next=alternatives[0];suggestion={instance,text:next?`依据“${certificationTitle}”目标，建议将《${c.title}》替换为《${next.title}》，仍属于${c.domain}领域。请确认是否采用。`:`《${c.title}》已覆盖当前领域的关键内容，建议保留并调整到更靠前的位置。`,replacement:next?.id||null};render();return;}if(action==='dismiss-ai'){suggestion=null;render();return;}if(action==='accept-ai'&&suggestion){if(suggestion.replacement){const replacement=catalog.find(x=>x.id===suggestion.replacement);courses[index]={...replacement,instance};}else if(index>0)[courses[index-1],courses[index]]=[courses[index],courses[index-1]];suggestion=null;dirty();}});
  document.getElementById('addCourse').onclick=()=>openDialog('add');
  document.getElementById('resetPath').onclick=()=>{courses=fresh();suggestion=null;dirty();};
  document.getElementById('savePath').onclick=()=>{try{localStorage.setItem(key,JSON.stringify(courses));status.textContent='已保存到当前浏览器';}catch{status.textContent='浏览器未允许本地保存';}};
  render();
})();
