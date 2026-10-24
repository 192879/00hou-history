# 00后渡劫模拟器

一款从公元前 1000 年跨越至公元 2000 年的中文人生模拟游戏。`main` 为稳定 PWA，`v2-android` 正在将同一套 HTML/CSS/JavaScript 游戏引擎扩展为可离线安装的 Capacitor Android APP。

## V2 Android 第一阶段

- Capacitor 8 Android 原生工程，应用 ID：`com.history00.life`。
- APK 内置完整网页资源；启动不依赖 GitHub Pages 或网络。
- 仅申请联网权限，用于未来检查经过版本兼容验证的静态数据包。
- Web 与 Android 共享 ES Modules 游戏核心。
- 新增确定性随机数、无公元 0 年日历、逐年结算基础引擎。
- IndexedDB 优先的统一存档接口：一个自动槽、三个手动槽、校验与整包备份。
- V1 `00hou-save-v1` 原始存档会先备份，再作为只读人生档案保存。
- Android 返回键、前后台切换和状态栏通过 Capacitor 原生插件接入。

V2 Alpha 2 已提供完整可玩主循环：从出生开始逐年推进，进入时代对应职业，处理经济、健康、关系与历史事件，直至死亡结算、成就和轮回。V1 逻辑仍保留用于回归测试及旧档归档。

### 当前可玩系统

- 31 届出生年代、4 个出生地区及无公元 0 年的连续日历。
- 60 个天赋、5 个稀有度和4种中央规则引擎天赋组合。
- 20 个具有时代门槛、收入、风险、技能与晋升规则的职业。
- 10 类技能、年度收入支出、现金、储蓄、资产与债务。
- 健康、体力、压力、衰老、疾病风险与非固定寿命。
- 伴侣、子女等 NPC 关系；婚育均为可选路线。
- 中国、欧洲、西亚和其他地区的按年份历史事件。
- 推进1年、快进5年、快进10年；重大事件自动暂停。
- 20 项成就、多结局、人生时间轴和轮回。
- 自动档、三个手动档、JSON完整备份、损坏检测与紧急恢复。

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

## 开发与测试

```powershell
pnpm install
pnpm test
pnpm test:e2e
pnpm build
```

测试覆盖 V1 完整流程，以及 V2 从出生到死亡、日历、随机数、职业年代、地区历史、天赋组合、逐年结算、快进、多槽存档、备份和旧档迁移。Windows 环境下 `test:e2e` 使用 Edge 真实点击并验证刷新恢复。详细结果及设备测试边界见 [`docs/TESTING.md`](docs/TESTING.md)。

## 构建 Android Debug APK

本地需安装 Node.js 22、JDK 21 与 Android SDK 36：

```powershell
pnpm install --frozen-lockfile
pnpm test
pnpm android:debug
```

APK 输出在 `android/app/build/outputs/apk/debug/app-debug.apk`。也可以在 GitHub 的 **Actions → Android Debug APK → Run workflow** 手动构建，完成后从该次运行的 Artifacts 下载 APK。

Debug APK 使用 Android 调试签名，仅用于测试。正式 Release 必须使用 GitHub Actions Secrets 中的独立签名密钥，密钥和密码不得提交仓库。

## 说明

历史文字为面向游戏的简要概括，不应视为学术研究资料。所有玩家角色、家庭关系和个人经历均为虚构。
