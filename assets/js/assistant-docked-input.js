/* A dragged-down assistant becomes a compact question entry. */
(() => {
  if (!location.pathname.endsWith('/learn.html')) return;
  const panel=document.getElementById('unifiedCompanion');
  const handle=panel?.querySelector('.iv-assistant-drag');
  if (!panel||!handle) return;
  const form=document.createElement('form');
  form.className='assistant-docked-input';form.hidden=true;
  form.innerHTML='<button type="button" data-docked-expand aria-label="展开学习助手"><span class="docked-assistant-icon" aria-hidden="true"></span><strong>学习助手</strong></button><input aria-label="向学习助手提问" placeholder="有问题，随时问学习助手。"><button type="submit" aria-label="发送问题">↑</button>';
  form.querySelector('.docked-assistant-icon').innerHTML=panel.querySelector('.uac-logo')?.innerHTML||'';
  document.body.append(form);
  function restore(){document.body.classList.remove('assistant-docked');form.hidden=true;for(const key of ['left','top','right'])panel.style.removeProperty(key);panel.classList.remove('is-dragging');}
  function dock(){document.body.classList.remove('assistant-left-docked');for(const key of ['left','top','right'])panel.style.removeProperty(key);document.body.classList.add('assistant-docked');form.hidden=false;form.querySelector('input').focus({preventScroll:true});}
  window.AscendAssistantBottomDock={dock,restore};
  form.querySelector('[data-docked-expand]').addEventListener('click',restore);
  form.addEventListener('submit',event=>{event.preventDefault();const input=form.querySelector('input'),question=input.value.trim();if(!question)return;restore();window.AscendCompanion?.beginTool(question,'<p>我已记下你的问题。你可以继续在学习助手中查看课程总结、知识点和视频字幕。</p>');input.value='';});
  document.getElementById('learningFloors1030')?.addEventListener('scroll',()=>{if(document.body.classList.contains('assistant-reviews-floor')&&document.body.classList.contains('assistant-docked'))restore();},{passive:true});
})();
