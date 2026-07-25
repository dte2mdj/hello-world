---
name: wuwei-shanfang
description: >-
  维护「无为山房」GitHub Pages 多文件静态站：道教意象、网络梗、减压互动。
  Use when the user opens TestAI/hello-world, mentions 无为山房, 别硬撑先放下,
  GitHub Pages, 投烦恼/摇签/木鱼/摸鱼/图鉴, or wants to edit/deploy this site.
---

# 无为山房维护指南

## 这是什么

个人减压互动站：**无为山房**。气质半正经半抽象——道德经 × 打工人梗。

核心标语：

- **别硬撑、先放下。**
- 人间有诈，此处无事。
- 命数在自己手里（差签自动逆天改命）。

## 主线关联

```
识破（图鉴）→ 放下（投烦恼）→ 改命（摇签）→ 固本（功课）
```

跨模块用 `WuweiBridge`（`js/bridge.js`）：

- `wuwei:goto` — 滚到板块 / 预填 / 开游戏 / 展开骗局
- `wuwei:dao` — 累计道行 + toast

| 从 | 到 |
|----|----|
| 图鉴「丢进清心池」 | 投烦恼预填 |
| 投完烦恼 | 一悟 / 摇签 / 木鱼 |
| 改命成功 | 木鱼 / 调息 / 图鉴 |
| 一悟「相关骗局」 | 图鉴按 `scamId` 展开 |

## 资源位置

| 用途 | 路径 |
|------|------|
| 本地工程 | `/Users/xwg/TestAI/` |
| 页面 | `index.html` |
| 样式 | `css/main.css` |
| 文案数据 | `js/data.js` |
| 存储/道行 | `js/store.js` |
| 总线 | `js/bridge.js` |
| 模块 | `js/{scams,drop,lot,oracle,games,main,audio}.js` |
| Skill | `.cursor/skills/wuwei-shanfang/SKILL.md` |
| 规则 | `.cursor/rules/wuwei-shanfang.mdc` |
| 远程 | `https://github.com/dte2mdj/hello-world.git` |
| 线上 | `https://dte2mdj.github.io/hello-world/` |

纯静态、无构建。本地预览需 HTTP（相对路径）：`python3 -m http.server`。

## 改站流程

1. 改对应文件（文案多在 `js/data.js`，样式在 `css/main.css`）
2. 本地 `python3 -m http.server` 自测联动
3. 用户要上线时再 commit + push

```bash
export PATH="/opt/homebrew/bin:$PATH"
cd /Users/xwg/TestAI
git add -A
git commit -m "$(cat <<'EOF'
说明为何而改。

EOF
)"
git push origin main
```

## 设计约束

- 水墨松绿 / 朱砂 / 金；避免赛博紫、奶油陶土、报纸风
- 首屏：品牌 + 标语 + CTA + 山雾
- 字体：Ma Shan Zheng / ZCOOL XiaoWei / Noto Serif SC
- 无后端、无账号；本机 key：`wuwei-shanfang-v1`

## 开场应答

> 这是无为山房（别硬撑、先放下）——多文件 GitHub Pages 站，主线识破→放下→改命→固本。线上 https://dte2mdj.github.io/hello-world/ 。要改内容或发布，直接说即可。
