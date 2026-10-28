/* Standalone home assistant. Artwork and layout follow 首页-学伴 in the supplied export. */
(() => {
  const trigger = document.getElementById('homeAssistantTrigger');
  const panel = document.getElementById('homeAssistantWindow');
  if (!trigger || !panel) return;
  const handle = panel.querySelector('.ha-drag-handle');
  let drag = null;
  let moved = false;
  function place(left, top) {
    const margin = 8;
    const maxLeft = Math.max(margin, innerWidth - panel.offsetWidth - margin);
    const maxTop = Math.max(margin, innerHeight - panel.offsetHeight - margin);
    panel.style.left = `${Math.max(margin, Math.min(left, maxLeft))}px`;
    panel.style.top = `${Math.max(margin, Math.min(top, maxTop))}px`;
    panel.style.right = 'auto';
    moved = true;
  }
  function setOpen(open) {
    panel.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
    if (open) {
      if (moved) place(parseFloat(panel.style.left), parseFloat(panel.style.top));
      handle.focus({preventScroll:true});
    } else {
      trigger.focus({preventScroll:true});
    }
  }
  trigger.addEventListener('click', () => setOpen(panel.hidden));
  panel.querySelector('[data-ha-close]').addEventListener('click', () => setOpen(false));
  panel.querySelectorAll('[data-ha-section]').forEach(button => {
    button.addEventListener('click', () => {
      const section = document.getElementById(button.dataset.haSection);
      const content = panel.querySelector('.ha-content');
      content.scrollTo({top:section.offsetTop - 8,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
    });
  });
  handle.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    const rect = panel.getBoundingClientRect();
    drag = {id:event.pointerId,x:event.clientX,y:event.clientY,left:rect.left,top:rect.top};
    handle.setPointerCapture(event.pointerId);
    panel.classList.add('is-dragging');
  });
  handle.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    place(drag.left + event.clientX - drag.x, drag.top + event.clientY - drag.y);
  });
  function stop(event) {
    if (!drag || event.pointerId !== drag.id) return;
    drag = null;
    panel.classList.remove('is-dragging');
    if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
  }
  handle.addEventListener('pointerup', stop);
  handle.addEventListener('pointercancel', stop);
  handle.addEventListener('lostpointercapture', () => { drag=null;panel.classList.remove('is-dragging'); });
  handle.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') {
      panel.style.removeProperty('left');panel.style.removeProperty('top');panel.style.removeProperty('right');moved=false;
      return;
    }
    const rect = panel.getBoundingClientRect(),step=event.shiftKey?48:16;
    place(rect.left+(event.key==='ArrowLeft'?-step:event.key==='ArrowRight'?step:0),rect.top+(event.key==='ArrowUp'?-step:event.key==='ArrowDown'?step:0));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) { event.preventDefault();setOpen(false); }
  });
  window.addEventListener('resize', () => {
    if (panel.hidden || !moved) return;
    place(parseFloat(panel.style.left), parseFloat(panel.style.top));
  });
  if (new URLSearchParams(location.search).get('companion') === 'open') setOpen(true);
})();
