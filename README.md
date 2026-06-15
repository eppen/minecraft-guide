# 我的世界 · 玩法与攻略指南

一个介绍《我的世界》（Minecraft）玩法与攻略的静态网站项目。

**在线访问：** https://mcguidehub.eppencn.com/

> 根域名 `eppencn.com` 用于个人博客；本攻略站使用子域名 `mcguidehub.eppencn.com`。

## 功能

- 游戏介绍与四种模式说明
- 新手第一天生存步骤
- 生存攻略：挖矿、战斗、附魔、农业
- 关键物品合成配方
- 建造技巧与进阶内容（下界、末地、红石）
- Steve AI 模组使用与实践
- 常见问题 FAQ
- 关键词搜索与标签快捷筛选
- 响应式设计，支持移动端

## 快速启动

直接用浏览器打开 `index.html`，或使用本地服务器：

```bash
cd minecraft-guide
python3 -m http.server 8765
```

然后访问 http://localhost:8765

## 部署（GitHub Pages）

推送到 `main` 分支后，GitHub Actions 会自动部署。

首次需在仓库 **Settings → Pages** 中，将 Source 设为 **GitHub Actions**。

自定义域名：`mcguidehub.eppencn.com`（Cloudflare DNS：CNAME `mcguidehub` → `eppen.github.io`，代理关闭）

## Google AdSense 配置

1. 申请 [Google AdSense](https://www.google.com/adsense) 并添加站点 `eppencn.com`（根域名博客）；攻略站子域名为 `mcguidehub.eppencn.com`
2. 获取发布商 ID（`ca-pub-xxxxxxxx`）
3. 在 AdSense 后台创建 3 个展示广告单元（顶部 / 中部 / 底部）
4. 编辑 `js/ads-config.js`：
   - 填入 `client` 发布商 ID
   - 填入 `slots.top` / `slots.mid` / `slots.bottom` 广告单元 ID
5. 同步更新根目录 `ads.txt` 中的 `pub-xxxxxxxx`
6. 提交并推送，等待 AdSense 审核通过

## 项目结构

```
minecraft-guide/
├── index.html
├── privacy.html
├── ads.txt
├── css/style.css
├── js/
│   ├── app.js
│   ├── ads-config.js
│   └── ads.js
└── .github/workflows/pages.yml
```

## 技术栈

- 纯 HTML / CSS / JavaScript
- GitHub Pages + GitHub Actions 自动部署
