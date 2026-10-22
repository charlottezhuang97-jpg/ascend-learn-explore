/* Step 7: local, non-executing comparison of a curl draft and a response fixture. */
(() => {
  if(new URLSearchParams(location.search).get('course')!=='mindie'||!window.AscendCompanion)return;
  const api=window.AscendCompanion,learning=window.AscendLearning;
  const names=['环境准备','下载模型权重','获取MindIE镜像','启动容器','模型推理配置','启动MindIE服务','推理交互'];
  const file='08_generate.sh',expectedPrompt='介绍下Qwen2-7B';
  const expectedURL='http://127.0.0.1:1025/generate';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const editor=()=>document.getElementById('ideEditor');
  const currentFile=()=>document.querySelector('.ide-tabs button.active')?.dataset.ideFile;
  const find=id=>document.querySelector(`[data-uac-inference-id="${id}"]`);
  const button=(action,text,primary=false)=>`<button type="button" data-uac-inference-action="${action}" class="${primary?'env-primary':''}">${text}</button>`;
  // Parse a deliberately limited curl syntax. Never eval, spawn, fetch or execute it.
  function parseCurl(code){
    const input=code.replace(/\\\r?\n/g,' ');const tokens=[];let token='',quote=null,started=false;
    for(let i=0;i<input.length;i++){const ch=input[i];if(quote){if(ch===quote){quote=null;}else if(ch==='\\'&&quote==='"'&&['"','\\'].includes(input[i+1])){token+=input[++i];}else token+=ch;started=true;continue;}
      if(ch==='"'||ch==="'"){quote=ch;started=true;continue;}
      if(/[;|&<>`]/.test(ch)||ch==='$')throw Error('仅支持单条 curl 请求；不解析命令拼接、重定向或变量。');
      if(/\s/.test(ch)){if(started){tokens.push(token);token='';started=false;}continue;}
      token+=ch;started=true;
    }
    if(quote)throw Error('引号未闭合，无法读取请求内容。');if(started)tokens.push(token);
    if(tokens.shift()!=='curl')throw Error('请在 08_generate.sh 中填写一条 curl 请求。');
    let method='',url='',payload;const headers=[];
    while(tokens.length){const arg=tokens.shift();if(['-X','--request','-H','--header','-d','--data','--data-raw','--url'].includes(arg)){if(!tokens.length)throw Error(`${arg} 缺少参数。`);const value=tokens.shift();if(['-X','--request'].includes(arg))method=value.toUpperCase();else if(['-H','--header'].includes(arg))headers.push(value);else if(arg==='--url')url=value;else{if(payload!==undefined)throw Error('当前示例仅支持一份 JSON 请求体。');payload=value;}}else if(/^https?:\/\//.test(arg)){if(url)throw Error('当前示例仅支持一个请求地址。');url=arg;}else throw Error(`当前示例不支持参数 ${arg}，无法可靠比对；没有执行命令。`);}
    return {method:method||(payload!==undefined?'POST':'GET'),url,payload,headers};
  }
  function validate(code,response,http,filename=file){
    let request,parseError='',body,responseBody;
    try{request=parseCurl(code);}catch(error){parseError=error.message;}
    try{body=JSON.parse(request?.payload);}catch{}
    try{responseBody=JSON.parse(response);}catch{}
    const checks=[
      {name:'请求方法与地址',expected:'POST '+expectedURL,actual:request?`${request.method} ${request.url||'未填写地址'}`:parseError,pass:filename===file&&request?.method==='POST'&&request?.url===expectedURL},
      {name:'JSON 内容类型',expected:'Content-type: application/json',actual:request?.headers.find(h=>/^content-type\s*:/i.test(h))||'缺少 Content-type',pass:!!request?.headers.some(h=>/^content-type\s*:\s*application\/json\s*$/i.test(h))},
      {name:'请求体可解析',expected:'合法的 JSON 对象',actual:body&&typeof body==='object'&&!Array.isArray(body)?'JSON 对象':'请求体缺失或 JSON 无效',pass:!!body&&typeof body==='object'&&!Array.isArray(body)},
      {name:'本次提示词',expected:expectedPrompt,actual:typeof body?.prompt==='string'?body.prompt:'缺少 prompt',pass:body?.prompt===expectedPrompt},
      {name:'生成长度',expected:'max_tokens = 500',actual:`max_tokens = ${body?.max_tokens??'未填写'}`,pass:body?.max_tokens===500},
      {name:'响应状态',expected:'HTTP 200',actual:`HTTP ${http}`,pass:http===200},
      {name:'生成结果',expected:'响应为 JSON，text 是非空字符串',actual:typeof responseBody?.text==='string'&&responseBody.text.trim()?'已获得非空 text':'text 缺失、为空或响应不是合法 JSON',pass:typeof responseBody?.text==='string'&&!!responseBody.text.trim()}
    ];
    if(filename!==file)checks[0].actual=`当前打开的是 ${filename||'未知文件'}，请切换到 ${file}`;
    return {checks,passed:checks.every(c=>c.pass),count:checks.filter(c=>c.pass).length,parseError};
  }
  function suggestions(c,report){
    if(report.parseError&&['请求方法与地址','JSON 内容类型','请求体可解析','本次提示词','生成长度'].includes(c.name))return ['先处理命令解析问题：'+report.parseError,'本示例仅支持一条 curl 和一份 JSON 请求体。可在上方填入参考代码后检查；修正解析问题，再比对其他字段。'];
    const advice={
      '请求方法与地址':[`打开 ${file}，使用 -X POST，并将请求地址设为 ${expectedURL}。`,'这是本实验的目标地址；若服务部署在其他主机，应先确认对应地址与实验目标。'],
      'JSON 内容类型':['在 curl 中添加请求头 -H "Content-type: application/json"，让服务按 JSON 读取请求体。'],
      '请求体可解析':['用 -d 传入一个 JSON 对象，字段名和字符串使用英文双引号；检查逗号、括号及外层 Shell 引号是否闭合。','本步请求体示例：{"prompt":"介绍下Qwen2-7B","max_tokens":500}'],
      '本次提示词':[`将 JSON 中的 prompt 设为“${expectedPrompt}”，与本次练习目标保持一致。`,'如果你想测试其他提示词，需要调整练习目标；不同提示词不一定代表代码错误。'],
      '生成长度':['将 JSON 中的 max_tokens 设为数字 500，不要写成字符串 "500"。'],
      '响应状态':['当前是模拟 HTTP 500，不代表真实服务故障。要预览成功流程，可将上方“模拟 HTTP 状态”切换为 200，再重新比对。','真实服务返回 500 时，先查看 MindIE 服务端日志，检查模型加载状态及请求参数；处理原因后重新发送请求，以实际响应为准。不要仅修改状态数字来判定成功。'],
      '生成结果':['检查响应是否为合法 JSON，并包含非空字符串 text；本地示例可填写 {"text":"一段生成文本"}，再重新比对。','真实响应若为空或结构不同，先检查实际响应和服务日志，确认接口返回字段；不要手动补写 text 作为真实执行成功的证明。']
    };
    return advice[c.name]||['核对预期与当前值，修正后重新比对。'];
  }
  function highlightShell(code){
    const pattern=/"(?:\\.|[^"\\])*"|'[^']*'|--?[a-zA-Z][\w-]*|\bcurl\b|\b\d+\b/g;
    let html='',last=0;for(const match of code.matchAll(pattern)){html+=esc(code.slice(last,match.index));const token=match[0],kind=token==='curl'?'command':token.startsWith('-')?'flag':/^\d/.test(token)?'number':'string';html+=`<span class="env-syntax-${kind}">${esc(token)}</span>`;last=match.index+token.length;}return html+esc(code.slice(last));
  }
  function codeAdvice(c){
    const code=window.MindIELab.steps[7].code;
    const note=c.name==='响应状态'?'参考请求代码不保证修复 HTTP 500；实际服务异常仍需结合服务日志排查。本页是模拟响应，置入代码不会修改 HTTP 状态。':c.name==='生成结果'?'此代码用于发起请求，不会伪造或补写响应 text；请以服务实际返回内容为准。':'以下为符合本次练习目标的完整请求代码，可置入 IDE 后继续修改。';
    return `<div class="env-code-advice"><div class="env-code-toolbar"><span>Shell</span><div>${button('copy-advice','复制')}${button('insert-advice','置入 IDE 修改')}</div></div><pre><code>${highlightShell(code)}</code></pre><div class="env-code-note">${esc(note)}<br>置入将替换 ${file}，可撤销；不会执行命令。</div></div>`;
  }
  function reportMarkup(s){if(!s.report)return '';
    return `<section class="env-comparison ${s.report.passed?'pass':'fail'}"><div class="env-comparison-title" role="status"><b>${s.report.passed?'✓ 比对一致':'✕ 比对不一致'}</b><span>${s.report.count} / ${s.report.checks.length} 项符合 · 演示</span></div><p>${s.report.passed?'本步已完成并自动收起。可随时展开查看代码与结果。':'本步尚未完成，保留展开。按下面的建议处理，再重新比对。'}</p><div class="env-check-list">${s.report.checks.map(c=>`<details class="env-check ${c.pass?'pass':'fail'}" ${c.pass?'':'open'}><summary><span>${c.pass?'✓':'✕'}</span><b>${esc(c.name)}</b><small>${c.pass?'一致':'不一致'}</small></summary><p>预期：${esc(c.expected)}</p><p>当前：${esc(c.actual)}</p>${c.pass?'':`<div class="env-fix-advice"><b>修改建议</b><ol>${suggestions(c,s.report).map(t=>`<li>${esc(t)}</li>`).join('')}</ol><p>处理后，点击“读取当前代码并比对”再次检查。</p></div>`}</details>`).join('')}</div><details class="env-code-snapshot"><summary>查看本次读取的用户代码</summary><pre>${esc(s.code)}</pre></details><small>这是本地规则与模拟响应的比对，不代表已部署、已请求真实服务或生成内容事实正确。</small></section>`;
  }
  function markup(s){
    const template=document.createElement('template');template.innerHTML=window.MindIEStepUI.decorate(rawMarkup(s));
    template.content.querySelector('[data-uac-inference-id]').setAttribute('data-uac-inference-ui-version','4');
    // Upgrade the advice presentation without changing recorded validation data.
    for(const advice of template.content.querySelectorAll('.env-fix-advice')){
      const name=advice.closest('.env-check').querySelector('summary>b').textContent;
      const next=document.createElement('template');next.innerHTML=codeAdvice({name});advice.replaceWith(next.content);
    }
    return template.innerHTML;
  }
  function rawMarkup(s){const passed=s.status==='pass',failed=s.status==='fail';
    return `<div class="env-flow env-inference" data-uac-inference-id="${s.id}" data-uac-inference-state="${esc(JSON.stringify(s))}"><div class="env-vertical-head"><b>文本生成推理实践</b><span class="env-demo-label">第 7 步示例 · 未连接服务器</span></div><div class="env-vertical-steps">${names.map((name,i)=>i!==6?`<details class="env-vertical-step not-run"><summary><span class="env-step-number">${i+1}</span><b>${name}</b><small>本次未执行</small></summary><div class="env-step-content"><p>仅保留流程位置。本次直接预览第 7 步，没有验证此步骤，不能视为已完成。</p></div></details>`:`<details class="env-vertical-step current ${passed?'pass':failed?'fail':''}" ${passed?'':'open'} data-uac-inference-step><summary><span class="env-step-number">${passed?'✓':failed?'✕':'7'}</span><b>推理交互</b><small>${passed?'比对一致 · 7/7':failed?`不一致 · ${s.report.count}/7`:s.status==='stale'?'待重新比对':'进行中'}</small></summary><div class="env-step-summary">${passed?'7 / 7 项符合 · 响应包含非空 text · 点击展开结果':failed?`${s.report.count} / 7 项符合 · 请修正后重新比对`:'目标：发送请求，并获得包含 text 的 JSON 响应'}</div><div class="env-step-content"><p>编辑 IDE 中的 <code>${file}</code>，再比对代码与本步目标。这里只解析代码和模拟响应，不执行 curl。</p><section class="env-step-target"><b>本步预期结果</b><p>POST <code>${expectedURL}</code></p><p>提示词“${expectedPrompt}”，<code>max_tokens: 500</code>，JSON 请求体。</p><pre>HTTP 200\n{ "text": "非空的模型生成文本" }</pre><small>校验字段与响应结构，不逐字匹配生成文本。更换提示词需同步调整本次目标。</small></section><div class="env-editor-source"><b>代码来源：IDE 当前文件</b><span>${file}</span><div class="env-actions">${button('locate','定位用户代码')}${button('reference','填入参考代码（替换当前文件）')}${s.backup!==undefined?button('undo','撤销填入'):''}</div></div><label class="env-response-label">本次模拟响应（可编辑）<textarea name="inference-response" aria-label="本次模拟响应" maxlength="6000" spellcheck="false">${esc(s.response)}</textarea></label><div class="env-preview-options"><span>模拟 HTTP 状态</span><button type="button" data-uac-inference-action="http-ok" aria-pressed="${s.http===200}">200</button><button type="button" data-uac-inference-action="http-error" aria-pressed="${s.http===500}">500</button></div>${s.status==='stale'?'<p class="env-stale" role="status">输入已改变，原比对结果已失效，请重新比对。</p>':''}<div class="env-actions env-compare-actions">${button('compare','读取当前代码并比对',true)}</div>${reportMarkup(s)}<small class="env-source">依据手册 §2.2 推理交互 ｜ 仅为样式与本地比对演示</small></div></details>`).join('')}</div></div>`;
  }
  function state(root){try{const s=JSON.parse(root.dataset.uacInferenceState);return /^[a-z0-9-]+$/i.test(s.id)?s:null;}catch{return null;}}
  function update(root,s){const id=Number(root.closest('[data-uac-message]').dataset.uacMessage);api.updateToolMessage(id,markup(s));return find(s.id);}
  function locate(){learning.setView('video');learning.setVideoPerspective('ide');document.querySelector('.ide-tabs [data-mindie-step="7"]')?.click();}
  // Saved conversations contain old HTML. Re-render from their recorded state,
  // without re-running validation or changing the user's historical code/result.
  let upgrading=false;
  function upgradeHistory(){if(upgrading)return;upgrading=true;try{const ids=[...document.querySelectorAll('[data-uac-inference-id]')].map(r=>r.dataset.uacInferenceId);for(const id of ids){const root=find(id);if(!root||root.dataset.uacInferenceUiVersion==='4')continue;const s=state(root);if(s)update(root,s);}}finally{upgrading=false;}}
  document.addEventListener('uac:render',upgradeHistory);upgradeHistory();
  window.MindIEInferencePreview={validate,start(){locate();const s={id:crypto.randomUUID(),status:'pending',http:200,response:'{\n  "text": "你好！我是 Qwen2-7B，这是一条文本生成响应示例。"\n}',code:'',report:null};api.beginTool('用第 7 步演示：比对我的代码与预期结果。',markup(s));find(s.id)?.querySelector('[data-uac-inference-step]')?.scrollIntoView({block:'start',behavior:'auto'});}};
  document.addEventListener('click',async event=>{const launch=event.target.closest('[data-uac-inference-launch]');if(launch){window.MindIEInferencePreview.start();return;}const b=event.target.closest('[data-uac-inference-action]');if(!b)return;const root=b.closest('[data-uac-inference-id]'),s=root&&state(root);if(!s)return;const action=b.dataset.uacInferenceAction;
    s.response=root.querySelector('textarea[name="inference-response"]').value;
    if(action==='copy-advice'){
      const code=b.closest('.env-code-advice').querySelector('pre code').textContent;
      try{await navigator.clipboard.writeText(code);b.textContent='已复制';learning.showToast('代码已复制');}catch{learning.showToast('复制未成功，请选中代码后手动复制');}return;
    }
    if(action==='insert-advice'){
      const code=b.closest('.env-code-advice').querySelector('pre code').textContent;
      locate();if(s.backup===undefined)s.backup=editor().value;editor().value=code;editor().dispatchEvent(new Event('input',{bubbles:true}));
      s.status='stale';s.report=null;update(find(s.id)||root,s);editor().focus();learning.showToast('建议代码已置入 08_generate.sh，可撤销；未执行命令');return;
    }
    if(action==='locate'){locate();editor().focus();return;}
    if(action==='reference'||action==='undo'){locate();if(action==='reference'){if(s.backup===undefined)s.backup=editor().value;editor().value=window.MindIELab.steps[7].code;}else{if(s.backup===undefined)return;editor().value=s.backup;delete s.backup;}editor().dispatchEvent(new Event('input',{bubbles:true}));learning.showToast(action==='reference'?'已填入参考代码，可撤销；未执行命令':'已恢复填入前的代码');s.status='stale';s.report=null;update(find(s.id)||root,s);return;}
    if(action==='http-ok'||action==='http-error'){s.http=action==='http-ok'?200:500;s.status='stale';s.report=null;update(root,s);return;}
    if(action==='compare'){s.code=editor().value;s.report=validate(s.code,s.response,s.http,currentFile());s.status=s.report.passed?'pass':'fail';api.addToolMessage('user','<p>请读取我当前的代码，并与第 7 步目标及模拟响应进行比对。</p>');const next=update(find(s.id)||root,s);window.MindIETerminal?.write({id:`${s.id}:comparison:${Date.now()}`,host:'A',command:s.code,status:s.report.passed?'success':'error',output:`[本地比对演示，未执行请求]\n${s.report.count}/7 项符合\nHTTP ${s.http}\n${s.response}\n\n${s.report.checks.filter(c=>!c.pass).map(c=>c.name+'：'+c.actual+'；预期 '+c.expected).join('\n')}`},{reveal:true});next?.querySelector('[data-uac-inference-step]')?.scrollIntoView({block:'start',behavior:'auto'});}
  });
  document.addEventListener('input',event=>{if(event.target!==editor()&&!event.target.matches('[name="inference-response"]'))return;for(const root of document.querySelectorAll('[data-uac-inference-id]')){const s=state(root);if(!s?.report)continue;s.response=root.querySelector('textarea').value;s.status='stale';s.report=null;const typing=event.target===root.querySelector('textarea'),position=typing?event.target.selectionStart:0;const next=update(root,s);if(typing){const t=next.querySelector('textarea');t.focus({preventScroll:true});t.setSelectionRange(position,position);}}});
  const entry=document.createElement('button');entry.type='button';entry.className='mindie-practice-link';entry.textContent='第 7 步 · 结果比对';entry.addEventListener('click',()=>window.MindIEInferencePreview.start());document.querySelector('#videoIde .ide-actions')?.insertBefore(entry,document.getElementById('runCode'));
  function openPreview(){
    const previous=[...document.querySelectorAll('[data-uac-inference-id]')].at(-1);
    if(!previous){window.MindIEInferencePreview.start();return;}
    const id=previous.dataset.uacInferenceId;api.open();const root=find(id);
    const failure=root?.querySelector('.env-check.fail');
    if(failure)root.querySelector('[data-uac-inference-step]').open=true;
    (failure||root?.querySelector('[data-uac-inference-step]'))?.scrollIntoView({block:'start',behavior:'auto'});
  }
  if(new URLSearchParams(location.search).get('agent')==='inference'){const sheet=document.querySelector('link[href*="mindie-environment-preview.css"]');if(!sheet||sheet.sheet)openPreview();else sheet.addEventListener('load',openPreview,{once:true});}
})();
