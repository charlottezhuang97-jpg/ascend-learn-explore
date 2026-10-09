(()=>{
  const embedded=new URLSearchParams(location.search).get('embedded')==='1';
  if(embedded)document.body.classList.add('embedded');
  const send=type=>{if(embedded&&parent!==window)parent.postMessage({type},'*');else location.href='index.html'};
  document.querySelector('#companionClose').addEventListener('click',()=>send('close-ai-companion'));
  document.querySelector('#assistantBack').addEventListener('click',()=>send('back-smart-assistant'));
  const tabs=[...document.querySelectorAll('.ac-tabs [role="tab"]')],panels=[...document.querySelectorAll('[data-panel]')];
  tabs.forEach(tab=>tab.addEventListener('click',()=>{tabs.forEach(item=>item.setAttribute('aria-selected',String(item===tab)));panels.forEach(panel=>panel.hidden=panel.dataset.panel!==tab.dataset.tab)}));
  document.querySelector('#recommendReason').addEventListener('click',event=>{event.currentTarget.textContent='基于你的 6 条实践记录';event.currentTarget.disabled=true});
  const reanalyze=document.querySelector('#reanalyzeAbility');
  reanalyze?.addEventListener('click',()=>{
    reanalyze.disabled=true;
    reanalyze.textContent='分析中…';
    window.setTimeout(()=>{
      reanalyze.textContent='已更新';
      window.setTimeout(()=>{reanalyze.textContent='再次分析';reanalyze.disabled=false},1200);
    },800);
  });
})();
