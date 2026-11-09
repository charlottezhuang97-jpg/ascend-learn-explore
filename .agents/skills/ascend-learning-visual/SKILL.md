---
name: ascend-learning-visual
description: Apply the current Ascend Developer Learning Center demo visual language when creating or revising this repository's homepage, course detail, immersive learning, assistant, certification path, and related UI. Excludes unrelated PTO projects.
---

# 当前学习中心视觉风格

本 skill 只服务于 `ascend-learn-explore`。最新用户确认的参考图优先于本文件；本文件优先于仓库中标为历史方案的模式。PTO skill 的“先读基线、复用组件、检查状态、实机验收”是工作方法，PTO 的颜色和组件外观不是本产品的视觉来源。

## 开工时读取

1. `design-system/README.md` 与 `design-system/current-demo-visual.md`，确认当前页面属于发现、课程详情、沉浸学习或认证路径。
2. 对应的现行页面与 CSS：`index.html`、`course-preview.html`、`learn.html`、`certification-path.html`；沉浸式视角额外读 `assets/css/learning-fixed-1030.css`、`assets/css/ide-experiment-latest.css` 和 `assets/css/learning-timeline-1030.css`。
3. `design-system/states.md` 与相关组件文档，只读取本次需要的部分。

## 决策顺序

- 先确定页面结构与当前交互状态，再引用已有视觉规则；不要从旧页面抽一张截图重新造一套组件。
- 首页采用浅蓝点阵 Hero、独立搜索框、黑色主要操作和轻蓝紫点缀；课程和路径卡片沿用现行页面的层级。
- 沉浸学习采用白色固定框架：顶部课节区、单一主视角（视频／白板／实验）、右侧独立学习助手、底部模式栏和语义时间线。视频画面本身可以是深色，实验 IDE 使用当前浅色 HiDevLab 皮肤。
- 学习助手使用现行紫色图标、统一标题、七项功能入口与对话样式；课程详情、首页和沉浸学习保持同一身份。图标优先从已交付资源和现行 demo 中复用。
- 认证路径使用浅色点阵画布、蓝色主干、中央课程节点与侧边章节节点；课程、考试、证书各自呈现对应语义。
- 视觉尺寸、颜色和行为有冲突时，以当前页面中可见且已确认的实现为准，记录新决定并同步 `current-demo-visual.md`，不要用新样式叠加隐藏旧样式来解决。

## 修改与验收

1. 对照当前页面找出可复用的布局、组件、资源和状态；明确哪些旧层需要移除。
2. 先把新状态加入现行结构，再处理 CSS。首次绘制与脚本完成后必须显示同一套视觉，避免旧界面闪现。
3. 在桌面与窄屏检查默认、悬停、聚焦、展开、切换及返回；核对视频、白板、实验视角和助手内容没有相互覆盖。
4. 如新增可复用模式，先更新设计文件和必要的资源，再在页面中复用。不要把仅用于局部调整的值提升为全局 Token。

详细外观与来源见 [`design-system/current-demo-visual.md`](../../../design-system/current-demo-visual.md)。
