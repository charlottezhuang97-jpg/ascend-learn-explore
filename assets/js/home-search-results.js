(() => {
  const shell=document.querySelector('.dlc-search-shell'),input=document.getElementById('heroInput'),form=document.getElementById('heroForm');
  if(!shell||!input||!form)return;
  const panel=document.createElement('div');panel.className='dlc-search-results';panel.id='heroSearchResults';panel.hidden=true;panel.setAttribute('role','region');panel.setAttribute('aria-label','学习搜索建议');shell.append(panel);input.setAttribute('aria-controls',panel.id);input.setAttribute('aria-expanded','false');
  let historyView=false;
  const close=()=>{panel.hidden=true;historyView=false;input.setAttribute('aria-expanded','false')};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const recent=()=>{try{return JSON.parse(localStorage.getItem('ascend-recent-searches')||'[]').filter(x=>typeof x==='string').slice(0,4)}catch{return []}};
  const initialRecent=['Ascend C','推理开发','算子调试'];
  const recommended=[['第一次接触昇腾，该从哪里开始？','我刚接触昇腾，希望从基础开始学习'],['如何用 Ascend C 开发一个简单 Vector 算子？','我想学习 Ascend C 算子开发'],['怎样完成一次分布式模型训练？','我想学习模型训练并完成一次分布式训练'],['模型如何部署到昇腾并验证推理性能？','我想把模型部署到昇腾并完成推理服务验证'],['如何在昇腾上开发并部署一个 RAG 智能体？','我想开发一个 RAG 智能体应用，并部署到昇腾环境']];
  const suggestions=['昇腾 深度学习组件 MindCluster','昇腾 产品形态说明 - 产品与技术常见问题','昇腾 虚拟化实例（AVI）用户指南','昇腾 技术认证与申请方案发布 - 认证要求','在非昇腾设备上安装 CANN'];
  function choose(value,submit=false){input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));input.focus();if(submit)form.requestSubmit();}
  function render(){
    const value=input.value.trim();if(value==='/'||value==='／'){close();return;}
    if(!value){const items=localStorage.getItem('ascend-recent-searches')===null?initialRecent:recent();panel.innerHTML=historyView?`<section class="search-history-view"><div class="search-panel-toolbar"><h2>最近搜索</h2><button type="button" class="search-history-close" data-close-history aria-label="关闭最近搜索">×</button></div><div class="search-history-list">${items.length?items.map(x=>`<button type="button" data-query="${esc(x)}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span>${esc(x)}</span><span aria-hidden="true">↗</span></button>`).join(''):'<span class="search-recent-empty">暂无最近搜索</span>'}</div></section>`:`<section class="search-recommend"><div class="search-panel-toolbar"><h2>推荐提问</h2><button type="button" class="search-history-trigger" data-open-history aria-label="查看最近搜索" title="最近搜索"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></button></div><div class="search-chip-row">${recommended.map(([label,prompt])=>`<button type="button" data-query="${esc(prompt)}">${esc(label)}</button>`).join('')}</div></section>`;panel.innerHTML+=`<p class="search-results-footer">不知道从哪开始？ <button type="button" data-open-quiz>开启</button>3 步测验，为你推荐专属学习内容</p>`;}
    else {const q=esc(value),isQwen=/Qwen|NPU/i.test(value),isOperator=/算子|Ascend C/i.test(value),isInference=/推理|MindIE/i.test(value),isAgent=/智能体|RAG|Agent/i.test(value),isCertification=value.includes('认证'),course=isOperator?'operator':isQwen||isInference?'inference':isAgent?'agent':'training',title=isCertification?(isOperator?'算子开发者认证学习路径':'推理开发者认证学习路径'):isQwen?'在昇腾 NPU 上运行 Qwen3':isOperator?'Ascend C 算子开发学习路径':isInference?'推理开发学习路径':isAgent?'RAG 智能体应用开发':'昇腾开发学习路径';target=isCertification?`certification-path.html?track=${isOperator?'operator':'inference'}&level=ACDP`:`course-preview.html?course=${course}`;panel.innerHTML=`<section class="search-match-card"><div><h2>${title}</h2><p>从环境准备、基础学习到实践优化，完成一次可运行、可测量的昇腾开发任务。</p><small>4 阶段 / 17 个内容 · 包含在线实验</small></div><div class="search-match-action">${isQwen?'<span>96% 匹配</span>':''}<a href="${target}" data-course-link>${isCertification?'查看认证路径':'开始学习'}</a></div></section><section><h2>搜索建议</h2><div class="search-suggestion-list">${suggestions.map(s=>`<button type="button" data-query="${esc(s)}"><span>${esc(s)}</span><span aria-hidden="true">›</span></button>`).join('')}</div></section>`;}
    panel.hidden=false;
    input.setAttribute('aria-expanded','true');
    panel.style.maxHeight=`${Math.max(260,window.innerHeight-panel.getBoundingClientRect().top-16)}px`;
  }
  input.addEventListener('focus',render);input.addEventListener('input',()=>{historyView=false;render()});
  input.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  panel.addEventListener('mousedown',e=>e.preventDefault());
  panel.addEventListener('click',e=>{if(e.target.closest('[data-course-link]')){const value=input.value.trim();if(value)localStorage.setItem('ascend-recent-searches',JSON.stringify([value,...recent().filter(x=>x!==value)].slice(0,4)));}});
  panel.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-open-history')){historyView=true;render()}else if(b.hasAttribute('data-close-history')){historyView=false;render()}else if(b.hasAttribute('data-open-quiz')){close();document.getElementById('openQuiz')?.click()}else if(b.dataset.submitQuery)choose(b.dataset.submitQuery,true);else if(b.dataset.query)choose(b.dataset.query)});
  document.addEventListener('pointerdown',e=>{if(!shell.contains(e.target))close()});
  window.addEventListener('resize',()=>{if(!panel.hidden)panel.style.maxHeight=`${Math.max(260,window.innerHeight-panel.getBoundingClientRect().top-16)}px`});
  form.addEventListener('submit',()=>{const value=input.value.trim();if(!value||value==='/')return;localStorage.setItem('ascend-recent-searches',JSON.stringify([value,...recent().filter(x=>x!==value)].slice(0,4)));close()});
})();
