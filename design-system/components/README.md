# 组件层

组件层只描述可复用的交互单元。页面负责组合组件，不能在页面 CSS 中重新定义同名视觉语言。

## 组件目录

| 组件 | 作用 | 主要 Token | 适用场景 |
| --- | --- | --- | --- |
| `PrimaryButton` / `SecondaryButton` / `IconButton` | 提交、进入、工具操作 | `components.button` | 全站 |
| `SearchInput` | 表达学习目标或开发问题 | `components.input` | 首页、AI 对话 |
| `Chip` / `StatusBadge` | 分类、来源、状态和内容类型 | `components.chip`、`semantic.state` | 课程、资源、视频代码 |
| `CourseCard` | 展示课程和学习成本 | `components.courseCard` | 首页、课程列表、课程预览 |
| `AIStep` | 表示生成流程中的一个大步骤 | `components.aiStep` | AI 对话 |
| `QuestionOption` | 表示学习路径问答选项 | `components.aiStep` | 构思学习路径 |
| `UnitBadge` / `LessonRow` | 课程单元和课节层级 | `components.courseLesson` | 课程预览、课程详情 |
| `CodeSnippet` | 展示代码、时间点和操作 | `components.videoWorkbench` | 视频学习 |
| `ToolBar` / `ModeToggle` | 白板、视频和画布工具切换 | `components.button` | 沉浸式学习 |
| `FloatingActionBar` | 开始学习、加入学习计划 | `components.courseLesson` | 课程预览 |

## 组件状态

所有可交互组件至少定义 `default`、`hover`、`focus`、`disabled`；选择、提交和异步任务再增加 `selected`、`loading`、`success`、`error`。状态含义统一引用 [`../states.md`](../states.md)。

## 组件使用规则

- 按钮按行为分为主要提交、次要进入和图标工具三类，不按页面临时命名新的按钮样式。
- 标签必须说明分类、来源、状态或内容类型，不能把标签当作装饰。
- 卡片用于内容单元；大画布、视频工作台和 IDE 工作区属于场景模式，不重复套卡片外壳。
- 图标按钮必须有可访问名称；图标不能单独承担颜色之外的唯一状态含义。
- 组件内文字沿用 Token，业务内容不修改字号、字重和间距。
