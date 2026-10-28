/* Second-floor reviews. All aggregate/example data is explicitly labelled. */
(() => {
  if(!document.body.classList.contains('fixed1030'))return;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const floors=document.createElement('div');floors.className='fixed1030-floors';floors.id='learningFloors1030';floors.setAttribute('aria-label','学习详情：第一层学习，第二层课程评价');
  const learning=document.createElement('section');learning.className='fixed1030-floor-learning';learning.setAttribute('aria-label','第一楼层：学习区');
  document.body.append(floors);floors.append(learning);
  for(const selector of ['#learningRoom','#videoWorkspace','.mindie-glass-progress','.fixed1030-footer']){const el=document.querySelector(selector);if(el)learning.append(el);}
  const reviews=document.createElement('section');reviews.className='course-reviews-floor';reviews.id='course-reviews-1030';reviews.setAttribute('aria-labelledby','reviewsTitle1030');
  reviews.innerHTML='<header class="reviews-floor-head"><div><span>第二楼层</span><h2 id="reviewsTitle1030" tabindex="-1">课程评价</h2></div><button type="button" data-reviews-back>↑ 返回学习</button></header><p class="reviews-source">样式预览 · 以下评分与同学评价为示例数据；你发表的内容仅保存在本机，不提交到正式平台。</p><section class="reviews-overview" aria-label="课程评分概览"><div class="reviews-score"><span>赞不绝口</span><strong data-reviews-rate>97.1%</strong><small data-reviews-count>140 条示例评价</small></div><div class="reviews-distribution"></div><button type="button" class="reviews-write" data-reviews-write>我要评价</button></section><form class="reviews-compose"><span class="review-avatar" aria-hidden="true">Z</span><div><label for="reviewText1030">分享你的学习体验</label><textarea id="reviewText1030" name="comment" maxlength="2000" placeholder="分享你的学习收获、疑问或建议…" required></textarea><fieldset><legend>课程感受</legend><label><input type="radio" name="rating" value="good" required> 好评</label><label><input type="radio" name="rating" value="neutral"> 中评</label><label><input type="radio" name="rating" value="bad"> 差评</label></fieldset><div class="reviews-publish"><button type="submit">发表评价</button><small>仅本机保存</small></div><p data-reviews-status role="status"></p></div></form><div class="reviews-list-head"><h3>同学评价 <small data-reviews-visible-count></small></h3><label>排序 <select data-reviews-sort aria-label="评价排序"><option value="rating">评分优先</option><option value="newest">最新发布</option></select></label></div><div class="reviews-list"></div>';
  floors.append(reviews);
  const key='ascend-1030-course-reviews-v1',labels={good:'好评',neutral:'中评',bad:'差评'},weights={good:3,neutral:2,bad:1};
  const examples=[
    {id:'sample-a',name:'林同学',rating:'good',text:'把讲解、白板和 IDE 放在一起后，理解模型到推理服务的流程更直观了。',sample:true,createdAt:0},
    {id:'sample-b',name:'陈同学',rating:'good',text:'代码示例和小测验配合着看很有帮助，希望继续补充常见报错的排查说明。',sample:true,createdAt:0},
    {id:'sample-c',name:'周同学',rating:'neutral',text:'环境准备的步骤比较清楚，第一次实践时还需要多对照设备与镜像版本。',sample:true,createdAt:0}
  ];
  let local=[];
  try{const saved=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(saved))local=saved.filter(r=>r&&typeof r.id==='string'&&typeof r.text==='string'&&r.text.length<=2000&&labels[r.rating]&&Number.isFinite(r.createdAt)).map(r=>({...r,sample:false,name:'我'}));}catch{}
  const form=reviews.querySelector('form'),textarea=form.elements.comment,status=reviews.querySelector('[data-reviews-status]');
  try{textarea.value=localStorage.getItem('ascend-1030-comment-draft')||localStorage.getItem('ascend-1030-comment')||'';}catch{}
  function render(){
    const counts={good:136,neutral:3,bad:1};for(const r of local)counts[r.rating]++;
    const total=140+local.length;
    reviews.querySelector('[data-reviews-rate]').textContent=(counts.good/total*100).toFixed(1)+'%';
    reviews.querySelector('[data-reviews-count]').textContent=local.length?total+' 条 · 含 140 条示例':'140 条示例评价';
    reviews.querySelector('.reviews-distribution').innerHTML=Object.entries(labels).map(([k,label])=>'<div><span>'+label+'</span><div role="meter" aria-label="'+label+'比例" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+(counts[k]/total*100).toFixed(1)+'"><i style="width:'+(counts[k]/total*100)+'%"></i></div></div>').join('');
    const list=[...local,...examples];const sort=reviews.querySelector('[data-reviews-sort]').value;
    list.sort((a,b)=>sort==='newest'?b.createdAt-a.createdAt:weights[b.rating]-weights[a.rating]||b.createdAt-a.createdAt);
    reviews.querySelector('[data-reviews-visible-count]').textContent=local.length?'3 条示例 / '+local.length+' 条本机评价':'3 条展示示例';
    reviews.querySelector('.reviews-list').innerHTML=list.map(r=>'<article class="review-item"><span class="review-avatar '+(r.sample?'sample':'')+'" aria-hidden="true">'+esc(r.name[0])+'</span><div><header><b>'+esc(r.name)+'</b><small>'+ (r.sample?'示例评价 · 非真实用户':new Intl.DateTimeFormat('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'Asia/Singapore'}).format(r.createdAt)+' · 本机保存')+'</small><span class="review-rating '+r.rating+'">'+labels[r.rating]+'</span></header><p>'+esc(r.text)+'</p></div></article>').join('');
  }
  render();
  function reduced(){return matchMedia('(prefers-reduced-motion: reduce)').matches;}
  function goComments(){floors.scrollTo({top:reviews.offsetTop,behavior:reduced()?'auto':'smooth'});reviews.querySelector('h2').focus({preventScroll:true});const url=new URL(location.href);url.hash='course-reviews-1030';history.replaceState(null,'',url);}
  function goLearning(){floors.scrollTo({top:0,behavior:reduced()?'auto':'smooth'});document.querySelector('[data-fixed-comment]')?.focus({preventScroll:true});const url=new URL(location.href);if(url.hash==='#course-reviews-1030'){url.hash='';history.replaceState(null,'',url);}}
  document.querySelector('[data-fixed-comment]').setAttribute('aria-controls',reviews.id);
  document.querySelector('[data-fixed-comment]').addEventListener('click',goComments);
  reviews.querySelector('[data-reviews-back]').addEventListener('click',goLearning);
  reviews.querySelector('[data-reviews-write]').addEventListener('click',()=>{form.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'center'});textarea.focus({preventScroll:true});});
  reviews.querySelector('[data-reviews-sort]').addEventListener('change',render);
  textarea.addEventListener('input',()=>{try{localStorage.setItem('ascend-1030-comment-draft',textarea.value);}catch{}});
  form.addEventListener('submit',e=>{e.preventDefault();const text=textarea.value.trim(),rating=form.elements.rating.value;if(!text||!labels[rating]){status.textContent='请填写评价并选择课程感受。';return;}
    const next=[{id:crypto.randomUUID(),name:'我',text,rating,createdAt:Date.now(),sample:false},...local];
    try{localStorage.setItem(key,JSON.stringify(next));}catch{status.textContent='暂时无法保存，请先复制评价内容。';return;}
    local=next;textarea.value='';form.querySelectorAll('[name=rating]').forEach(input=>input.checked=false);try{localStorage.removeItem('ascend-1030-comment-draft');localStorage.removeItem('ascend-1030-comment');}catch{}
    status.textContent='评价已保存到本机。';render();
  });
  floors.addEventListener('scroll',()=>{document.dispatchEvent(new Event('learning:floor-change'));},{passive:true});
  let mode=document.body.dataset.fixedView;
  new MutationObserver(()=>{if(mode!==document.body.dataset.fixedView){mode=document.body.dataset.fixedView;floors.scrollTo({top:0,behavior:'instant'});}}).observe(document.body,{attributes:true,attributeFilter:['data-fixed-view']});
  if(location.hash==='#course-reviews-1030')requestAnimationFrame(goComments);
})();
