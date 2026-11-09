(() => {
  const question = document.querySelector('.dlc-rotating-question');
  const learning = question?.querySelector('[data-topic-learning]');
  const problem = question?.querySelector('[data-topic-problem]');
  if (!learning || !problem) return;
  const examples = [
    ['算子开发', '算子调优问题'],
    ['模型开发', '分布式训练问题'],
    ['推理开发', '模型部署问题'],
    ['Ascend C 编程', '算子精度问题'],
    ['大模型训练', '训练性能问题'],
    ['MindIE 推理', '推理服务问题']
  ];
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let index = 0, typing = false;
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  async function typePair(pair) {
    typing = true;
    learning.textContent = '';
    problem.textContent = '';
    learning.classList.add('is-typing');
    for (const char of pair[0]) { learning.textContent += char; await wait(65); }
    learning.classList.remove('is-typing');
    problem.classList.add('is-typing');
    for (const char of pair[1]) { problem.textContent += char; await wait(65); }
    problem.classList.remove('is-typing');
    question.setAttribute('aria-label', `你想学习${pair[0]}，或正在解决${pair[1]}？`);
    typing = false;
  }
  setInterval(() => {
    if (typing || document.hidden) return;
    index = (index + 1) % examples.length;
    typePair(examples[index]);
  }, 5000);
})();
