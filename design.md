# 学习方案探索版标题字体规范

参考已落地的[开发者学习中心页面](https://charlottezhuang97-jpg.github.io/developerlearningcenter/)核对其浏览器计算样式，记录于 2026-09-15。此规范用于探索版首页的大标题与各楼层标题；其余排版沿用 [`design-tokens.json`](design-system/tokens/design-tokens.json)。

| 位置 | 字体 | 字号 | 字重 | 行高 | 字间距 | 颜色 |
| --- | --- | ---: | ---: | ---: | --- | --- |
| 首页主标题（Hero `h1`） | HarmonyOS Sans SC Medium | 50px | 600 | 50px | normal | `#101828` |
| 楼层标题（`.section h2`） | HarmonyOS Sans SC Medium | 40px | 600 | 50px | normal | `#101828` |

CSS 中以 `font-weight: 600` 加载本地 `HarmonyOS_Sans_SC_Medium.woff2`。主标题避免使用 Bold（700）和负字间距。小屏继续使用现有的 40px Hero、30px 楼层标题响应式字号，保持 600 字重和正常字间距；其行高可按小屏排版调整。
