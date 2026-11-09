/* One release point resolves to one pane zone, following conical split areas. */
(() => {
  if (!location.pathname.endsWith('/learn.html')) return;
  const panel = document.getElementById('unifiedCompanion');
  const handle = panel?.querySelector('.iv-assistant-drag');
  if (!panel || !handle) return;
  let origin = null;
  const zoneAt = (x, y) => {
    const dx = (x - innerWidth / 2) / (innerWidth / 2);
    const dy = (y - innerHeight / 2) / (innerHeight / 2);
    if (Math.abs(dy) > Math.abs(dx)) return dy > 0 ? 'bottom' : 'top';
    return dx < 0 ? 'left' : 'right';
  };
  handle.addEventListener('pointerdown', event => {
    if (event.button !== 0 || event.target.closest('button,a,input,textarea,select,summary,details')) return;
    origin = {id:event.pointerId,x:event.clientX,y:event.clientY};
  });
  handle.addEventListener('pointerup', event => {
    if (!origin || origin.id !== event.pointerId) return;
    const moved = Math.hypot(event.clientX-origin.x,event.clientY-origin.y) >= 50;
    origin = null;
    if (!moved || panel.hidden || !document.body.classList.contains('reference-immersive')) return;
    const zone = zoneAt(event.clientX,event.clientY);
    if (zone === 'bottom') {window.AscendAssistantBottomDock?.dock();return;}
    document.body.classList.remove('assistant-docked');
    if (zone === 'left' && innerWidth > 800) {
      document.body.classList.add('assistant-left-docked');
      for (const key of ['left','top','right']) panel.style.removeProperty(key);
    } else if (zone === 'right') {
      document.body.classList.remove('assistant-left-docked');
    }
  });
  handle.addEventListener('pointercancel',()=>{origin=null;});
  addEventListener('resize',()=>{if(innerWidth<=800)document.body.classList.remove('assistant-left-docked');});
})();
