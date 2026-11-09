/* Keep the learning assistant in the first floor; show a compact return cue in reviews. */
(() => {
  const floors=document.getElementById('learningFloors1030');
  const panel=document.getElementById('unifiedCompanion');
  if(!floors||!panel)return;
  const labels={course:'课程总结',chapter:'章节总结',summary:'智能摘要',notes:'笔记',transcript:'视频字幕',cards:'知识点',quiz:'测一测'};
  const descriptions={course:'查看这门课程的章节要点',chapter:'回顾当前章节的核心含义',summary:'查看当前内容的智能摘要',notes:'继续整理学习笔记',transcript:'按时间定位视频讲解',cards:'复习本节知识点',quiz:'检验当前章节的掌握情况'};
  const bubble=document.createElement('button');
  bubble.type='button';bubble.className='learning-assistant-floor-bubble';bubble.hidden=true;
  bubble.setAttribute('aria-label','返回学习区并展开学习助手');
  bubble.innerHTML='<span class="learning-assistant-floor-icon" aria-hidden="true"></span><span class="learning-assistant-floor-copy"><strong>学习助手</strong><span></span></span><span class="learning-assistant-floor-arrow" aria-hidden="true">↑</span>';
  const sourceIcon=panel.querySelector('.uac-logo');
  if(sourceIcon)bubble.querySelector('.learning-assistant-floor-icon').innerHTML=sourceIcon.innerHTML;
  document.body.append(bubble);
  function update(){
    const feature=panel.dataset.feature;
    const label=labels[feature]||'学习建议';
    bubble.querySelector('.learning-assistant-floor-copy span').textContent=`${label} · ${descriptions[feature]||'继续当前课程的学习'}`;
  }
  function sync(){
    const next=floors.scrollTop>Math.max(90,floors.clientHeight*.12);
    document.body.classList.toggle('assistant-reviews-floor',next);
    bubble.hidden=!next||panel.hidden;
    if(!bubble.hidden)update();
  }
  floors.addEventListener('scroll',sync,{passive:true});
  new MutationObserver(()=>{update();sync();}).observe(panel,{attributes:true,attributeFilter:['data-feature','hidden']});
  bubble.addEventListener('click',()=>floors.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
  update();sync();
})();
