/* Standalone home assistant, using the shared floating-window interaction. */
(() => {
  const trigger=document.getElementById('homeAssistantTrigger'),panel=document.getElementById('homeAssistantWindow');
  if(!trigger||!panel)return;
  const handle=panel.querySelector('.ha-drag-handle');
  const floating=window.AscendFloatingWindow.mount(panel,handle);
  function setOpen(open){panel.hidden=!open;trigger.setAttribute('aria-expanded',String(open));if(open){floating.clamp();panel.tabIndex=-1;panel.focus({preventScroll:true});getSelection()?.removeAllRanges();document.getElementById('homeAgentFrame')?.contentWindow.postMessage({kind:'ascend-agent-command',command:'home'},location.origin);}else trigger.focus({preventScroll:true});}
  trigger.addEventListener('click',()=>setOpen(panel.hidden));
  panel.querySelector('[data-ha-close]').addEventListener('click',()=>setOpen(false));
  panel.querySelectorAll('[data-ha-section]').forEach(button=>button.addEventListener('click',()=>{
    const frame=document.getElementById('homeAgentFrame');if(frame){frame.contentWindow.postMessage({kind:'ascend-agent-command',command:button.dataset.haSection==='homeAssistantAbility'?'ability':'plan'},location.origin);return;}const section=document.getElementById(button.dataset.haSection),content=panel.querySelector('.ha-content');if(!section)return;
    content.scrollTo({top:section.offsetTop-8,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
  }));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){event.preventDefault();setOpen(false);}});
  if(new URLSearchParams(location.search).get('companion')==='open')setOpen(true);
})();
