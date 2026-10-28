/* Course content adapter: consumes the existing learning room, never a new page shell. */
(() => {
  const params=new URLSearchParams(location.search);
  if(params.get('course')!=='mindie')return;
  const api=window.AscendLearning,lab=window.MindIELab;
  const $=id=>document.getElementById(id);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  document.body.classList.add('mindie-course');
  document.title='生成式AI通用知识 · 白板与 IDE 学习';
  $('courseName').textContent='生成式AI通用知识';
  let step=0,page=0,boardTeacher=false;
  let boardTypingGeneration=0;
  function revealBoardPoints(canvas){
    const generation=++boardTypingGeneration;
    const targets=[...canvas.querySelectorAll('.board-page-intro h2,.board-page-intro p')];
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const lines=targets.map(target=>{const text=target.textContent;target.setAttribute('aria-label',text);target.setAttribute('aria-live','off');target.classList.add('mindie-type-line');target.innerHTML=`<span class="mindie-type-reserve" aria-hidden="true">${esc(text)}</span><span class="mindie-type-output"></span>`;return{target,text,output:target.querySelector('.mindie-type-output')};});
    canvas.classList.add('mindie-board-revealing');
    (async()=>{for(const {target,text,output} of lines){if(generation!==boardTypingGeneration)return;target.classList.add('mindie-is-typing');for(const char of Array.from(text)){if(generation!==boardTypingGeneration||!target.isConnected)return;output.textContent+=char;await new Promise(resolve=>setTimeout(resolve,32));}target.classList.remove('mindie-is-typing');await new Promise(resolve=>setTimeout(resolve,100));}if(generation===boardTypingGeneration)canvas.classList.remove('mindie-board-revealing');})();
  }
  let checks=[];try{checks=JSON.parse(localStorage.getItem('mindie-integrated-checks')||'[]');if(!Array.isArray(checks))checks=[];}catch{}
  const topics=['生成式AI概述','昇腾AI基础软硬件平台','生成式AI在昇腾平台上的应用案例','生成式AI展望'];
  const pages=[
    {title:topics[0],kicker:'理论篇 · 知识点 01',description:'理解生成式 AI 的输入、模型与生成结果，再进入文本生成推理实践。',caption:'先建立整体认识：模型负责生成，推理服务负责加载模型并提供可调用接口。',nodes:[['输入','提示词 prompt'],['生成式模型','学习数据中的规律'],['生成结果','文本 / 图片 / 代码']],note:'白板为学习引导示意；原始理论视频与课件待接入。'},
    {title:topics[1],kicker:'理论篇 · 知识点 02',description:'分清硬件、基础软件、推理引擎和模型的职责。',caption:'本手册使用 Atlas 800I A2、MindIE 2.0.RC1 和 Qwen2-7B，不要把模型与推理引擎混为一谈。',nodes:[['Atlas 800I A2','计算设备'],['CANN / ATB','基础软件'],['MindIE','推理服务'],['Qwen2-7B','模型权重']],note:'版本与硬件取自上传的文本生成实验手册。'},
    {title:topics[2],kicker:'理论篇 · 知识点 03',description:'用文本生成这个已提供的实验，理解从应用请求到模型推理的链路。',caption:'准备环境与权重，部署推理服务，再让应用调用接口并取得返回文本。',nodes:[['准备','设备 / 镜像 / 权重'],['部署','容器 / 配置 / 服务'],['调用','POST /generate'],['结果','检查返回 text']],note:'课程目录还包含视图生成分支，具体实验内容待对应手册接入。'},
    {title:topics[3],kicker:'理论篇 · 知识点 04',description:'保留原课程的“生成式AI展望”主题，待正式教学素材接入。',caption:'课程路径：理论学习 → 文本与视图生成实践 → 生成式AI通用知识微认证。',nodes:[['理论篇','4 个知识主题'],['实践篇','文本 / 视图生成'],['微认证','生成式AI通用知识']],note:'当前材料不含本节正式内容或认证规则，不虚构逐字稿和考试结果。'},
    {title:'文本生成推理快速入门',kicker:'实践篇 · 基于 MindIE 的生成式 AI 入门',description:'本实验在 Atlas 800I A2 上准备 Qwen2-7B，经 MindIE 的 /generate 接口获取文本。',caption:'进入 IDE 后，按八步核对主机、容器和模型服务；注意不同步骤的执行位置。',nodes:[['提示词','prompt'],['MindIE 服务',':1025 /generate'],['Qwen2-7B','/home/weights/'],['生成文本','text']],note:'来自《基于MindIE的文本生成推理实践》，保留手册实验版本。'}
  ];
  function title(text,kind='课节'){document.querySelectorAll('.lesson-directory-trigger').forEach(b=>{b.querySelector('strong').textContent=text;b.querySelector('span').textContent=kind;});}
  const boardPages=[...document.querySelectorAll('[data-board-page]')];
  window.MindIERenderBoard=index=>{
    page=Math.max(0,Math.min(4,index));const p=pages[page];
    boardPages.forEach((n,i)=>{n.hidden=i!==page;n.classList.remove('mindie-board-revealing');n.classList.add('media-ready');});
    const canvas=boardPages[page];canvas.innerHTML=`<div class="board-page-intro"><span>${p.kicker}</span><h2>${p.title}</h2><p>${p.description}</p></div><figure class="embedded-board-media mindie-board-diagram"><figcaption><span>课堂图解</span><strong>${page===4?'文本生成推理链路':'理解当前知识点'}</strong></figcaption><div class="mindie-chain">${p.nodes.map(([name,detail],i)=>`${i?'<span aria-hidden="true">→</span>':''}<div><b>${name}</b><small>${detail}</small></div>`).join('')}</div><p>${p.note}</p>${page===4?'<button type="button" class="mindie-practice-link" data-mindie-action="practice">查看 IDE 实践 →</button>':''}</figure>`;
    canvas.scrollTop=0;revealBoardPoints(canvas);
    $('boardPageValue').textContent=`${page+1} / 5`;$('previousBoardPage').disabled=page===0;$('nextBoardPage').disabled=page===4;
    document.querySelector('.learning-anchor>span').lastChild.textContent=`板书 ${String(page+1).padStart(2,'0')} · ${page===4?'文本生成':p.title}`;
    $('boardSubtitle').textContent=p.caption;title(p.title,page===4?'实践篇':`课节 ${page+1}`);
    const caption=document.querySelector('.mindie-board-mini .mini-video-caption span:last-child');if(caption)caption.textContent=p.title;
    document.querySelectorAll('[data-mindie-page]').forEach(b=>b.classList.toggle('is-current',Number(b.dataset.mindiePage)===page));
  };
  function directoryMarkup(){
    const row=(label,action,progress='—',practice='—')=>`<button type="button" class="directory-lesson" ${action}><span class="directory-lesson-title"><span class="directory-state">▷</span><span>${label}</span></span><span class="directory-progress">${progress}</span><span class="directory-practice">${practice}</span><time title="原始时长未提供">待接入</time></button>`;
    const branch=(name,prefix,available)=>`<details class="directory-unit" ${available?'open':''}><summary><span class="directory-name">${name}生成推理快速入门</span><span></span><span></span><time>—</time></summary><ol>${row('理论视频',available?'data-mindie-page="4"':`data-mindie-missing="${name}生成理论视频"`)}${row('实践视频',available?'data-mindie-action="practice-video"':`data-mindie-missing="${name}生成实践视频"`,'—','含实践')}${row('课件',`data-mindie-missing="《${name}生成推理快速入门》课件"`)}${row(`实验手册：基于MindIE的${name}生成推理实践`,available?'data-mindie-action="practice"':`data-mindie-missing="${name}生成实验手册"`,available?`${checks.length}/8`:'—','含实践')}</ol></details>`;
    return `<details class="directory-stage" open><summary><span class="directory-name">一、理论篇：生成式AI通用知识</span><span class="directory-progress">—</span><span></span><time>—</time></summary><div class="directory-stage-content">${topics.map((t,i)=>row(`${i+1}. ${t}`,`data-mindie-page="${i}"`)).join('')}${row('课件：《生成式AI通用知识》','data-mindie-missing="《生成式AI通用知识》课件"')}</div></details><details class="directory-stage" open><summary><span class="directory-name">二、实践篇：基于MindIE的生成式AI入门</span><span></span><span></span><time>—</time></summary><div class="directory-stage-content">${branch('文本','text',true)}${branch('视图','view',false)}</div></details>${row('三、微认证：生成式AI通用知识','data-mindie-missing="生成式AI通用知识微认证考试入口与规则"')}`;
  }
  const directory=document.createElement('section');directory.id='lessonDirectory';directory.className='lesson-directory mindie-directory';directory.hidden=true;directory.setAttribute('aria-label','课程目录');
  directory.innerHTML='<header class="lesson-directory-head"><div><span>课程目录</span><h2>生成式AI通用知识</h2></div><button type="button" data-mindie-close-directory aria-label="关闭课程目录">×</button></header><div class="lesson-directory-columns"><span>模块 / 课节 / 资源</span><span>核对</span><span>实践</span><span>时长</span></div><div class="lesson-directory-scroll"></div><footer class="lesson-directory-footer">理论 → 实践 → 微认证<span>不虚构时长与完成状态</span></footer>';
  document.body.append(directory);
  const outline=$('lessonOutline');outline.querySelector('header strong').textContent='课程目录';outline.querySelector('header span').textContent='生成式 AI 通用知识';
  outline.querySelector('nav').innerHTML=directoryMarkup();$('toggleLessonOutline').textContent='☷ 课程目录';
  function refreshDirectory(){directory.querySelector('.lesson-directory-scroll').innerHTML=directoryMarkup();outline.querySelector('nav').innerHTML=directoryMarkup();}
  refreshDirectory();
  let directoryTrigger;
  function closeDirectory(){directory.hidden=true;document.querySelectorAll('.lesson-directory-trigger').forEach(b=>b.setAttribute('aria-expanded','false'));}
  document.querySelectorAll('.lesson-directory-trigger').forEach(b=>b.addEventListener('click',()=>{const open=directory.hidden||directoryTrigger!==b;closeDirectory();if(!open)return;directoryTrigger=b;const r=b.getBoundingClientRect(),w=Math.min(780,innerWidth-24);directory.style.width=`${w}px`;directory.style.left=`${Math.max(12,Math.min(r.left,innerWidth-w-12))}px`;directory.style.top=`${r.bottom+8}px`;directory.style.maxHeight=`${innerHeight-r.bottom-20}px`;directory.hidden=false;b.setAttribute('aria-expanded','true');}));
  document.addEventListener('pointerdown',e=>{if(!directory.hidden&&!directory.contains(e.target)&&!e.target.closest('.lesson-directory-trigger'))closeDirectory();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDirectory();});
  const boardArea=document.querySelector('.board-area');
  const back=document.createElement('button');back.type='button';back.className='mindie-board-back';back.textContent='← 回到讲解';back.dataset.mindieAction='board-teacher';document.querySelector('.board-header').insertBefore(back,document.querySelector('.board-tools'));
  const bigVideo=document.createElement('section');bigVideo.className='mindie-board-video';bigVideo.hidden=true;bigVideo.setAttribute('aria-label','白板课程的视频讲解');bigVideo.innerHTML='<div class="video-player"><div class="video-meta"><span>文本生成推理快速入门 · 视频示意</span><button type="button" class="enter-ide-practice" data-mindie-action="board-canvas">查看白板 →</button></div><div class="video-stage"><img src="assets/images/video-teacher-cover.png" alt="课程视频封面"><button type="button" class="mindie-video-play" data-mindie-action="video-placeholder" aria-label="播放讲解视频"></button><p class="teacher-subtitle">先看讲解，点击视频外区域即可查看白板。</p></div></div>';
  boardArea.append(bigVideo);
  const mini=document.createElement('div');mini.className='ide-mini-video mindie-board-mini';mini.setAttribute('aria-label','可拖拽的白板悬浮讲解');mini.innerHTML='<button type="button" class="mini-video-drag-handle" aria-label="拖动悬浮视频，也可用方向键移动" title="拖动视频"><span></span></button><button type="button" class="mini-video-close" data-mindie-action="close-board-video" aria-label="关闭悬浮视频">×</button><button type="button" class="mini-video-poster" data-mindie-action="board-teacher" aria-label="放大讲解视频"><img src="assets/images/video-teacher-cover.png" alt="讲解视频封面"></button><div class="mini-video-caption"><span>讲解示意</span><span>点击放大 · 当前白板位置保留</span></div>';
  boardArea.append(mini);
  const footer=document.querySelector('.board-footer');footer.insertAdjacentHTML('beforeend','<div class="mindie-board-track" aria-label="学习节点；原视频时间待接入"><i></i><button type="button" data-mindie-page="0" title="重点：生成式 AI 概述" aria-label="重点：生成式 AI 概述">♧</button><button type="button" data-mindie-page="4" title="代码：文本推理链路" aria-label="代码：文本推理链路">&lt;/&gt;</button><button type="button" data-mindie-action="practice" title="实践：进入 IDE" aria-label="实践：进入 IDE">⚑</button></div>');
  document.querySelectorAll('.mindie-board-track button').forEach((b,i)=>{b.innerHTML=document.querySelectorAll('.teacher-timeline .timeline-marker')[i].innerHTML;});
  const progress=document.createElement('nav');progress.className='mindie-glass-progress';progress.setAttribute('aria-label','理论学习进度与实验入口');
  progress.innerHTML='<span class="mindie-progress-label">理论学习</span><div class="mindie-progress-line"></div><button type="button" class="mindie-lab-entry" data-mindie-action="practice" data-mindie-lab-entry aria-label="进入文本生成实验实践" title="进入实验，白板位置会保留"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M8 15h8M10 17h.01M14 18h.01"/></svg><span>实验</span><span aria-hidden="true">→</span></button>';
  progress.querySelector('.mindie-progress-line').append(document.querySelector('.mindie-board-track'));boardArea.append(progress);
  function placeProgress(){if($('learningRoom').hidden)return;const r=$('whiteboard').getBoundingClientRect();boardArea.style.setProperty('--mindie-progress-left',`${r.left+20}px`);boardArea.style.setProperty('--mindie-progress-width',`${Math.max(0,r.width-40)}px`);}
  new ResizeObserver(placeProgress).observe($('whiteboard'));window.addEventListener('resize',placeProgress);document.addEventListener('learning:view-change',placeProgress);placeProgress();
  function boardPerspective(teacher){boardTeacher=teacher;$('learningRoom').classList.toggle('board-teacher-mode',teacher);bigVideo.hidden=!teacher;mini.hidden=teacher;boardArea.classList.toggle('mindie-board-mini-open',!teacher);back.hidden=teacher;$('boardToVideo').hidden=teacher;}
  document.querySelector('.whiteboard').addEventListener('click',()=>{if(boardTeacher)boardPerspective(false);});
  $('boardToVideo').addEventListener('click',e=>{e.stopImmediatePropagation();api.setView('board');boardPerspective(true);},true);
  $('boardToVideo').lastChild.textContent='查看视频讲解';$('boardToVideo').removeAttribute('data-time');
  $('openDocument').lastChild.textContent='实验手册';
  $('openDocument').addEventListener('click',e=>{e.stopImmediatePropagation();info('实验手册 · 内容依据','实验命令、路径、配置与请求来自上传的《基于MindIE的文本生成推理实践》。容器名按后文统一为 qwen，JSON 片段修复了引号与尾逗号，仅用于合并字段。设备编号需对照实际环境。');},true);
  const handle=mini.querySelector('.mini-video-drag-handle');let drag;
  function move(left,top){mini.style.left=`${Math.max(8,Math.min(left,boardArea.clientWidth-mini.offsetWidth-8))}px`;mini.style.top=`${Math.max(76,Math.min(top,boardArea.clientHeight-mini.offsetHeight-76))}px`;}
  handle.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,left:mini.offsetLeft,top:mini.offsetTop};handle.setPointerCapture(e.pointerId);mini.classList.add('is-dragging');e.preventDefault();});
  handle.addEventListener('pointermove',e=>{if(drag)move(drag.left+e.clientX-drag.x,drag.top+e.clientY-drag.y);});
  for(const type of ['pointerup','pointercancel'])handle.addEventListener(type,()=>{drag=null;mini.classList.remove('is-dragging');});
  handle.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();if(e.key==='Home')move(24,90);else move(mini.offsetLeft+(e.key==='ArrowLeft'?-12:e.key==='ArrowRight'?12:0),mini.offsetTop+(e.key==='ArrowUp'?-12:e.key==='ArrowDown'?12:0));});
  window.addEventListener('resize',()=>{if(!mini.hidden)move(mini.offsetLeft,mini.offsetTop);closeDirectory();});
  const infoDialog=document.createElement('dialog');infoDialog.className='mindie-info-dialog';document.body.append(infoDialog);
  function info(heading,text){infoDialog.innerHTML=`<form method="dialog"><button aria-label="关闭">×</button></form><h2>${esc(heading)}</h2><p>${esc(text)}</p>`;infoDialog.showModal();}
  function showExperimentCompletion(){
    info('文本生成推理实验 · 阶段回顾',`已到达第 8 步，自核对 ${checks.length}/8 步。当前为页面演示，不代表真实设备运行或实验通过。`);
    infoDialog.insertAdjacentHTML('beforeend','<section class="mindie-next-experiment"><span>下一实验</span><h3>视图生成推理快速入门</h3><p><b>实验名称：</b>基于 MindIE 的视图生成推理实践</p><p><b>实验描述：</b>把本次熟悉的模型准备、服务部署与接口调用思路，继续应用到视图生成推理。</p><small>课程目录中已列出该实验；对应课件、视频和操作手册尚未接入，具体步骤与命令暂不虚构。</small><button type="button" data-mindie-action="open-next-experiment">查看第二个实验</button></section>');
  }
  api.loadFiles(Object.fromEntries(lab.steps.map(s=>[s.file,s.code])));
  const explorer=document.querySelector('.ide-explorer');const oldJump=$('fileVideoJump');
  explorer.querySelectorAll('.folder,[data-ide-file]').forEach(n=>n.remove());
  const files=document.createElement('div');files.className='mindie-lab-files';files.innerHTML='<strong class="folder open">⌄ MINDIE-TEXT-LAB</strong>'+lab.steps.map((s,i)=>`<button type="button" class="ide-file" data-mindie-step="${i}" data-ide-file="${s.file}"><span>${String(i+1).padStart(2,'0')}</span> ${s.file}</button>`).join('');explorer.insertBefore(files,oldJump.parentElement);
  document.querySelector('.ide-tabs').innerHTML=lab.steps.map((s,i)=>`<button type="button" role="tab" aria-selected="false" data-mindie-step="${i}" data-ide-file="${s.file}">${s.file}</button>`).join('');
  document.querySelector('.ide-environment small').innerHTML='<i></i> Atlas 800I A2 · MindIE 2.0.RC1 · 演示未连接';
  $('runCode').textContent='▷ 运行示例';$('runCode').title='展示手册预期结果，不在真实 NPU 执行';
  document.querySelector('.ide-stop').hidden=true;
  $('fileVideoTooltip').textContent='视频节点 · 时间待接入';oldJump.setAttribute('aria-label','展开当前步骤讲解视频；时间待接入');
  document.querySelector('.timeline-duration').textContent='--:--';
  const markerSteps=[0,3,7];document.querySelectorAll('.timeline-marker').forEach((b,i)=>{b.removeAttribute('data-seek');b.dataset.mindieStep=markerSteps[i];b.title=`${['重点','代码','实践'][i]} · ${lab.steps[markerSteps[i]].title}（时间待接入）`;b.setAttribute('aria-label',b.title);b.addEventListener('click',e=>{e.stopImmediatePropagation();selectStep(markerSteps[i],true);},true);});
  function renderOutput(showExample=false){const s=lab.steps[step];$('ideOutput').innerHTML=`<div class="mindie-ide-instruction"><b>步骤 ${step+1}/8 · ${s.title}</b><span>${s.context} · ${s.source}</span></div><p class="mindie-step-goal">${esc(s.action)}</p>${showExample?`<pre class="mindie-example-output">${esc(s.output)}</pre><small>手册示例 · 非真实执行结果</small>`:`<p>${esc(s.expected)}</p>`}<div class="mindie-lab-controls"><button type="button" data-mindie-action="check-step">${checks.includes(s.id)?'✓ 已自核对':'我已对照核对'}</button><button type="button" data-mindie-action="step-note">注意事项</button><button type="button" data-mindie-action="next-step">${step===7?'查看实验回顾':'下一步 →'}</button></div>`;}
  function selectStep(index,enter=false){step=Math.max(0,Math.min(7,index));const s=lab.steps[step];window.MindIECurrentStep=s;if(enter){api.setView('video');api.setVideoPerspective('ide');}api.openIdeFile(s.file,s.focus);
    document.querySelectorAll('[data-mindie-step]').forEach(b=>{const active=Number(b.dataset.mindieStep)===step;b.classList.toggle('active',active);if(b.getAttribute('role')==='tab')b.setAttribute('aria-selected',String(active));});
    $('timelineCurrentTime').textContent=`节点 ${String(step+1).padStart(2,'0')}`;$('miniVideoTime').textContent=`步骤 ${step+1}`;$('videoCurrentTime').textContent='原视频待接入';$('videoPlayed').style.width=`${(step+1)/8*100}%`;
    $('ideLiveSubtitle').textContent=s.goal;$('ideMiniVideo').querySelector('.mini-video-caption span:last-child').textContent=s.goal;
    $('ideAssistTime').textContent=`步骤 ${step+1}`;$('ideAssistTopic').textContent=s.title;$('ideAssistFile').textContent=`${s.file} · ${s.context}`;
    $('ideAssistMessages').innerHTML=`<div class="ide-assist-message assistant"><span>基于手册的引导示例</span><p>${esc(s.note)}</p><p>预期：${esc(s.expected)}</p></div>`;
    renderOutput();title('文本生成推理快速入门 · 实践视频','实践篇');
  }
  document.addEventListener('mindie:preview-output',()=>{renderOutput(true);api.showToast('手册运行示例，未连接实际 NPU');});
  document.addEventListener('mindie:video-node',e=>{const m=String(e.detail.time).match(/节点\s*(\d+)/);selectStep(m?Number(m[1])-1:step,true);});
  document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.mindiePage!==undefined){api.setView('board');api.renderBoardPage(Number(b.dataset.mindiePage));boardPerspective(false);closeDirectory();$('lessonOutline').hidden=true;return;}
    if(b.dataset.mindieStep!==undefined){selectStep(Number(b.dataset.mindieStep));return;}
    if(b.dataset.mindieMissing){closeDirectory();info(b.dataset.mindieMissing,'按上传课程目录保留入口。本次未提供该资源或认证规则，待正式内容接入，不伪造教学内容和通过结果。');return;}
    const action=b.dataset.mindieAction;
    if(action==='open-next-experiment'){infoDialog.close();const trigger=document.querySelector('.lesson-directory-trigger');trigger?.click();const nextBranch=[...directory.querySelectorAll('.directory-unit')].find(branch=>branch.textContent.includes('视图生成'));if(nextBranch){nextBranch.open=true;nextBranch.scrollIntoView({block:'nearest'});}return;}
    if(action==='practice'){selectStep(step,true);if(b.hasAttribute('data-mindie-lab-entry')){api.showToast('已进入文本生成实验：按左侧八步操作，并对照手册核对结果');$('ideEditor').focus();}}
    if(action==='practice-video'){selectStep(0);api.setView('video');api.setVideoPerspective('teacher');}
    if(action==='board-teacher')boardPerspective(true);
    if(action==='board-canvas')boardPerspective(false);
    if(action==='close-board-video'){mini.hidden=true;boardArea.classList.remove('mindie-board-mini-open');}
    if(action==='video-placeholder')api.showToast('当前为上传封面示意；原始视频待接入');
    if(action==='close-directory')closeDirectory();
    if(b.hasAttribute('data-mindie-close-directory'))closeDirectory();
    if(action==='step-note')info('手册依据与注意事项',lab.steps[step].note+' '+lab.steps[step].trouble);
    if(action==='check-step'){const id=lab.steps[step].id;checks=checks.includes(id)?checks.filter(x=>x!==id):[...checks,id];try{localStorage.setItem('mindie-integrated-checks',JSON.stringify(checks));}catch{}renderOutput();refreshDirectory();}
    if(action==='next-step'){if(step<7)selectStep(step+1);else showExperimentCompletion();}
    if(action==='practice'||action==='practice-video'){closeDirectory();outline.hidden=true;}
  });
  document.querySelectorAll('.learning-mode-tabs').forEach(nav=>nav.setAttribute('aria-label','学习环节'));
  document.querySelectorAll('.learning-mode-tabs [data-view="board"]').forEach(b=>{b.textContent='理论学习';b.addEventListener('click',()=>{boardPerspective(false);api.renderBoardPage(page===4?0:page);});});
  document.querySelectorAll('.learning-mode-tabs [data-view="video"]').forEach(b=>{b.textContent='实践';b.addEventListener('click',()=>selectStep(step,true));});
  document.addEventListener('learning:view-change',()=>document.querySelectorAll('.learning-mode-tabs button').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('active')))));
  document.querySelectorAll('.ide-assist-suggestions button').forEach((b,i)=>{b.textContent=i?'没看到预期结果怎么办？':'这一步在哪里执行？';b.dataset.assistQuestion=b.textContent;});
  document.querySelector('#chatPanel .companion-label').textContent='生成式AI通用知识';
  document.querySelectorAll('#chatPanel>p')[1].textContent='保留白板学习方式：从课程目录选择理论或实践资源。查看讲解时，点击视频外区域即可回到白板，视频变为可拖动小窗。';
  document.querySelectorAll('#chatPanel>p')[2].textContent='文本生成实验手册已整理为八步，实践代码在现有 IDE 中查看与编辑。示例结果不等同于真实 NPU 运行。';
  window.MindIEStudyData={course:'生成式AI通用知识',chapter:'基于MindIE的文本生成推理实践',outline:[['理论篇','生成式AI概述、昇腾AI基础软硬件平台、应用案例与展望。'],['实践篇','文本生成与视图生成推理快速入门；当前已提供文本生成手册。'],['微认证','理论与实验完成后衔接生成式AI通用知识微认证。']],points:lab.steps.map((s,i)=>[s.title,s.goal,`节点${i+1}`,'video',4]),transcript:[],cards:[['modelWeightPath 应使用哪个路径？','服务在容器内运行，使用已挂载的 /home/weights/，而不是主机目录。'],['如何确认服务启动？','查看真实服务日志中的 Daemon start success!，再发送接口请求。']]};
  // Do not manufacture transcript timing when only a Word manual is supplied.
  document.querySelectorAll('[data-assist-resource="quiz"] small').forEach(n=>n.textContent='检验容器路径与服务调用的理解');
  selectStep(0);api.renderBoardPage(0);$('modeOverlay').hidden=true;
  if(params.get('view')==='video'){api.setView('video');api.setVideoPerspective('teacher');}else{api.setView('board');boardPerspective(false);}
})();
