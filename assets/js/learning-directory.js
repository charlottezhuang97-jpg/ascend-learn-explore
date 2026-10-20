(() => {
  const params=new URLSearchParams(location.search);
  const key=params.get('course')||'architecture';
  const catalog=window.AscendCourseCatalog;
  const legacy={title:params.get('title')||'昇腾 AI 处理器架构',stages:[
    {title:'认识昇腾计算体系',units:[{number:1,title:'昇腾处理器架构',lessons:[['课程','昇腾处理器的逻辑结构拆解','18:40'],['课程','Cube、Vector 与 Scalar 的协作','22 分钟'],['实践','完成 CANN 环境检查','26 分钟']]},{number:2,title:'CANN 软件栈',lessons:[['课程','训练任务的执行链路','24 分钟'],['实践','追踪一次任务的下发路径','32 分钟']]}]},
    {title:'理解计算与数据流',units:[{number:3,title:'计算与内存',lessons:[['课程','片上内存与数据搬运','26 分钟'],['课程','流水执行与计算单元','28 分钟'],['实践','观察算子输入与输出','30 分钟']]}]}
  ]};
  const course=catalog[key]||legacy;
  const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toSeconds=text=>text.includes(':')?text.split(':').reduce((total,n)=>total*60+Number(n),0):parseInt(text,10)*60;
  const formatTime=seconds=>`${Math.floor(seconds/60).toString().padStart(2,'0')}:${(seconds%60).toString().padStart(2,'0')}`;
  let unitCounter=0;
  const stages=course.stages.map((stage,stageIndex)=>({...stage,index:stageIndex,units:stage.units.map(raw=>{
    unitCounter++;
    const unit=Array.isArray(raw)?{number:unitCounter,title:raw[1].replace(/^单元\s*\d+[：:]\s*/,''),lessons:[raw]}:raw;
    return {...unit,lessons:unit.lessons.map(([kind,title,duration],index)=>({id:`${unit.number}-${index+1}`,number:index+1,kind,title,seconds:toSeconds(duration),stage:stageIndex,unit:unit.number,unitTitle:unit.title}))};
  })}));
  const lessons=stages.flatMap(stage=>stage.units.flatMap(unit=>unit.lessons));
  const currentTitle=document.getElementById('videoLessonTitle').textContent;
  const requested=lessons.find(lesson=>lesson.id===params.get('unit'));
  const current=requested||lessons.find(lesson=>lesson.title===currentTitle)||lessons[0];
  // The existing preview video is 18:40 unless a specific lesson was selected.
  if(!requested)current.seconds=1120;
  document.querySelectorAll('.lesson-directory-trigger').forEach(button=>{
    button.querySelector('strong').textContent=current.title;
    button.querySelector('span').textContent=`课节 ${current.number}`;
    button.title=`查看课程目录：${current.title}`;
  });
  const room=document.getElementById('videoWorkspace');room.dataset.durationSeconds=current.seconds;
  document.querySelector('.timeline-duration').textContent=formatTime(current.seconds);
  document.getElementById('videoCurrentTime').textContent=`00:00 / ${formatTime(current.seconds)}`;
  const videoMeta=document.querySelector('.video-meta>span');videoMeta.firstChild.textContent=`课节 ${current.number} · `;
  const storageKey=`ascend-lesson-progress:${key}`;
  let progress={};try{progress=JSON.parse(localStorage.getItem(storageKey)||'{}')||{};}catch{}
  const getProgress=lesson=>Math.min(100,Math.max(0,Math.round(Number(progress[lesson.id])||0)));
  const hasPractice=lesson=>lesson.kind==='实践'||['数据并行与梯度同步','昇腾处理器的逻辑结构拆解'].includes(lesson.title);
  const aggregate=list=>Math.round(list.reduce((sum,lesson)=>sum+getProgress(lesson),0)/list.length);
  const panel=document.createElement('section');panel.id='lessonDirectory';panel.className='lesson-directory';panel.hidden=true;panel.setAttribute('aria-label','课程模块和课节目录');
  panel.innerHTML=`<header class="lesson-directory-head"><div><span>课程目录</span><h2>${escape(course.title)}</h2></div><button type="button" data-directory-close aria-label="关闭课程目录">×</button></header><div class="lesson-directory-location">当前位置：模块 ${current.stage+1} / 单元 ${current.unit} / 课节 ${current.number}<button type="button" data-directory-current>定位当前课节</button></div><div class="lesson-directory-columns"><span>模块 / 单元 / 课节</span><span>进度</span><span>实践</span><span>时长</span></div><div class="lesson-directory-scroll">${stages.map(stage=>{
    const all=stage.units.flatMap(unit=>unit.lessons);
    return `<details class="directory-stage" ${stage.index===current.stage?'open':''}><summary><span class="directory-name">模块 ${stage.index+1} · ${escape(stage.title)}</span><span class="directory-progress" data-directory-progress="${all.map(l=>l.id).join(',')}">${aggregate(all)}%</span><span class="directory-practice">${all.filter(hasPractice).length} 项</span><time>${Math.round(all.reduce((n,l)=>n+l.seconds,0)/60)} 分</time></summary><div class="directory-stage-content">${stage.units.map(unit=>`<details class="directory-unit" ${unit.number===current.unit?'open':''}><summary><span class="directory-name">单元 ${unit.number} · ${escape(unit.title)}</span><span class="directory-progress" data-directory-progress="${unit.lessons.map(l=>l.id).join(',')}">${aggregate(unit.lessons)}%</span><span class="directory-practice">${unit.lessons.filter(hasPractice).length} 项</span><time>${Math.round(unit.lessons.reduce((n,l)=>n+l.seconds,0)/60)} 分</time></summary><ol>${unit.lessons.map(lesson=>{
      const url=new URL(location.href);url.searchParams.set('unit',lesson.id);url.searchParams.delete('v');url.searchParams.set('view',room.hidden?'board':'video');
      return `<li><a href="${escape(url.pathname+url.search)}" class="directory-lesson ${lesson.id===current.id?'is-current':''}" ${lesson.id===current.id?'aria-current="page"':''} data-directory-lesson="${lesson.id}"><span class="directory-lesson-title"><span class="directory-state" aria-hidden="true">${lesson.id===current.id?'▶':getProgress(lesson)===100?'✓':'○'}</span><span>课节 ${lesson.number} · ${escape(lesson.title)}${lesson.id===current.id?'<b>当前</b>':''}</span></span><span class="directory-progress" data-directory-progress="${lesson.id}">${getProgress(lesson)}%</span><span class="directory-practice ${hasPractice(lesson)?'has-practice':''}">${hasPractice(lesson)?'含实践':'无实践'}</span><time>${formatTime(lesson.seconds)}</time></a></li>`;
    }).join('')}</ol></details>`).join('')}</div></details>`;
  }).join('')}</div><footer class="lesson-directory-footer">${stages.length} 个模块 · ${unitCounter} 个单元 · ${lessons.length} 个课节<span>进度按本机学习位置记录</span></footer>`;
  document.body.append(panel);
  let trigger=null;
  function placePanel(){if(!trigger)return;const rect=trigger.getBoundingClientRect();const width=Math.min(780,innerWidth-24);panel.style.width=`${width}px`;panel.style.left=`${Math.min(Math.max(12,rect.left),innerWidth-width-12)}px`;panel.style.top=`${rect.bottom+10}px`;panel.style.maxHeight=`${Math.max(200,innerHeight-rect.bottom-24)}px`;}
  function close(returnFocus=false){panel.hidden=true;document.querySelectorAll('.lesson-directory-trigger').forEach(button=>button.setAttribute('aria-expanded','false'));if(returnFocus)trigger?.focus();}
  function locate(){const row=panel.querySelector('[aria-current="page"]');let parent=row?.parentElement;while(parent&&parent!==panel){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement;}row?.scrollIntoView({block:'center'});}
  document.querySelectorAll('.lesson-directory-trigger').forEach(button=>button.addEventListener('click',()=>{
    if(!panel.hidden&&trigger===button){close();return;}
    trigger=button;panel.hidden=false;document.querySelectorAll('.lesson-directory-trigger').forEach(item=>item.setAttribute('aria-expanded',String(item===button)));placePanel();locate();panel.querySelector('[aria-current="page"]')?.focus({preventScroll:true});
    panel.querySelectorAll('a').forEach(link=>{const url=new URL(link.href);url.searchParams.set('view',room.hidden?'board':'video');link.href=url.pathname+url.search;});
  }));
  panel.querySelector('[data-directory-close]').addEventListener('click',()=>close(true));
  panel.querySelector('[data-directory-current]').addEventListener('click',locate);
  panel.querySelector('[aria-current="page"]').addEventListener('click',event=>{event.preventDefault();close(true);});
  document.addEventListener('pointerdown',event=>{if(!panel.hidden&&!panel.contains(event.target)&&!event.target.closest('.lesson-directory-trigger'))close();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){event.preventDefault();close(true);}});
  window.addEventListener('resize',()=>{if(!panel.hidden)placePanel();});
  document.addEventListener('learning:time-update',event=>{
    progress[current.id]=Math.max(getProgress(current),Math.round(event.detail.seconds/current.seconds*100));try{localStorage.setItem(storageKey,JSON.stringify(progress));}catch{}
    panel.querySelectorAll('[data-directory-progress]').forEach(node=>{const ids=node.dataset.directoryProgress.split(',');node.textContent=`${aggregate(lessons.filter(l=>ids.includes(l.id)))}%`;});
  });
  if(params.get('view')){document.getElementById('modeOverlay').hidden=true;document.querySelector(`.learning-mode-tabs [data-view="${params.get('view')==='board'?'board':'video'}"]`)?.click();}
})();
