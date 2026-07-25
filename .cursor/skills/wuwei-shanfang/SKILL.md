---
name: wuwei-shanfang
description: >-
  维护「无为山房」GitHub Pages 单页站点：道教意象、网络梗、减压互动小游戏。
  Use when the user opens TestAI/hello-world, mentions 无为山房, 别硬撑先放下,
  GitHub Pages, 投烦恼/摇签/木鱼/摸鱼, or wants to edit/deploy this site.
---

# 无为山房维护指南

## 这是什么

个人减压互动站：**无为山房**。气质是半正经半抽象——道德经 × 打工人梗，帮人松一口气，不是严肃宗教站点。

核心标语（勿改坏语气）：

- **别硬撑、先放下。**
- 人间有诈，此处无事。

## 资源位置

| 用途 | 路径 |
|------|------|
| 本地工程 | `/Users/xwg/TestAI/` |
| 唯一页面 | `/Users/xwg/TestAI/index.html` |
| 本 skill | `.cursor/skills/wuwei-shanfang/SKILL.md` |
| 项目规则 | `.cursor/rules/wuwei-shanfang.mdc` |
| Git 远程 | `https://github.com/dte2mdj/hello-world.git` |
| 线上地址 | `https://dte2mdj.github.io/hello-world/` |

当前是**单文件**架构：HTML + 内联 CSS/JS，无构建步骤。不要无故拆成框架工程，除非用户明确要求。

## 现有板块

1. **投烦恼** — 输入/快捷标签 → 清心池回应；本机 `localStorage` 记录
2. **摇签** — 上上/上吉/中平/下下签文，可复制
3. **今日一悟** — 道德经 × 互联网梗
4. **人间骗局图鉴** — 可展开的生活骗局吐槽
5. **山房功课** — 坐忘 / 摸鱼 / 木鱼 / 调息

存储 key：`wuwei-shanfang-v1`（drops、muyu、fishBest、history）

## 改站流程

1. 编辑 `index.html`
2. 本地用浏览器打开文件，或起静态服务自测
3. 用户要上线时再 commit + push（未明确说「提交/推送」则先改本地）
4. 推送命令：

```bash
export PATH="/opt/homebrew/bin:$PATH"
cd /Users/xwg/TestAI
git add index.html
git commit -m "$(cat <<'EOF'
简短说明这次为何而改。

EOF
)"
git push origin main
```

5. Pages 约 1–2 分钟更新；可用 `curl` 检查页面是否含新文案

认证：`gh` 已登录账号 `dte2mdj`；若 push 失败先 `gh auth setup-git`。

## 设计约束

- 水墨松绿 / 朱砂 / 金色点缀；避免赛博紫、奶油陶土风、报纸排版风
- 首屏只保留：品牌「无为山房」+ 一句标语 + 一小组 CTA + 山雾氛围
- 每段一个目的、一个标题；少卡片、少徽章堆砌
- 字体：`Ma Shan Zheng` + `ZCOOL XiaoWei` + `Noto Serif SC`
- 文案：可毒可暖，最终落点是松一口气，不是制造更焦虑
- 新增互动优先本机可玩、无后端、无账号

## 常见请求怎么做

| 用户说 | 做法 |
|--------|------|
| 加文案/梗 | 改对应数组：`replies` / `oracles` / `lots` / `scams` / `muyuLines` |
| 加小游戏 | 在 `#games` 加 tab + panel，保持单文件 |
| 改视觉 | 只动 `:root` 变量与 hero/section 样式 |
| 换仓库名/域名 | 更新本 skill、规则、远程与 Pages 设置，并告知新 URL |
| 只要本地预览 | 改文件即可，不 push |

## 开场应答（新会话）

若用户只是打开项目或问「这是啥」，用一两句说明：

> 这是无为山房（别硬撑、先放下）——单页 GitHub Pages 站，本地在 `index.html`，线上 https://dte2mdj.github.io/hello-world/ 。要改内容、加互动或发布，直接说即可。
