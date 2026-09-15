# 学习方案探索版标题字体规范

参考已落地的[开发者学习中心页面](https://charlottezhuang97-jpg.github.io/developerlearningcenter/)核对其浏览器计算样式，记录于 2026-09-15。此规范用于探索版首页的大标题与各楼层标题；其余排版沿用 [`design-tokens.json`](design-system/tokens/design-tokens.json)。

| 位置 | 字体 | 字号 | 字重 | 行高 | 字间距 | 颜色 |
| --- | --- | ---: | ---: | ---: | --- | --- |
| 首页主标题（Hero `h1`） | HarmonyOS Sans SC Medium | 50px | 600 | 50px | normal | `#101828` |
| 楼层标题（`.section h2`） | HarmonyOS Sans SC Medium | 40px | 600 | 50px | normal | `#101828` |

CSS 中以 `font-weight: 600` 加载本地 `HarmonyOS_Sans_SC_Medium.woff2`。主标题避免使用 Bold（700）和负字间距。小屏继续使用现有的 40px Hero、30px 楼层标题响应式字号，保持 600 字重和正常字间距；其行高可按小屏排版调整。

## 生成课程问答界面

全屏问答界面使用近白底 `#FCFCFE`，对应参考截图的轻浅背景。选项卡默认白底、浅灰描边；选中、悬停和主操作使用主题蓝 `#2E53FA`（`design-tokens.json` 的 `color.link.default`，页面变量 `--blue`）。选中卡采用浅蓝底 `#F3F6FF`，保持标题与说明文字清晰。问答内容和学习建议目前是探索版示例，页面应明确标出未接入实时 AI 与资料检索。

## 课程选题大纲

四题完成后展示全屏课程结构预览。画布沿用近白底与浅灰点阵，结构按“课程目标 → 单元 → 章节”展开；节点默认白底和浅灰描边，选中态使用主题蓝 `#2E53FA` 描边及浅蓝底 `#F4F7FF`。编辑面板允许修改单元或章节名称、增加单元下的章节，以及为章节设置“基础理解 / 标准实践 / 深入掌握”三档学习深度。大纲、单元和章节均为当前页面的探索版示例，不应表达为已由 AI 实时生成。
