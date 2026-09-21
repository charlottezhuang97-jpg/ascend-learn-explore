# 学习方案探索版设计系统入口

设计系统已经拆成五层，完整入口见 [`design-system/README.md`](design-system/README.md)。本文件保留为历史入口，记录首页标题的已确认基线，并把后续规则指向新的分层文档。

## 首页标题基线

| 位置 | 字体 | 字号 | 字重 | 行高 | 颜色 |
| --- | --- | ---: | ---: | ---: | --- |
| 首页主标题（Hero `h1`） | HarmonyOS Sans SC Medium | 50px | 600 | 50px | `foundation.color.heading` |
| 楼层标题 | HarmonyOS Sans SC Medium | 40px | 600 | 50px | `foundation.color.heading` |

小屏继续使用现有的响应式字号，保持 HarmonyOS Sans SC Medium 和正常字间距。字体、颜色和间距的新引用以 [`design-system/tokens/foundation.json`](design-system/tokens/foundation.json) 和 [`semantic.json`](design-system/tokens/semantic.json) 为准。

## 规则去向

- 基础值、语义色和组件值：[`design-system/tokens/`](design-system/tokens/README.md)
- 可复用组件：[`design-system/components/`](design-system/components/README.md)
- 页面级场景模式：[`design-system/patterns/`](design-system/patterns/README.md)
- loading、完成、错误和恢复：[`design-system/states.md`](design-system/states.md)
- 开发验收：[`design-system/acceptance.md`](design-system/acceptance.md)

旧页面中的问答、大纲和课程预览实现仍然保留；新增或重构时按 `ai-dialogue` 和 `course-preview` 模式实现，不再在本文件新增页面级规则。
