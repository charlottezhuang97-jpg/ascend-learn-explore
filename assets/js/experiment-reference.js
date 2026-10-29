/* The four experiment-mode frames, implemented as one editable exercise. */
(() => {
  if(!location.pathname.endsWith('/learn.html'))return;
  const floor=document.querySelector('.fixed1030-floor-learning'),assistant=window.AscendCompanion,panel=document.getElementById('unifiedCompanion');
  if(!floor||!assistant||!panel)return;
  const root=new URL('../../',document.currentScript.src),asset=p=>new URL(p,root).href;
  const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href=asset('assets/css/experiment-reference.css?v=2');document.head.append(sheet);
  const icon=name=>`<span class="ex-icon ex-${name}" aria-hidden="true"></span>`;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const filename='config.patch.json',hostPath='/home/lgy/Qwen2-7B/',containerPath='/home/weights/';
  const original=JSON.stringify({ServerConfig:{httpsEnabled:false},BackendConfig:{npuDeviceIds:[[0]],ModelDeployConfig:{ModelConfig:[{modelName:'qwen2-7b',modelWeightPath:hostPath,worldSize:1,trustRemoteCode:false}]}}},null,2).replace('[\n      [\n        0\n      ]\n    ]','[[0]]');
  let code=original,proposal='',stage='idle',showRepair=false,consoleTab='Terminal',runTimer=null,generationTimer=null,runId=0;
  const surface=document.createElement('main');surface.className='ex-surface';surface.hidden=true;surface.dataset.state=stage;surface.setAttribute('aria-label','HiDevLab 实验学习');
  const treeFile=(name,depth=0)=>`<button type="button" class="ex-tree-file${name===filename?' active':''}" style="--depth:${depth}" data-ex-file="${name}">${icon(name.endsWith('.json')||name.endsWith('.json5')?'json':'file')}<span>${name}</span></button>`;
  const folder=(name,children='',open=false)=>`<details ${open?'open':''}><summary>${icon('folder')}<span>${name}</span></summary><div>${children}</div></details>`;
  const project=folder('MyApplication',folder('.hvigor')+folder('.idea')+folder('AppScope')+folder('entry',folder('.preview')+folder('src',folder('main',folder('ets',treeFile('Index.ets')+folder('entryability')+folder('pages',treeFile('Index.ets'),true),true),true),true)+folder('resources')+treeFile('module.json5'),true)+folder('ohosTest')+folder('Test')+treeFile(filename)+['.gitignore','build-profile.json5','hvigorfile.ts','obfuscation-rules.txt','oh-package.json5','topo.json','.gitignore','build-profile.json5','hvigorfile.ts','obfuscation-rules.txt','oh-package.json5','topo.json'].map(f=>treeFile(f)).join(''),true);
  surface.innerHTML=`<header class="ex-course"><a href="course-preview.html?course=${encodeURIComponent(new URLSearchParams(location.search).get('course')||'operator')}" aria-label="返回课程详情">${icon('back')}</a><button type="button" data-ex-directory>Ascend C 算子开发基础 ${icon('chevron')}</button><button type="button" class="ex-assistant-entry" data-ex-assistant hidden>学习助手</button></header>
    <section class="ex-workbench"><header class="ex-menu"><span class="ex-brand" role="img" aria-label="HiDevLab"></span><strong>在线环境</strong><nav aria-label="IDE 菜单">${['文件','编辑','查看','导航','调试','Git','窗口','帮助'].map(x=>`<button type="button" data-ex-menu="${x}">${x}</button>`).join('')}</nav><div class="ex-environment"><span>我的环境：</span><b>NPU A3</b><span>DevEnvC_4aoJC</span>${icon('chevron')}</div></header>
    <nav class="ex-rail" aria-label="工作区工具">${[['project','资源管理器'],['search','搜索'],['source-control','源代码管理'],['wiki','课程资料'],['extensions','扩展'],['run','运行和调试']].map(([key,label],i)=>`<button type="button" data-ex-rail="${key}" aria-label="${label}" class="${i?'':'active'}">${icon(key)}</button>`).join('')}</nav><aside class="ex-explorer"><header>Project</header><div class="ex-tree">${project}</div></aside>
    <section class="ex-editor"><div class="ex-tabs" role="tablist" aria-label="打开的文件">${['Index.ets','Index1.ets','Index1.ets',filename].map((name,i)=>`<button type="button" role="tab" aria-selected="${i===3}" class="${i===3?'active':''}" data-ex-tab="${name}">${icon(i===3?'json':'file')}${name}${i===3?icon('close'):''}</button>`).join('')}<div class="ex-editor-actions"><button type="button" data-ex-run aria-label="运行和调试当前代码" title="运行和调试">${icon('debug')}</button><button type="button" data-ex-run-menu aria-label="运行选项">${icon('chevron')}</button><button type="button" data-ex-split aria-label="切换代码对照">${icon('split')}</button><button type="button" data-ex-more aria-label="更多编辑操作">${icon('more')}</button><div class="ex-run-menu" hidden><button type="button" data-ex-run>运行和调试</button><button type="button" data-ex-reset>重置实验</button></div></div></div>
    <div class="ex-breadcrumb">${['makefile','otc','code','alpha','Index.ets'].map(x=>`<span>${icon('folder')}${x}</span>`).join('')}</div>
    <div class="ex-editor-split"><section class="ex-current" aria-label="当前代码"><div class="ex-code-caption">${icon('json')} test &gt;...</div><div class="ex-code-viewport"><div class="ex-code-render" aria-hidden="true"></div><textarea class="ex-code-input" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="config.patch.json 代码编辑器"></textarea></div><div class="ex-selection-actions" hidden><button type="button" data-ex-generate aria-label="帮我写代码" title="帮我写代码并解释问题">${icon('ai')}帮我修复</button><button type="button" data-ex-explain>${icon('explain')}帮我解释</button><button type="button" data-ex-note>${icon('note')}记笔记</button></div></section><section class="ex-proposal" aria-label="AI 生成的修复代码" hidden><header>${icon('ai')}<button type="button" data-ex-apply>一键置入</button></header><div class="ex-code-caption">${icon('json')} test &gt;...</div><div class="ex-proposal-code"></div></section><button type="button" class="ex-compare-toggle" data-ex-split aria-label="收起或展开代码对照" hidden>‹ ›</button></div>
    <section class="ex-terminal" aria-label="实验输出"><nav role="tablist" aria-label="输出面板">${[['Terminal','terminal'],['Problem','problem'],['Output','output'],['DebugConsole','debug-console'],['Event','event']].map(([name,key],i)=>`<button type="button" role="tab" aria-selected="${!i}" class="${i?'':'active'}" data-ex-console="${name}">${icon(key)}${name}</button>`).join('')}<span></span><button type="button" data-ex-clear aria-label="清空终端">${icon('plus')}</button>${icon('chevron')}${icon('more')}<button type="button" data-ex-terminal-size aria-label="展开或收起终端">${icon('fullscreen')}</button><button type="button" data-ex-terminal-close aria-label="收起终端">${icon('close')}</button></nav><div class="ex-console-content" role="log" aria-live="polite"></div></section></section>
    <footer class="ex-footer"><nav aria-label="学习视角">${[['video','视频'],['board','白板'],['ide','实验']].map(([mode,label])=>`<button type="button" data-ex-mode="${mode}" class="${mode==='ide'?'active':''}">${label}</button>`).join('')}</nav><div><button type="button" data-ex-comments>${icon('comment')}课程评论</button><button type="button" data-ex-resources>${icon('resources')}学习资料</button></div></footer></section><p class="ex-sr" role="status" aria-live="polite" data-ex-status></p>`;
  floor.append(surface);
  const input=surface.querySelector('.ex-code-input'),render=surface.querySelector('.ex-code-render'),proposalView=surface.querySelector('.ex-proposal-code'),consoleContent=surface.querySelector('.ex-console-content');
  input.value=code;
  function highlight(line){return line.replace(/"(?:[^"\\]|\\.)*"|\b(?:true|false|null)\b|\b\d+\b|[{}\[\]]/g,(token,offset)=>{const type=token.startsWith('"')?(line.slice(offset+token.length).trimStart().startsWith(':')?'key':'string'):/true|false|null|\d/.test(token)?'value':'brace';return `<span class="ex-token-${type}">${esc(token)}</span>`;});}
  function pathLine(value){return value.split('\n').findIndex(line=>line.includes('"modelWeightPath"'))+1;}
  function rows(value,proposed=false){const lines=value.split('\n');while(lines.length<27)lines.push('');return lines.map((line,i)=>{let state='';if(i+1===pathLine(value)){if(proposed||stage==='success')state=' verified';else if(stage==='applied')state=' inserted';else if(stage==='error'||stage==='suggestion')state=' invalid';}return `<div class="ex-code-line${state}" data-line="${i+1}"><span class="ex-line-number">${i+1}</span><code>${highlight(line)||' '}</code></div>`;}).join('');}
  function status(text){surface.querySelector('[data-ex-status]').textContent=text;}
  function paint(){
    surface.dataset.state=stage;render.innerHTML=rows(code);proposalView.innerHTML=rows(proposal||code,true);
    const compare=['suggestion','applied','success'].includes(stage);surface.querySelector('.ex-proposal').hidden=!compare;surface.querySelector('.ex-compare-toggle').hidden=!compare;surface.querySelector('.ex-editor-split').classList.toggle('is-comparing',compare);
    surface.querySelector('.ex-selection-actions').hidden=stage!=='error';surface.querySelector('[data-ex-apply]').disabled=stage!=='suggestion';surface.querySelector('[data-ex-run]').disabled=stage==='running'||stage==='generating';
    surface.querySelector('[data-ex-generate]').disabled=stage==='generating';render.style.transform=`translate(${-input.scrollLeft}px,${-input.scrollTop}px)`;
    paintConsole();if(showRepair)paintAssistant();
  }
  const buildOutput='<p>Downloading org.apache.maven.plugins:maven-j　 <span>21 sec,60 ms</span></p><p>Downloading org.apache.maven.plugins:maven-re　 <span>21 sec,121 ms</span></p><p><code>chunk {0} <em>runtime.38f7659sdbsoyt7980svjsbhcdskb.js</em> (runtime) 2.25 KB [entry] <em>[rendered]</em></code></p><p><code>chunk {1} <em>common.jsdtfha687adftadjgsf5557.js</em> (common) 1.79 KB <em>[rendered]</em></code></p><p>Downloading org.apache.maven.plugins:maven-j　 <span>21 sec,60 ms</span></p>';
  let diagnostic='';
  function paintConsole(){surface.querySelectorAll('[data-ex-console]').forEach(b=>{const selected=b.dataset.exConsole===consoleTab;b.classList.toggle('active',selected);b.setAttribute('aria-selected',String(selected));});consoleContent.innerHTML=consoleTab==='Problem'?(stage==='error'||stage==='suggestion'?`<p class="ex-console-error">${icon('error')} ${filename}:${pathLine(code)}　${esc(diagnostic||'modelWeightPath 使用了主机路径，请改为容器可见路径。')}</p>`:'<p>没有待处理的问题。</p>'):consoleTab==='Event'?'<p>本地实验交互示例，未连接真实 NPU 或容器。</p>':buildOutput;}
  function run(){
    if(runTimer||generationTimer)return;
    const id=++runId;stage='running';paint();status('正在检查配置');
    runTimer=setTimeout(()=>{runTimer=null;if(id!==runId)return;let config;
      try{config=JSON.parse(code);}catch{diagnostic='JSON 格式有误，请检查括号、引号与逗号。';stage='error';paint();status(diagnostic);return;}
      const value=config?.BackendConfig?.ModelDeployConfig?.ModelConfig?.[0]?.modelWeightPath;
      if(value!==containerPath){diagnostic=value===hostPath?'服务在容器内运行，无法使用主机权重路径。':'modelWeightPath 应指向容器挂载目录 /home/weights/。';stage='error';status('配置路径报错，可点击帮我修复');}
      else{stage='success';status('本地配置检查通过；未执行真实 NPU 服务');}
      paint();
    },450);
  }
  function generate(){
    if(generationTimer||runTimer)return;
    let parsed;try{parsed=JSON.parse(code);}catch{status('请先修正 JSON 格式，再生成路径修复建议');window.AscendLearning.showToast('请先修正 JSON 格式，避免覆盖其他代码');return;}
    if(!parsed?.BackendConfig?.ModelDeployConfig?.ModelConfig?.[0]){window.AscendLearning.showToast('缺少 ModelConfig，未修改当前文件');return;}
    const old=parsed.BackendConfig.ModelDeployConfig.ModelConfig[0].modelWeightPath;
    if(typeof old!=='string'){window.AscendLearning.showToast('缺少 modelWeightPath 字符串，未修改当前文件');return;}
    proposal=code.replace(/("modelWeightPath"\s*:\s*)"(?:[^"\\]|\\.)*"/,(_,prefix)=>prefix+JSON.stringify(containerPath));
    stage='generating';paint();status('正在生成修复代码');
    generationTimer=setTimeout(()=>{generationTimer=null;stage='suggestion';showRepair=true;assistant.beginIsolatedTool('帮我写这段报错代码并解释问题','');paint();status('代码建议已生成，等待一键置入');},650);
  }
  function apply(){
    if(stage!=='suggestion'||!proposal)return;
    const before=code;code=proposal;input.value=code;stage='applied';paint();
    surface._undo=before;status('修复代码已置入，尚未运行');input.focus({preventScroll:true});
  }
  function paintAssistant(){
    if(document.body.dataset.fixedView!=='ide'||!showRepair)return;
    const content=panel.querySelector('.uac-body');content.className='uac-body ex-assistant-repair';
    content.innerHTML=`<div class="ex-request"><p>帮我写这段报错代码并解释问题</p><code>${highlight('"modelWeightPath": "'+hostPath+'"')}</code></div><h3>已为你生成代码</h3><section class="ex-explanation"><header><b>代码解释</b><button type="button" data-ex-copy aria-label="复制修复代码">${icon('copy')}</button><button type="button" data-ex-note aria-label="记录修复笔记">${icon('note')}</button></header><p>目前报错主要是路径有误<br>已为你将主机路径改为容器路径</p><code class="ex-generated-snippet">${highlight('"modelWeightPath": "'+containerPath+'"')}</code></section><div class="ex-feedback">${[['regenerate','重新生成'],['copy','复制'],['like','有帮助'],['dislike','无帮助'],['report','反馈问题']].map(([key,label])=>`<button type="button" data-ex-feedback="${key}" aria-label="${label}">${icon(key)}</button>`).join('')}</div><details class="ex-generated-code"><summary>查看生成代码 · config.patch.json</summary><pre><code>${(proposal||code).split('\n').map(highlight).join('\n')}</code></pre></details>`;
    panel.querySelector('.iv-selected-tool').hidden=true;
  }
  function reset(){clearTimeout(runTimer);clearTimeout(generationTimer);runTimer=null;generationTimer=null;runId++;code=original;input.value=code;proposal='';stage='idle';showRepair=false;surface._undo=null;assistant.showHome();paint();status('已重置实验');}
  function sync(){const ide=document.body.dataset.fixedView==='ide';surface.hidden=!ide;if(ide){panel.querySelector('[data-uac-action=close]').hidden=false;surface.querySelector('[data-ex-assistant]').hidden=!panel.hidden;if(showRepair)paintAssistant();}}
  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['data-fixed-view']});
  new MutationObserver(sync).observe(panel,{attributes:true,attributeFilter:['hidden']});
  document.addEventListener('uac:render',()=>{if(showRepair)paintAssistant();});
  panel.addEventListener('click',event=>{if(event.target.closest('[data-uac-action],[data-iv-tool],[data-uac-feature]'))showRepair=false;},true);
  input.addEventListener('input',()=>{clearTimeout(runTimer);clearTimeout(generationTimer);runTimer=null;generationTimer=null;runId++;surface._undo=null;code=input.value;stage='idle';proposal='';paint();status('代码已修改，请重新运行检查');});
  input.addEventListener('scroll',()=>render.style.transform=`translate(${-input.scrollLeft}px,${-input.scrollTop}px)`);
  input.addEventListener('keydown',event=>{if(event.key==='Tab'){event.preventDefault();input.setRangeText('  ',input.selectionStart,input.selectionEnd,'end');input.dispatchEvent(new Event('input'));}if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'&&surface._undo){event.preventDefault();code=surface._undo;surface._undo=null;input.value=code;stage='idle';proposal='';paint();status('已撤销置入');}});
  async function copy(){try{await navigator.clipboard.writeText(proposal||code);window.AscendLearning.showToast('代码已复制');}catch{window.AscendLearning.showToast('请选中编辑器中的代码后复制');}}
  function note(){const text='config.patch.json：modelWeightPath 必须使用容器路径 /home/weights/，而非主机路径 '+hostPath;window.AscendLearning.showToast(assistant.saveNote(text)?'修复笔记已保存在本机':'未能保存笔记，请重试');}
  function click(event){
    const b=event.target.closest('button');if(!b)return;
    if(b.hasAttribute('data-ex-run'))run();if(b.hasAttribute('data-ex-generate'))generate();if(b.hasAttribute('data-ex-apply'))apply();if(b.hasAttribute('data-ex-reset'))reset();if(b.hasAttribute('data-ex-copy'))copy();if(b.hasAttribute('data-ex-note'))note();
    if(b.hasAttribute('data-ex-explain')){showRepair=true;assistant.beginIsolatedTool('解释这段报错代码','');paintAssistant();}
    if(b.hasAttribute('data-ex-assistant'))assistant.open();
    if(b.hasAttribute('data-ex-run-menu')||b.hasAttribute('data-ex-more')){const menu=surface.querySelector('.ex-run-menu');menu.hidden=!menu.hidden;}
    if(b.hasAttribute('data-ex-split')&&proposal){const split=surface.querySelector('.ex-editor-split');split.classList.toggle('is-comparing');surface.querySelector('.ex-proposal').hidden=!split.classList.contains('is-comparing');}
    if(b.dataset.exMode)document.querySelector(`.fixed1030-footer [data-fixed-view="${b.dataset.exMode}"]`)?.click();
    if(b.dataset.exConsole){consoleTab=b.dataset.exConsole;paintConsole();}
    if(b.hasAttribute('data-ex-clear'))consoleContent.innerHTML='';
    if(b.hasAttribute('data-ex-terminal-size'))surface.classList.toggle('ex-terminal-expanded');
    if(b.hasAttribute('data-ex-terminal-close'))surface.classList.toggle('ex-terminal-collapsed');
    if(b.hasAttribute('data-ex-comments'))document.querySelector('.fixed1030-footer [data-fixed-comment]')?.click();
    if(b.hasAttribute('data-ex-resources'))document.querySelector('.fixed1030-footer [data-fixed-resources]')?.click();
    if(b.hasAttribute('data-ex-directory'))document.querySelector('.fixed1030-lesson .lesson-directory-trigger')?.click();
    if(b.dataset.exFeedback==='copy')copy();if(b.dataset.exFeedback==='regenerate')generate();if(['like','dislike'].includes(b.dataset.exFeedback)){b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'));}
    if(b.dataset.exFeedback==='report')window.AscendLearning.showToast('可通过课程评论反馈本次代码建议的问题');
    if(b.dataset.exMenu==='文件')surface.querySelector('.ex-tree-file.active')?.focus();
    if(b.dataset.exMenu==='调试')run();
  }
  surface.addEventListener('click',click);panel.addEventListener('click',click);
  surface.querySelector('[data-ex-run]').title='运行和调试 · 本地配置检查示例';
  paint();sync();
})();
