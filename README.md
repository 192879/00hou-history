# 00后渡劫模拟器

一款从公元前 1000 年跨越至公元 2000 年的中文人生抉择 PWA。31 届历史档案提供真实时代背景，玩家人物与人生故事均为虚构。

## 游玩

直接访问 GitHub Pages 地址，或用静态服务器打开仓库根目录。游戏不依赖后端或第三方库。

```powershell
python -m http.server 8080
```

然后访问 `http://localhost:8080`。支持添加到安卓桌面、离线缓存、自动存档，以及 JSON 存档导入导出。

## GitHub Pages 发布

1. 打开仓库的 **Settings → Pages**。
2. 在 **Build and deployment** 中将 Source 设为 **Deploy from a branch**。
3. Branch 选择 `main`，目录选择 `/ (root)`，点击 **Save**。
4. 等待 Pages 部署完成，访问 `https://192879.github.io/00hou-history/`。

## 测试

```powershell
node tests.mjs
```

测试覆盖 31 届档案、24 种天赋、随机开局、完整六阶段流程、结局生成、即时存档及导入数据校验。

## 说明

历史文字为面向游戏的简要概括，不应视为学术研究资料。所有玩家角色、家庭关系和个人经历均为虚构。
