/* Local interaction prototype: no shell, HTTP request, debugger or model runs. */
(() => {
  if(new URLSearchParams(location.search).get('course')!=='mindie'||!window.MindIEInferencePreview)return;
  const api=window.AscendCompanion,ide=window.AscendLearning,engine=window.MindIEInferencePreview;
  const editor=document.getElementById('ideEditor'),file='08_generate.sh',storageKey='ascend-mindie-last-run-v1';
  const stylesheet=document.createElement('link');stylesheet.rel='stylesheet';stylesheet.href=new URL('../css/mindie-development-assist.css?v=selection-3',document.currentScript.src);document.head.append(stylesheet);
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
  window.MindIEDevelopmentAssist={render,loadErrorExample};
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
  function loadErrorExample(){
    locate();setCode(reference().replace(/("max_tokens"\s*:\s*)500/,'$1"500"'));
    bar.querySelector('select').value='auto';
    bar.querySelector('small').textContent='错误示例已载入：max_tokens 被写成字符串。点击“运行”。';
    editor.focus({preventScroll:true});
    ide.showToast('第 7 步错误示例已载入；点击 IDE“运行”查看结果');
  }
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
    bar.querySelector('small').textContent=result.passed?'模拟运行通过':'结果有误：划选高亮错误代码，再点“帮我写代码”';positionMark();
    // Existing authorized analyses are refreshed on rerun; a new failure still
    // requires the explicit analysis confirmation when the companion opens.
    for(const root of [...document.querySelectorAll('[data-uac-inference-id]')]){const s=read(root);if(!s?.run||!s.report||s.run.id!==previous?.id)continue;s.run=latest;s.code=code;s.response=response;s.http=http;s.report=result;s.status=result.passed?'pass':'fail';s.stale=false;update(find(s.id),s);}
    ide.showToast(result.passed?'模拟运行符合预期':'结果有误：划选第 '+line+' 行代码，向 AI 学伴请求修正');
  }
  document.getElementById('runCode').addEventListener('click',e=>{if(filename()!==file)return;e.preventDefault();e.stopImmediatePropagation();run();},true);
  bar.addEventListener('click',e=>{const key=e.target.closest('[data-dev-toolbar]')?.dataset.devToolbar;
    if(key==='example')loadErrorExample();
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
    let corrected=text.replace(/("max_tokens"\s*:\s*)"(\d+)"/g,(whole,prefix,n)=>Number(n)>=1&&Number(n)<=2048?prefix+Number(n):whole);
    corrected=corrected.replace(/http:\/\/127\.0\.0\.1:1025\/(?:wrong|generat)(?=[\s'"\\]|$)/g,'http://127.0.0.1:1025/generate');
    return corrected===text?null:corrected;
  }
  const selectionLabel=()=>`${selection.file} · 第 ${selection.line}–${selection.endLine} 行`;
  const selectedStep=()=>window.MindIELab.steps.find(s=>s.file===selection.file);
  function selectionExplanation(){
    const rows=[],text=selection.text,step=selectedStep();
    if(/"max_tokens"/.test(text))rows.push('max_tokens 是本次请求的生成长度参数；本演示要求 JSON 数值，不能把 500 写成字符串 "500"。修改生成量后要更新预览并重新确认请求。');
    if(/"prompt"/.test(text))rows.push('prompt 是本次问题。更换问题会改变练习目标，请保留对应请求和响应，不把生成内容当作事实证明。');
    if(/curl|\/generate/.test(text))rows.push('请求应为 POST，使用 application/json；127.0.0.1 指执行该请求的实验环境，而不是浏览器本机。');
    if(/source\s/.test(text))rows.push('这些 source 命令在同一容器会话加载环境；无文字回显不等于失败。后续启动服务仍需使用该会话环境。');
    if(/docker run|privileged|net=host/.test(text))rows.push('容器创建引用已确认的设备、镜像与只读权重目录；高权限和主机网络必须分别确认，不因选中代码就获得执行授权。');
    if(/npu-smi|docker ps/.test(text))rows.push('这是主机只读检查。Docker 只返回表头也可能是正常结果；检查授权不包括安装或启停组件。');
    if(/httpsEnabled|npuDeviceIds|modelWeightPath/.test(text))rows.push('这只是完整配置中的字段：核对容器设备映射、权重路径及隔离实验的 HTTPS 边界，不能把片段直接覆盖为完整文件。');
    if(/tail|nohup|mindieservice_daemon/.test(text))rows.push('后台启动与日志观察是两个动作。Ctrl+C 只退出 tail，不代表停止后台服务；成功应依据本次日志和进程 / 端口证据。');
    if(!rows.length)rows.push(step?.action||'当前选区没有匹配到课程规则，请继续描述希望理解的用途、输入输出或修改目标。');
    return '<ul>'+rows.map(row=>'<li>'+esc(row)+'</li>').join('')+'</ul>';
  }
  function selectionShortcuts(draft=''){return `<footer class="mindie-selection-shortcuts" aria-label="代码选区快捷操作"><button type="button" data-selection-action="write">帮我写代码</button><button type="button" data-selection-action="explain">帮我解释</button><button type="button" data-selection-action="note">记笔记</button></footer><form class="mindie-selection-question" data-selection-question><label for="mindie-selection-question-input">针对选中的代码提问</label><div><input id="mindie-selection-question-input" name="question" type="text" maxlength="500" required autocomplete="off" placeholder="输入你的问题…" value="${esc(draft)}" aria-describedby="mindie-selection-question-status"><button type="submit">发送</button></div><p id="mindie-selection-question-status" role="status" aria-live="polite"></p></form><button type="button" class="selection-diagnose" data-selection-action="diagnose">异常定位 →</button>`;}
  function selectionComparison(){
    const step=selectedStep(),proposed=selection.replacement,draft=popup.querySelector('[name="question"]')?.value||'';
    popup.innerHTML=`<header><b>AI 学伴 · 帮我写代码</b><button type="button" data-selection-action="close" aria-label="关闭选区建议">×</button></header><p>${esc(selectionLabel())}</p><div class="selection-code-compare"><section><h3>所选原代码</h3><div class="env-code-advice"><pre><code>${engine.highlightShell(selection.text)}</code></pre></div></section><section><h3>${proposed?'建议修正代码':'完整文件参考 · 非局部修复'}</h3><div class="env-code-advice"><div class="env-code-toolbar"><span>${esc(selection.file)}</span><div><button type="button" data-selection-action="${proposed?'copy':'copy-reference'}">复制</button><button type="button" data-selection-action="insert" ${proposed?'':'disabled'}>置入 IDE 修改</button></div></div><pre><code>${engine.highlightShell(proposed||step?.code||selection.text)}</code></pre></div></section></div><small>${proposed?'本地规则识别到参数类型或接口路径问题。置入仅替换本次选区，可撤销；不会运行代码，也不保证服务端问题已解决。':'当前没有可可靠应用的局部修正；下方仅展示课程完整文件参考，不允许直接替换当前选区。请用“帮我解释”补充修改目标。'} 未接入实时 AI。</small>${selectionShortcuts(draft)}`;
    popup.dataset.view='comparison';positionSelection(true);
  }
  function positionSelection(compare=false){
    const rect=editor.getBoundingClientRect(),width=Math.min(compare?620:360,innerWidth-32,Math.max(260,rect.width-24));popup.style.width=width+'px';
    const y=rect.top+(selection.line-1)*(parseFloat(getComputedStyle(editor).lineHeight)||22)-editor.scrollTop;
    popup.style.left=Math.max(16,Math.min(rect.left+Math.min(rect.width*.35,260),rect.right-width-12,innerWidth-width-16))+'px';
    popup.style.top=Math.max(16,Math.min(y+28,innerHeight-popup.offsetHeight-16))+'px';
  }
  function showSelection(){
    if(!filename()){popup.hidden=true;return;}
    const start=editor.selectionStart,end=editor.selectionEnd,text=editor.value.slice(start,end);
    if(!text.trim()){popup.hidden=true;return;}
    if(!popup.hidden&&selection?.file===filename()&&selection.whole===editor.value&&selection.start===start&&selection.end===end)return;
    if(text.length>8000){popup.hidden=true;ide.showToast('请将选区缩小到 8000 字以内，方便解释与记录');return;}
    const selectedFile=filename(),replacement=selectedFile===file?selectionFix(text):null,line=editor.value.slice(0,start).split('\n').length,endLine=editor.value.slice(0,end).replace(/\n$/,'').split('\n').length;
    const matchedRun=latest?.filename===selectedFile&&latest.code===editor.value;
    selection={file:selectedFile,whole:editor.value,start,end,text,replacement,line,endLine};
    popup.dataset.view='shortcuts';
    popup.innerHTML=`<header><b>AI 学伴</b><button type="button" data-selection-action="close" aria-label="关闭选区建议">×</button></header><p>${esc(selectedFile)} · 第 ${line}${endLine!==line?'–'+endLine:''} 行 · ${paused?'断点暂停（演示）':matchedRun&&!latest.passed?'运行报错（演示）':'已选中代码'}</p><details class="selection-source"><summary>查看所选代码</summary><div class="env-code-advice"><pre><code>${engine.highlightShell(text)}</code></pre></div></details>${selectionShortcuts()}<small>选择一个操作，不会自动执行或修改代码。</small>`;
    popup.hidden=false;positionSelection();
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
    if(['write','note','explain','copy-reference'].includes(key)&& (filename()!==selection.file||editor.value!==selection.whole)){popup.hidden=true;ide.showToast('文件或代码已变化，请重新框选');return;}
    if(key==='write'){clearTimeout(selectionTimer);selectionComparison();return;}
    if(key==='copy-reference'){try{await navigator.clipboard.writeText(selectedStep()?.code||selection.text);ide.showToast('课程完整文件参考已复制，未置入或运行');}catch{ide.showToast('复制失败，请手动选择代码');}return;}
    if(key==='note'){
      const step=selectedStep(),context=selectionLabel(),draft=`代码笔记 · ${context}\n学习步骤：${step?.title||'当前文件'}\n\n所选代码：\n${selection.text}\n\n我的理解：\n`;
      popup.hidden=true;
      api.beginTool(`帮我把所选代码记成笔记：${context}\n${selection.text}`,`<section class="selection-note-draft"><h3>代码笔记草稿</h3><p>已带入文件、行号和所选代码。补充理解后保存到“我的笔记”；只保存在当前浏览器，不上传代码。</p><form data-uac-code-note><label>编辑笔记<textarea name="note" maxlength="12000" required aria-label="代码笔记内容">${esc(draft)}</textarea></label><button type="submit">保存到我的笔记</button><p data-uac-note-status role="status"></p></form></section>`);
      return;
    }
    if(key==='ask'||key==='explain'||key==='diagnose'){
      if(filename()!==selection.file||editor.value!==selection.whole){popup.hidden=true;ide.showToast('文件或代码已变化，请重新框选');return;}
      const context=`${selection.file} · 第 ${selection.line}–${selection.endLine} 行`,snippet=`<div class="env-code-advice"><pre><code>${engine.highlightShell(selection.text)}</code></pre></div>`;
      popup.hidden=true;
      if(key==='ask'||key==='explain'){
        const step=window.MindIELab.steps.find(s=>s.file===selection.file);
        api.beginTool(`请解释所选代码：${context}\n${selection.text}`,`<p>已收到你框选的 <b>${esc(context)}</b>：</p>${snippet}${selectionExplanation()}<p>${esc(step?.goal||'可以继续描述你的问题。')}</p><small>依据当前课程手册的预设说明，非实时 AI；不会修改或执行代码。</small>`);
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
      const before=editor.value;editor.setRangeText(selection.replacement,selection.start,selection.end,'select');const after=editor.value;editor.dispatchEvent(new Event('input',{bubbles:true}));undo={file:selection.file,before,after};refreshBar();popup.hidden=true;ide.showToast('仅替换所选代码；请点击 IDE“运行”验证');
    }
  });
  popup.addEventListener('submit',e=>{
    const form=e.target;if(!form.matches('[data-selection-question]'))return;e.preventDefault();
    const question=form.elements.question.value.trim(),status=form.querySelector('[role="status"]');
    if(!question){status.textContent='请输入问题后再发送。';form.elements.question.focus();return;}
    if(!selection||filename()!==selection.file||editor.value!==selection.whole){status.textContent='代码已变化，请重新框选后提问。';return;}
    clearTimeout(selectionTimer);
    const context=selectionLabel(),snippet=`<div class="env-code-advice"><pre><code>${engine.highlightShell(selection.text)}</code></pre></div>`;
    popup.hidden=true;
    api.beginTool(`${question}（${context}）`,`<p>你问的是 <b>${esc(context)}</b> 中的这段代码：</p>${snippet}${selectionExplanation()}<small>以上是根据课程内容整理的提示；本演示未连接实时 AI。如需更具体的回答，请在学伴中继续补充问题。</small>`);
  });
  document.addEventListener('submit',e=>{
    const form=e.target;if(!form.matches('[data-uac-code-note]'))return;e.preventDefault();
    const note=form.elements.note.value.trim();if(!note)return;
    if(!api.saveNote?.(note)){form.querySelector('[data-uac-note-status]').textContent='未能保存，浏览器存储不可用；请先复制笔记内容。';return;}
    const id=Number(form.closest('[data-uac-message]').dataset.uacMessage);
    api.updateToolMessage(id,`<section class="selection-note-draft"><h3>代码笔记</h3><p role="status">已保存到本机“我的笔记”。</p><pre>${esc(note)}</pre><button type="button" data-uac-feature="notes">查看我的笔记 →</button></section>`);
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
