# Ascend Developer 学习方案探索版

这是一个面向昇腾开发者的智能学习方案交互原型。它把“我想学什么”或“我正在解决什么开发问题”作为入口，经过目标确认、学习路径编排和课程预览，进入白板或视频工作台，最终连接知识学习、代码实践、AI 学伴和实战能力验证。

## 当前探索方案

当前持续维护的页面只保留发现、预览、学习执行和个人学习分析链路。页面状态的唯一清单是 [`page-registry.json`](page-registry.json)。

在线入口：[当前方案首页](https://charlottezhuang97-jpg.github.io/ascend-learn-explore/index.html) · [页面版本目录](https://charlottezhuang97-jpg.github.io/ascend-learn-explore/catalog.html) · [本地首页](index.html)

> GitHub Pages 由 `main` 分支自动部署。课程、用户、学习进度和代码运行结果均为演示数据，用于验证信息结构与交互方向。

| 场景 | 页面 | 解决的问题 |
| --- | --- | --- |
| 首页发现与目标输入 | [index.html](index.html) | 今天想学什么，或正在解决什么开发问题？ |
| 课程预览与学习路线 | [course-preview.html](course-preview.html) | 课程为什么这样组织、每个阶段包含哪些单元、如何验证学习结果？ |
| 沉浸式课程学习 | [learn.html](learn.html) | 如何完成当前课节、实践代码并获得 AI 辅助？ |
| AI 学伴 | [ai-companion.html](ai-companion.html) | 如何查看个人能力、学习建议和计划？ |
| 知识地图 | [knowledge-map.html](knowledge-map.html) | 如何理解全局知识结构与自己的学习位置？ |

## 页面版本管理

仓库按用途管理页面，避免把讨论稿误认为当前方案：

| 目录 | 用途 | 发布方式 |
| --- | --- | --- |
| 根目录中的当前页面 | 当前探索方案 | 保留稳定公开链接 |
| [`prototypes/lowfi/`](prototypes/lowfi/) | 低保真结构与交互讨论 | 发布到 `/prototypes/lowfi/`，页面带“低保真原型”标识 |
| [`outputs/ux-audit/`](outputs/ux-audit/) | 高保真探索、UX 审查与对照稿 | 发布到 `/lab/ux-audit/` |
| [`archive/legacy-v1/`](archive/legacy-v1/) | 已停止维护的旧版页面 | 发布到 `/archive/legacy-v1/`，页面带“历史版本”标识 |

旧的根路径仍会跳转到归档后的页面，已经分享的链接不会直接失效。新增页面必须先登记到 [`page-registry.json`](page-registry.json)，再决定是否进入 Pages 发布白名单。

## 主要产品链路

```text
首页表达目标
  → AI 目标确认
  → 构思学习路径
  → 编辑课程大纲
  → 课程预览
  → 选择白板或视频
  → 学习、实践与 AI 学伴辅助
  → Benchmark 实战能力验证
```

Benchmark 用于验证用户完成学习后的真实开发能力：以 Task 表示一个可验收的开发任务，以 Benchmark 表示一组能力任务，再通过统一评测记录正确性、性能、稳定性和问题诊断结果。通过记录可进入个人能力证明，并作为“实战突破榜”的可信成果，不替代课程或单纯按学习时长排名。

## 设计系统结构

设计系统按五层维护，页面实现必须从上到下复用：

```text
Token → 组件 → 场景模式 → 状态 → 验收
```

- **Token**：`design-system/tokens/`，包含基础 Token、语义 Token、组件 Token 和旧页面兼容导出。字体统一为 HarmonyOS Sans；主要按钮优先使用黑色，品牌红只作为受限品牌强调色。
- **组件**：`design-system/components/`，定义按钮、输入框、标签、卡片、步骤、代码片段和面板的结构与尺寸。
- **场景模式**：`design-system/patterns/`，定义首页发现、AI 对话、AI 分身、课程预览、白板学习、视频工作台和成长反馈等复杂场景。
- **状态**：[`design-system/states.md`](design-system/states.md)，定义加载、进行中、成功、失败、完成、选中、收起和恢复。
- **验收**：[`design-system/acceptance.md`](design-system/acceptance.md)，定义视觉、交互、层级、可访问性和响应式检查。

## 如何遵循设计系统

新增或修改页面时：

1. 先确认页面属于哪个场景模式，并读取对应的 pattern 文件。
2. 优先引用现有 Token、组件和状态，不在页面 CSS 中重新发明颜色、字号、圆角、阴影、按钮或卡片。
3. 主要按钮使用黑色；品牌红只用于品牌标识、少量品牌强调或官方状态。
4. 复杂场景先复用已有结构，再通过页面数据组合，不复制另一套视觉语言。
5. 如果现有系统无法表达需求，先做预览并记录新增原因，确认后再把新模式吸收到设计系统。

## 如何反向检查后续文件

设计系统既是实现依据，也是后续文件的检查清单。每次新增 HTML、CSS、组件或页面规格时，按以下顺序反查：

1. **Token 检查**：字体是否使用 HarmonyOS Sans；颜色、间距、圆角、阴影和层级是否引用 Token；主要按钮是否为黑色；是否错误扩大使用品牌红。
2. **组件检查**：是否复用了已有按钮、输入框、卡片、标签、步骤、面板和代码片段规格；是否出现页面私有的同类组件。
3. **场景检查**：页面是否符合对应 pattern 的布局、信息层级和交互顺序；AI 对话、白板学习和视频工作台是否保持各自的信息密度。
4. **状态检查**：加载、进行中、完成、失败、空状态、选中、收起和恢复是否有明确表现；状态切换是否影响层级和可操作性。
5. **验收检查**：检查 20px 步骤间距、AI 对话内部间距、全屏容器层级、响应式布局、键盘交互、可访问性和页面跳转。

发现冲突时，优先记录在设计系统或 pattern 文件中，再修改页面；不要在业务文件中静默覆盖规范。

## 设计与产品文档

- [学习方案设计系统](design-system/README.md)
- [前端还原规范](docs/前端还原规范.md)
- [产品结构 PRD](docs/产品结构PRD.md)
- [设计 Token](design-system/tokens/design-tokens.json)
- [产品结构工作簿](outputs/product-structure-prd/开发者学习平台产品结构.xlsx)

## 本地查看

这是静态原型，可以直接打开 `index.html`。页面目录通过读取 JSON 生成，建议在项目根目录启动静态文件服务器后访问：

```text
/index.html
/course-preview.html
/learn.html
/ai-companion.html
/knowledge-map.html
/catalog.html
```

GitHub Pages 只发布 [`scripts/build-pages.sh`](scripts/build-pages.sh) 明确列出的页面和资源，不再把工作表、临时文件、构建脚本与全部输出目录直接暴露到站点。

## Contributors

- [charlottezhuang97](https://github.com/charlottezhuang97)：仓库维护、产品设计与交互决策
- **Codex**：设计系统整理、前端原型实现与文档协作
