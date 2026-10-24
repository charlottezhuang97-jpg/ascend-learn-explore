/* Learning-node previews and local quizzes; no video time or execution claims. */
(() => {
  if(!document.body.classList.contains('fixed1030'))return;
  const progress=document.querySelector('.mindie-glass-progress'),A=window.AscendCompanion,L=window.AscendLearning;
  if(!progress||!A)return;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icons={knowledge:'<path d="M9 18h6M10 21h4M8 14a6 6 0 1 1 8 0c-1 .8-1 1.8-1 2H9c0-.2 0-1.2-1-2z"/>',code:'<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',quiz:'<path d="M5 22V3m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0"/>'};
  const types={knowledge:'重要知识点',code:'代码示例',quiz:'小测验'};
  const nodes=[
    {id:'concept',type:'knowledge',title:'模型与推理服务',text:'模型负责生成内容，MindIE 加载模型并提供推理接口。',diagram:['提示词','模型与推理服务','生成文本'],page:0},
    {id:'host-code',type:'code',title:'检查 NPU 与 Docker',file:0},
    {id:'roles-quiz',type:'quiz',title:'分清模型与推理服务',question:'本实验中，MindIE 的作用是什么？',choices:['代替用户输入提示词','加载模型并提供推理接口','作为存放权重的目录'],answer:1,explanation:'MindIE 是推理服务；模型、权重目录与提示词分别承担不同职责。'},
    {id:'mount',type:'knowledge',title:'主机路径与容器路径',text:'主机权重目录挂载到容器后，服务配置应使用容器内可访问的路径。',diagram:['主机权重目录','只读挂载','/home/weights/'],page:4},
    {id:'config-code',type:'code',title:'模型配置示例',file:5},
    {id:'path-quiz',type:'quiz',title:'权重路径怎么填',question:'权重已挂载到容器 /home/weights/，modelWeightPath 应填写哪里？',choices:['主机任意目录','浏览器下载目录','容器路径 /home/weights/'],answer:2,explanation:'服务运行在容器中，应填写容器内可访问的路径。主机路径与容器路径不能混用。'},
    {id:'response',type:'knowledge',title:'请求成功不只看状态码',text:'同时查看 HTTP 状态和响应内容；空结果不能算本次推理成功。',diagram:['POST /generate','HTTP 200','非空 text'],page:4},
    {id:'request-code',type:'code',title:'发送文本生成请求',file:7},
    {id:'logs-quiz',type:'quiz',title:'退出日志观察',question:'在 tail -f 中按 Ctrl+C，意味着什么？',choices:['只停止日志观察，后台服务仍运行','删除日志文件','停止并删除推理容器'],answer:0,explanation:'Ctrl+C 退出本次 tail 观察，不等于停止后台服务。停止服务需要单独操作与确认。'}
  ];
  const track=progress.querySelector('.mindie-board-track');
  track.classList.add('learning-node-track');
  track.innerHTML='<i aria-hidden="true"></i>'+nodes.map((n,i)=>'<button type="button" class="learning-node '+n.type+'" data-node-id="'+n.id+'" style="left:'+(6+i*11)+'%" aria-label="'+types[n.type]+'：'+n.title+'" aria-expanded="false" aria-controls="learningNodePreview"><svg viewBox="0 0 24 24" aria-hidden="true">'+icons[n.type]+'</svg></button>').join('');
  progress.querySelector('.mindie-progress-label').textContent='学习节点';
  progress.querySelector('.mindie-progress-line').classList.add('learning-node-scroll');
  const pop=document.createElement('section');pop.id='learningNodePreview';pop.className='learning-node-preview';pop.hidden=true;pop.setAttribute('role','dialog');pop.setAttribute('aria-label','学习节点预览');document.body.append(pop);
  let active=null,anchor=null,pinned=false,closeTimer;
  function hide(){clearTimeout(closeTimer);pop.hidden=true;anchor?.setAttribute('aria-expanded','false');pinned=false;}
  function position(){const b=anchor.getBoundingClientRect(),width=Math.min(360,innerWidth-24);pop.style.width=width+'px';pop.style.left=Math.max(12,Math.min(b.left+b.width/2-width/2,progress.getBoundingClientRect().right-width,innerWidth-width-12))+'px';pop.style.top=Math.max(12,b.top-pop.offsetHeight-10)+'px';}
  function show(n,b,pin=false){clearTimeout(closeTimer);anchor?.setAttribute('aria-expanded','false');active=n;anchor=b;pinned=pin;anchor.setAttribute('aria-expanded','true');
    let body;
    if(n.type==='knowledge')body='<p>'+esc(n.text)+'</p><div class="learning-node-diagram">'+n.diagram.map(x=>'<span>'+esc(x)+'</span>').join('<b aria-hidden="true">→</b>')+'</div><button type="button" data-node-preview="board">在白板中查看</button>';
    if(n.type==='code'){const step=window.MindIELab.steps[n.file];body='<small>'+esc(step.file)+' · '+esc(step.context)+'</small><pre><code>'+window.MindIEInferencePreview.highlightShell(step.code)+'</code></pre><p>'+esc(step.note)+'</p><button type="button" data-node-preview="ide">在 IDE 中查看</button>';}
    if(n.type==='quiz')body='<p>'+esc(n.question)+'</p><button type="button" data-node-preview="quiz">在 AI 学伴中作答 →</button>';
    pop.innerHTML='<header><span>'+types[n.type]+'</span><button type="button" data-node-preview="close" aria-label="关闭节点预览">×</button></header><h3>'+esc(n.title)+'</h3>'+body+'<small class="learning-node-source">学习节点示意 · 原视频时间待接入</small>';pop.hidden=false;position();
  }
  function delayedHide(){if(!pinned){clearTimeout(closeTimer);closeTimer=setTimeout(hide,200);}}
  for(const b of track.querySelectorAll('button')){
    const n=nodes.find(x=>x.id===b.dataset.nodeId);
    b.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')show(n,b);});
    b.addEventListener('pointerleave',delayedHide);
    b.addEventListener('focus',()=>show(n,b));
    b.addEventListener('blur',e=>{if(!pop.contains(e.relatedTarget)&&!track.contains(e.relatedTarget))delayedHide();});
    b.addEventListener('click',()=>{track.querySelector('i').style.width=b.style.left;if(n.type==='quiz'){hide();startQuiz(n);}else show(n,b,true);});
  }
  pop.addEventListener('pointerenter',()=>clearTimeout(closeTimer));pop.addEventListener('pointerleave',delayedHide);
  pop.addEventListener('focusout',e=>{if(!pop.contains(e.relatedTarget)&&!track.contains(e.relatedTarget)){pinned=false;delayedHide();}});
  pop.addEventListener('click',e=>{const action=e.target.closest('[data-node-preview]')?.dataset.nodePreview;if(!action)return;const n=active;if(action==='close'){hide();anchor?.focus({preventScroll:true});hide();return;}if(action==='quiz'){hide();startQuiz(n);}if(action==='board'){hide();L.setView('board');L.renderBoardPage(n.page);}if(action==='ide'){hide();L.setView('video');L.setVideoPerspective('ide');document.querySelector('.ide-tabs [data-mindie-step="'+n.file+'"]')?.click();L.showToast('已定位代码示例，未替换或运行代码');}});
  document.addEventListener('pointerdown',e=>{if(!pop.contains(e.target)&&!track.contains(e.target))hide();});
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!pop.hidden){const returnFocus=pop.contains(document.activeElement);hide();if(returnFocus)anchor?.focus({preventScroll:true});hide();e.preventDefault();e.stopImmediatePropagation();}},true);
  window.addEventListener('resize',hide);track.parentElement.addEventListener('scroll',hide);
  document.addEventListener('learning:floor-change',hide);
  new MutationObserver(()=>{if(document.body.dataset.fixedView==='ide')hide();}).observe(document.body,{attributes:true,attributeFilter:['data-fixed-view']});
  function quizMarkup(s){const q=nodes.find(n=>n.id===s.quiz),done=s.submitted,correct=done&&s.choice===q.answer;
    return '<section class="timeline-quiz" data-uac-tq-state="'+esc(JSON.stringify(s))+'"><header><span>随堂小测</span><b>'+esc(q.title)+'</b></header><p>'+esc(q.question)+'</p><div class="timeline-quiz-options" aria-label="选择一个答案">'+q.choices.map((text,i)=>'<button type="button" data-uac-tq-action="choose" data-uac-tq-choice="'+i+'" aria-pressed="'+(s.choice===i)+'" '+(done?'disabled':'')+'>'+String.fromCharCode(65+i)+'. '+esc(text)+'</button>').join('')+'</div>'+(done?'<div class="timeline-quiz-feedback '+(correct?'correct':'incorrect')+'" role="status"><b>'+(correct?'✓ 答对了':'✕ 再想一想')+'</b><p>'+esc(q.explanation)+'</p></div><button type="button" data-uac-tq-action="retry">'+(correct?'再练一次':'重新作答')+'</button>':'<button type="button" data-uac-tq-action="submit" '+(s.choice===null?'disabled':'')+'>提交答案</button>')+'<small>随堂练习，不计认证成绩。只在本对话保存答题记录。</small></section>';
  }
  function startQuiz(q){const s={quiz:q.id,choice:null,submitted:false,attempts:[]};const id=A.beginTool('我想做这道小测验：'+q.title+'。',quizMarkup(s));document.querySelector('[data-uac-message="'+id+'"]')?.scrollIntoView({block:'nearest'});}
  document.addEventListener('click',e=>{const b=e.target.closest('[data-uac-tq-action]');if(!b)return;const root=b.closest('[data-uac-tq-state]');let s;try{s=JSON.parse(root.dataset.uacTqState);}catch{return;}const q=nodes.find(n=>n.id===s.quiz&&n.type==='quiz');if(!q)return;const action=b.dataset.uacTqAction,id=Number(root.closest('[data-uac-message]').dataset.uacMessage);
    if(action==='choose'&&!s.submitted){const choice=Number(b.dataset.uacTqChoice);if(!Number.isInteger(choice)||choice<0||choice>=q.choices.length)return;s.choice=choice;}
    else if(action==='submit'&&!s.submitted&&Number.isInteger(s.choice)&&s.choice>=0&&s.choice<q.choices.length){s.submitted=true;s.attempts.push(s.choice);A.addToolMessage('user','<p>我选择 '+String.fromCharCode(65+s.choice)+'：'+esc(q.choices[s.choice])+'。</p>');A.updateToolMessage(id,quizMarkup(s));A.addToolMessage('assistant','<section class="timeline-quiz-feedback '+(s.choice===q.answer?'correct':'incorrect')+'"><b>'+(s.choice===q.answer?'✓ 答对了':'✕ 再想一想')+'</b><p>'+esc(q.explanation)+'</p><small>可以回到题目重新作答，或继续学习。</small></section>');return;}
    else if(action==='retry'){s.choice=null;s.submitted=false;}
    else return;
    A.updateToolMessage(id,quizMarkup(s));const updated=document.querySelector('[data-uac-message="'+id+'"]');if(action==='choose')updated?.querySelector('[data-uac-tq-choice="'+s.choice+'"]')?.focus({preventScroll:true});else updated?.scrollIntoView({block:'nearest'});
  });
})();

