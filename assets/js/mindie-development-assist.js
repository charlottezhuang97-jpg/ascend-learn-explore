/* Local interaction prototype: no shell, HTTP request, debugger or model runs. */
(() => {
  if(new URLSearchParams(location.search).get('course')!=='mindie'||!window.MindIEInferencePreview)return;
  const api=window.AscendCompanion,ide=window.AscendLearning,engine=window.MindIEInferencePreview;
  const editor=document.getElementById('ideEditor'),file='08_generate.sh',storageKey='ascend-mindie-last-run-v1';
  const stylesheet=document.createElement('link');stylesheet.rel='stylesheet';stylesheet.href=new URL('../css/mindie-development-assist.css?v=1',document.currentScript.src);document.head.append(stylesheet);
  const names=['环境准备','下载模型权重','获取MindIE镜像','启动容器','模型推理配置','启动MindIE服务','推理交互'];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const filename=()=>document.querySelector('.ide-tabs button.active')?.dataset.ideFile;
  const reference=goal=>goal?window.MindIEGuideContent.command({config:{...window.MindIEGuideContent.defaults,prompt:goal.prompt,maxTokens:String(goal.maxTokens)},steps:Array.from({length:7},()=>({}))},6):window.MindIELab.steps[7].code;
  const find=id=>document.querySelector(`[data-uac-inference-id="${id}"]`);
  const action=(key,text,primary=false)=>`<button type="button" data-uac-dev-action="${key}" class="${primary?'env-primary':''}">${text}</button>`;
  let latest=null,undo=null,selection=null,breakpoint=null,paused=false,upgrading=false;
  try{const saved=JSON.parse(sessionStorage.getItem(storageKey));if(saved?.filename===file&&typeof saved.code==='string'&&saved.code.length<60000)latest=saved;}catch{}
  function read(root){try{const s=JSON.parse(root.dataset.uacInferenceState);return /^[\w-]+$/.test(s.id)?s:null;}catch{return null;}}
  function update(root,s){const id=Number(root.closest('[data-uac-message]').dataset.uacMessage);api.updateToolMessage(id,render(s));return find(s.id);}
  function locate(){ide.setView('video');ide.setVideoPerspective('ide');document.querySelector('.ide-tabs [data-mindie-step="7"]')?.click();}
  function codePanel(code,note=''){
    return `<div class="env-code-advice"><div class="env-code-toolbar"><span>Shell · ${file}</span><div>${action('copy','复制')}${action('insert','置入 IDE 修改')}</div></div><pre><code>${engine.highlightShell(code)}</code></pre>${note?`<div class="env-code-note">${esc(note)}</div>`:''}</div>`;
  }
  function report(s){const r=s.report;if(!r)return '';
    return `<section class="env-comparison ${r.passed?'pass':'fail'}"><div class="env-comparison-title" role="status"><b>${r.passed?'✓ 运行结果符合预期':'✕ 终端结果与预期不一致'}</b><span>${r.count} / ${r.checks.length} 项符合 · 演示</span></div><p>${s.stale?'代码已修改。以下仍是上一次运行快照的分析；请回到 IDE 重新运行。':r.passed?'本步已完成并自动收起，可展开查看运行记录。':'以下分析基于运行时的文件、代码和终端记录，不读取后来切换的文件。修改后请在 IDE 点击“运行”。'}</p>${r.checks.map(c=>`<details class="env-check ${c.pass?'pass':'fail'}" ${c.pass?'':'open'}><summary><span>${c.pass?'✓':'✕'}</span><b>${esc(c.name)}</b><small>${c.pass?'一致':'不一致'}</small></summary><p>预期：${esc(c.expected)}</p><p>运行记录：${esc(c.actual)}</p></details>`).join('')}${r.passed?'':`<h3>建议修复代码</h3>${codePanel(reference(s.run?.goal),'完整参考请求，置入将替换 08_generate.sh，可撤销；不会执行代码，也不会改变模拟响应。服务端 500 仍需结合实际服务日志排查。')}`}<details class="env-code-snapshot"><summary>查看运行时的代码与终端记录</summary><pre>${esc(s.run?.code??s.code)}\n\n${esc(s.run?.output??s.response)}</pre></details></section>`;
  }
  function render(s){
    const run=s.run,offer=s.status==='offer',declined=s.status==='declined';
    let content;
    if(offer||declined){content=`<section class="env-analysis-offer"><h3>第 7 步 · 推理交互遇到问题</h3><p>检测到 <code>${esc(run.filename)}</code> 的终端结果与预期不一致，HTTP ${run.http}。是否分析这次运行的问题？</p><pre>${esc(run.output)}</pre><small>仅使用本次运行快照；当前终端是演示，未连接主机或实时 AI。</small><div class="env-actions">${action('analyze',declined?'开始分析':'分析问题',true)}${offer?action('decline','暂不分析'):''}</div></section>`;}
    else if(s.report){content=`<div class="env-vertical-head"><b>文本生成推理实践</b><span class="env-demo-label">运行记录分析 · 演示</span></div><div class="env-vertical-steps">${names.map((n,i)=>`<details class="env-vertical-step ${i===6?'current '+(s.report.passed&&!s.stale?'pass':'fail'):'not-run'}" ${i===6&&(!s.report.passed||s.stale)?'open':''}><summary><span class="env-step-number">${i+1}</span><b>${n}</b><small>${i===6?'运行分析':'未执行'}</small></summary>${i===6?`<div class="env-step-content"><p>运行文件：<code>${esc(run?.filename||file)}</code>${run?` · 第 ${run.errorLine||1} 行附近`:''}</p><section class="env-step-target"><b>预期结果</b><pre>HTTP 200\n{ "text": "非空的生成文本" }</pre></section>${report(s)}</div>`:'<div class="env-step-content"><p>本次未执行该步骤。</p></div>'}</details>`).join('')}</div>`;}
    else{content='<p>在 IDE 的第 7 步运行代码后，我会结合终端记录询问是否分析。也可以在报错后选中代码，查看局部修复建议。</p>';}
    const template=document.createElement('template');template.innerHTML=window.MindIEStepUI.decorate(`<div class="env-flow env-inference" data-uac-inference-id="${s.id}" data-uac-inference-ui-version="4" data-uac-development-version="1" data-uac-inference-state="${esc(JSON.stringify(s))}">${content}</div>`);
    if(s.stale){const step=template.content.querySelector('.env-vertical-step.current');step?.classList.remove('pass','fail');const icon=step?.querySelector('.env-step-state');if(icon){icon.className='env-step-state active';icon.setAttribute('aria-label','代码已修改，待运行');icon.setAttribute('title','代码已修改，待运行');}}
    return template.innerHTML;
  }
  window.MindIEDevelopmentAssist={render};
  function upgrade(){if(upgrading)return;upgrading=true;try{for(const id of [...document.querySelectorAll('[data-uac-inference-id]')].map(e=>e.dataset.uacInferenceId)){const root=find(id);if(root?.dataset.uacDevelopmentVersion==='1')continue;const s=root&&read(root);if(s)update(root,s);}}finally{upgrading=false;}}
  document.addEventListener('uac:render',upgrade);upgrade();
  function offerAnalysis(){
    if(!latest||latest.passed)return;
    const exists=[...document.querySelectorAll('[data-uac-inference-id]')].some(root=>read(root)?.run?.id===latest.id);
    if(!exists)api.addToolMessage('assistant',render({id:crypto.randomUUID(),status:'offer',run:latest,report:null}));
  }
  document.addEventListener('uac:open',offerAnalysis);
  const bar=document.createElement('nav');bar.className='mindie-dev-toolbar';bar.setAttribute('aria-label','第七步开发演示');
  bar.innerHTML='<span>第 7 步 · 本地开发演示</span><button type="button" data-dev-toolbar="example">载入报错示例（替换）</button><label>运行场景 <select aria-label="模拟运行场景"><option value="auto">根据代码模拟</option><option value="500">服务端 HTTP 500</option></select></label><button type="button" data-dev-toolbar="debug">断点调试（演示）</button><button type="button" data-dev-toolbar="undo" hidden>撤销置入</button><small role="status">未连接执行器或调试器</small>';
  document.querySelector('#videoIde .ide-tabs').after(bar);
  const popup=document.createElement('section');popup.className='mindie-selection-assist';popup.hidden=true;popup.setAttribute('role','dialog');popup.setAttribute('aria-label','AI学伴选区修复建议');document.body.append(popup);
  const mark=document.createElement('div');mark.className='mindie-dev-error-line';mark.hidden=true;document.querySelector('#videoIde .ide-code-surface').append(mark);
  function refreshBar(){bar.hidden=filename()!==file;bar.querySelector('[data-dev-toolbar="undo"]').hidden=!undo;positionMark();}
  function positionMark(){
    const line=paused?breakpoint:latest?.errorLine;
    if(filename()!==file||!latest||latest.passed||latest.code!==editor.value||!line){mark.hidden=true;return;}
    const style=getComputedStyle(editor),height=parseFloat(style.lineHeight)||22;
    const top=(parseFloat(style.paddingTop)||16)+(line-1)*height-editor.scrollTop;
    mark.style.top=top+'px';mark.style.height=height+'px';mark.hidden=top<0||top>editor.clientHeight;
  }
  function setCode(code){const before=editor.value;editor.value=code;editor.dispatchEvent(new Event('input',{bubbles:true}));undo={file:filename(),before,after:code};refreshBar();}
  function errorLine(code){const lines=code.split('\n');let index=lines.findIndex(l=>/"max_tokens"\s*:\s*"/.test(l));if(index<0)index=lines.findIndex(l=>/https?:/.test(l));return Math.max(1,index+1);}
  function run(){
    const previous=latest;
    const code=editor.value;
    if(code.length>50000){ide.showToast('演示仅支持 50 KB 以内的代码；未运行');return;}
    let http=200,response=JSON.stringify({text:'这是一条模拟生成文本。'});
    const goal=window.MindIEGuidedLearning?.requestGoal();
    const draft=engine.validate(code,response,200,file,goal);
    const invalid=draft.checks.slice(0,5).some(c=>!c.pass);
    if(bar.querySelector('select').value==='500'){http=500;response=JSON.stringify({error:'Internal Server Error（模拟服务异常）'});}
    else if(invalid){http=400;response=JSON.stringify({error:draft.checks.filter(c=>!c.pass).map(c=>c.name+'：'+c.actual).join('；')});}
    const result=engine.validate(code,response,http,file,goal),line=errorLine(code);
    latest={id:crypto.randomUUID(),filename:file,code,http,response,goal,passed:result.passed,errorLine:result.passed?null:line,time:Date.now(),output:`[模拟运行 · 未执行命令]\n${file}${result.passed?'':':'+line}\nHTTP ${http}\n${response}`};
    try{sessionStorage.setItem(storageKey,JSON.stringify(latest));}catch{}
    paused=false;popup.hidden=true;
    window.MindIETerminal.write({id:latest.id,host:'A',command:code,status:result.passed?'success':'error',output:latest.output},{reveal:true});
    bar.querySelector('small').textContent=result.passed?'模拟运行通过':'模拟运行报错 · 打开 AI 学伴可分析';positionMark();
    // Existing authorized analyses are refreshed on rerun; a new failure still
    // requires the explicit analysis confirmation when the companion opens.
    for(const root of [...document.querySelectorAll('[data-uac-inference-id]')]){const s=read(root);if(!s?.run||!s.report||s.run.id!==previous?.id)continue;s.run=latest;s.code=code;s.response=response;s.http=http;s.report=result;s.status=result.passed?'pass':'fail';s.stale=false;update(find(s.id),s);}
    ide.showToast(result.passed?'模拟运行符合预期':'终端已有错误记录，可打开 AI 学伴分析');
  }
  document.getElementById('runCode').addEventListener('click',e=>{if(filename()!==file)return;e.preventDefault();e.stopImmediatePropagation();run();},true);
  bar.addEventListener('click',e=>{const key=e.target.closest('[data-dev-toolbar]')?.dataset.devToolbar;
    if(key==='example'){locate();setCode(reference().replace(/("max_tokens"\s*:\s*)500/,'$1"500"'));bar.querySelector('select').value='auto';ide.showToast('已载入 max_tokens 类型错误示例；点击 IDE“运行”');}
    if(key==='undo'){if(!undo||filename()!==undo.file||editor.value!==undo.after){ide.showToast('代码已变化，未覆盖；请手动撤销或核对');return;}editor.value=undo.before;undo=null;editor.dispatchEvent(new Event('input',{bubbles:true}));refreshBar();ide.showToast('已撤销置入，未执行代码');}
    if(key==='debug'){
      if(!latest||latest.passed||latest.code!==editor.value){ide.showToast('请先运行当前代码并产生报错记录');return;}
      breakpoint=breakpoint||latest.errorLine;paused=true;
      const offset=editor.value.split('\n').slice(0,breakpoint-1).join('\n').length+(breakpoint>1?1:0);
      editor.focus();editor.setSelectionRange(offset,offset);editor.scrollTop=Math.max(0,(breakpoint-4)*22);positionMark();
      bar.querySelector('small').textContent=`演示断点暂停在第 ${breakpoint} 行；选中代码查看建议`;
    }
  });
  const gutter=document.getElementById('ideGutter');gutter.removeAttribute('aria-hidden');
  function decorateGutter(){for(const [i,node]of [...gutter.children].entries()){node.classList.toggle('dev-breakpoint',filename()===file&&breakpoint===i+1);if(filename()!==file){node.removeAttribute('role');node.removeAttribute('tabindex');node.removeAttribute('aria-label');continue;}node.setAttribute('role','button');node.setAttribute('tabindex','0');node.setAttribute('aria-label',`第 ${i+1} 行，切换演示断点`);}}
  function toggleBreakpoint(node){if(filename()!==file)return;const line=[...gutter.children].indexOf(node)+1;breakpoint=breakpoint===line?null:line;paused=false;decorateGutter();bar.querySelector('small').textContent=breakpoint?`已设置第 ${breakpoint} 行演示断点`:'已清除演示断点';}
  gutter.addEventListener('click',e=>{if(e.target.parentElement===gutter)toggleBreakpoint(e.target);});
  gutter.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)&&e.target.parentElement===gutter){e.preventDefault();toggleBreakpoint(e.target);}});
  new MutationObserver(decorateGutter).observe(gutter,{childList:true});decorateGutter();
  function selectionFix(text){
    let corrected=text.replace(/("max_tokens"\s*:\s*)"500"/g,(_,prefix)=>prefix+'500');
    corrected=corrected.replace(/http:\/\/127\.0\.0\.1:1025\/(?:wrong|generat)(?=[\s'"\\]|$)/g,'http://127.0.0.1:1025/generate');
    return corrected===text?null:corrected;
  }
  function showSelection(){
    if(!filename()){popup.hidden=true;return;}
    const start=editor.selectionStart,end=editor.selectionEnd,text=editor.value.slice(start,end);
    if(!text.trim()){popup.hidden=true;return;}
    const selectedFile=filename(),replacement=selectedFile===file?selectionFix(text):null,line=editor.value.slice(0,start).split('\n').length,endLine=editor.value.slice(0,end).replace(/\n$/,'').split('\n').length;
    const matchedRun=latest?.filename===selectedFile&&latest.code===editor.value;
    selection={file:selectedFile,whole:editor.value,start,end,text,replacement,line,endLine};
    popup.innerHTML=`<header><b>AI 学伴</b><div><button type="button" data-selection-action="copy">复制</button><button type="button" data-selection-action="insert" ${replacement?'':'disabled'}>置入 IDE</button><button type="button" data-selection-action="close" aria-label="关闭选区建议">×</button></div></header><p>${esc(selectedFile)} · 第 ${line}${endLine!==line?'–'+endLine:''} 行 · ${paused?'断点暂停（演示）':matchedRun&&!latest.passed?'运行报错（演示）':'已选中代码'}</p><div class="env-code-advice"><pre><code>${engine.highlightShell(replacement??text)}</code></pre></div><small>${replacement?'发现本地规则可修复的问题。置入仅替换本次选区，可撤销，不执行代码。':'基于所选代码提问，或结合对应运行记录定位异常。'}</small><footer class="mindie-selection-shortcuts" aria-label="代码选区快捷操作"><button type="button" data-selection-action="ask">问一问</button><button type="button" data-selection-action="diagnose">异常定位</button></footer>`;
    popup.hidden=false;
    const rect=editor.getBoundingClientRect(),width=Math.min(460,innerWidth-32,Math.max(260,rect.width-24));popup.style.width=width+'px';
    const y=rect.top+(line-1)*(parseFloat(getComputedStyle(editor).lineHeight)||22)-editor.scrollTop;
    popup.style.left=Math.max(16,Math.min(rect.left+Math.min(rect.width*.35,260),rect.right-width-12,innerWidth-width-16))+'px';
    popup.style.top=Math.max(16,Math.min(y+28,innerHeight-popup.offsetHeight-16))+'px';
  }
  let selectionTimer,selecting=false;function queueSelection(){clearTimeout(selectionTimer);selectionTimer=setTimeout(()=>{if(!selecting)showSelection();},100);}
  editor.addEventListener('pointerdown',e=>{if(e.button===0){selecting=true;popup.hidden=true;}});
  document.addEventListener('pointerup',()=>{if(selecting){selecting=false;queueSelection();}});
  document.addEventListener('pointercancel',()=>{selecting=false;});
  editor.addEventListener('select',queueSelection);editor.addEventListener('mouseup',queueSelection);editor.addEventListener('keyup',e=>{if(e.key!=='Escape')queueSelection();});
  editor.addEventListener('scroll',()=>{positionMark();popup.hidden=true;});
  editor.addEventListener('input',()=>{popup.hidden=true;paused=false;positionMark();if(filename()!==file)return;for(const root of [...document.querySelectorAll('[data-uac-inference-id]')]){const s=read(root);if(s?.report&&!s.stale){s.stale=true;update(find(s.id),s);}}});
  popup.addEventListener('click',async e=>{const key=e.target.closest('[data-selection-action]')?.dataset.selectionAction;if(!selection)return;
    if(key==='close'){popup.hidden=true;return;}
    if(key==='ask'||key==='diagnose'){
      if(filename()!==selection.file||editor.value!==selection.whole){popup.hidden=true;ide.showToast('文件或代码已变化，请重新框选');return;}
      const context=`${selection.file} · 第 ${selection.line}–${selection.endLine} 行`,snippet=`<div class="env-code-advice"><pre><code>${engine.highlightShell(selection.text)}</code></pre></div>`;
      popup.hidden=true;
      if(key==='ask'){
        const step=window.MindIELab.steps.find(s=>s.file===selection.file);
        api.beginTool(`请解释所选代码：${context}\n${selection.text}`,`<p>已收到你框选的 <b>${esc(context)}</b>：</p>${snippet}<p>${esc(step?.action||'可以继续问我这段代码的用途、参数含义或修改方法。')}</p><small>依据当前课程手册的预设说明，非实时 AI；不会修改或执行代码。</small>`);
      }else if(latest?.filename===selection.file&&latest.code===selection.whole){
        const result=engine.validate(latest.code,latest.response,latest.http,latest.filename,latest.goal);
        const within=latest.errorLine>=selection.line&&latest.errorLine<=selection.endLine;
        const intro=`<p>选区：<b>${esc(context)}</b>。${latest.passed?'该次模拟运行未记录异常。':within?'终端记录的异常行位于本次选区内。':`终端记录的异常位于第 ${latest.errorLine} 行，不在当前选区内，不能直接认定此选区有误。`}</p>`;
        api.beginTool(`定位所选代码的异常：${context}\n${selection.text}`,intro+render({id:crypto.randomUUID(),status:result.passed?'pass':'fail',run:latest,code:latest.code,report:result}));
      }else{
        api.beginTool(`定位所选代码的异常：${context}\n${selection.text}`,`<p>当前文件或代码版本还没有匹配的运行记录，无法确认终端异常位置。</p>${snippet}<p>${selection.replacement?'本地规则发现选区中有可修正的参数或路径；可重新框选并置入建议后，在 IDE 运行验证。':'请先在 IDE 中运行当前文件，再结合终端错误和断点记录定位问题。当前演示只接入第 7 步的模拟运行。'}</p><small>未执行代码、未调用调试器或实时 AI。</small>`);
      }
      return;
    }
    if(key==='copy'){try{await navigator.clipboard.writeText(selection.replacement??selection.text);ide.showToast('选区代码已复制');}catch{ide.showToast('复制失败，请手动选择并复制代码');}return;}
    if(key==='insert'){
      if(!selection.replacement||filename()!==selection.file||editor.value!==selection.whole){ide.showToast('文件或代码已变化，请重新选择；未覆盖代码');popup.hidden=true;return;}
      const before=editor.value;editor.setRangeText(selection.replacement,selection.start,selection.end,'select');const after=editor.value;editor.dispatchEvent(new Event('input',{bubbles:true}));undo={file,before,after};refreshBar();popup.hidden=true;ide.showToast('仅替换所选代码；请点击 IDE“运行”验证');
    }
  });
  document.addEventListener('click',async e=>{const b=e.target.closest('[data-uac-dev-action]');if(!b)return;const root=b.closest('[data-uac-inference-id]'),s=root&&read(root);if(!s)return;const key=b.dataset.uacDevAction;
    if(key==='decline'){s.status='declined';update(root,s);api.addToolMessage('user','<p>暂不分析这次运行。</p>');return;}
    if(key==='analyze'){s.code=s.run.code;s.response=s.run.response;s.http=s.run.http;s.report=engine.validate(s.run.code,s.run.response,s.run.http,s.run.filename,s.run.goal);s.status=s.report.passed?'pass':'fail';api.addToolMessage('user','<p>请分析这次终端报错，给出修复建议。</p>');const next=update(find(s.id),s);next?.querySelector('.env-comparison')?.scrollIntoView({block:'start'});return;}
    const code=b.closest('.env-code-advice')?.querySelector('pre code')?.textContent;
    if(key==='copy'){try{await navigator.clipboard.writeText(code);b.textContent='已复制';ide.showToast('代码已复制');}catch{ide.showToast('复制失败，请手动复制代码');}}
    if(key==='insert'){locate();setCode(code);popup.hidden=true;s.stale=true;update(find(s.id),s);editor.focus();ide.showToast('代码已置入，可撤销；请点击 IDE“运行”验证');}
  });
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!popup.hidden){clearTimeout(selectionTimer);popup.hidden=true;e.preventDefault();e.stopImmediatePropagation();}},true);
  document.addEventListener('pointerdown',e=>{if(!popup.contains(e.target)&&e.target!==editor)popup.hidden=true;});
  document.addEventListener('click',e=>{if(e.target.closest('[data-ide-file],[data-nested-file]')){popup.hidden=true;paused=false;refreshBar();decorateGutter();}});
  engine.start=()=>{locate();refreshBar();api.close();ide.showToast('第 7 步：先运行代码，再打开 AI 学伴分析终端报错');};
  const entry=[...document.querySelectorAll('.mindie-practice-link')].find(b=>b.textContent.includes('结果比对'));if(entry)entry.textContent='第 7 步 · 推理交互';
  if(new URLSearchParams(location.search).get('agent')==='inference'){locate();api.close();}
  refreshBar();
})();
