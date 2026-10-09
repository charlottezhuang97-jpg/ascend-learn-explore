(()=>{
  const fab=document.querySelector('#homeCompanionFab'),panel=document.querySelector('#homeCompanionPanel');
  if(!fab||!panel)return;
  function toggle(force){const open=force??!panel.classList.contains('open');panel.classList.toggle('open',open);fab.setAttribute('aria-expanded',String(open));panel.setAttribute('aria-hidden',String(!open))}
  fab.addEventListener('click',()=>toggle());document.addEventListener('keydown',event=>{if(event.key==='Escape'&&panel.classList.contains('open')){toggle(false);fab.focus()}});
  addEventListener('message',event=>{if(event.data?.type==='close-ai-companion'||event.data?.type==='back-smart-assistant'){toggle(false);fab.focus()}});
  if(new URLSearchParams(location.search).get('companion')==='open')requestAnimationFrame(()=>toggle(true));
})();
