(() => {
  const icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>';
  const courses = [
    { title:'Ascend C 入门简单Vector算子开发', description:'从一个简单的向量加法算子出发，认识 Ascend C 编程模型，完成算子实现、编译与正确性验证。', modules:[['认识 Ascend C 编程模型','了解核函数与主机侧调用','认识 Global Memory 与 Local Memory'],['实现简单 Vector 算子','编写数据搬入、计算与搬出流程','实现向量加法 Add 算子'],['运行并验证算子','编译与运行样例','对比计算结果，完成精度验证']] },
    { title:'Ascend C进阶泛化Vector算子开发', description:'在简单 Vector 算子的基础上，学习 Tiling 与多核运行，让算子适配不同形状的数据。', modules:[['理解泛化与 Tiling','分析输入形状与切分策略','设计 Tiling 参数'],['实现多核 Vector 算子','划分多核计算任务','处理尾块与边界数据'],['验证与调优','验证不同形状输入','分析访存与流水开销']] },
    { title:'Ascend C高级Cube算子开发', description:'理解 Cube 计算特点，围绕矩阵乘法组织数据、实现计算并分析性能。', modules:[['认识 Cube 计算','理解矩阵乘法与数据布局','认识存储层次'],['实现矩阵计算','组织分块与数据搬运','实现矩阵乘法调用'],['精度与性能验证','校验计算精度','分析并优化计算效率']] },
    { title:'Ascend C高级CV融合算子', description:'结合计算机视觉场景，学习算子融合的思路，减少中间数据搬运并验证融合效果。', modules:[['分析 CV 融合场景','识别可融合的计算步骤','分析中间数据开销'],['设计融合实现','组织数据流与计算顺序','实现融合算子'],['验证融合效果','对比精度与输出','比较融合前后性能']] }
  ];
  // Reuse the same catalog that powers course-preview.html.
  const catalogScenes = {operator:'cann', training:'gen', inference:'gen', agent:'agent'};
  courses.forEach((course, index) => Object.assign(course, {id:`ascend-${index}`, scene:'cann', href:'course-preview.html?course=operator'}));
  Object.entries(window.AscendCourseCatalog || {}).forEach(([key, course]) => {
    if (!catalogScenes[key]) return;
    courses.push({
      id:`catalog-${key}`, scene:catalogScenes[key], title:course.title,
      description:course.summary, href:`course-preview.html?course=${key}`,
      modules:course.stages.map(stage => [stage.title, ...stage.units.flatMap(unit => Array.isArray(unit) ? [unit[1]] : unit.lessons.map(lesson => lesson[1]))])
    });
  });
  window.AscendKnowledgeCourses = courses;
  window.createKnowledgeOutline = ({goal='我要学习算子开发', source='goal', workflow=false, initialPath='ascend', initialCourseId='ascend-0', onStart=null}={}) => {
    const root=document.createElement('section'); root.className='kmap';
    root.innerHTML=`<div class="kmap-heading"><div><span class="kmap-eyebrow">${source==='assessment'?'根据测一测结果推荐':'为你的学习目标推荐'}</span><h1 id="flowHeading">从知识图谱，找到学习的起点</h1><p class="kmap-description"></p></div><a class="kmap-back" href="index.html">返回首页 ↗</a></div><div class="kmap-bar"><div class="kmap-legend"><span class="kmap-dot"></span>当前推荐方向 <span class="kmap-pattern"></span>学习路径 ${icon}课程</div><div class="kmap-tools"><button data-action="focus">聚焦 CANN</button><button data-action="all">查看全图</button><button data-action="minus" aria-label="缩小">−</button><output aria-live="polite">100%</output><button data-action="plus" aria-label="放大">＋</button></div></div><div class="kmap-viewport" tabindex="0" aria-label="学习知识图谱，可滚动查看，使用缩放按钮调整大小"><div class="kmap-canvas"><svg class="kmap-lines" viewBox="0 0 1500 1540" aria-hidden="true"></svg></div></div><div class="kmap-footer"><span>点击学习路径展开课程 · 点击课程查看目录</span><span>蓝色虚线：共同调优方向　灰色实线：分类关联</span></div>`;
    root.querySelector('.kmap-description').textContent=`「${goal}」 · 先了解全貌，再沿学习路径逐步实践。`;
    const canvas=root.querySelector('.kmap-canvas'), viewport=root.querySelector('.kmap-viewport'), lines=root.querySelector('.kmap-lines');
    let scale=1, modal=null, editing=false, closePicker=null;
    const storageKey='ascend-knowledge-map-courses-v1';
    const defaults={ascend:['ascend-0','ascend-1','ascend-2','ascend-3']};
    let assignments=structuredClone(defaults), savedAssignments=structuredClone(defaults);
    const expandedPath={cann:initialPath,gen:null,agent:null};
    const scenes = {
      cann: {
        label: 'CANN', height: 960,
        nodes: [
          ['tuning','应用/算子调优',710,795,300,'tuning'],['cann','CANN',1210,330,300,'domain active'],
          ['ascend','AscendC算子开发',710,75,300,'path active'],['triton','Triton算子开发',710,255,300,'path'],
          ['catlass','CATLASS算子开发',710,435,300,'path'],['950','950系列算子开发',710,615,300,'path']
        ],
        edges: [['cann','ascend'],['cann','triton'],['cann','catlass'],['cann','950'],['cann','tuning']]
      },
      gen: {
        label: '生成式 AI', height: 700,
        nodes: [
          ['gen','生成式AI与大语言模型',1150,280,340,'domain active'],
          ['training','训练开发',590,100,320,'path'],['inference','推理开发',590,280,320,'path'],
          ['genapp','生成式AI应用开发部署',590,460,320,'path']
        ],
        edges: [['gen','training'],['gen','inference'],['gen','genapp']]
      },
      agent: {
        label: '智能体', height: 700,
        nodes: [
          ['agent','智能体',1150,290,300,'domain active'],
          ['agentapp','Agent应用开发部署',590,180,320,'path'],
          ['rag','RAG应用开发部署',590,400,320,'path']
        ],
        edges: [['agent','agentapp'],['agent','rag']]
      }
    };
    let activeScene = 'cann';
    const pathNodes = scene => scenes[scene].nodes.filter(node => node[5].includes('path'));
    const pathScene = id => Object.keys(scenes).find(scene => pathNodes(scene).some(node => node[0] === id));
    const courseById = id => courses.find(course => course.id === id);
    try {
      const stored=JSON.parse(localStorage.getItem(storageKey));
      if (stored && typeof stored==='object' && !Array.isArray(stored)) {
        assignments={};
        Object.entries(stored).forEach(([path, ids]) => {
          if (pathScene(path) && Array.isArray(ids)) assignments[path]=[...new Set(ids)].filter(id => courseById(id)?.scene===pathScene(path));
        });
        savedAssignments=structuredClone(assignments);
      }
    } catch (_) { /* Storage may be unavailable; editing still works in this page. */ }
    const editActions=document.createElement('div');
    editActions.className='kmap-edit-actions';
    editActions.innerHTML='<button type="button" class="kmap-edit-toggle">编辑课程</button><button type="button" class="kmap-edit-cancel" hidden>取消</button><button type="button" class="kmap-start-learning" hidden>确认课程，安排学习 →</button>';
    editActions.append(root.querySelector('.kmap-back'));
    root.querySelector('.kmap-heading').append(editActions);
    const editToggle=editActions.querySelector('.kmap-edit-toggle');
    const cancelEdit=editActions.querySelector('.kmap-edit-cancel');
    const startLearning=editActions.querySelector('.kmap-start-learning');
    startLearning.hidden=!workflow;
    const editStatus=document.createElement('p');
    editStatus.className='kmap-edit-status';
    editStatus.setAttribute('role','status');
    root.querySelector('.kmap-heading').after(editStatus);
    function setEditing(value) {
      editing=value;
      if(value)startLearning.hidden=true;
      root.classList.toggle('is-editing', value);
      editToggle.textContent=value?'完成编辑':'编辑课程';
      cancelEdit.hidden=!value;
      editStatus.textContent=value?'选择路径，从课程库添加课程；也可以移除已有课程。完成后保存到当前浏览器。':'';
      renderScene(activeScene);
    }
    editToggle.onclick=()=>{
      if (!editing) { savedAssignments=structuredClone(assignments); setEditing(true); return; }
      savedAssignments=structuredClone(assignments);
      let stored=true;
      try { localStorage.setItem(storageKey, JSON.stringify(assignments)); } catch (_) { stored=false; }
      setEditing(false);
      editStatus.textContent=stored?'学习图谱已更新，课程调整已保存在当前浏览器。':'学习图谱已更新，本次调整仅在当前页面保留。';
      startLearning.hidden=!workflow;
    };
    cancelEdit.onclick=()=>{assignments=structuredClone(savedAssignments);setEditing(false);editStatus.textContent='已取消本次编辑。';startLearning.hidden=!workflow;};
    startLearning.onclick=()=>{
      const selectedIds=[...new Set([...(assignments[initialPath]||[]),...Object.values(assignments).flat()])];
      const selected=selectedIds.map(courseById).filter(Boolean);
      const course=selected.find(item=>item.id===initialCourseId)||selected[0];
      if(!course){editStatus.textContent='请先从课程库添加至少一门课程，再安排学习计划。';return;}
      if(typeof onStart==='function')onStart(course,selected);
    };

    const workspace = document.createElement('div');
    workspace.className = 'kmap-workspace';
    const sidebar = document.createElement('nav');
    sidebar.className = 'kmap-sidebar';
    sidebar.setAttribute('aria-label', '开发场景');
    sidebar.innerHTML = '<p class="kmap-sidebar-title">开发场景</p>';
    Object.entries(scenes).forEach(([id, scene], index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.scene = id;
      button.setAttribute('aria-pressed', String(id === activeScene));
      button.innerHTML = `<span class="kmap-scene-index">0${index + 1}</span><strong></strong><span aria-hidden="true">›</span>`;
      button.querySelector('strong').textContent = scene.label;
      button.addEventListener('click', () => renderScene(id));
      sidebar.append(button);
    });
    const pane = document.createElement('div');
    pane.className = 'kmap-pane';
    ['.kmap-bar', '.kmap-viewport', '.kmap-footer'].forEach(selector => pane.append(root.querySelector(selector)));
    workspace.append(sidebar, pane);
    root.append(workspace);
    root.querySelector('[data-action="focus"]').textContent = '重置视图';
    root.querySelector('[data-action="all"]').textContent = '适配视图';
    const sceneTitle = document.createElement('p');
    sceneTitle.className = 'kmap-scene-title';
    sceneTitle.setAttribute('aria-live', 'polite');
    pane.prepend(sceneTitle);
    function renderScene(id) {
      if (modal) closeModal();
      activeScene = id;
      const scene = scenes[id];
      sidebar.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scene === id)));
      root.querySelectorAll('.kmap-add-course').forEach(element=>element.remove());
      canvas.querySelectorAll('.kmap-node').forEach(element => element.remove());
      lines.replaceChildren();
      scene.nodes.forEach(node);
      sceneTitle.textContent = `${scene.label} · 知识图谱`;
      viewport.setAttribute('aria-label', `${scene.label}知识图谱，可滚动查看，使用缩放按钮调整大小`);
      root.querySelector('.kmap-footer span').textContent = '点击路径展开课程 · 使用编辑课程调整学习内容';
      root.querySelector('.kmap-footer span:last-child').textContent = id === 'cann' ? '蓝色虚线：共同后续课程　灰色实线：分类关联' : '灰色实线：分类关联';
      lines.setAttribute('viewBox', `0 0 1500 ${scene.height}`);
      lines.style.height = `${scene.height}px`;
      renderCourses();
      zoom(Math.max(.65, Math.min(1, viewport.clientWidth / 1500)));
      viewport.scrollTo(0, 0);
      requestAnimationFrame(draw);
    }
    function node([id,title,x,y,w,type]) {
      const el=document.createElement('button'); el.type='button';el.className=`kmap-node ${type}`;el.dataset.node=id;el.style.cssText=`left:${x-w/2}px;top:${y}px;width:${w}px`;
      el.innerHTML=`<span class="kmap-node-type">${type.includes('domain')?'知识领域':id==='tuning'?'课程 · 共同进阶':'学习路径'}</span><strong></strong>${id==='tuning'?'<span class="kmap-tuning-note">完成算子开发路径后学习</span>':''}${type.includes('path')?`<span class="kmap-path-meta">${(assignments[id]||[]).length} 门课程 <span class="kmap-chevron">${expandedPath[activeScene]===id?'⌄':'›'}</span></span>`:''}`;
      el.querySelector('strong').textContent=title;
      el.addEventListener('click',()=>{if(type.includes('path')){expandedPath[activeScene]=expandedPath[activeScene]===id?null:id;renderScene(activeScene);root.querySelector('[data-node="'+id+'"]').focus({preventScroll:true});}else{root.querySelectorAll('.kmap-node.is-selected').forEach(n=>n.classList.remove('is-selected'));el.classList.add('is-selected');root.querySelector('.kmap-footer span').textContent=`已选择「${title}」 · ${scenes[activeScene].label}知识图谱`;}});
      if(type.includes('path'))el.setAttribute('aria-expanded',String(expandedPath[activeScene]===id));canvas.append(el);
    }
    function curve(a,b,dashed=false){const path=document.createElementNS('http://www.w3.org/2000/svg','path');const mid=(a[0]+b[0])/2;path.setAttribute('d',`M${a[0]},${a[1]} C${mid},${a[1]} ${mid},${b[1]} ${b[0]},${b[1]}`);if(dashed)path.classList.add('shared');lines.append(path);}
    function connect(a,b,dashed=false){const x=canvas.querySelector(`[data-node="${a}"]`),y=canvas.querySelector(`[data-node="${b}"]`);if(!x||!y)return;const ax=x.offsetLeft,ay=x.offsetTop,bx=y.offsetLeft,by=y.offsetTop;const vertical=Math.abs(ax-bx)<100;if(vertical){const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',`M${ax+x.offsetWidth/2},${ay+x.offsetHeight} L${bx+y.offsetWidth/2},${by}`);if(dashed)p.classList.add('shared');lines.append(p);}else{const right=bx>ax;curve([right?ax+x.offsetWidth:ax,ay+x.offsetHeight/2],[right?bx:bx+y.offsetWidth,by+y.offsetHeight/2],dashed);}}
    function draw() {
      lines.replaceChildren();
      scenes[activeScene].edges.forEach(edge => connect(...edge));
      if (activeScene === 'cann') {
        const target=canvas.querySelector('[data-node="tuning"]');
        ['ascend','triton','catlass','950'].forEach((id,index)=>{
          const from=canvas.querySelector(`[data-node="${id}"]`);
          const x=from.offsetLeft+from.offsetWidth;
          const endX=target.offsetLeft+target.offsetWidth;
          const y=from.offsetTop+from.offsetHeight/2;
          const endY=target.offsetTop+target.offsetHeight/2;
          const rail=970+index*16;
          const path=document.createElementNS('http://www.w3.org/2000/svg','path');
          path.setAttribute('d',`M${x},${y} C${rail},${y} ${rail},${endY} ${endX},${endY}`);
          path.classList.add('shared');
          lines.append(path);
        });

      }
      const path=expandedPath[activeScene];
      if(path)(assignments[path]||[]).forEach(id=>connect(path, `course-${id}`));
    }
    function renderCourses() {
      const path=expandedPath[activeScene];
      const list=(assignments[path]||[]).map(courseById).filter(Boolean);
      scenes[activeScene].height=Math.max(activeScene==='cann'?960:700, 110+list.length*157);
      lines.setAttribute('viewBox',`0 0 1500 ${scenes[activeScene].height}`);
      lines.style.height=`${scenes[activeScene].height}px`;
      list.forEach((course,index)=>{
        const card=document.createElement('div');
        card.className='kmap-node kmap-course'+(workflow&&course.id===initialCourseId?' is-recommended':'');card.dataset.node='course-'+course.id;
        card.style.cssText='left:30px;top:'+(75+index*157)+'px;width:340px';
        const open=document.createElement('button');open.type='button';open.className='kmap-course-open';
        open.innerHTML='<span class="kmap-course-label"></span><strong></strong><span class="kmap-course-link">查看课程 →</span>';
        const courseLabel=open.querySelector('.kmap-course-label');
        courseLabel.innerHTML=icon+'课程 '+String(index+1).padStart(2,'0');
        if(workflow&&course.id===initialCourseId){const badge=document.createElement('b');badge.className='kmap-recommended-label';badge.textContent='建议起点';courseLabel.append(badge);}
        open.querySelector('strong').textContent=course.title;
        open.onclick=()=>openCourse(courses.indexOf(course),open);
        card.append(open);
        if(editing){
          const remove=document.createElement('button');remove.type='button';remove.className='kmap-course-remove';remove.textContent='移除';remove.setAttribute('aria-label',`移除课程：${course.title}`);
          remove.onclick=()=>{assignments[path]=assignments[path].filter(id=>id!==course.id);renderScene(activeScene);root.querySelector('[data-node="'+path+'"]').focus({preventScroll:true});};
          card.append(remove);
        }
        canvas.append(card);
      });
      if(editing){
        const add=document.createElement('button');add.type='button';add.className='kmap-add-course';add.innerHTML='<span>＋</span> 从课程库添加课程';
        add.onclick=()=>openPicker(path);root.querySelector('.kmap-bar').append(add);
      }
      requestAnimationFrame(draw);
    }
    function openPicker(preferredPath) {
      const returnTarget=document.activeElement;
      let scene=activeScene, target=preferredPath||pathNodes(scene)[0][0], selected=new Set();
      const picker=document.createElement('div');picker.className='kmap-modal kmap-picker-modal';
      const oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';root.inert=true;
      picker.innerHTML='<div class="kmap-scrim"></div><section class="kmap-picker" role="dialog" aria-modal="true" aria-labelledby="kmapPickerTitle"><header><div><h2 id="kmapPickerTitle">从课程库添加</h2><p>选择现有课程，加入对应的学习路径。</p></div><button type="button" class="kmap-dismiss" aria-label="关闭课程库">×</button></header><div class="kmap-picker-controls"><div class="kmap-library-tabs" aria-label="课程所属场景"></div><label>加入路径<select class="kmap-target-path"></select></label><label>搜索课程<input type="search" class="kmap-course-search" placeholder="搜索课程名称"></label></div><div class="kmap-library-list"></div><footer><span class="kmap-picker-count" role="status"></span><button type="button" class="kmap-picker-add" disabled>添加到图谱</button></footer></section>';
      closePicker=close;
      const tabs=picker.querySelector('.kmap-library-tabs'), select=picker.querySelector('select'), search=picker.querySelector('input'), list=picker.querySelector('.kmap-library-list'), add=picker.querySelector('.kmap-picker-add');
      function close(){closePicker=null;picker.remove();root.inert=false;document.body.style.overflow=oldOverflow;if(returnTarget?.isConnected)returnTarget.focus();}
      function count(){picker.querySelector('.kmap-picker-count').textContent=`已选择 ${selected.size} 门课程`;add.disabled=!selected.size;}
      function renderList(){
        list.replaceChildren();const query=search.value.trim().toLowerCase();
        const available=courses.filter(c=>c.scene===scene&&c.title.toLowerCase().includes(query));
        available.forEach(course=>{
          const row=document.createElement('label');row.className='kmap-library-course';
          const exists=(assignments[target]||[]).includes(course.id);
          const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.value=course.id;checkbox.disabled=exists;checkbox.checked=exists||selected.has(course.id);
          const body=document.createElement('span');body.innerHTML='<strong></strong><small></small>';body.querySelector('strong').textContent=course.title;body.querySelector('small').textContent=exists?'已在此路径中':course.description;
          checkbox.onchange=()=>{if(checkbox.checked)selected.add(course.id);else selected.delete(course.id);count();};
          row.append(checkbox,body);list.append(row);
        });
        if(!available.length){const empty=document.createElement('p');empty.className='kmap-library-empty';empty.textContent='没有找到匹配的课程，试试其他关键词。';list.append(empty);}
        count();
      }
      function renderControls(){
        tabs.replaceChildren();Object.entries(scenes).forEach(([id,item])=>{const b=document.createElement('button');b.type='button';b.textContent=item.label;b.setAttribute('aria-pressed',String(scene===id));b.onclick=()=>{scene=id;target=pathNodes(scene)[0][0];selected.clear();renderControls();[...tabs.querySelectorAll('button')].find(button=>button.textContent===item.label)?.focus();};tabs.append(b);});
        select.replaceChildren();pathNodes(scene).forEach(node=>{const option=document.createElement('option');option.value=node[0];option.textContent=node[1];select.append(option);});select.value=target;renderList();
      }
      select.onchange=()=>{target=select.value;selected.clear();renderList();};search.oninput=renderList;
      add.onclick=()=>{assignments[target]=[...new Set([...(assignments[target]||[]),...selected])];expandedPath[scene]=target;close();renderScene(scene);editStatus.textContent=`已添加 ${selected.size} 门课程，点击「完成编辑」保存。`;editToggle.focus({preventScroll:true});};
      picker.querySelector('.kmap-dismiss').onclick=close;picker.querySelector('.kmap-scrim').onclick=close;
      picker.addEventListener('keydown',event=>{if(event.key==='Escape'){event.stopPropagation();close();}if(event.key==='Tab'){const items=[...picker.querySelectorAll('button:not([disabled]),input:not([disabled]),select')].filter(n=>n.getClientRects().length);if(event.shiftKey&&document.activeElement===items[0]){event.preventDefault();items.at(-1).focus();}else if(!event.shiftKey&&document.activeElement===items.at(-1)){event.preventDefault();items[0].focus();}}});
      document.body.append(picker);renderControls();picker.querySelector('.kmap-dismiss').focus();
    }
    function closeModal(){if(!modal)return;const back=modal._return;document.body.style.overflow=modal._overflow;modal.remove();modal=null;root.inert=false;back?.focus();}
    function openCourse(index,trigger){if(modal)closeModal();const c=courses[index];modal=document.createElement('div');modal.className='kmap-modal';modal._return=trigger;modal._overflow=document.body.style.overflow;document.body.style.overflow='hidden';modal.innerHTML=`<div class="kmap-scrim"></div><aside class="kmap-drawer" role="dialog" aria-modal="true" aria-labelledby="kmapCourseTitle" tabindex="-1"><header><span>${icon}课程详情</span><button class="kmap-dismiss" aria-label="关闭课程详情">×</button></header><div class="kmap-drawer-content"><p class="kmap-eyebrow">CANN / AscendC算子开发</p><h2 id="kmapCourseTitle"></h2><p class="kmap-course-description"></p><div class="kmap-course-facts">3 个模块 · 6 个课节 <span>含实践</span></div><h3>课程目录</h3><div class="kmap-directory"></div><h3>关联课程</h3><div class="kmap-related"></div></div><footer><a class="kmap-start">查看完整学习路径 →</a></footer></aside>`;
      modal.querySelector('.kmap-eyebrow').textContent=scenes[c.scene].label+' / 课程详情';
      modal.querySelector('.kmap-course-facts').textContent=`${c.modules.length} 个模块 · ${c.modules.reduce((sum,m)=>sum+m.length-1,0)} 个课节`;
      modal.querySelector('h2').textContent=c.title;modal.querySelector('.kmap-course-description').textContent=c.description;
      c.modules.forEach((m,i)=>{const d=document.createElement('details');d.open=i===0;d.innerHTML=`<summary><span>模块 ${i+1}</span><strong></strong><span class="kmap-summary-arrow">⌄</span></summary><ol></ol>`;d.querySelector('strong').textContent=m[0];m.slice(1).forEach((lesson,j)=>{const li=document.createElement('li');li.innerHTML=`${icon}<span></span><small>${j===1&&i>0?'实践':'课程'}</small>`;li.querySelector('span').textContent=lesson;d.querySelector('ol').append(li);});modal.querySelector('.kmap-directory').append(d);});
      courses.forEach((related,i)=>{if(i===index||related.scene!==c.scene)return;const b=document.createElement('button');b.innerHTML='<span>课程</span><u></u><span>↗</span>';b.querySelector('u').textContent=related.title;b.onclick=()=>openCourse(i,trigger);modal.querySelector('.kmap-related').append(b);});
      modal.querySelector('.kmap-start').href=c.href;
      modal.querySelector('.kmap-dismiss').onclick=closeModal;modal.querySelector('.kmap-scrim').onclick=closeModal;
      modal.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();closeModal();}if(e.key==='Tab'){const items=[...modal.querySelectorAll('button, summary, a[href]')].filter(n=>n.getClientRects().length);const first=items[0],last=items.at(-1);if(e.shiftKey&&(document.activeElement===first||document.activeElement===modal.querySelector('aside'))){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
      document.body.append(modal);root.inert=true;modal.querySelector('.kmap-dismiss').focus();
    }
    function zoom(value){scale=Math.max(.3,Math.min(1.4,value));canvas.style.transformOrigin='0 0';canvas.style.zoom=scale;canvas.style.width='1500px';canvas.style.height=`${scenes[activeScene].height}px`;root.querySelector('output').textContent=`${Math.round(scale*100)}%`;}
    root.querySelector('.kmap-tools').onclick=e=>{const a=e.target.closest('button')?.dataset.action;if(a==='plus')zoom(scale+.1);if(a==='minus')zoom(scale-.1);if(a==='all'){zoom(Math.min(viewport.clientWidth/1500,viewport.clientHeight/scenes[activeScene].height));viewport.scrollTo(0,0);}if(a==='focus'){zoom(Math.min(1,viewport.clientWidth/1500));viewport.scrollTo(0,0);}};
    const observer=new ResizeObserver(draw);observer.observe(canvas);requestAnimationFrame(()=>renderScene('cann'));
    root.destroy=()=>{closePicker?.();closeModal();observer.disconnect();};return root;
  };
})();
