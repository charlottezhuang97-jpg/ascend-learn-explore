/* Full seven-step teaching workflow. No fetch, eval, shell or model execution. */
(() => {
  const C=window.MindIEGuideContent,A=window.AscendCompanion,L=window.AscendLearning;
  if(!C||!A||!location.pathname.endsWith('learn-1030.html'))return;
  const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href=new URL('../css/mindie-guided-learning.css?v=1',document.currentScript.src);document.head.append(sheet);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const running=new Map(),goals=new Map();let hydrating=false;
  const find=id=>document.querySelector(`[data-uac-guide-id="${id}"]`);
  const button=(key,label,primary=false,disabled=false)=>`<button type="button" data-uac-guide-action="${key}" ${disabled?'disabled':''} class="${primary?'env-primary':''}">${label}</button>`;
  const text=(p,key,label,type='text')=>`<label class="guide-field"><span>${label}</span><input type="${type}" data-uac-guide-field="${key}" value="${esc(p[key])}" maxlength="500" autocomplete="off"></label>`;
  const select=(p,key,label,choices)=>`<label class="guide-field"><span>${label}</span><select data-uac-guide-field="${key}">${choices.map(([value,title])=>`<option value="${value}" ${p[key]===value?'selected':''}>${title}</option>`).join('')}</select></label>`;
  const check=(p,key,label)=>`<label class="guide-check"><input type="checkbox" data-uac-guide-field="${key}" ${p[key]?'checked':''}><span>${label}</span></label>`;
  function read(root){try{const s=JSON.parse(root.dataset.uacGuideState);return /^[\w-]+$/.test(s.id)&&s.steps?.length===7?s:null;}catch{return null;}}
  function fields(s,i){const p=s.config,row=s.steps[i];let html='';
    if(i===0)html=select(p,'host','示例主机',[['A','Atlas 800I A2 · 主机 A'],['B','Atlas 800I A2 · 主机 B']]);
    if(i===1)html=select(p,'weightsMethod','权重准备方式',[['server','服务器已有权重'],['local','本地已有，需要上传'],['download','尚未下载，先网页下载再上传']])+text(p,'weightsPath','服务器权重目录（以 / 结尾）')+(p.weightsMethod==='server'?'':`<p>在外部完成下载/上传后再确认。</p>${button('model-repo','打开手册模型仓 ↗')}`+check(p,'filesPrepared','我已在外部准备并上传（用户确认，尚未验证）'));
    if(i===2)html=select(p,'imageMode','镜像准备方式',[['cached','复用本地已有镜像'],['pull','从仓库拉取镜像']])+select(p,'architecture','示例主机架构（需按真实机器核对）',[['aarch64','aarch64'],['x86_64','x86_64']])+text(p,'image','完整镜像标识（手册历史版本）')+(p.imageMode==='pull'?select(p,'access','仓库权限',[['granted','用户确认已有权限'],['pending','尚需申请 / 等待审核']])+check(p,'loginConfirmed','我已在安全终端完成登录（不向对话提供凭据）'):'');
    if(i===3)html=select(p,'containerMode','容器处理方式',[['create','创建新容器'],['reuse','复用并检查现有容器']])+text(p,'container','容器名（后续统一引用）')+text(p,'device','主机 NPU 设备编号')+`<p>只读挂载：${esc(p.weightsPath)} → /home/weights/</p>`+(p.containerMode==='create'?check(p,'allowPrivileged','确认手册实验中的 privileged 高权限影响')+check(p,'allowHostNetwork','确认使用主机网络；不默认视为生产安全配置'):'<p>复用前核对名称、镜像、设备和挂载；不会删除或重建。</p>');
    if(i===4)html=row.phase==='initialize'?`<p>先由主机进入容器 <b>${esc(p.container)}</b>。五条 source 与后续服务必须属于同一容器会话。</p>`:text(p,'containerDevice','容器内可见设备编号（不得从主机编号自动推导）')+check(p,'mappingConfirmed','我已核对容器可见设备；本演示使用 1 张卡')+check(p,'allowHttp','确认仅在隔离实验中使用 httpsEnabled=false')+'<p>worldSize=1，trustRemoteCode=false；以下 JSON 仅为字段合并片段，不可覆盖完整配置。</p>';
    if(i===5)html=select(p,'logPolicy','已有日志处理方式',[['new','使用新日志；同名时应停止'],['append','追加日志，保留既有内容'],['overwrite','覆盖同名日志（需单独确认）']])+text(p,'logFile','容器日志文件名')+(p.logPolicy==='overwrite'?check(p,'overwriteLog','我确认覆盖这个日志文件的风险（仅演示）'):'')+'<p>预期端口 1025；不自动终止已有进程，不假设存在健康检查接口。</p>';
    if(i===6)html=`<label class="guide-field"><span>本次提示词</span><textarea data-uac-guide-field="prompt" maxlength="500">${esc(p.prompt)}</textarea></label>`+text(p,'maxTokens','max_tokens（本演示 1–2048）','number')+'<p>请求地址：127.0.0.1:1025/generate，指实验执行环境，不是浏览器本机。不计量或编造真实 Token 数。</p>';
    const scenarios=i===4?C.steps[i].scenarios.filter(([k])=>k==='ok'||k===(row.phase==='config'?'path':'script')):C.steps[i].scenarios;
    html+=select({scenario:row.scenario},'scenario','预览场景（仅模拟）',scenarios);
    return `<div class="guide-fields">${html}<p class="guide-draft" data-uac-guide-draft role="status">参数修改后须更新预览；授权只对应当前预览。</p>${button('preview','更新参数预览')}</div>`;
  }
  function context(s,i){return i<4?'示例主机 '+s.config.host:i===4&&s.steps[i].phase==='initialize'?'主机进入 '+s.config.container+' 后在同一容器会话执行':'容器 '+s.config.container+' · 示例会话';}
  function resultCard(record){return `<section class="env-result"><header><b>${esc(record.title)}</b><span class="env-status ${record.passed?'success':'error'}">${record.passed?'证据符合':'需处理'}</span><span class="env-demo-label">演示数据</span></header><div class="env-result-body"><small>${esc(record.context)} · 授权 ${esc(record.authorization)}</small><ul class="guide-checks">${record.checks.map(c=>`<li class="${c.status}"><b>${c.status==='fail'?'✕':c.status==='skip'?'—':c.status==='user'?'◌':'✓'} ${esc(c.name)}</b><span>${esc(c.detail)}</span></li>`).join('')}</ul>${record.advice?`<p class="guide-error">${esc(record.advice)}</p>`:''}</div><details ${record.passed?'':'open'}><summary>查看命令 / 配置与模拟回显</summary><pre>${esc(record.command)}\n\n${esc(record.output)}</pre></details></section>`;}
  function body(s,i){const row=s.steps[i],def=C.steps[i],locked=i!==s.current;
    if(row.status==='idle')return `<p>${row.invalidated?'上游参数已变化，旧结果失效，需要重新验证。':'未执行。请先完成上一步，再点击“继续下一步”；展开此处不会执行命令。'}</p>${row.archive?.length?`<details class="guide-archive"><summary>查看已失效的旧参数记录</summary>${row.archive.map(resultCard).join('')}</details>`:''}`;
    let html=`<p>${esc(def.goal)}</p><small>子任务 ${def.tasks.length} 个：${def.tasks.map(esc).join(' → ')}</small>`;
    html+=row.records.map(resultCard).join('');
    if(row.status==='success')return html+button('revise','修改本步参数 / 重新验证');
    if(locked)return html+'<p>本步尚未激活，请先处理当前依赖步骤。</p>';
    if(row.status==='manual')return html+`<p>请在自己的安全环境操作。粘贴内容只作为“用户提供”的记录，不能证明服务器执行成功；不要包含凭据。</p><label class="guide-field"><span>脱敏回显（可选）</span><textarea data-uac-guide-manual maxlength="4000"></textarea></label>${row.manual?`<pre>用户提供（未验证）：\n${esc(row.manual)}</pre>`:''}<div class="env-actions">${button('save-manual','保存用户回显')}${button('ready','返回授权演示')}</div>`;
    if(row.status==='running')return html+`<div class="env-run" role="status"><div><span class="env-spinner" aria-hidden="true"></span><span>正在展示授权后的模拟过程，不执行真实命令…</span></div></div>${button('pause','暂停演示')}`;
    if(row.status==='watching')return html+'<p role="status">本次模拟新日志、进程及端口已核对。请停止日志观察；后台服务不会因此停止。</p>'+button('stop-watch','停止日志观察',true);
    if(row.status==='paused'||row.status==='cancelled')html+=`<p class="guide-notice" role="status">${row.status==='paused'?'演示已暂停 / 刷新后中断，未生成后续结果。':'已取消，本阶段未执行。'} 需要重新确认授权才能继续。</p>`;
    if(i===4)html+=`<h3>${row.phase==='initialize'?'5A · 进入容器并初始化环境':'5B · 确认配置差异并静态检查'}</h3>`;
    html+=fields(s,i);
    const gate=C.gate(s,i);
    html+=`<section class="env-authorization"><header><b>确认本次${i===4&&row.phase==='config'?'配置合并':'操作'}范围</b></header><dl class="env-meta"><dt>执行位置</dt><dd>${esc(context(s,i))}</dd><dt>影响范围</dt><dd>${esc(def.impact)}</dd><dt>授权效期</dt><dd>仅本步、本参数版本 v${s.revision}；不包含后续步骤或自动重试。</dd></dl><div class="env-command"><div><span>${i===4&&row.phase==='config'?'JSON 合并片段（不是完整文件）':'命令预览 · 不会执行'}</span><span>手册 / 标注的补充检查</span></div><pre>${esc(C.command(s,i))}</pre></div><div class="env-actions">${button('copy','复制预览')}${button('insert','置入对应 IDE 文件')}${s.editorBackup?button('undo','撤销上次置入'):''}</div><p class="guide-source">${i===1?'目录 ls 为补充检查；下载上传命令未在手册提供，不自行编造。':i===3?'ll 为手册别名写法，真实环境若无此别名需另行确认等价查询。容器名按后文统一。':i===4&&row.phase==='config'?'备份、读取完整配置和真正字段合并需执行器；当前仅模拟检查，不覆盖真实文件。':i===5?'新日志的 test 防覆盖条件、追加方案为产品补充；启动、tail 命令来自手册。':''}</p>${gate?`<p class="guide-notice" role="status">${esc(gate)}</p>`:''}<p data-uac-guide-error class="guide-error" role="status">${esc(row.error||'')}</p><div class="env-actions">${button('authorize',row.status==='error'?'重新授权本步（演示）':'授权本步（演示）',true,!!gate)}${button('manual','我来操作')}${button('cancel','取消')}</div></section>`;
    if(row.archive?.length)html+=`<details class="guide-archive"><summary>查看已失效的旧参数结果（${row.archive.length} 条）</summary>${row.archive.map(resultCard).join('')}</details>`;
    return html;
  }
  function render(s){const complete=s.steps.every(r=>r.status==='success'),count=s.steps.filter(r=>r.status==='success').length;
    let html=`<div class="env-flow guide-flow" data-uac-guide-id="${s.id}" data-uac-guide-state="${esc(JSON.stringify(s))}"><div class="env-vertical-head"><b>MindIE 文本生成实验</b><span class="env-demo-label">${count}/7 步 · 25 个子任务 · 演示</span></div><p class="guide-source">手册 §2.2 · 未连接主机、执行器或实时 AI。所有回显均明确为模拟，完成演示不代表真实部署或认证通过。</p><div class="env-vertical-steps">${C.steps.map((def,i)=>{const row=s.steps[i],done=row.status==='success',active=i===s.current;return `<details class="env-vertical-step ${done?'pass':row.status==='error'?'fail':active?'current':'not-run'}" ${active&&!done?'open':''} data-uac-guide-step="${i}"><summary><span class="env-step-number">${i+1}</span><b>${def.name}</b><small>${done?'演示完成':active?'进行中':'未执行'}</small></summary><div class="env-step-content">${body(s,i)}</div></details>`;}).join('')}</div>${complete?`<section class="env-summary" role="status"><b>✓ 7 步引导演示完成</b><p>环境 → 权重 → 镜像 → 容器 → 配置 → 服务 → 推理的记录已保存在本对话。真实实验、内容正确性及认证尚未验证。</p><div class="env-actions">${button('export','导出本次演示记录')}${button('note','保存到预览笔记')}</div></section>`:s.steps[s.current].status==='success'?`<div class="env-summary"><b>第 ${s.current+1} 步完成（演示），已自动收起</b><p>继续仅进入下一步，不代表同意下一阶段操作。</p>${button('next','继续下一步 →',true)}</div>`:''}</div>`;
    return window.MindIEStepUI.decorate(html);
  }
  function update(s,messageId){A.updateToolMessage(messageId,render(s));}
  function invalidate(s,i){const token=running.get(s.id);if(token){token.cancelled=true;clearTimeout(token.timer);running.delete(s.id);}for(let n=i;n<7;n++){const r=s.steps[n];if(r.records.length){r.archive=[...(r.archive||[]),...r.records].slice(-3);r.invalidated=true;}r.records=[];r.status=n===i?'ready':'idle';r.error='';if(n===4)r.phase='initialize';}s.current=i;s.revision++;}
  function locate(s,i){L.setView('video');L.setVideoPerspective('ide');const index=i===4?(s.steps[i].phase==='config'?5:4):C.steps[i].files[0];document.querySelector(`.ide-tabs [data-mindie-step="${index}"]`)?.click();return window.MindIELab.steps[index].file;}
  function terminal(s,i,status,output,command=C.command(s,i)){window.MindIETerminal?.write({id:`guide:${s.id}:${s.revision}:${i}:${s.steps[i].phase||'main'}:${command.startsWith('Ctrl+C')?'stop':'run'}`,host:s.config.host,command,status,output:'[7步引导 · 模拟回显 · 未执行真实命令]\n位置：'+context(s,i)+'\n'+output},{reveal:true});}
  function finish(s,i,messageId,authorization){const row=s.steps[i],result=C.fixture(s,i);
    const record={...result,title:C.steps[i].name+(i===4?(row.phase==='initialize'?' · 初始化':' · 配置合并'):''),context:context(s,i),authorization,command:C.command(s,i)};
    row.records.push(record);row.error='';row.invalidated=false;
    terminal(s,i,result.passed?'success':'error',result.output);
    if(!result.passed){row.status='error';row.error=result.advice;}
    else if(i===4&&row.phase==='initialize'){row.phase='config';row.scenario='ok';row.status='ready';}
    else if(i===5){row.status='watching';}
    else row.status='success';
    update(s,messageId);
    const root=find(s.id);(root?.querySelector(`[data-uac-guide-step="${i}"]`)||root)?.scrollIntoView({block:'start'});
  }
  function authorize(s,i,messageId){const row=s.steps[i],blocked=C.validate(s.config)||C.gate(s,i);if(blocked){row.error=blocked;update(s,messageId);return;}
    row.status='running';row.error='';const authorization=crypto.randomUUID().slice(0,8),token={session:A.getSessionId(),revision:s.revision,cancelled:false};running.set(s.id,token);update(s,messageId);
    A.addToolMessage('user',`<p>授权演示第 ${i+1} 步${i===4?(row.phase==='config'?'的配置合并与静态检查':'的容器环境初始化'):''}，位置为${esc(context(s,i))}，只限当前预览参数 v${s.revision}，不包含下一步或自动重试。${i===3&&s.config.containerMode==='create'?'已分别确认高权限和主机网络的实验影响。':''}${i===4&&row.phase==='config'?'已确认容器设备编号及隔离实验的非 HTTPS 配置。':''}不在真实主机执行。</p>`);
    terminal(s,i,'running','正在展示模拟过程…');
    token.timer=setTimeout(()=>{if(token.cancelled||running.get(s.id)!==token)return;running.delete(s.id);if(A.getSessionId()!==token.session)return;finish(s,i,messageId,authorization);},900);
  }
  function start(){
    A.showToolMessage?.();const existing=[...document.querySelectorAll('[data-uac-guide-id]')].at(-1);
    if(existing){existing.scrollIntoView({block:'start'});L.setView('video');L.setVideoPerspective('ide');return;}
    const s={id:crypto.randomUUID(),revision:1,current:0,config:{...C.defaults},steps:C.steps.map((_,i)=>({status:i===0?'ready':'idle',phase:i===4?'initialize':'',scenario:'ok',records:[],archive:[],error:''}))};
    L.setView('video');L.setVideoPerspective('ide');A.beginTool('请按实验手册引导我完成 MindIE 文本生成实验，每一步先确认范围。',render(s));locate(s,0);
  }
  function requestGoal(){const roots=[...document.querySelectorAll('[data-uac-guide-id]')];const s=roots.length?read(roots.at(-1)):null;const goal=s?{prompt:s.config.prompt,maxTokens:Number(s.config.maxTokens),url:'http://127.0.0.1:1025/generate'}:goals.get(A.getSessionId());if(goal)goals.set(A.getSessionId(),goal);return goal;}
  window.MindIEGuidedLearning={start,requestGoal};window.MindIEEnvironmentPreview.start=start;
  document.addEventListener('input',e=>{const root=e.target.closest('[data-uac-guide-id]');if(!root||!e.target.matches('[data-uac-guide-field]'))return;root.dataset.uacGuideDirty='true';root.querySelectorAll('[data-uac-guide-action="authorize"]').forEach(b=>b.disabled=true);const notice=root.querySelector('[data-uac-guide-draft]');if(notice)notice.textContent='有未保存参数：请先点击“更新参数预览”，旧授权不能复用。';});
  document.addEventListener('change',e=>{if(e.target.matches('[data-uac-guide-field]'))e.target.dispatchEvent(new Event('input',{bubbles:true}));});
  document.addEventListener('click',async e=>{const b=e.target.closest('[data-uac-guide-action]');if(!b)return;const root=b.closest('[data-uac-guide-id]'),s=root&&read(root);if(!s)return;const key=b.dataset.uacGuideAction,i=Number(b.closest('[data-uac-guide-step]')?.dataset.uacGuideStep??s.current),row=s.steps[i],messageId=Number(root.closest('[data-uac-message]').dataset.uacMessage);
    if(key==='model-repo'){window.open('https://huggingface.co/Qwen/Qwen2-7B/tree/main','_blank','noopener,noreferrer');return;}
    if(key==='preview'){
      const config={...s.config};let scenario=row.scenario;
      for(const field of root.querySelectorAll('[data-uac-guide-field]')){const k=field.dataset.uacGuideField;if(k==='scenario')scenario=field.value;else config[k]=field.type==='checkbox'?field.checked:field.value;}
      const error=C.validate(config);if(error){root.querySelector('[data-uac-guide-error]').textContent=error;return;}
      const changed=JSON.stringify(config)!==JSON.stringify(s.config)||scenario!==row.scenario;
      if(changed){const phase=row.phase,initialization=row.records.filter(r=>r.title.includes('初始化'));invalidate(s,i);if(i===4&&phase==='config'){s.steps[4].phase='config';s.steps[4].records=initialization;}s.config=config;s.steps[i].scenario=scenario;}
      update(s,messageId);return;
    }
    if(key==='revise'){invalidate(s,i);update(s,messageId);locate(s,i);return;}
    if(key==='next'){if(row.status!=='success'||i>=6)return;s.current=i+1;s.steps[i+1].status='ready';update(s,messageId);locate(s,i+1);find(s.id)?.querySelector(`[data-uac-guide-step="${i+1}"]`)?.scrollIntoView({block:'start'});return;}
    if(key==='copy'){try{await navigator.clipboard.writeText(C.command(s,i));b.textContent='已复制';}catch{L.showToast('复制失败，请手动选择预览代码');}return;}
    if(key==='insert'){const target=locate(s,i),editor=document.getElementById('ideEditor'),before=editor.value,after=C.command(s,i);editor.value=after;editor.dispatchEvent(new Event('input',{bubbles:true}));s.editorBackup={file:target,before,after};update(s,messageId);L.showToast('预览已置入 '+target+'，可撤销；未执行命令');return;}
    if(key==='undo'){const backup=s.editorBackup;if(!backup)return;const tab=document.querySelector(`.ide-tabs [data-ide-file="${backup.file}"]`);tab?.click();const editor=document.getElementById('ideEditor');if(editor.value!==backup.after){L.showToast('IDE 内容已变化，未覆盖，请手动核对');return;}editor.value=backup.before;editor.dispatchEvent(new Event('input',{bubbles:true}));delete s.editorBackup;update(s,messageId);return;}
    if(key==='export'){const blob=new Blob([JSON.stringify({source:'1030 引导演示，非真实执行',...s},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='mindie-guided-demo.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;}
    if(key==='note'){try{localStorage.setItem('ascend-1030-guided-note',JSON.stringify({source:'仅演示',config:s.config,records:s.steps.map(r=>r.records)}));L.showToast('本次演示记录已保存到预览笔记（本机）');}catch{L.showToast('浏览器未允许保存，可导出记录');}return;}
    if(i!==s.current||s.steps.slice(0,i).some(r=>r.status!=='success'))return;
    if(key==='authorize'){if(root.dataset.uacGuideDirty==='true'){L.showToast('请先更新参数预览');return;}if(['ready','paused','cancelled','error'].includes(row.status))authorize(s,i,messageId);return;}
    if(key==='pause'){const token=running.get(s.id);if(token){token.cancelled=true;clearTimeout(token.timer);running.delete(s.id);}row.status='paused';terminal(s,i,'paused','演示暂停；未生成后续回显。');update(s,messageId);return;}
    if(key==='cancel'){row.status='cancelled';update(s,messageId);A.addToolMessage('user','<p>取消本阶段操作；不授权执行。</p>');return;}
    if(key==='manual'){row.status='manual';update(s,messageId);A.addToolMessage('user','<p>本阶段我来操作，暂不授权自动执行。</p>');return;}
    if(key==='save-manual'){const value=root.querySelector('[data-uac-guide-manual]')?.value.trim();if(!value)return;row.manual=value.replace(/((?:password|token|authorization)\s*[:=]\s*)[^\n]+/ig,'$1[已隐藏]').slice(0,4000);update(s,messageId);L.showToast('已保存用户提供的回显，未自动判定通过');return;}
    if(key==='ready'){row.status='ready';update(s,messageId);return;}
    if(key==='stop-watch'&&row.status==='watching'){row.records.push({title:'停止日志观察',passed:true,context:context(s,i),authorization:row.records.at(-1).authorization,command:'Ctrl+C（仅退出 tail 观察）',output:'已停止日志观察。后台服务仍运行（模拟），未执行停止服务操作。',checks:[{name:C.steps[i].tasks[3],status:'pass',detail:'仅停止本次模拟日志观察；不等于停止后台服务。'}]});row.status='success';terminal(s,i,'success','已停止观察；后台服务仍在运行（模拟）。','Ctrl+C（仅退出 tail）');update(s,messageId);A.addToolMessage('user','<p>停止本次日志观察，后台服务保持运行（演示）。</p>');}
  });
  function hydrate(){if(hydrating)return;hydrating=true;try{requestGoal();for(const root of [...document.querySelectorAll('[data-uac-guide-id]')]){const s=read(root);if(!s)continue;let changed=false;for(const row of s.steps){if(row.status==='running'&&!running.has(s.id)){row.status='paused';changed=true;}}if(changed)update(s,Number(root.closest('[data-uac-message]').dataset.uacMessage));}
    for(const entry of document.querySelectorAll('.uac-environment-entry')){entry.querySelector('b').textContent='文本生成实验 · 完整 7 步引导';entry.querySelector('small').textContent='选择、授权、命令、终端回显与结果检查 →';}
  }finally{hydrating=false;}}
  document.addEventListener('uac:render',hydrate);hydrate();
  const toolbar=[...document.querySelectorAll('.mindie-practice-link')].find(b=>b.textContent==='AI 实验引导');if(toolbar){toolbar.textContent='7步实验引导';toolbar.title='按手册走完全部七步（演示）';}
  if(new URLSearchParams(location.search).get('guide')==='open')start();
})();
