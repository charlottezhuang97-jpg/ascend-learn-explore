(() => {
  const training = new URLSearchParams(location.search).get('course') === 'training';
  const labels = {course:'课程总结', chapter:'章节总结', transcript:'视频字幕', cards:'闪卡'};
  const lesson = document.getElementById('videoLessonTitle').textContent;
  const data = training ? {
    course:'大模型分布式训练', chapter:'数据并行与梯度同步',
    outline:[['建立训练全景','理解模型、数据、设备与训练任务之间的关系。'],['完成设备协同','通过数据并行、梯度同步与混合精度完成多卡协作。'],['稳定调优与验收','从通信开销、训练稳定性到可复现的验收证据。']],
    points:[['数据拆分','每张 NPU 保留完整模型，通过 rank 读取不同的数据切片。','03:20','video',0],['梯度同步','AllReduce 汇总局部梯度，再除以设备数量得到平均梯度。','05:05','video',1],['一致更新','各设备使用相同的全局梯度更新参数，保持模型副本一致。','07:36','board',1]],
    transcript:[
      ['01:50','video','讲解','为什么需要数据并行','同一个模型可以放在多张 NPU 上，各设备接收不同的数据，分别完成前向与反向计算。',0],
      ['03:20','video','代码','拆分 mini-batch','DistributedSampler 根据设备的 rank 拆分数据，让每张 NPU 只读取自己的那份样本。',0],
      ['05:05','video','代码','同步局部梯度','先执行 AllReduce 对局部梯度求和，再按设备数量取平均，随后更新模型参数。',1],
      ['06:20','board','板书','数据并行结构','模型是完整副本，数据是不同切片。沿着图中的数据流，观察一个 mini-batch 如何分配到 NPU 0–3。',0],
      ['07:36','board','高亮','全局梯度与一致更新','局部梯度不能直接更新模型；先聚合并平均，再让所有设备执行相同的参数更新。',1],
      ['09:40','board','小测','检查你的理解','如果四张 NPU 分别得到不同的局部梯度，为什么每张设备最终仍能保持相同的模型参数？',2]
    ],
    cards:[['数据并行拆分的是什么？','拆分的是数据批次。每张 NPU 保留完整模型，读取不同的数据切片。'],['为什么 AllReduce 后还要取平均？','AllReduce SUM 得到梯度总和，除以设备数量后得到平均梯度，使更新尺度与设备数量解耦。'],['怎样保证各设备参数一致？','各设备从相同参数出发，用相同的全局平均梯度与优化器规则完成更新。']]
  } : {
    course:'昇腾处理器与算子开发', chapter:lesson,
    outline:[['认识昇腾计算体系','建立 CPU、NPU 与 CANN 软件栈的协作直觉。'],['理解处理器架构','认识 Cube、Vector、Scalar 的职责与数据流。'],['完成算子实践','理解数据搬运、计算与结果写回，并验证运行结果。']],
    points:[['三类计算单元','Cube 负责矩阵计算，Vector 负责向量运算，Scalar 负责控制流程。','03:36','board',0],['数据搬运','把输入从全局内存搬到合适的片上缓冲区，再开始计算。','03:20','video',0],['结果写回','完成计算后，明确结果长度与写回目标，保证输出正确。','05:05','video',1]],
    transcript:[['01:50','video','讲解','达芬奇架构：AI 计算的核心','上一节我们把 NPU 比作工厂。现在进入工厂内部，理解各计算单元如何分工。',0],['03:20','video','代码','输入数据搬运','先准备输入数据与缓冲区，再把数据搬运到计算单元可访问的位置。',0],['03:36','board','板书','Cube、Vector 与 Scalar','达芬奇架构把计算任务拆分给三个各司其职的单元：Cube、Vector 和 Scalar。',0],['05:05','video','代码','计算结果写回','计算完成后，把结果按指定长度写回输出空间。',1],['05:40','board','高亮','计算单元的职责','Cube 承担矩阵乘法，Vector 处理向量运算，Scalar 负责控制流程。',0],['06:20','board','小测','判断主要计算单元','Transformer 中的大规模矩阵乘法，主要由哪个计算单元承担？',0]],
    cards:[['Cube 主要负责什么？','矩阵计算，例如大模型中的矩阵乘法。'],['Vector 与 Scalar 有什么区别？','Vector 处理向量运算与后处理；Scalar 负责标量运算和流程控制。'],['算子执行的基本顺序是什么？','输入搬运 → 计算 → 结果写回。']]
  };
  let tool = null, filter = 'all', query = '', cardIndex = 0, revealed = false, selectedEntry = -1;
  const surfaces = [];
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const sourceBadge = (view, type) => `<span class="study-source ${view}">${view === 'video' ? '▷ 视频' : '▱ 白板'} · ${escape(type)}</span>`;
  function mount(root, form, chat, context, suggestions) {
    const view = document.createElement('section');
    view.className = 'study-tool-view'; view.hidden = true; view.setAttribute('aria-label','学习工具内容');
    const bar = document.createElement('nav');
    bar.className = 'study-tool-bar'; bar.setAttribute('aria-label','AI 学伴学习工具');
    bar.innerHTML = Object.entries(labels).map(([key,label]) => `<button type="button" data-study-tool="${key}" aria-pressed="false">${label}</button>`).join('');
    root.insertBefore(view, chat); root.insertBefore(bar, form);
    surfaces.push({root, view, bar, chat, context, suggestions});
  }
  mount(document.getElementById('ideAssistAi'),document.getElementById('ideAssistForm'),document.getElementById('ideAssistMessages'),document.querySelector('.ide-assist-context'),document.querySelector('.ide-assist-suggestions'));
  const boardChat = document.getElementById('chatPanel');
  const boardCopy = document.createElement('div'); boardCopy.className='board-chat-copy';
  while(boardChat.firstChild) boardCopy.append(boardChat.firstChild);
  boardChat.append(boardCopy);
  // Keep the original chat panel and note behavior while sharing the same tools.
  const boardView = document.createElement('section'); boardView.className='study-tool-view'; boardView.hidden=true; boardView.setAttribute('aria-label','学习工具内容'); boardChat.prepend(boardView);
  const boardBar=document.createElement('nav'); boardBar.className='study-tool-bar'; boardBar.setAttribute('aria-label','AI 学伴学习工具');
  boardBar.innerHTML=surfaces[0].bar.innerHTML;
  document.getElementById('companionForm').before(boardBar);
  surfaces.push({root:boardChat,view:boardView,bar:boardBar,chat:boardCopy});
  function jump(time, view, page=0) {
    document.dispatchEvent(new CustomEvent('learning:locate',{detail:{time,view,page}}));
  }
  function summary(course) {
    const heading=course?data.course:data.chapter;
    const body=course?`<p class="study-lead">围绕整门课程，把学习内容串成三个能力阶段。</p><ol class="study-summary-list">${data.outline.map(([title,text],i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><div><h4>${title}</h4><p>${text}</p></div></li>`).join('')}</ol><div class="study-callout"><b>学完后你能够</b><p>${training?'独立完成一次可验证的分布式训练，保留指标、调优过程与验收证据。':'理解昇腾处理器的计算分工，并完成数据搬运、计算与结果验证。'}</p></div>`:`<p class="study-lead">本章三个重点，点击来源回到对应讲解。</p>${data.points.map(([title,text,time,view,page])=>`<article class="study-summary-point"><h4>${title}</h4><p>${text}</p><button type="button" data-study-jump="${time}" data-study-view="${view}" data-study-page="${page}">${sourceBadge(view,view==='video'?'讲解':'板书')}<time>${time}</time><span>定位 ↗</span></button></article>`).join('')}`;
    return `<div class="study-scope">${course?'整门课程':'当前章节'}</div><h3>${escape(heading)}</h3>${body}`;
  }
  function transcript() {
    const entries=data.transcript.map((entry,index)=>({entry,index})).filter(({entry})=>(filter==='all'||entry[1]===filter)&&(!query||entry.join(' ').toLowerCase().includes(query.toLowerCase())));
    return `<div class="study-transcript-toolbar"><label class="study-search"><span aria-hidden="true">⌕</span><input type="search" data-study-search aria-label="搜索字幕或知识点" placeholder="搜索字幕或知识点" value="${escape(query)}"></label><div class="study-filters" aria-label="字幕来源筛选">${[['all','全部'],['video','视频'],['board','白板']].map(([key,title])=>`<button type="button" data-study-filter="${key}" aria-pressed="${filter===key}" class="${filter===key?'active':''}">${title}</button>`).join('')}<small>${entries.length} 条</small></div></div><p class="study-caption">本节内容时间轴 · 示例字幕</p><ol class="study-transcript-list">${entries.map(({entry:[time,view,type,title,text,page],index})=>`<li class="${selectedEntry===index?'is-current':''}"><button type="button" class="study-entry-heading" data-study-entry="${index}" aria-label="定位到 ${time} ${title}"><time>${time}</time>${sourceBadge(view,type)}<span class="study-jump-arrow" aria-hidden="true">↗</span></button><h4>${title}</h4><p>${text}</p><div class="study-entry-actions"><button type="button" data-study-entry="${index}">${view==='video'?'定位视频':'查看白板'} ↗</button><button type="button" data-study-copy="${index}" aria-label="复制 ${time} 的字幕">复制</button></div></li>`).join('')}</ol>${entries.length?'':'<p class="study-empty">没有匹配内容，试试其他关键词。</p>'}`;
  }
  function cards() {
    const [question,answer]=data.cards[cardIndex];
    return `<div class="study-card-meta"><span>本章知识回顾</span><b>${cardIndex+1} / ${data.cards.length}</b></div><button type="button" class="study-flashcard ${revealed?'is-revealed':''}" data-study-flip aria-pressed="${revealed}"><small>${revealed?'答案':'问题'}</small><strong>${escape(revealed?answer:question)}</strong><span>${revealed?'点击收起答案':'点击查看答案'} ↻</span></button><div class="study-card-navigation"><button type="button" data-study-card-step="-1" ${cardIndex===0?'disabled':''}>← 上一张</button><button type="button" data-study-card-step="1" ${cardIndex===data.cards.length-1?'disabled':''}>下一张 →</button></div><p class="study-caption">先尝试回忆，再翻面核对答案。</p>`;
  }
  function render({focus=false}={}) {
    surfaces.forEach(surface=>{
      surface.view.hidden=!tool; surface.chat.hidden=!!tool;
      if(surface.context) surface.context.hidden=!!tool;
      if(surface.suggestions) surface.suggestions.hidden=!!tool;
      surface.root.classList.toggle('study-tool-open',!!tool);
      surface.bar.querySelectorAll('button').forEach(button=>{const active=button.dataset.studyTool===tool;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
      if(!tool)return;
      surface.view.innerHTML=`<header class="study-tool-head"><h2>${labels[tool]}</h2><button type="button" data-study-close>返回对话</button></header><div class="study-tool-body">${tool==='course'?summary(true):tool==='chapter'?summary(false):tool==='transcript'?transcript():cards()}</div>`;
      if(focus) {const heading=surface.view.querySelector('h2');heading.tabIndex=-1;if(surface.view.getClientRects().length)heading.focus({preventScroll:true});}
    });
  }
  document.addEventListener('click',async event=>{
    const button=event.target.closest('[data-study-tool],[data-study-close],[data-study-filter],[data-study-entry],[data-study-jump],[data-study-copy],[data-study-flip],[data-study-card-step]');
    if(!button)return;
    if(button.dataset.studyTool){tool=tool===button.dataset.studyTool?null:button.dataset.studyTool;render({focus:true});}
    else if(button.hasAttribute('data-study-close')){tool=null;render();}
    else if(button.dataset.studyFilter){filter=button.dataset.studyFilter;render();}
    else if(button.dataset.studyEntry!==undefined){selectedEntry=Number(button.dataset.studyEntry);const entry=data.transcript[selectedEntry];jump(entry[0],entry[1],entry[5]);render();}
    else if(button.dataset.studyJump){jump(button.dataset.studyJump,button.dataset.studyView,Number(button.dataset.studyPage));render();}
    else if(button.dataset.studyCopy!==undefined){const entry=data.transcript[Number(button.dataset.studyCopy)];try{await navigator.clipboard.writeText(`${entry[0]} ${entry[3]}\n${entry[4]}`);button.textContent='已复制';}catch{button.textContent='复制未成功';}}
    else if(button.hasAttribute('data-study-flip')){revealed=!revealed;render();}
    else if(button.dataset.studyCardStep){cardIndex=Math.max(0,Math.min(data.cards.length-1,cardIndex+Number(button.dataset.studyCardStep)));revealed=false;render();}
  });
  document.addEventListener('input',event=>{
    if(!event.target.matches('[data-study-search]'))return;
    query=event.target.value;
    const surface=surfaces.find(item=>item.view.contains(event.target));
    render();surface.view.querySelector('[data-study-search]').focus({preventScroll:true});
  });
  document.querySelectorAll('.companion-tabs button').forEach(button=>button.addEventListener('click',()=>{boardBar.hidden=button.dataset.tab!=='chat';}));
  document.getElementById('ideAssistForm').addEventListener('submit',()=>{tool=null;render();});

  // Both study views share the same resource categories and note collection.
  const videoResources = document.getElementById('ideAssistResources');
  const boardResources = document.getElementById('boardCourseResources');
  boardResources.classList.add('ide-assist-resources');
  boardResources.innerHTML = videoResources.innerHTML;
  const resourceRoots = [videoResources, boardResources];
  const noteStore = document.getElementById('notesPanel');
  resourceRoots.forEach(root => {
    const home = document.createElement('div'); home.dataset.resourceHome='';
    while(root.firstChild)home.append(root.firstChild);
    const detail = document.createElement('section');detail.className='study-resource-detail';detail.hidden=true;
    root.append(home,detail);
  });
  const resourceTitles = {errors:'常见错误码',quiz:'随堂测试',docs:'相关文档',notes:'笔记'};
  function noteMarkup() {
    const entries=[...noteStore.querySelectorAll('.note-item')];
    return `<p class="study-lead">白板摘录与随手记，在两种学习视角中同步查看。</p>${entries.length?entries.map(item=>`<article class="study-saved-note"><small>${escape(item.dataset.noteSource||'白板摘录')}</small><p>${escape(item.textContent)}</p></article>`).join(''):'<p class="study-empty">还没有笔记。可长按选中白板文字摘录，也可以在下方记录。</p>'}<form data-resource-note-form><label>添加笔记<textarea name="note" aria-label="笔记内容" placeholder="记下这一刻的理解或疑问…" required maxlength="2000"></textarea></label><button type="submit">保存笔记</button></form>`;
  }
  function openResource(root, key) {
    root.dataset.openResource=key;
    root.querySelector('[data-resource-home]').hidden=true;
    const detail=root.querySelector('.study-resource-detail');detail.hidden=false;
    let body='';
    if(key==='notes')body=noteMarkup();
    if(key==='errors')body=`<p class="study-lead">展开错误项，查看排查顺序。</p><details class="study-error-item"><summary>ACL_INIT_FAILED · 初始化失败</summary><p>先确认驱动、CANN 与运行时环境已正确安装，再检查环境变量和当前进程的设备权限。</p></details><details class="study-error-item"><summary>设备不可见 · NPU 数量为 0</summary><p>检查设备状态、容器挂载与设备权限，然后重新执行设备数量查询。</p></details><details class="study-error-item"><summary>通信初始化失败</summary><p>核对各进程的 RANK、WORLD_SIZE 与网络配置，确认所有训练进程均已启动。</p></details>`;
    if(key==='quiz')body=`<p class="study-lead">选择一个答案，立即查看解析。</p><h3>${training?'AllReduce 求和后，为什么还需要除以设备数量？':'Cube 计算单元主要负责哪类任务？'}</h3><div class="study-quiz-options">${(training?['得到全局平均梯度','减少模型参数的数量','让每张 NPU 读取相同数据']:['矩阵运算','输入输出流程控制','保存所有训练数据']).map((choice,index)=>`<button type="button" data-resource-answer="${index}">${String.fromCharCode(65+index)}. ${choice}</button>`).join('')}</div><p class="study-quiz-feedback" role="status"></p>`;
    if(key==='docs')body=`<p class="study-lead">按知识点查阅本节讲解与板书。</p>${data.points.map(([title,text,time,view,page])=>`<article class="study-summary-point"><h4>${escape(title)}</h4><p>${escape(text)}</p><button type="button" data-study-jump="${time}" data-study-view="${view}" data-study-page="${page}">${sourceBadge(view,view==='video'?'讲解':'板书')}<time>${time}</time><span>查看来源 ↗</span></button></article>`).join('')}`;
    detail.innerHTML=`<header class="study-tool-head"><h2>${resourceTitles[key]}</h2><button type="button" data-resource-back>返回资源</button></header><div class="study-tool-body">${body}</div>`;
  }
  function syncNoteCounts() {
    const count=noteStore.querySelectorAll('.note-item').length;
    document.querySelectorAll('[data-resource-note-count]').forEach(node=>{node.textContent=String(count);});
    resourceRoots.filter(root=>root.dataset.openResource==='notes').forEach(root=>openResource(root,'notes'));
  }
  new MutationObserver(syncNoteCounts).observe(noteStore,{childList:true,subtree:true,characterData:true});
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-assist-resource],[data-resource-back],[data-resource-answer]');
    if(!button)return;
    const root=resourceRoots.find(item=>item.contains(button));if(!root)return;
    if(button.dataset.assistResource)openResource(root,button.dataset.assistResource);
    else if(button.hasAttribute('data-resource-back')){
      delete root.dataset.openResource;
      root.querySelector('.study-resource-detail').hidden=true;
      root.querySelector('[data-resource-home]').hidden=false;
    } else {
      const correct=button.dataset.resourceAnswer==='0';
      root.querySelectorAll('[data-resource-answer]').forEach(item=>item.classList.toggle('selected',item===button));
      root.querySelector('.study-quiz-feedback').textContent=correct?`回答正确。${data.cards[training?1:0][1]}`:`再想一想：${training?'这里需要把各设备的梯度总和变成平均值。':'Cube 擅长大规模矩阵乘法。'}`;
    }
  });
  document.addEventListener('submit',event=>{
    if(!event.target.matches('[data-resource-note-form]'))return;
    event.preventDefault();
    const input=event.target.elements.note;const text=input.value.trim();if(!text)return;
    noteStore.querySelector('.empty-note')?.remove();
    const note=document.createElement('p');note.className='note-item';note.dataset.noteSource='随手记';note.textContent=text;noteStore.append(note);
    document.getElementById('noteCount').textContent=String(noteStore.querySelectorAll('.note-item').length);
  });
})();
