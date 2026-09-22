# Ascend Developer 学习方案探索版

这是一个面向昇腾开发者的智能学习方案交互原型。它把“我想学什么”或“我正在解决什么开发问题”作为入口，经过目标确认、学习路径编排和课程预览，进入白板或视频工作台，最终连接知识学习、代码实践、AI 学伴和实战能力验证。

## 当前 Demo

- [打开当前 Demo 首页](https://charlottezhuang97-jpg.github.io/ascend-learn-explore/index.html)
- [本地首页](index.html)

> GitHub Pages 由 `main` 分支自动部署。Demo 中的课程、用户、学习进度和代码运行结果均为演示数据，用于验证信息结构与交互方向。

## 六个核心场景

这是当前方案的六个核心页面，分别对应从发现、规划到学习执行的完整链路。

| 场景 | 页面 | 解决的问题 |
| --- | --- | --- |
| 首页发现与目标输入 | [index.html](index.html) | 今天想学什么，或正在解决什么开发问题？ |
| 搜索与资源查找 | [find.html](find.html) | 已经有关键词时，如何找到课程、路径、文档和认证资源？ |
| 开发场景与知识路线 | [paths.html](paths.html) | 某类开发任务应该按什么知识顺序学习？ |
| 课程详情与学习方式选择 | [detail.html](detail.html) | 这门课是否适合我，应该选择白板还是视频？ |
| 沉浸式课程学习 | [learn.html](learn.html) | 如何完成当前课节、实践代码并获得 AI 辅助？ |
| 开发者认证 | [certification.html](certification.html) | 学习路径和认证准备之间如何衔接？ |

补充页面：[自主学习课程](courses.html)、[讲师指导培训](training.html)、[算子开发场景卡低保真](prototypes/operator-development-card-lowfi.html)。

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
- **场景模式**：`design-system/patterns/`，定义首页发现、AI 对话、课程预览、白板学习、视频工作台和成长反馈等复杂场景。
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

这是静态原型，可以直接打开 `index.html`，也可以在项目根目录启动任意静态文件服务器后访问：

```text
/index.html
/find.html
/paths.html
/detail.html
/learn.html
/certification.html
```

## Contributors

- [Cindy_wxd](https://github.com/charlottezhuang97-jpg)：产品设计、交互决策与项目维护
- **Codex**：设计系统整理、前端原型实现与文档协作
