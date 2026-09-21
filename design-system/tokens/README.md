# Token 层

Token 分为三层，页面和组件不得跳过语义层直接使用基础值：

1. `foundation.json`：基础字体、颜色、间距、圆角、阴影和层级；
2. `semantic.json`：按发现、AI 对话、课程和沉浸学习场景定义的文本、表面、边框、操作和状态语义；
3. `components.json`：组件所需的尺寸、内边距、排版和状态映射。

当前页面还在使用 `design-tokens.json` 这一份 Figma 导出文件。它暂时保留用于兼容旧页面；新页面和重构页面应迁移到本目录的三层 Token。
