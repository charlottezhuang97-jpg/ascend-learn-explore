/* Shared movement for home and immersive assistant windows. */
(() => {
  window.AscendFloatingWindow = {
    mount(panel, handle, {enabled=()=>true,onReset=()=>{}}={}) {
      let drag=null,moved=false;
      function place(left,top) {
        const x=Math.max(8,Math.min(left,Math.max(8,innerWidth-panel.offsetWidth-8)));
        const y=Math.max(8,Math.min(top,Math.max(8,innerHeight-panel.offsetHeight-8)));
        panel.style.setProperty('left',`${x}px`,'important');
        panel.style.setProperty('top',`${y}px`,'important');
        panel.style.setProperty('right','auto','important');
        moved=true;
      }
      function reset() {
        for(const key of ['left','top','right'])panel.style.removeProperty(key);
        moved=false;onReset();
      }
      handle.addEventListener('pointerdown',event=>{
        if(!enabled()||event.button!==0||event.target.closest('button,a,input,textarea,select,summary,details'))return;
        const r=panel.getBoundingClientRect();drag={id:event.pointerId,x:event.clientX,y:event.clientY,left:r.left,top:r.top};
        handle.setPointerCapture(event.pointerId);panel.classList.add('is-dragging');
      });
      handle.addEventListener('pointermove',event=>{if(drag&&event.pointerId===drag.id)place(drag.left+event.clientX-drag.x,drag.top+event.clientY-drag.y);});
      function stop(event) {if(!drag||event.pointerId!==drag.id)return;drag=null;panel.classList.remove('is-dragging');if(handle.hasPointerCapture(event.pointerId))handle.releasePointerCapture(event.pointerId);}
      handle.addEventListener('pointerup',stop);handle.addEventListener('pointercancel',stop);
      handle.addEventListener('lostpointercapture',()=>{drag=null;panel.classList.remove('is-dragging');});
      handle.addEventListener('keydown',event=>{
        if(!enabled()||event.target!==handle||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(event.key))return;
        event.preventDefault();if(event.key==='Home'){reset();return;}
        const r=panel.getBoundingClientRect(),step=event.shiftKey?48:16;
        place(r.left+(event.key==='ArrowLeft'?-step:event.key==='ArrowRight'?step:0),r.top+(event.key==='ArrowUp'?-step:event.key==='ArrowDown'?step:0));
      });
      function clamp(){if(!panel.hidden&&moved&&enabled()){const r=panel.getBoundingClientRect();place(r.left,r.top);}}
      addEventListener('resize',clamp);
      return {reset,clamp};
    }
  };
})();
