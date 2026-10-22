(() => {
  if(new URLSearchParams(location.search).get('course')!=='mindie')return;
  const api=window.AscendLearning,$=id=>document.getElementById(id),lab=window.MindIELab;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const body=document.querySelector('#videoIde .ide-body'),explorer=body.querySelector('.ide-explorer'),editor=$('ideEditor');
  const rail=document.createElement('nav');rail.className='mindie-plugin-rail';rail.setAttribute('aria-label','IDE 插件');
  const plugins=['资源管理器','搜索','源代码管理','运行和调试','扩展'];
  rail.innerHTML=plugins.map((label,i)=>`<button type="button" data-ide-plugin="${i}" class="${i===0?'active':''}" aria-pressed="${i===0}" title="${label}"><span>${label}</span></button>`).join('');body.prepend(rail);
  const tree=document.createElement('div');tree.className='mindie-nested-tree';
  const samples={
    'conf/config.json':lab.steps[5].code,
    'scripts/service/start.sh':lab.steps[6].code,
    'scripts/client/generate.sh':lab.steps[7].code,
    'docs/lab-notes.md':'# 文本生成实验笔记\n\n1. 主机权重：/home/lgy/Qwen2-7B/\n2. 容器权重：/home/weights/\n3. 服务：127.0.0.1:1025/generate\n\n记录真实环境中的配置、服务日志与接口响应。',
    'logs/output.log':'# 服务日志位置示意\n# 请在真实实验环境查看 output.log\n# 预期成功标记：Daemon start success!\n# 本文件不是实际运行日志。'
  };api.loadFiles(samples);
  // One project tree for both the manual steps and supporting example files.
  const stepFiles=[...explorer.querySelectorAll('.mindie-lab-files [data-mindie-step]')];
  const branch=(name,indices,children='')=>`<details open><summary><span class="mindie-folder-icon" aria-hidden="true"></span>${name}</summary><div class="mindie-tree-children">${indices.map(i=>`<span data-step-slot="${i}"></span>`).join('')}${children}</div></details>`;
  tree.innerHTML='<details class="mindie-project-root" open><summary>MINDIE-TEXT-LAB</summary><div class="mindie-tree-children">'+branch('environment',[0,1])+branch('container',[2,3])+branch('scripts',[],branch('setup',[4])+branch('service',[6])+branch('client',[7]))+branch('conf',[5])+branch('docs',[],'<button type="button" data-nested-file="docs/lab-notes.md"><span>MD</span>lab-notes.md</button>')+branch('logs',[],'<button type="button" data-nested-file="logs/output.log"><span>≡</span>output.log</button>')+'</div></details>';
  // Move real file buttons rather than copying them, preserving existing file actions.
  stepFiles.forEach((button,i)=>{button.querySelector('span').textContent=button.dataset.ideFile.endsWith('.json')?'{}':'$';button.title=button.dataset.ideFile;tree.querySelector(`[data-step-slot="${i}"]`).replaceWith(button);});
  explorer.querySelector('.mindie-lab-files').remove();
  explorer.append(tree);
  const markCurrent=button=>{tree.querySelectorAll('button').forEach(b=>{b.classList.toggle('active',b===button);if(b===button)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});};
  markCurrent(stepFiles[0]);
  document.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;if(tree.contains(button)){markCurrent(button);}else if(button.dataset.mindieStep!==undefined){markCurrent(stepFiles[Number(button.dataset.mindieStep)]);}});
  const pluginPanel=document.createElement('section');pluginPanel.className='mindie-plugin-content';pluginPanel.hidden=true;explorer.append(pluginPanel);
  function plugin(index){rail.querySelectorAll('button').forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-pressed',String(i===index));});explorer.querySelector('header span').textContent=plugins[index];[...explorer.children].filter(n=>n!==pluginPanel&&n.tagName!=='HEADER').forEach(n=>n.hidden=index!==0);pluginPanel.hidden=index===0;
    if(index===1)pluginPanel.innerHTML='<label for="mindieFileSearch">搜索实验文件</label><input id="mindieFileSearch" type="search" placeholder="文件名或代码内容"><div id="mindieSearchResults"></div>';
    if(index===2)pluginPanel.innerHTML='<h3>源代码管理</h3><p>当前为本地学习演示，未连接 Git 仓库。</p><p>编辑器中的修改会在本页切换文件时保留。</p>';
    if(index===3)pluginPanel.innerHTML='<h3>运行和调试</h3><p>先演示配置路径错误，再对照修复建议。</p><button type="button" data-repair-action="demo">演示配置报错</button><small>不会启动实际容器或模型。</small>';
    if(index===4)pluginPanel.innerHTML='<h3>扩展</h3><p>Shell 语法支持</p><p>JSON 配置校验</p><p>AI 学伴</p><small>插件入口示意，未安装或连接外部扩展。</small>';
  }
  pluginPanel.addEventListener('input',e=>{if(e.target.id!=='mindieFileSearch')return;const q=e.target.value.trim().toLowerCase();const files=[...lab.steps.map(s=>[s.file,s.code]),...Object.entries(samples)];$('mindieSearchResults').innerHTML=q?files.filter(([name,code])=>(name+' '+code).toLowerCase().includes(q)).map(([name])=>`<button type="button" data-search-file="${esc(name)}">${esc(name)}</button>`).join('')||'<p>没有匹配的文件</p>':'<p>输入关键词搜索</p>';});
  // Retain the legacy output as a hidden data source; only diagnostics are shown.
  const output=$('ideOutput'),stack=document.createElement('section');stack.className='mindie-bottom-stack';output.before(stack);stack.append(output);
  const consolePanel=document.createElement('section');consolePanel.className='mindie-console';consolePanel.setAttribute('aria-label','问题、输出与终端');consolePanel.innerHTML='<nav role="tablist" aria-label="IDE 底部面板"><button type="button" role="tab" aria-selected="false" data-console-tab="problems">问题 <span id="mindieProblemCount">0</span></button><button type="button" role="tab" aria-selected="true" class="active" data-console-tab="output">输出</button><button type="button" role="tab" aria-selected="false" data-console-tab="terminal">终端</button></nav><div id="mindieConsoleBody" role="tabpanel" tabindex="0"></div>';stack.append(consolePanel);
  let consoleTab='output',repair=null;
  const terminalRecords=[];
  function terminalMarkup(){const labels={running:'模拟处理中',success:'已完成（演示）',error:'失败（演示）',paused:'已暂停（演示）'};return '<div class="mindie-agent-terminal"><small>AI 学伴回写 · 演示记录 · 终端未连接真实服务器</small>'+terminalRecords.map(r=>`<section class="mindie-terminal-entry ${r.status}"><header><code><span>demo@host-${esc(r.host.toLowerCase())}:~$</span> ${esc(r.command)}</code><span>${labels[r.status]}</span></header>${r.output?`<pre>${esc(r.output)}</pre>`:'<p>等待模拟回显…</p>'}</section>`).join('')+'</div>';}
  window.MindIETerminal={write(record,{reveal=false}={}){
    if(!record||typeof record.id!=='string'||!['running','success','error','paused'].includes(record.status))return;
    const next={id:record.id,command:String(record.command||''),host:record.host==='B'?'B':'A',status:record.status,output:String(record.output||'')};
    const index=terminalRecords.findIndex(r=>r.id===next.id);if(index<0)terminalRecords.push(next);else terminalRecords[index]=next;
    if(reveal){api.setView('video');api.setVideoPerspective('ide');consoleTab='terminal';}
    if(consoleTab==='terminal'){renderConsole();$('mindieConsoleBody').scrollTop=$('mindieConsoleBody').scrollHeight;}
  }};
  editor.setAttribute('aria-describedby','mindieConsoleBody');
  function renderConsole(){consolePanel.querySelectorAll('[data-console-tab]').forEach(b=>{const active=b.dataset.consoleTab===consoleTab;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));});$('mindieProblemCount').textContent=repair&&!repair.applied?'1':'0';const s=window.MindIECurrentStep||lab.steps[0];let html;
    if(consoleTab==='problems')html=repair?`<div class="mindie-problem ${repair.applied?'pending':''}" role="status"><strong>${repair.applied?'修改已应用 · 待真实运行验证':'路径错误示例 · config.patch.json'}</strong><p>${repair.applied?'已改为容器权重路径 /home/weights/。这里只应用代码，不代表服务运行成功。':`第 ${repair.line} 行：modelWeightPath 使用了主机路径，服务在容器内无法按此路径读取挂载权重。`}</p>${repair.applied?'':'<button type="button" data-repair-action="show">✦ 查看 AI 修复对照</button>'}</div>`:'<p>暂无已标记的问题。可点击“演示报错”查看修复流程。</p>';
    if(consoleTab==='output')html=`<small>手册回显示例 · 未连接 NPU</small><pre>${esc(s.output)}</pre>`;
    if(consoleTab==='terminal')html=terminalRecords.length?terminalMarkup():`<small>${esc(s.context)} · 终端未连接（只读命令预览，未执行）</small><pre>${esc(s.code)}</pre>`;
    $('mindieConsoleBody').innerHTML=html;
  }
  renderConsole();
  const shell=document.querySelector('#videoIde .ide-editor-shell'),split=document.createElement('div');split.className='mindie-editor-split';shell.before(split);
  const left=document.createElement('section');left.className='mindie-current-editor';left.innerHTML='<header class="mindie-compare-header" hidden><span>当前代码 · 错误位置</span><b>config.patch.json</b></header>';left.append(shell);split.append(left);
  const right=document.createElement('section');right.className='mindie-correct-editor';right.hidden=true;right.setAttribute('aria-label','AI 学伴正确代码示例');split.append(right);
  const surface=document.querySelector('#videoIde .ide-code-surface'),mark=document.createElement('div');mark.className='mindie-error-line';mark.hidden=true;surface.append(mark);
  const ai=document.createElement('button');ai.type='button';ai.className='mindie-line-ai';ai.innerHTML='✦';ai.hidden=true;ai.setAttribute('aria-label','AI 学伴：查看此行修复建议');ai.title='AI 学伴 · 查看修复对照';ai.dataset.repairAction='show';surface.append(ai);
  const demo=document.createElement('button');demo.type='button';demo.className='mindie-demo-error';demo.dataset.repairAction='demo';demo.textContent='演示报错';document.querySelector('#videoIde .ide-actions').insertBefore(demo,$('runCode'));
  function positionError(){if(!repair){mark.hidden=true;ai.hidden=true;return;}const target=repair.applied?repair.correct:repair.wrong;repair.line=editor.value.split('\n').findIndex(line=>line.includes(target))+1;const style=getComputedStyle(editor),height=parseFloat(style.lineHeight)||22.1;const top=(parseFloat(style.paddingTop)||16)+(repair.line-1)*height-editor.scrollTop;mark.style.top=`${top}px`;mark.style.height=`${height}px`;mark.classList.toggle('applied',repair.applied);mark.hidden=repair.line<1||top<0||top>editor.clientHeight;ai.style.top=`${top-3}px`;ai.hidden=repair.applied||mark.hidden;}
  editor.addEventListener('scroll',positionError);
  editor.addEventListener('input',positionError);
  function closeRepair(){repair=null;split.classList.remove('is-comparing');right.hidden=true;left.querySelector('header').hidden=true;mark.hidden=true;ai.hidden=true;renderConsole();}
  function showComparison(){if(!repair)return;positionError();$('ideLineHighlight').hidden=true;split.classList.add('is-comparing');right.hidden=false;left.querySelector('header').hidden=false;left.querySelector('header span').textContent=repair.applied?'当前代码 · 已应用修复':'当前代码 · 错误位置';
    const correct=editor.value.replace(repair.wrong,repair.correct);right.innerHTML=`<header class="mindie-compare-header"><span>✦ AI 学伴 · 正确示例</span><button type="button" data-repair-action="close" aria-label="关闭代码对照">×</button></header><div class="mindie-repair-explanation"><b>将主机路径改为容器路径</b><p>主机目录通过 docker -v 挂载到 /home/weights/，服务配置读取容器内路径。</p></div><div class="mindie-reference-code">${correct.split('\n').map((line,i)=>`<div class="${i+1===repair.line?'correct-line':''}"><span>${i+1}</span>${i+1===repair.line?`<button type="button" data-repair-action="apply" title="点击应用此处修复" ${repair.applied?'disabled':''}>${esc(line)}</button>`:`<code>${esc(line)||' '}</code>`}</div>`).join('')}</div><footer><span>${repair.applied?'已应用 · 待验证':'仅修改这一处路径，不覆盖其他代码'}</span><button type="button" data-repair-action="apply" ${repair.applied?'disabled':''}>${repair.applied?'✓ 已填入左侧':'← 应用到当前代码'}</button></footer>`;
    positionError();
  }
  function simulateError(){closeRepair();api.setView('video');api.setVideoPerspective('ide');document.querySelector('.ide-tabs [data-mindie-step="5"]').click();api.setIdeAssistOpen(false,false);$('ideMiniVideo').hidden=true;
    const correct='"modelWeightPath": "/home/weights/"',wrong='"modelWeightPath": "/home/lgy/Qwen2-7B/"';
    if(!editor.value.includes(correct)){api.showToast('当前权重路径已被修改，请使用原始配置字段后再演示；未覆盖你的修改');return;}
    editor.value=editor.value.replace(correct,wrong);editor.dispatchEvent(new Event('input',{bubbles:true}));repair={wrong,correct,line:editor.value.split('\n').findIndex(line=>line.includes(wrong))+1,applied:false};editor.scrollTop=Math.max(0,(repair.line-5)*22.1);consoleTab='problems';renderConsole();showComparison();$('mindieConsoleBody').setAttribute('role','alert');api.showToast('已进入演示报错场景，未执行真实服务');
  }
  function apply(){if(!repair||repair.applied)return;if(!editor.value.includes(repair.wrong)){api.showToast('当前错误行已变化，请核对后重新打开建议；未覆盖代码');return;}const start=editor.value.indexOf(repair.wrong);editor.setRangeText(repair.correct,start,start+repair.wrong.length,'preserve');editor.dispatchEvent(new Event('input',{bubbles:true}));repair.applied=true;showComparison();renderConsole();api.showToast('正确路径已填入左侧；请在真实环境重新运行验证');}
  document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.idePlugin!==undefined)plugin(Number(b.dataset.idePlugin));if(b.dataset.consoleTab){consoleTab=b.dataset.consoleTab;renderConsole();}if(b.dataset.nestedFile){closeRepair();api.openIdeFile(b.dataset.nestedFile);api.showToast(`已打开 ${b.dataset.nestedFile}（目录示意）`);}if(b.dataset.searchFile){closeRepair();const i=lab.steps.findIndex(s=>s.file===b.dataset.searchFile);if(i>=0)document.querySelector(`.ide-tabs [data-mindie-step="${i}"]`).click();else api.openIdeFile(b.dataset.searchFile);}
    const a=b.dataset.repairAction;if(a==='demo')simulateError();if(a==='show')showComparison();if(a==='apply')apply();if(a==='close'){split.classList.remove('is-comparing');right.hidden=true;left.querySelector('header').hidden=true;}
  });
  document.addEventListener('click',e=>{if(e.target.closest('[data-mindie-step]')&&repair)closeRepair();},true);
  document.addEventListener('mindie:preview-output',()=>{if(repair&&!repair.applied){consoleTab='problems';showComparison();}else consoleTab='output';renderConsole();});
  new MutationObserver(()=>{renderConsole();}).observe(output,{childList:true});
  const params=new URLSearchParams(location.search);if(params.get('scenario')==='error')simulateError();else if(params.get('perspective')==='ide'){api.setView('video');api.setVideoPerspective('ide');}
})();
