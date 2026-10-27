/* New, automatic preparation preview. No HiDevLab or model repository connection. */
(() => {
  const A=window.AscendCompanion,L=window.AscendLearning;
  if(!A||!L||!location.pathname.endsWith('learn-1030.html'))return;
  const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href=new URL('../css/mindie-auto-preparation.css?v=3',document.currentScript.src);document.head.append(sheet);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const timers=new Map();
  const inferenceTimers=new Map();
  const requestCode=window.MindIELab?.steps?.[7]?.code||'';
  // The wording below follows the supplied terminal screenshot. It is sample output, not a claim about the model.
  const sampleText='介绍下Qwen2-7B 的参数和功能特点。\nQwen2-7B是一款基于GPT-2模型的大型语言模型，具有以下参数和功能特点：\n参数：\n- 7B参数量，即模型参数数量为70亿个。\n- 12层Transformer编码器，每个编码器包含12个注意力头。\n- 16个Transformer解码器，每个解码器包含16个注意力头。\n- 16个Transformer编码器和解码器的隐藏层大小为1024。\n- 16个Transformer编码器和解码器的注意力大小为128。\n- 前馈神经网络大小为4096，dropout率为0.1，激活函数为GELU。\n功能特点：\n- 支持自然语言处理任务，如文本生成、文本分类、问答系统等。\n- 支持多语言处理与自然语言对话。\n- 支持知识图谱、多模态处理、分布式训练、模型压缩和剪枝，以及模型微调和迁移学习。';
  const sampleResponse=JSON.stringify({text:sampleText});
  const items=[
    {title:'获取并启动实验环境',doing:'正在准备 HiDevLab 算力申请、CANN 环境创建与开机流程…',done:'环境获取与开机流程已完成',terminal:'[环境准备信息 · 未连接 HiDevLab]\n申请 100 卡时 A3 算力 → 创建 CANN 环境 → 环境开机 → NPU / Docker 检查\n以上是预设流程，并非平台返回的真实结果。'},
    {title:'下载并上传模型权重',doing:'正在准备 Qwen2-7B 权重下载与上传流程…',done:'模型权重准备流程已完成',terminal:'[模型权重信息 · 尚未下载或上传文件]\n来源示意：Hugging Face / Qwen2-7B\n目标目录示意：/home/lgy/Qwen2-7B/\n文件是否存在，需在真实服务器核对。'},
    {title:'打开 IDE 环境',doing:'正在切换到 IDE 实践区…',done:'IDE 实践区已打开',terminal:'[IDE 状态]\n已打开页面内的 IDE 实践区；尚未连接真实 HiDevLab 主机。'}
  ];
  function root(){return document.querySelector('[data-uac-auto-prep]');}
  function inferenceRoot(){return document.querySelector('[data-uac-auto-inference]');}
  function read(node){try{const value=JSON.parse(node.dataset.uacAutoPrep);return value&&typeof value.id==='string'&&Number.isInteger(value.step)?value:null;}catch{return null;}}
  function markup(state){const complete=state.step>=items.length;
    return `<section class="auto-prep" data-uac-auto-prep="${esc(JSON.stringify(state))}"><header><div><small>新版 · 自动准备</small><h3>为你打开 MindIE 实验环境</h3></div></header><p class="auto-prep-intro">我会依次准备实验环境和模型权重，并打开左侧 IDE；无需逐项确认。</p><ol class="auto-prep-list">${items.map((item,index)=>{const status=index<state.step?'done':index===state.step?'active':'waiting';return `<li class="${status}"><span class="auto-prep-mark" aria-hidden="true">${status==='done'?'✓':index+1}</span><div><b>${item.title}</b><small>${status==='done'?item.done:status==='active'?item.doing:'等待前一步完成'}</small></div></li>`;}).join('')}</ol><p class="auto-prep-status" role="status" aria-atomic="true">${complete?'环境准备已完成。接下来可查看推理交互的预期效果。':items[state.step].doing}</p>${state.step>=2?'<div class="auto-prep-result"><b>模型权重准备结果</b><p>目标目录为 /home/lgy/Qwen2-7B/；文件是否存在，请在真实服务器核对。</p></div>':''}<small class="auto-prep-disclaimer">当前未连接 HiDevLab、Hugging Face 或真实主机；环境与文件状态需在真实环境核对。</small></section>`;
  }
  function locateInference(){L.setView('video');L.setVideoPerspective('ide');document.querySelector('.ide-tabs [data-mindie-step="7"]')?.click();}
  function inferenceMarkup(state){const busy=state.status==='running',done=state.status==='done';return `<section class="auto-prep auto-inference" data-uac-auto-inference="${esc(JSON.stringify(state))}"><header><div><small>第 2 阶段 · 推理交互</small><h3>输入问题，查看模型回答</h3></div></header><p class="auto-prep-intro">先看看这次请求可以得到的效果。你可以在左侧 <code>08_generate.sh</code> 修改提示词；点击开始时会读取当前代码。</p><div class="auto-inference-block"><b>本次请求</b><pre><code>${esc(state.code||requestCode)}</code></pre></div><div class="auto-inference-block"><b>预期效果</b><div class="auto-inference-answer"><small>JSON 响应中的 text 字段</small><p>介绍下Qwen2-7B 的参数和功能特点。</p><p>随后展开“参数”和“功能特点”的文字说明。</p></div><small>依据上传的终端截图展示效果；其中模型介绍的事实性内容尚未核实。</small></div>${done?'<p class="auto-prep-status" role="status">请求示例已完成，结果见下一张卡片和左侧终端。</p>':busy?'<p class="auto-prep-status" role="status">正在读取当前代码并生成示例回显…</p>':`<button type="button" class="auto-inference-start" data-uac-auto-inference-action="start">确认开始</button>`}<small class="auto-prep-disclaimer">不会向 127.0.0.1:1025 发送真实请求。</small></section>`;}
  function resultMarkup(code,report){const passed=report.passed;return `<section class="auto-prep auto-inference-result"><header><div><small>推理交互 · 结果</small><h3>${passed?'已得到文本回答':'当前代码与请求目标不一致'}</h3></div><span class="auto-prep-badge">${passed?'示例响应':'本地检查'}</span></header>${passed?`<div class="auto-prep-result"><b>请求结果</b><p>请求体中的提示词为“介绍下Qwen2-7B”，响应包含非空的 <code>text</code> 字段。</p></div><div class="auto-inference-block"><b>终端输出</b><pre><code>$ ${esc(code)}\n${esc(sampleResponse)}\n[root@Ascend mindie-service]#</code></pre></div><div class="auto-inference-next"><b>再试一个第 7 步错误示例</b><p>把 <code>max_tokens</code> 误写成字符串，点击 IDE“运行”查看报错；划选问题代码后，点“帮我写代码”查看修改前后对照。</p><button type="button" class="auto-inference-start" data-uac-auto-inference-action="error-example">载入错误示例</button></div><small class="auto-prep-disclaimer">回答文字取自截图的内容结构并作节选，不代表已连接模型服务，也不保证其中描述准确。</small>`:`<p class="auto-prep-intro">请在左侧 <code>08_generate.sh</code> 核对请求。${report.count}/7 项符合，尚未展示成功响应。</p><ul class="auto-inference-issues">${report.checks.filter(check=>!check.pass).map(check=>`<li>${esc(check.name)}：预期 ${esc(check.expected)}</li>`).join('')}</ul><small class="auto-prep-disclaimer">代码没有执行。修改后，可在上方再次点击“确认开始”。</small>`}</section>`;}
  function ensureInference(){const prep=root(),state=prep&&read(prep);if(!state||state.step<items.length||inferenceRoot())return;locateInference();const next={id:crypto.randomUUID(),session:A.getSessionId(),status:'ready',code:document.getElementById('ideEditor')?.value||requestCode};A.addToolMessage('assistant',inferenceMarkup(next));}
  function writeTerminal(state,index){window.MindIETerminal?.write({id:`auto-prep:${state.id}:${index}`,host:'A',command:items[index].title,status:'success',output:items[index].terminal},{reveal:true});}
  function advance(id,messageId){const node=root(),state=node&&read(node);if(!state||state.id!==id||A.getSessionId()!==state.session)return;
    const index=state.step;writeTerminal(state,index);state.step=index+1;
    if(index===items.length-1){L.setView('video');L.setVideoPerspective('ide');document.querySelector('.ide-tabs [data-mindie-step="0"]')?.click();}
    A.updateToolMessage(messageId,markup(state));
  }
  function resume(){const node=root();if(!node)return;const state=read(node);if(!state)return;if(state.step>=items.length){ensureInference();return;}if(timers.has(state.id))return;
    const messageId=Number(node.closest('[data-uac-message]')?.dataset.uacMessage);if(!messageId)return;
    const delay=matchMedia('(prefers-reduced-motion: reduce)').matches?550:state.step===0?1500:state.step===1?1900:800;
    timers.set(state.id,setTimeout(()=>{timers.delete(state.id);advance(state.id,messageId);},delay));
  }
  function start(){A.showToolMessage?.();const existing=root();if(existing){existing.scrollIntoView({block:'start'});resume();return;}
    const state={id:crypto.randomUUID(),session:null,step:0};
    const messageId=A.beginIsolatedTool('请自动帮我准备实验环境、下载模型权重，并打开 IDE。',markup(state));
    state.session=A.getSessionId();A.updateToolMessage(messageId,markup(state));resume();
  }
  window.MindIEAutoPreparation={start};window.MindIEEnvironmentPreview.start=start;
  function recoverInference(){const node=inferenceRoot();if(!node)return;let state;try{state=JSON.parse(node.dataset.uacAutoInference);}catch{return;}if(state.status!=='running'||inferenceTimers.has(state.id))return;state.status='ready';const messageId=Number(node.closest('[data-uac-message]')?.dataset.uacMessage);if(messageId)A.updateToolMessage(messageId,inferenceMarkup(state));}
  document.addEventListener('click',event=>{const button=event.target.closest('[data-uac-auto-inference-action="start"]');if(!button)return;const node=button.closest('[data-uac-auto-inference]');if(!node)return;let state;try{state=JSON.parse(node.dataset.uacAutoInference);}catch{return;}if(state.status==='running'||A.getSessionId()!==state.session)return;
    state.status='running';const messageId=Number(node.closest('[data-uac-message]')?.dataset.uacMessage);A.updateToolMessage(messageId,inferenceMarkup(state));A.addToolMessage('user','<p>确认开始推理交互，使用左侧 IDE 当前的请求代码。</p>');
    inferenceTimers.set(state.id,setTimeout(()=>{inferenceTimers.delete(state.id);const current=inferenceRoot();if(!current||A.getSessionId()!==state.session)return;locateInference();const code=document.getElementById('ideEditor')?.value||'',report=window.MindIEInferencePreview?.validate(code,sampleResponse,200,'08_generate.sh');if(!report)return;window.MindIETerminal?.write({id:`auto-inference:${state.id}:${Date.now()}`,host:'A',command:code,status:report.passed?'success':'error',output:report.passed?'[推理交互示例 · 未发送真实请求]\n'+sampleResponse:'[本地代码检查 · 未执行请求]\n'+report.checks.filter(check=>!check.pass).map(check=>check.name+'：预期 '+check.expected).join('\n')},{reveal:true});state.code=code;state.status=report.passed?'done':'ready';A.updateToolMessage(messageId,inferenceMarkup(state));A.addToolMessage('assistant',resultMarkup(code,report));},matchMedia('(prefers-reduced-motion: reduce)').matches?500:1000));
  });
  document.addEventListener('click',event=>{if(!event.target.closest('[data-uac-auto-inference-action="error-example"]'))return;window.MindIEDevelopmentAssist?.loadErrorExample();});
  function syncEntry(){const entry=document.querySelector('.uac-environment-entry');if(entry){entry.querySelector('span').textContent='AI 学伴 · 新版';entry.querySelector('b').textContent='自动准备实验环境';entry.querySelector('small').textContent='环境获取 → 模型权重 → 打开 IDE';}}
  document.addEventListener('uac:render',()=>{syncEntry();resume();queueMicrotask(recoverInference);});syncEntry();queueMicrotask(recoverInference);
  const toolbar=[...document.querySelectorAll('.mindie-practice-link')].find(button=>button.textContent==='实验引导');if(toolbar){toolbar.textContent='自动准备环境';toolbar.title='自动准备环境与模型，并打开 IDE';}
  if(new URLSearchParams(location.search).get('guide')!=='open'&&['environment','inference'].includes(new URLSearchParams(location.search).get('agent')))start();
})();
