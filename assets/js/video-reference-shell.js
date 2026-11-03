/* Shared immersive surface: original exports from video learning 1 and 2. */
(() => {
  if(!location.pathname.endsWith('/learn.html'))return;
  const learning=window.AscendLearning,assistant=window.AscendCompanion;
  const panel=document.getElementById('unifiedCompanion'),floor=document.querySelector('.fixed1030-floor-learning');
  if(!learning||!assistant||!panel||!floor)return;
  const root=new URL('../../',document.currentScript.src),asset=p=>new URL(p,root).href;
  const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href=asset('assets/css/video-reference-shell.css?v=5');document.head.append(sheet);
  document.body.classList.add('reference-immersive');
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon=name=>`<span class="iv-source iv-${name}" aria-hidden="true"></span>`;
  const referenceView=()=>['video','board'].includes(document.body.dataset.fixedView);
  const assistantReferenceView=()=>['video','board','ide'].includes(document.body.dataset.fixedView);
  const tools={course:'课程总结',chapter:'章节总结',summary:'智能摘要',notes:'笔记',transcript:'视频字幕',cards:'知识卡片',quiz:'测一测'};
  const featureTitles={...tools,cards:'知识点'};
  const referenceFeatures=new Set(['notes','cards','summary','transcript']);
  const rows=[
    ['00:00:02','voice','这章节我们主要讲的是样例的一些演示'],
    ['00:00:06','','我们首先通过一个hello word这样的一个样例'],
    ['00:00:11','knowledge','然后带大家看看'],
    ['00:00:14','practice','一个最简单的一个日计算是怎么写的'],
    ['00:00:17','','我这里把一些详细的都给它标示出来了'],
    ['00:00:21','','我们先从前往后看'],
    ['00:00:21','','先用图文件看'],
    ['00:00:29','knowledge','我们知道assnc它有两种模式'],
    ['00:00:31','','一个cpu模式'],['00:00:32','','一个mtu模式'],
    ['00:00:34','','cpu模式的话'],['00:00:35','','它可以不依赖'],
    ['00:00:38','','生腾硬件它就可以去执行mmp模式的话'],
    ['00:00:42','','它是要具体的去跑在某个芯片或者硬件上']
  ];
  const nodes=[['knowledge','00:02',14.9,'知识'],['knowledge','00:11',28.2],['knowledge','00:21',32.75],['practice','00:29',37.3,'实践'],['knowledge','00:38',43.1],['knowledge','04:12',52.8],['practice','05:05',67.2],['knowledge','06:44',70.6],['knowledge','13:40',84.8],['note','17:42',95.5,'笔记']];
  const surface=document.createElement('main');surface.className='iv-surface';surface.setAttribute('aria-label','视频学习视角');
  surface.innerHTML=`<header class="iv-course-header"><a class="iv-course-back" href="course-preview.html?course=${encodeURIComponent(new URLSearchParams(location.search).get('course')||'operator')}" aria-label="返回课程详情">${icon('back')}</a><button type="button" class="iv-course-name">Ascend C 算子开发基础 ${icon('course-chevron')}</button></header>
    <div class="iv-canvas-tools" aria-label="画布工具"><button type="button" data-iv-open hidden>${icon('logo')}学习助手</button><button type="button" data-iv-zoom="-1" aria-label="缩小视频">${icon('zoom-out')}</button><span data-iv-scale>50%</span><button type="button" data-iv-zoom="1" aria-label="放大视频">${icon('zoom-in')}</button><i></i><button type="button" data-iv-settings aria-label="学习设置">${icon('settings')}</button><button type="button" data-iv-help aria-label="学习帮助">${icon('help')}</button></div>
    <h1 class="iv-part-title">Part 1. CANN、达芬奇架构与算子</h1>
    <section class="iv-video-frame" aria-label="Ascend C 算子开发课程视频"><div class="iv-video-art"><img class="iv-default-cover" src="${asset('assets/images/video-learning-reference/default.webp')}" alt="Ascend C 算子开发：机器人与儿童课程封面"><img class="iv-subtitle-cover" src="${asset('assets/images/video-learning-reference/knowledge.webp')}" alt="什么是算子：算子的数学含义与 Tanh、ReLU、Sigmoid 函数图像" hidden></div><div class="iv-player-controls"><button type="button" data-iv-play aria-label="播放课程视频">${icon('play')}</button><button type="button" data-iv-sound aria-label="切换声音">${icon('sound')}</button><time>01:00:00</time><button type="button" class="iv-caption-button" data-iv-transcript aria-label="查看视频字幕">${icon('caption')}</button><button type="button" data-iv-fullscreen aria-label="全屏观看">${icon('fullscreen')}</button></div></section>
    <section class="iv-board-viewport" aria-label="AI Core whiteboard" hidden><div class="iv-board-art"><img src="${asset('assets/images/video-learning-reference/notes.webp')}" alt="AI Core: Scalar, Vector, Cube, DMA, Local Memory, Global Memory"><div class="iv-board-selectable" aria-label="可划选的 AI Core 三流概念"><p class="iv-board-lead">Ascend C 入门要点：异构系统上的核函数写在 Device / AI Core 侧，Host 负责调度与数据搬运。</p><h2>AI Core内部并行计算架构抽象</h2><h3>异步指令流</h3><p>Scalar 计算单元读取指令序列，并把向量计算、矩阵计算、数据搬运指令发射给对应单元的指令队列。向量计算单元、矩阵计算单元和数据搬运单元异步并行执行接收到的指令。</p><h3>同步信号流</h3><p>指令间可能存在依赖关系。为保证不同指令队列中的指令按正确的逻辑关系执行，Scalar 计算单元也会向对应单元下发同步指令。</p><h3>计算数据流</h3><p>DMA 搬入单元把数据从 Global Memory 搬运到 Local Memory；Vector / Cube 计算单元完成数据计算，并把结果写回 Local Memory；DMA 搬出单元将处理好的数据搬运返回 Global Memory。</p></div><div class="iv-board-selectable iv-board-concept-three" aria-label="可划选的三流怎么咬合"><h3>核心概念 3</h3><strong>三流怎么咬合</strong><p>指令流：Scalar → 各单元队列</p><p>同步流：依赖放行，单元握手</p><p>数据流：DMA ↔ Local ↔ 计算单元</p><h3>实例：一次矢量计算</h3><p>先搬入数据，再在 Vector 单元计算，完成后搬出结果；同步信号确保依赖顺序正确。</p></div></div></section>
    <div class="iv-timeline" aria-label="课程语义进度节点"><div class="iv-timeline-background"></div><span class="iv-timeline-duration">${icon('history')}28:25:20</span>${nodes.map(([type,time,at,label])=>`<button type="button" class="iv-node iv-node-${type}" style="--at:${at}%" data-iv-seek="${time}" aria-label="${type==='knowledge'?'知识':type==='note'?'笔记':'实践'} ${time}">${label?`<span class="iv-node-label">${label}</span>`:''}<i></i>${icon(type)}</button>`).join('')}<span class="iv-timeline-cursor" style="left:40.2%"><i></i><small>AI Core 硬件架构</small></span></div>
    <footer class="iv-footer"><nav aria-label="学习视角"><button type="button" class="active" data-iv-mode="video" aria-current="page">视频</button><button type="button" data-iv-mode="board">白板</button><button type="button" data-iv-mode="ide">实验</button></nav><div><button type="button" data-iv-comments>${icon('comment')}课程评论</button><button type="button" data-iv-resources>${icon('resources')}学习资料</button></div></footer>`;
  floor.append(surface);
  const header=panel.querySelector('.uac-header');
  header.innerHTML=`<button type="button" class="uac-back" data-uac-action="back" aria-label="返回学习助手首页" hidden>${icon('back-small')}</button><div class="iv-assistant-drag" tabindex="0" role="group" aria-label="移动学习助手窗口，方向键移动，Home 恢复位置"><span class="uac-logo">${icon('logo')}</span><div class="uac-heading"><h2 id="uacTitle">学习助手</h2><details class="uac-mode-switch"><summary aria-label="选择助手类型">${icon('chevron')}</summary><div><button type="button" data-uac-action="assistant-mode" data-mode="smart"><span class="iv-type-check"></span>智能助手</button><button type="button" data-uac-action="assistant-mode" data-mode="study"><span class="iv-type-check"></span>学习助手</button></div></details></div><strong class="iv-selected-tool" hidden></strong></div><div class="uac-header-actions"><button type="button" data-uac-action="history" aria-label="历史对话">${icon('rating')}</button><button type="button" data-iv-tool-menu aria-label="切换学习工具" aria-expanded="false">${icon('list')}</button><button type="button" data-uac-action="close" aria-label="关闭学习助手">${icon('close')}</button></div>`;
  const menu=document.createElement('div');menu.className='iv-tools-menu';menu.hidden=true;menu.setAttribute('aria-label','学习工具切换');
  menu.innerHTML=Object.entries(tools).map(([key,label])=>`<button type="button" data-iv-tool="${key}">${label}</button>`).join('');panel.append(menu);
  const search=document.createElement('form');search.className='iv-transcript-search';search.hidden=true;search.setAttribute('role','search');search.innerHTML=`${icon('search')}<input aria-label="搜索视频字幕" placeholder="搜索" autocomplete="off">`;panel.append(search);
  const capture=document.createElement('div');capture.className='iv-note-capture';capture.hidden=true;capture.setAttribute('aria-label','添加学习笔记');
  capture.innerHTML=`<button type="button" data-iv-capture="camera" aria-label="添加图片笔记">${icon('note-camera')}</button><button type="button" data-iv-capture="voice" aria-label="语音记录笔记">${icon('note-microphone')}</button><button type="button" data-iv-capture="phone" aria-label="拍摄图片笔记">${icon('note-phone')}</button><input type="file" accept="image/*" hidden>`;panel.append(capture);
  // Existing course-resource entry forwards to this action without exposing another header icon.
  const resourcesAction=document.createElement('button');resourcesAction.type='button';resourcesAction.hidden=true;resourcesAction.dataset.uacAction='resources';panel.append(resourcesAction);
  const floating=window.AscendFloatingWindow.mount(panel,header.querySelector('.iv-assistant-drag'),{enabled:assistantReferenceView});
  let selectedRow=0,scale=50,lastVideo=null,lastFeature='',renderedFeature='';
  const noteAttachments=[];let voiceNotes=[];
  try{const saved=JSON.parse(localStorage.getItem('ascend-reference-voice-notes')||'[]');if(Array.isArray(saved))voiceNotes=saved.filter(v=>typeof v==='string');}catch{}
  function appendUserNotes(){
    const target=panel.querySelector('.iv-note-content');if(!target)return;
    for(const text of voiceNotes){const p=document.createElement('p');p.className='iv-note-recorded';p.textContent=text;target.append(p);}
    for(const attachment of noteAttachments){const img=document.createElement('img');img.className='iv-note-upload';img.src=attachment.src;img.alt=attachment.name;target.append(img);}
  }
  function renderTranscript(){
    const content=panel.querySelector('.uac-body');content.className='uac-body iv-transcript-body';
    content.innerHTML=`<h3 class="iv-transcript-title">已为你生成【HelloWorld】视频字幕。</h3><ol class="iv-transcript-list">${rows.map(([time,type,text],i)=>`<li data-iv-transcript-row="${i}"><button type="button" data-uac-time="${time.slice(3)}" aria-current="${i===selectedRow}" aria-label="定位到 ${time} ${esc(text)}"><span class="iv-row-icon">${type?icon(type):''}</span><span class="iv-row-copy"><time>${time}</time><span>${esc(text)}</span></span></button></li>`).join('')}</ol>`;
    search.querySelector('input').value='';
  }
  function setMode(mode){document.querySelector(`.fixed1030-footer [data-fixed-view="${mode}"]`)?.click();}
  function renderReferenceFeature(feature){
    if(feature==='transcript'){renderTranscript();return;}
    const render=window.AscendVideoReferenceContent?.[feature];if(!render)return;
    const content=panel.querySelector('.uac-body');content.className='uac-body iv-feature-body iv-'+feature+'-body';content.innerHTML=render(asset);content.scrollTop=0;
    if(feature==='notes')appendUserNotes();
  }
  function decorate(){
    const feature=panel.dataset.feature||'',transcript=feature==='transcript';
    if(feature!==lastFeature){lastFeature=feature;if(referenceFeatures.has(feature))setMode(feature==='notes'?'board':'video');}
    if(!assistantReferenceView())return;
    const active=header.querySelector('.iv-selected-tool');active.hidden=!feature;active.textContent=featureTitles[feature]||'';
    header.querySelector('[data-uac-action="close"]').hidden=false;
    const modeName=header.querySelector('h2').textContent;
    header.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.mode==='smart'?'智能助手':'学习助手')===modeName)));
    const hint={course:'智能分析复用策略',chapter:'智能分析复用策略',summary:'快速对比通信/计算',notes:'智能分析复用策略',transcript:'输入问题，检索知识',cards:'智能分析复用策略'};
    panel.querySelectorAll('.uac-cards [data-uac-feature]').forEach(button=>{
      const key=button.dataset.uacFeature;button.querySelector('.uac-card-watermark').innerHTML=icon(key==='summary'||key==='quiz'?'purple-tool':key==='transcript'?'transcript-tool':'blue-tool');
      const copy=button.querySelector('.uac-card-copy');if(!copy)return;
      const small=copy.querySelector('small');small.innerHTML=key==='quiz'?'<b class="iv-fast-card"># 快慢卡</b> 快速对比通信/计算差异并定位慢卡':hint[key]||small.textContent;
    });
    const think=panel.querySelector('.uac-think');if(think)think.innerHTML=icon('think')+'深度思考';
    const mic=panel.querySelector('.uac-mic');if(mic)mic.innerHTML=icon('mic');
    const send=panel.querySelector('.uac-input button[type="submit"]');if(send)send.innerHTML=icon('send');
    search.hidden=!transcript;panel.classList.toggle('iv-is-transcript',transcript);
    capture.hidden=feature!=='notes';
    const showLesson=referenceFeatures.has(feature);
    surface.classList.toggle('iv-show-subtitle',showLesson);
    surface.querySelector('.iv-default-cover').hidden=showLesson;surface.querySelector('.iv-subtitle-cover').hidden=!showLesson;
    if(referenceFeatures.has(feature)&&renderedFeature!==feature){renderedFeature=feature;renderReferenceFeature(feature);}
    if(!referenceFeatures.has(feature)){renderedFeature='';}
  }
  function viewChanged(){
    const video=referenceView(),mode=document.body.dataset.fixedView;surface.hidden=!video;
    surface.classList.toggle('iv-board-mode',mode==='board');surface.setAttribute('aria-label',mode==='board'?'白板学习视角':'视频学习视角');
    surface.querySelector('.iv-board-viewport').hidden=mode!=='board';surface.querySelector('.iv-video-frame').hidden=mode==='board';surface.querySelector('.iv-part-title').hidden=mode==='board';
    surface.querySelectorAll('[data-iv-mode]').forEach(b=>{b.classList.toggle('active',b.dataset.ivMode===mode);if(b.dataset.ivMode===mode)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
    if(!video){menu.hidden=true;search.hidden=true;capture.hidden=true;panel.classList.remove('iv-is-transcript');renderedFeature='';if(mode!=='ide')floating.reset();if(lastVideo===true&&!panel.hidden)assistant.open();if(mode==='ide')decorate();}
    else decorate();
    surface.querySelector('[data-iv-open]').hidden=!panel.hidden;
    lastVideo=video;
  }
  new MutationObserver(viewChanged).observe(document.body,{attributes:true,attributeFilter:['data-fixed-view']});
  new MutationObserver(()=>{const entry=surface.querySelector('[data-iv-open]');entry.hidden=!panel.hidden;if(panel.hidden&&assistantReferenceView()&&panel.contains(document.activeElement))entry.focus({preventScroll:true});}).observe(panel,{attributes:true,attributeFilter:['hidden']});
  document.addEventListener('uac:render',()=>{renderedFeature='';decorate();});
  document.addEventListener('uac:open',decorate);
  document.addEventListener('learning:time-update',event=>{
    const seconds=Number(event.detail?.seconds);if(!Number.isFinite(seconds)||seconds<0)return;
    const time=[Math.floor(seconds/3600),Math.floor(seconds/60)%60,Math.floor(seconds)%60].map(n=>String(n).padStart(2,'0')).join(':');
    surface.querySelector('.iv-player-controls time').textContent=time;
    for(let i=0;i<rows.length;i++){const [h,m,s]=rows[i][0].split(':').map(Number);if(h*3600+m*60+s<=seconds)selectedRow=i;}
    panel.querySelectorAll('.iv-transcript-list [aria-current]').forEach((b,i)=>b.setAttribute('aria-current',String(i===selectedRow)));
  });
  const conceptQuestions=[
    ['三流怎么咬合？','Scalar 发出指令后，数据流负责把数据搬到计算单元可使用的位置；不同队列有依赖时，同步信号协调执行先后。三者一起让搬运与计算能够并行，同时保证结果正确。'],
    ['指令流、同步流和数据流分别是什么意思？','指令流是发给 Vector、Cube、DMA 等单元的操作序列；同步流表达跨队列的依赖和放行条件；数据流描述数据在 Global Memory、Local Memory 和计算单元之间的搬运与处理。'],
    ['它们用在哪里？','在 Ascend C 算子开发中，理解三流有助于安排数据搬运、Vector / Cube 计算，以及不同指令队列之间的同步。例如实现搬入、计算、搬出的流水线时会同时涉及三者。'],
    ['理解三流有什么意义？','它帮助你区分性能瓶颈来自指令发射、队列等待还是数据搬运，也能避免在异步并行执行时遗漏必要的同步。']
  ];
  let lastBoardSelection='';
  function offerSelectedConcept(){
    if(document.body.dataset.fixedView!=='board')return;
    const selection=window.getSelection();
    const target=selection?.anchorNode?.parentElement?.closest('.iv-board-selectable');
    if(!selection||selection.isCollapsed||!target||!target.contains(selection.focusNode))return;
    const quote=selection.toString().replace(/\s+/g,' ').trim().slice(0,100);
    if(quote.length<2||quote===lastBoardSelection)return;
    lastBoardSelection=quote;
    const chips=conceptQuestions.map(([question],index)=>`<button type="button" data-uac-selection-question="${index}">${esc(question)}</button>`).join('');
    assistant.beginIsolatedTool(`我划选了「${quote}」`,`<div class="iv-selection-guide"><p class="iv-selection-quote">选中的内容：<strong>${esc(quote)}</strong></p><h3>对这个概念有疑问吗？</h3><p>可以从下面的问题开始：</p><div class="iv-selection-questions">${chips}</div></div>`);
  }
  surface.querySelectorAll('.iv-board-selectable').forEach(area=>{
    area.addEventListener('pointerup',offerSelectedConcept);
    area.addEventListener('keyup',event=>{if(event.key==='Shift'||event.key.startsWith('Arrow'))offerSelectedConcept();});
  });
  panel.querySelector('.uac-mode-switch').addEventListener('toggle',event=>{if(event.target.open){menu.hidden=true;header.querySelector('[data-iv-tool-menu]').setAttribute('aria-expanded','false');}});
  panel.addEventListener('click',event=>{
    const question=event.target.closest('[data-uac-selection-question]');
    if(question){const item=conceptQuestions[Number(question.dataset.uacSelectionQuestion)];if(item){assistant.addToolMessage('user',`<p>${esc(item[0])}</p>`);assistant.addToolMessage('assistant',`<p>${esc(item[1])}</p>`);}return;}
    const type=event.target.closest('[data-uac-action="assistant-mode"]');if(type){assistant.showHome();return;}
    const menuButton=event.target.closest('[data-iv-tool-menu]');
    if(menuButton){menu.hidden=!menu.hidden;menuButton.setAttribute('aria-expanded',String(!menu.hidden));panel.querySelector('.uac-mode-switch').open=false;return;}
    const tool=event.target.closest('[data-iv-tool]');if(tool){menu.hidden=true;header.querySelector('[data-iv-tool-menu]').setAttribute('aria-expanded','false');assistant.launch(tool.dataset.ivTool);return;}
    const row=event.target.closest('[data-iv-transcript-row]');if(row){selectedRow=Number(row.dataset.ivTranscriptRow);panel.querySelectorAll('.iv-transcript-list [aria-current]').forEach((b,i)=>b.setAttribute('aria-current',String(i===selectedRow)));}
    if(event.target.closest('[data-iv-note-video]')){setMode('video');document.dispatchEvent(new CustomEvent('learning:locate-video',{detail:{time:'00:11'}}));}
    const action=event.target.closest('[data-iv-summary-action]');
    if(action){
      const key=action.dataset.ivSummaryAction;
      if(key==='regenerate'){renderReferenceFeature('summary');learning.showToast('已根据当前课程重新整理摘要');}
      if(key==='copy'){
        const text=panel.querySelector('.iv-summary-body').innerText;
        if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text).then(()=>learning.showToast('摘要已复制')).catch(()=>learning.showToast('未能复制，请选中文字后复制'));
        else learning.showToast('请选中摘要文字后复制');
      }
      if(key==='like'||key==='dislike'){
        const pressed=action.getAttribute('aria-pressed')!=='true';
        panel.querySelectorAll('[data-iv-summary-action=like],[data-iv-summary-action=dislike]').forEach(b=>b.setAttribute('aria-pressed',String(b===action&&pressed)));
        try{localStorage.setItem('ascend-reference-summary-feedback',pressed?key:'');}catch{}
        learning.showToast(pressed?'反馈已保存在本机':'已取消反馈');
      }
      if(key==='report')learning.showToast('可通过课程评论描述摘要中的问题');
    }
  });
  capture.addEventListener('click',event=>{
    const button=event.target.closest('[data-iv-capture]');if(!button)return;
    if(button.dataset.ivCapture==='voice'){
      const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
      if(!Speech){learning.showToast('当前浏览器不支持语音笔记，请使用图片记录');return;}
      const recognition=new Speech();recognition.lang='zh-CN';recognition.interimResults=false;
      recognition.onstart=()=>button.classList.add('is-recording');recognition.onend=()=>button.classList.remove('is-recording');
      recognition.onerror=()=>learning.showToast('语音记录未完成，请检查麦克风权限');
      recognition.onresult=event=>{
        const p=document.createElement('p');p.className='iv-note-recorded';p.textContent=event.results[0][0].transcript;
        panel.querySelector('.iv-note-content')?.append(p);
        voiceNotes.push(p.textContent);try{localStorage.setItem('ascend-reference-voice-notes',JSON.stringify(voiceNotes));}catch{}
      };
      try{recognition.start();}catch{learning.showToast('无法开启语音记录，请重试');}return;
    }
    const input=capture.querySelector('input');if(button.dataset.ivCapture==='phone')input.setAttribute('capture','environment');else input.removeAttribute('capture');input.click();
  });
  capture.querySelector('input').addEventListener('change',event=>{
    const file=event.target.files?.[0];if(!file)return;
    if(!file.type.startsWith('image/')){learning.showToast('请选择图片文件');return;}
    const reader=new FileReader();reader.onload=()=>{const img=document.createElement('img');img.className='iv-note-upload';img.src=String(reader.result);img.alt=file.name;noteAttachments.push({src:img.src,name:file.name});panel.querySelector('.iv-note-content')?.append(img);learning.showToast('图片已加入当前笔记');};reader.onerror=()=>learning.showToast('图片未能读取，请重试');reader.readAsDataURL(file);event.target.value='';
  });
  document.addEventListener('click',event=>{
    if(!header.contains(event.target)&&!menu.contains(event.target)){menu.hidden=true;header.querySelector('[data-iv-tool-menu]').setAttribute('aria-expanded','false');}
    const types=panel.querySelector('.uac-mode-switch');if(!types.contains(event.target))types.open=false;
  });
  window.addEventListener('keydown',event=>{
    if(event.key!=='Escape'||!assistantReferenceView())return;
    const types=panel.querySelector('.uac-mode-switch');if(!menu.hidden||types.open){event.preventDefault();event.stopImmediatePropagation();menu.hidden=true;types.open=false;header.querySelector('[data-iv-tool-menu]').setAttribute('aria-expanded','false');}
  },true);
  search.addEventListener('submit',event=>event.preventDefault());
  search.querySelector('input').addEventListener('input',event=>{const query=event.target.value.trim().toLowerCase();panel.querySelectorAll('[data-iv-transcript-row]').forEach(li=>{li.hidden=!li.textContent.toLowerCase().includes(query);});});
  surface.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.ivMode){document.querySelector(`.fixed1030-footer [data-fixed-view="${button.dataset.ivMode}"]`)?.click();return;}
    if(button.hasAttribute('data-iv-open'))assistant.open();
    if(button.hasAttribute('data-iv-transcript'))assistant.launch('transcript');
    if(button.hasAttribute('data-iv-comments'))document.querySelector('.fixed1030-footer [data-fixed-comment]')?.click();
    if(button.hasAttribute('data-iv-resources'))document.querySelector('.fixed1030-footer [data-fixed-resources]')?.click();
    if(button.dataset.ivSeek){document.dispatchEvent(new CustomEvent('learning:locate-video',{detail:{time:button.dataset.ivSeek}}));surface.querySelector('.iv-timeline-cursor').style.left=button.style.getPropertyValue('--at');if(button.classList.contains('iv-node-note'))assistant.launch('notes');else if(button.classList.contains('iv-node-knowledge'))assistant.launch('cards');else if(button.classList.contains('iv-node-practice'))setMode('ide');}
    if(button.hasAttribute('data-iv-play'))document.getElementById('teacherPlay').click();
    if(button.hasAttribute('data-iv-sound')){const muted=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(muted));button.setAttribute('aria-label',muted?'声音已关闭，点击开启':'声音已开启，点击关闭');}
    if(button.hasAttribute('data-iv-fullscreen')){if(document.fullscreenElement)document.exitFullscreen?.();else surface.querySelector('.iv-video-frame').requestFullscreen?.();}
    if(button.dataset.ivZoom){scale=Math.max(30,Math.min(100,scale+Number(button.dataset.ivZoom)*10));surface.querySelector('[data-iv-scale]').textContent=scale+'%';surface.querySelector('.iv-video-art').style.setProperty('--zoom',scale/50);surface.querySelector('.iv-board-art').style.setProperty('--zoom',scale/50);}
    if(button.hasAttribute('data-iv-settings'))learning.showToast('可使用右侧学习助手整理本节内容');
    if(button.hasAttribute('data-iv-help'))learning.showToast('选择进度节点定位内容；通过右侧助手查看字幕与学习工具');
    if(button.classList.contains('iv-course-name'))document.querySelector('.fixed1030-lesson .lesson-directory-trigger')?.click();
  });
  assistant.showHome();viewChanged();
})();
