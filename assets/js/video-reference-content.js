/* Sidebar content from 视频学习2. Artwork is clipped from its unchanged exports. */
(() => {
  const icon=name=>`<span class="iv-source iv-${name}" aria-hidden="true"></span>`;
  const intro='本文介绍了昇腾Ascend C算子开发的基础知识，包括CANN架构、AI处理器、算子定义及基本概念。';
  window.AscendVideoReferenceContent={
    notes:asset=>`<h3 class="iv-feature-title">算子相关笔记</h3>
      <div class="iv-note-sections"><details class="iv-note-section" open><summary>${icon('note-edit')}<span>算子定义</span>${icon('note-chevron')}</summary>
        <div class="iv-note-content"><p>核心定义：算子是对数据进行处理的操作，可以有数学含义，也可以没有。在应用网络中，算子对应网络的层或节点的计算逻辑。</p>
        <button type="button" class="iv-note-image iv-note-video" data-iv-note-video aria-label="查看算子定义的视频片段"><img src="${asset('assets/images/video-learning-reference/notes.webp')}" alt="算子的数学含义：Tanh、ReLU、Sigmoid 函数图像"></button></div></details>
      <details class="iv-note-section" open><summary>${icon('note-edit')}<span>Ascend C入门要点</span>${icon('note-chevron')}</summary>
        <div class="iv-note-content"><p>要点：异购系统上的核函数（Kernel ）写在 Device / AI Core 侧，Host 负责调度与数据搬运。</p>
        <div class="iv-note-image iv-note-diagram" role="img" aria-label="AI Core 硬件架构示意图"><img src="${asset('assets/images/video-learning-reference/notes.webp')}" alt="Scalar、Vector、Cube、DMA 及 Local Memory、Global Memory"></div></div></details></div>`,
    cards:()=>`<h3 class="iv-feature-title">已为你生成【一、CANN、达芬奇架构与算子】知识点。</h3><p class="iv-feature-intro">${intro}</p>
      <h4 class="iv-knowledge-heading">学习要点</h4><article class="iv-knowledge-card"><h5>${icon('card-book')}<span>Ascend C 算子开发的层级定位</span></h5>
        <div class="iv-knowledge-copy"><span class="iv-knowledge-tag">关键要点</span><p>Ascend C 算子开发位于硬件使能栈的倒数第二层，是CANN中的算子编程语言与开发方式。CANN是昇腾软件栈的基础平台，Ascend C是其中编写算子的专用语言，不等同于整个CANN。</p>
        <span class="iv-knowledge-tag prerequisite">学习前提</span><p>初学者建议先具备C/C++基础，并了解算子的基本概念。</p></div></article>
      <h4 class="iv-knowledge-heading iv-extension-heading">知识拓展</h4><article class="iv-knowledge-card iv-knowledge-extension"><h5>${icon('card-book')}<span>算子的数据载体 - Tensor四要素</span></h5>
        <div class="iv-knowledge-copy"><span class="iv-knowledge-tag extension">拓展理解</span><p>在算子开发中，Tensor的四个属性会直接影响数据读取、计算方式与性能表现。形状决定参与计算的元素范围；数据类型影响精度与内存占用；数据排布格式会影响内存访问效率，常见格式包括ND、NCHW、NHWC等。理解Tensor属性，是阅读算子接口和理解算子输入输出关系的基础。</p>
        <span class="iv-knowledge-tag prerequisite">注意点</span><p>算子输入和输出通常都是Tensor，不是普通单个数值。</p></div></article>`,
    summary:()=>`<h3 class="iv-feature-title">已为你生成【一、CANN、达芬奇架构与算子】AI智能摘要。</h3><p class="iv-feature-intro">${intro}</p>
      <div class="iv-summary-sections"><details class="iv-summary-section" open><summary>一、基础支持${icon('summary-chevron')}</summary>
        <div><p>CANN架构：CANN是昇腾AI的基础软件平台，Ascend C算子开发位于CANN的倒数第二层，负责对接AI框架和硬件。</p><p>AI处理器：AI处理器的核心是AI core，具有耦合和分离两种架构，分别包含cube、vector和scaler等计算单元。</p></div></details>
      <details class="iv-summary-section iv-summary-current" open><summary>二、算子定义及基本概念${icon('summary-chevron')}</summary>
        <div><p>算子：算子是对数据进行处理的操作，可以有数学含义，也可以没有。在应用网络中，算子对应网络的层或节点的计算逻辑。</p><p>算子属性：包括算子名称、类型、数据容器（张量tensor）及其四个属性：名称、形状、数据类型和排布格式。</p></div></details>
      <div class="iv-summary-actions">${[['regenerate','重新生成'],['copy','复制摘要'],['like','有帮助'],['dislike','无帮助'],['report','反馈问题']].map(([key,label])=>`<button type="button" data-iv-summary-action="${key}" aria-label="${label}">${icon('summary-'+key)}</button>`).join('')}</div></div>`
  };
})();
