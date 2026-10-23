# 1030 固定双栏学习详情预览

- 分支：`1030`，基于本地已提交的 `a7359b8`，不包含其他未提交改动。
- 页面：`learn-1030.html?course=mindie&mode=video`。
- 线上预览：`https://charlottezhuang97-jpg.github.io/ascend-learn-explore/previews/1030/learn-1030.html?course=mindie`。
- 正式版：原站点地址不变，仍从 `main` 构建。

## 页面合同

左侧是同一学习区域，底部切换视频、白板、IDE；右侧是始终显示的学伴，不覆盖左侧内容。切换复用原有组件，不重新加载，保留代码、板书位置与对话。移动端改为上方学习、下方学伴，避免挤压成不可用的双栏。

复用本项目 `video-workbench`、`whiteboard-learning` 与统一学伴。用户最新要求覆盖旧模式中“视频与 IDE 同时固定”和“学伴可浮动关闭”的规定：本预览为两栏、左侧三态切换、右侧始终固定；不更改正式模式。PTO 外部技能缺少必需的 DESIGN.md，因此未引入另一套视觉系统。

预览对话使用 `ascend-1030-*` 独立存储，不读取或覆盖正式版对话。评论仅保存在本机。视频仍为原有封面示意，IDE 执行、终端、断点和 AI 分析仍为交互演示，并非真实服务。

## 发布隔离

沿用唯一 `.github/workflows/deploy.yml`，main 与 1030 保持同一份发布逻辑：

1. 始终 checkout `main` 并构建站点根目录，正式页不取分支代码。
2. 单独 checkout `1030` 并构建其白名单产物。
3. 仅把分支产物叠加到 `.pages-dist/previews/1030/`。
4. 一次性发布完整站点，避免多个 workflow 相互覆盖。

新增或调整预览路径时需同时同步 main 与 1030 的这份 workflow。不要把 1030 的整套产物直接部署到站点根目录。`previews/1030/REVISION` 可核对线上预览的 Git 提交。
