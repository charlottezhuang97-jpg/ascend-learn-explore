/* Course details use the same learning assistant tools and reference content as immersive learning. */
(() => {
  const panel=document.getElementById('unifiedCompanion');
  if(!panel||!window.AscendCompanion)return;
  const asset=path=>new URL('../../'+path,document.currentScript.src).href;
  const icon=name=>`<span class="iv-source iv-${name}" aria-hidden="true"></span>`;
  const header=panel.querySelector('.uac-header');
  header.innerHTML=`<button type="button" class="uac-back" data-uac-action="back" aria-label="返回学习助手首页" hidden></button><span class="uac-logo">${icon('logo')}</span><div class="uac-heading"><h2 id="uacTitle">学习助手</h2><details class="uac-mode-switch"><summary aria-label="选择助手类型">${icon('chevron')}</summary><div><button type="button" data-uac-action="assistant-mode" data-mode="smart">智能助手</button><button type="button" data-uac-action="assistant-mode" data-mode="study">学习助手</button></div></details></div><div class="uac-header-actions"><button type="button" data-uac-action="history" aria-label="历史对话">${icon('rating')}</button><button type="button" data-uac-action="resources" aria-label="学习资源">${icon('list')}</button><button type="button" data-uac-action="close" aria-label="关闭学习助手">${icon('close')}</button></div>`;
  const referenceFeatures=new Set(new URLSearchParams(location.search).get('course')==='operator'?['summary','notes','cards','transcript']:[]);
  const transcript=[
    ['00:00:02','这章节我们主要讲的是样例的一些演示'],
    ['00:00:06','我们首先通过一个 HelloWorld 样例'],
    ['00:00:11','然后带大家看看算子开发的基础知识'],
    ['00:00:14','一个最简单的计算是怎么写的'],
    ['00:00:17','这里把详细步骤标示出来了']
  ];
  let rendered='';
  let firstOpen=true;
  function decorate(){
    const feature=panel.dataset.feature||'';
    panel.querySelectorAll('.uac-cards [data-uac-feature]').forEach(button=>{
      const key=button.dataset.uacFeature;
      button.querySelector('.uac-card-watermark').innerHTML=icon(key==='summary'||key==='quiz'?'purple-tool':key==='transcript'?'transcript-tool':'blue-tool');
      const label=button.querySelector('.uac-card-label');
      if(key==='cards')label.textContent='知识点';
      const hint=button.querySelector('.uac-card-copy small');
      if(key==='quiz')hint.innerHTML='<b class="iv-fast-card"># 快慢卡</b> 快速对比通信/计算差异并定位慢卡';
      else if(key==='transcript')hint.textContent='输入问题，检索知识';
      else if(key==='notes'||key==='cards')hint.textContent='智能分析复用策略';
    });
    const think=panel.querySelector('.uac-think');if(think)think.innerHTML=icon('think')+'深度思考';
    const mic=panel.querySelector('.uac-mic');if(mic)mic.innerHTML=icon('mic');
    const send=panel.querySelector('.uac-input button[type="submit"]');if(send)send.innerHTML=icon('send');
    if(!referenceFeatures.has(feature)){rendered='';return;}
    if(rendered===feature)return;
    rendered=feature;
    const body=panel.querySelector('.uac-body');
    body.className='uac-body iv-feature-body iv-'+feature+'-body';
    if(feature==='transcript'){
      body.innerHTML=`<h3 class="iv-transcript-title">已为你生成【${document.querySelector('[data-course-title]')?.textContent||'当前课程'}】视频字幕。</h3><ol class="iv-transcript-list">${transcript.map(([time,line])=>`<li><button type="button" aria-label="${time} ${line}"><span class="iv-row-copy"><time>${time}</time><span>${line}</span></span></button></li>`).join('')}</ol>`;
    }else body.innerHTML=window.AscendVideoReferenceContent?.[feature]?.(asset)||'';
    body.scrollTop=0;
  }
  document.addEventListener('uac:render',()=>{rendered='';decorate();});
  document.addEventListener('uac:open',()=>{
    if(firstOpen){firstOpen=false;window.AscendCompanion.showHome();return;}
    decorate();
  });
  decorate();
})();
