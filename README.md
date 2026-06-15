# 我的世界 · 玩法与攻略指南

一个介绍《我的世界》（Minecraft）玩法与攻略的静态网站项目。

## 功能

- 游戏介绍与四种模式说明
- 新手第一天生存步骤
- 生存攻略：挖矿、战斗、附魔、农业
- 关键物品合成配方
- 建造技巧与进阶内容（下界、末地、红石）
- 常见问题 FAQ
- 关键词搜索与标签快捷筛选
- 响应式设计，支持移动端

## 快速启动

直接用浏览器打开 `index.html`，或使用本地服务器：

```bash
# Python
cd minecraft-guide
python3 -m http.server 8080

# Node.js (需安装 npx)
npx serve .
```

然后访问 http://localhost:8080

## 项目结构

```
minecraft-guide/
├── index.html      # 主页面
├── css/
│   └── style.css   # 样式
├── js/
│   └── app.js      # 交互逻辑
└── README.md
```

## 技术栈

- 纯 HTML / CSS / JavaScript
- 无构建依赖，开箱即用
