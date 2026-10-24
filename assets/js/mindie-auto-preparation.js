/* New, automatic preparation preview. No HiDevLab or model repository connection. */
(() => {
  const A=window.AscendCompanion,L=window.AscendLearning;
  if(!A||!L||!location.pathname.endsWith('learn-1030.html'))return;
  const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href=new URL('../css/mindie-auto-preparation.css?v=1',document.currentScript.src);document.head.append(sheet);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const timers=new Map();
  const items=[
    {title:'获取并启动实验环境',doing:'正在演示申请 HiDevLab 算力、创建 CANN 环境并开机…',done:'实验环境获取与开机流程已演示',terminal:'[自动准备 · 演示，未连接 HiDevLab]\n申请 100 卡时 A3 算力 → 创建 CANN 环境 → 环境开机 → NPU / Docker 检查\n以上是预设流程，并非平台返回的真实结果。'},
    {title:'下载并上传模型权重',doing:'正在演示下载 Qwen2-7B 并上传到实验目录…',done:'模型权重下载与上传流程已演示',terminal:'[自动准备 · 演示，未下载或上传文件]\n来源示意：Hugging Face / Qwen2-7B\n目标目录示意：/home/lgy/Qwen2-7B/\n文件是否存在，需在真实服务器核对。'},
    {title:'打开 IDE 环境',doing:'正在切换到 IDE 实践区…',done:'IDE 实践区已打开',terminal:'[自动准备 · 演示]\n已打开页面内的 IDE 实践区；尚未连接真实 HiDevLab 主机。'}
  ];
  function root(){return document.querySelector('[data-uac-auto-prep]');}
  function read(node){try{const value=JSON.parse(node.dataset.uacAutoPrep);return value&&typeof value.id==='string'&&Number.isInteger(value.step)?value:null;}catch{return null;}}
  function markup(state){const complete=state.step>=items.length;
    return `<section class="auto-prep" data-uac-auto-prep="${esc(JSON.stringify(state))}"><header><div><small>新版 · 自动准备</small><h3>为你打开 MindIE 实验环境</h3></div><span class="auto-prep-badge">交互演示</span></header><p class="auto-prep-intro">我会依次演示获取环境、准备模型权重，并打开左侧 IDE；无需逐项确认。</p><ol class="auto-prep-list">${items.map((item,index)=>{const status=index<state.step?'done':index===state.step?'active':'waiting';return `<li class="${status}"><span class="auto-prep-mark" aria-hidden="true">${status==='done'?'✓':index+1}</span><div><b>${item.title}</b><small>${status==='done'?item.done:status==='active'?item.doing:'等待前一步完成'}</small></div></li>`;}).join('')}</ol><p class="auto-prep-status" role="status" aria-atomic="true">${complete?'演示流程已结束。左侧已切换到 IDE，可继续查看代码与终端。':items[state.step].doing}</p>${state.step>=2?'<div class="auto-prep-result"><b>模型权重准备结果</b><p>下载和上传流程已演示，目标目录为 /home/lgy/Qwen2-7B/。本页没有实际传输文件，真实目录请在服务器核对。</p></div>':''}<small class="auto-prep-disclaimer">本页面没有连接 HiDevLab、Hugging Face 或真实主机；完成状态只代表页面演示。</small></section>`;
  }
  function writeTerminal(state,index){window.MindIETerminal?.write({id:`auto-prep:${state.id}:${index}`,host:'A',command:items[index].title+'（演示）',status:'success',output:items[index].terminal},{reveal:true});}
  function advance(id,messageId){const node=root(),state=node&&read(node);if(!state||state.id!==id||A.getSessionId()!==state.session)return;
    const index=state.step;writeTerminal(state,index);state.step=index+1;
    if(index===items.length-1){L.setView('video');L.setVideoPerspective('ide');document.querySelector('.ide-tabs [data-mindie-step="0"]')?.click();}
    A.updateToolMessage(messageId,markup(state));
  }
  function resume(){const node=root();if(!node)return;const state=read(node);if(!state||state.step>=items.length||timers.has(state.id))return;
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
  function syncEntry(){const entry=document.querySelector('.uac-environment-entry');if(entry){entry.querySelector('span').textContent='AI 学伴 · 新版';entry.querySelector('b').textContent='自动准备实验环境';entry.querySelector('small').textContent='环境获取 → 模型权重 → 打开 IDE';}}
  document.addEventListener('uac:render',()=>{syncEntry();resume();});syncEntry();
  const toolbar=[...document.querySelectorAll('.mindie-practice-link')].find(button=>button.textContent==='实验引导');if(toolbar){toolbar.textContent='自动准备环境';toolbar.title='自动演示环境与模型准备，并打开 IDE';}
  if(new URLSearchParams(location.search).get('guide')==='open'||['environment','inference'].includes(new URLSearchParams(location.search).get('agent')))start();
})();
