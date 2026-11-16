/* Keep the agent journey inside the existing homepage floating window. */
(() => {
  const frame=document.getElementById('homeAgentFrame'),rail=document.getElementById('homeAgentRail'),panel=document.getElementById('homeAssistantWindow');
  if(!frame||!rail||!panel)return;
  function command(command,index){frame.contentWindow.postMessage({kind:'ascend-agent-command',command,index},location.origin)}
  frame.addEventListener('load',()=>command('sync'));
  addEventListener('message',event=>{
    if(event.source!==frame.contentWindow||event.origin!==location.origin)return;
    if(event.data?.kind==='ascend-agent-close'){panel.querySelector('[data-ha-close]').click();return}
    if(event.data?.kind!=='ascend-agent-state'||!Array.isArray(event.data.agents))return;
    rail.replaceChildren();
    for(const a of event.data.agents.slice(0,12)){
      if(!Number.isInteger(a.index)||typeof a.avatar!=='string')continue;
      const src=new URL(a.avatar,frame.src);
      if(src.origin!==location.origin||!src.pathname.includes('/assets/images/agent-personas/'))continue;
      const button=document.createElement('button');button.type='button';button.className='ha-agent-chip';
      button.title=`${a.name} · ${a.done?'任务已完成':'正在工作（演示）'}`;button.setAttribute('aria-label',button.title);
      const img=document.createElement('img');img.src=src.href;img.alt=String(a.name||'学习分身');
      const dot=document.createElement('span');dot.className='ha-agent-status'+(a.done?' done':'');dot.setAttribute('aria-hidden','true');
      button.append(img,dot);button.addEventListener('click',()=>command('resume',a.index));rail.append(button);
    }
  });
})();
