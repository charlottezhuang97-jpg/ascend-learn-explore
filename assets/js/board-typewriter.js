/* Selectable whiteboard text is written before its related diagrams appear. */
(() => {
  if (!location.pathname.endsWith('/learn.html')) return;
  const art = document.querySelector('.iv-board-art');
  const left = art?.querySelector('.iv-board-selectable:not(.iv-board-concept-three)');
  const right = art?.querySelector('.iv-board-concept-three');
  if (!art || !left || !right) return;
  const root = new URL('../../', document.currentScript.src);
  const asset = path => new URL(path, root).href;
  const diagram = asset('assets/images/board-typewriter/ai-core-architecture.png');
  const table = asset('assets/images/board-typewriter/three-unit-table.png');
  art.classList.add('iv-board-typed');
  art.querySelector(':scope > img')?.remove();
  const middle = document.createElement('div');
  middle.className = 'iv-board-selectable iv-board-middle';
  left.innerHTML = `<p class="iv-board-lead" data-type>Ascend C 入门要点：异构系统上的核函数写在 Device / AI Core 侧，Host 负责调度与数据搬运。</p>
    <h2 data-type>AI Core内部并行计算架构抽象</h2>
    <h3 data-type>异步指令流</h3>
    <p data-type>Scalar 计算单元读取指令序列，并把向量计算、矩阵计算、数据搬运指令发射给对应单元的指令队列。向量计算单元、矩阵计算单元和数据搬运单元异步并行执行接收到的指令。</p>
    <h3 data-type>同步信号流</h3><p data-type>指令间可能存在依赖关系。为保证不同指令队列中的指令按正确的逻辑关系执行，Scalar 计算单元也会向对应单元下发同步指令。</p>
    <h3 data-type>计算数据流</h3><p data-type>DMA 搬入单元把数据从 Global Memory 搬运到 Local Memory；Vector / Cube 计算单元完成数据计算，并把结果写回 Local Memory；DMA 搬出单元将处理好的数据搬运返回 Global Memory。</p>
    <figure class="iv-board-reveal" data-reveal><img src="${diagram}" alt="AI Core 内部并行架构：Scalar 发射指令，Vector、Cube 和 DMA 单元通过 Local Memory 与 Global Memory 协作"><figcaption>AI Core内部并行计算架构抽象示意图</figcaption></figure>`;
  middle.innerHTML = `<h3 data-type>本节课路线图</h3><p data-type>• AI Core 三流并行</p><p data-type>• 问题 1：谁在发指令？</p><p data-type>• 问题 2：算力单元怎么协同？</p><p data-type>• 问题 3：数据从哪来、到哪去？</p>
    <h3 data-type>核心概念 1</h3><p data-type>知识卡片：异步指令流</p><p data-type>定义：Scalar 读取指令序列，分发到各指令队列。</p><p data-type>要点：Vector / Cube / DMA 可异步并行执行。</p>
    <h3 data-type>核心概念 2</h3><p data-type>计算、发令和数据搬运由不同单元负责，配合完成算子任务。</p>
    <figure class="iv-board-reveal iv-board-table" data-reveal><img src="${table}" alt="单元职责表：Scalar 读取并发射指令；Vector 和 Cube 执行计算；DMA 在 Global Memory 与 Local Memory 间搬运数据"></figure>`;
  right.innerHTML = `<h3 data-type>核心概念 3</h3><strong data-type>三流怎么咬合</strong><p data-type>指令流：Scalar → 各单元队列</p><p data-type>同步流：依赖放行，单元握手</p><p data-type>数据流：DMA ↔ Local ↔ 计算单元</p><h3 data-type>实例：一次矢量计算</h3><p data-type>先搬入数据，再在 Vector 单元计算，完成后搬出结果；同步信号确保依赖顺序正确。</p>`;
  right.before(middle);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!reduced.matches) {
    [left, middle, right].forEach(lane => lane.querySelectorAll('[data-type]').forEach(el => {
      el.dataset.full = el.textContent;
      el.textContent = '';
    }));
  }
  const waits = ms => new Promise(resolve => setTimeout(resolve, ms));
  async function typeLane(lane) {
    for (const element of lane.querySelectorAll('[data-type]')) {
      const characters = Array.from(element.dataset.full);
      for (let i = 0; i < characters.length; i += 2) {
        element.textContent += characters.slice(i, i + 2).join('');
        if (i % 8 === 0) await waits(20);
      }
      await waits(90);
    }
  }
  let started = false;
  function start() {
    if (started || document.body.dataset.fixedView !== 'board') return;
    started = true;
    if (reduced.matches) {
      art.querySelectorAll('[data-reveal]').forEach(item => item.classList.add('is-visible'));
      return;
    }
    Promise.all([left, middle, right].map(typeLane)).then(() => {
      art.classList.add('is-complete');
      art.querySelectorAll('[data-reveal]').forEach(item => item.classList.add('is-visible'));
    });
  }
  new MutationObserver(start).observe(document.body, {attributes:true, attributeFilter:['data-fixed-view']});
  start();
})();
