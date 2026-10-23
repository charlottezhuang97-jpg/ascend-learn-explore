/* 1030 preview only: reuse the learning surfaces without remounting them. */
(() => {
  const learning=window.AscendLearning,companion=window.AscendCompanion;
  if(!learning||!companion)return;
  document.body.classList.add('fixed1030');
  const title=document.querySelector('.board-header .lesson-title');
  const header=document.createElement('header');header.className='fixed1030-header';
  header.innerHTML='<a class="room-close" href="index.html" aria-label="返回课程首页">‹</a><div class="fixed1030-lesson"></div><span class="fixed1030-badge">1030 预览</span><a class="fixed1030-production" href="https://charlottezhuang97-jpg.github.io/ascend-learn-explore/learn.html?course=mindie">正式版 ↗</a>';
  header.querySelector('.fixed1030-lesson').append(title);document.body.prepend(header);
  const footer=document.createElement('footer');footer.className='fixed1030-footer';
  const icon={video:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3z"/>',board:'<path d="M4 4h16v12H4zM12 16v5M8 21h8M7 8h10M7 11h6"/>',ide:'<rect x="2" y="4" width="20" height="16" rx="3"/><path d="m8 9-3 3 3 3m8-6 3 3-3 3m-3-8-2 10"/>'};
  footer.innerHTML=`<nav class="learning-mode-tabs fixed1030-modes" role="tablist" aria-label="左侧学习视图">${[['video','视频'],['board','白板'],['ide','IDE']].map(([key,label])=>`<button type="button" role="tab" data-fixed-view="${key}" aria-selected="false" aria-controls="${key==='board'?'learningRoom':'videoWorkspace'}"><svg viewBox="0 0 24 24" aria-hidden="true">${icon[key]}</svg><span>${label}</span></button>`).join('')}</nav><div class="fixed1030-links"><button type="button" data-fixed-comment>课程评论</button><button type="button" data-fixed-resources>有用链接</button></div>`;
  document.body.append(footer);
  const panel=document.getElementById('unifiedCompanion');panel.setAttribute('role','complementary');panel.removeAttribute('aria-modal');
  // Reuse the real timeline outside either view's hidden subtree.
  const timeline=document.querySelector('.mindie-glass-progress');if(timeline)document.body.append(timeline);
  panel.querySelector('[data-uac-action="close"]').hidden=true;
  // A fixed companion cannot be dismissed by legacy floating-panel triggers.
  companion.close=()=>companion.open();
  const originalView=learning.setView,originalPerspective=learning.setVideoPerspective;
  function sync(){
    const mode=!document.getElementById('learningRoom').hidden?'board':document.getElementById('videoWorkspace').classList.contains('ide-mode')?'ide':'video';
    document.body.dataset.fixedView=mode;
    for(const b of footer.querySelectorAll('[data-fixed-view]')){const selected=b.dataset.fixedView===mode;b.classList.toggle('active',selected);b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;}
    const url=new URL(location.href);url.searchParams.set('mode',mode);history.replaceState(null,'',url);
    document.getElementById('ideMiniVideo').hidden=true;
  }
  learning.setView=(view)=>{originalView(view);sync();};
  learning.setVideoPerspective=(perspective)=>{originalPerspective(perspective);sync();};
  function choose(mode){if(mode==='board')originalView('board');else{originalView('video');originalPerspective(mode==='ide'?'ide':'teacher');}sync();}
  footer.addEventListener('click',e=>{const b=e.target.closest('[data-fixed-view]');if(b)choose(b.dataset.fixedView);if(e.target.closest('[data-fixed-resources]'))panel.querySelector('[data-uac-action="resources"]').click();});
  footer.querySelector('nav').addEventListener('keydown',e=>{const buttons=[...footer.querySelectorAll('[data-fixed-view]')],index=buttons.indexOf(e.target);if(index<0||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?2:(index+(e.key==='ArrowRight'?1:2))%3;choose(buttons[next].dataset.fixedView);buttons[next].focus();});
  document.addEventListener('learning:view-change',()=>queueMicrotask(sync));
  // Internal lesson/video links still use the original closure APIs.
  new MutationObserver(sync).observe(document.getElementById('videoWorkspace'),{attributes:true,attributeFilter:['class','hidden']});
  const comments=document.createElement('dialog');comments.className='fixed1030-comments';comments.innerHTML='<form method="dialog"><header><h2>课程评论</h2><button type="submit" aria-label="关闭课程评论">×</button></header></form><p>1030 预览评论，仅保存在本机，不提交到正式版。</p><label for="fixed1030Comment">你的学习反馈</label><textarea id="fixed1030Comment" placeholder="写下对这节课程的反馈…" maxlength="2000"></textarea><button type="button" data-save-comment>保存评论</button><p data-comment-status role="status"></p>';
  document.body.append(comments);
  footer.querySelector('[data-fixed-comment]').addEventListener('click',()=>{try{comments.querySelector('textarea').value=localStorage.getItem('ascend-1030-comment')||'';}catch{}comments.showModal();});
  comments.querySelector('[data-save-comment]').addEventListener('click',()=>{try{localStorage.setItem('ascend-1030-comment',comments.querySelector('textarea').value);comments.querySelector('[data-comment-status]').textContent='已保存在本机（预览版）';}catch{comments.querySelector('[data-comment-status]').textContent='浏览器未允许保存，请自行复制内容';}});
  const params=new URLSearchParams(location.search),mode=params.get('mode')||(params.get('view')==='board'?'board':params.get('perspective')==='ide'?'ide':'video');
  choose(['video','board','ide'].includes(mode)?mode:'video');companion.open();sync();
})();
