# 学术生存指南 (Academic Survival Guide)

> 微信小程序 · 像素风博士生存模拟游戏 · v1.1

## 项目概述

玩家扮演博士生，管理精力/论文进度/导师满意度/存款四项核心资源，通过每月决策和随机事件，在 72 个月（6 年）内完成论文、通过答辩、顺利毕业。

**技术栈**：微信小程序原生开发（WXML + WXSS + JS），无 Canvas，纯 CSS 像素风。

---

## 项目结构

```
first_cc/
├── app.js / app.json / app.wxss     # 入口、路由、全局像素风样式
├── config/                           # 游戏数值配置（JS 模块，非 JSON！）
│   ├── constants.js                  # 全局常量、初始值、阶段定义、每月消耗
│   ├── decisions.js                  # 5 种每月行动（实验/论文/开会/摸鱼/副业）
│   ├── events.js                     # 10 个随机事件
│   ├── milestones.js                 # 4 个阶段里程碑（资格考试/开题/预答辩/盲审）
│   ├── endings.js                    # 6 种结局
│   ├── disciplines.js                # 8 个学科
│   ├── talents.js                    # 5 个技能特长
│   └── achievements.js               # 18 个成就
├── core/                             # 纯 JS 游戏引擎
│   ├── GameEngine.js                 # 主引擎：回合推进、胜负判定、成就/里程碑
│   ├── ResourceManager.js            # 资源增减与边界保护
│   ├── DecisionResolver.js           # 决策解析（含随机修正 + 特长修正）
│   ├── EventManager.js               # 随机事件筛选/触发/冷却
│   └── SaveManager.js                # 3 槽位手动存档 + 自动存档
├── components/                       # 可复用 UI 组件
│   ├── status-bar/                   # 顶部：年月/阶段/特长 + 2×2 资源 + 次要属性
│   ├── resource-bar/                 # 单条资源进度条（含变化量）
│   ├── decision-card/                # 决策卡片（紧凑网格样式 + 效果预览）
│   ├── event-modal/                  # 事件弹窗（里程碑/随机事件共用）
│   ├── game-log/                     # 游戏日志滚动区
│   └── pixel-button/                 # 像素按钮
├── pages/
│   ├── index/                        # 首页：新游戏（学科→特长）→ 继续/存档管理
│   ├── game/                         # 游戏主页：单屏无滚动布局
│   ├── ending/                       # 结局展示：统计 + 成就列表
│   └── save/                         # 存档管理：3 槽位读/存/删
└── utils/
    ├── random.js                     # 随机工具（范围解析、加权随机）
    └── vibrate.js                    # 震动反馈封装
```

---

## 核心架构

### 数据流
```
玩家点击决策 → GameEngine.executeDecision()
  → DecisionResolver.execute()        # 计算基础效果 + 随机修正 + 特长修正
  → ResourceManager.applyEffects()    # 应用到资源并边界保护
  → EventManager.checkAndTrigger()    # 概率触发随机事件
  → _checkPhaseTransition()           # 检查阶段过渡 + 触发里程碑事件
  → _checkGameOver()                  # 检查胜负条件
  → _checkAchievements()              # 检查成就解锁
  → _notifyChange()                   # 回调页面更新 UI
```

### 时间系统
- 主时间单位：**月**（month），每月执行多次行动后点击"下个月"推进
- 年份 = `Math.ceil(month / 12)`
- 最长游戏时间：72 个月（6 年）
- 每 3 个月自动存档

### 阶段过渡（按月）
| 阶段 | 触发条件 |
|------|----------|
| 入学适应 → 课程学习 | month ≥ 3 |
| 课程学习 → 科研攻关 | month ≥ 15 |
| 科研攻关 → 论文写作 | paper ≥ 50 且 month ≥ 20 |
| 论文写作 → 答辩冲刺 | paper ≥ 90 且 month ≥ 30 |
| 答辩冲刺 → 毕业 | paper ≥ 100（在答辩阶段） |

### 毕业判定逻辑
论文 100% **不会直接毕业**，必须同时满足：
1. 进入「答辩冲刺期」（需要论文 ≥ 90% 且 月份 ≥ 30）
2. 在答辩阶段论文达到 100%
3. `_checkGameOver()` 在阶段过渡后会被**重新调用**（executeDecision 中）

---

## 开发注意事项

### 关键限制
1. **配置文件必须是 .js 文件**，不能用 .json！微信小程序 `require()` 不支持 JSON 文件
2. **WXML 模板不能调用组件方法** — 所有数据必须预计算为 data 属性。例如 `{{isOptionAvailable(item)}}` 不工作，需在 JS observer 中预计算 `_available` 字段
3. **自定义组件在 flex 布局中需要包裹层** — 直接对 `<custom-component>` 设置 flex 属性可能不生效，建议用 `<view>` 包裹
4. **小程序包体积限制 2MB** — 所有图片需压缩，字体需裁剪

### 数值平衡
- 每月净消耗：生活费 -3000 + 补助 +2000 = **-1000 元/月**
- 初始存款 5000 元，大约 5 个月不做副业就破产
- 做实验约 +10 论文/次，写论文约 +15 论文/次
- 正常毕业需 40-50 个月

### 特长修正机制
特长效果在 `DecisionResolver._applyTalentModifiers()` 中**回溯应用**：
1. 先正常计算效果并应用到资源
2. 然后用 `delta × (modifier - 1)` 回溯调整
3. 只对特定方向的 delta 生效（如 `energyCost` 仅修正负值精力变化）

### 里程碑事件
- 存储在 `milestones.js`，结构与普通事件相同（含 options/effects/setFlags）
- 通过 `_checkPhaseTransition()` 在阶段切换时触发
- 使用 `state.milestonesTriggered` 防止重复触发
- 盲审（blind_review）是唯一在 `advanceMonth()` 中随机触发的里程碑（15%/月）

### 存档兼容
- `loadGame()` 中检查旧存档缺失字段并补默认值
- talentConfig 从存档中的 talent ID 恢复
- 成就/里程碑追踪字段需兼容处理

### UI 布局
- 游戏页采用 **100vh flex column + overflow:hidden** 单屏布局
- 状态栏 2×2 资源网格 + 次要属性单行
- 决策卡片 3+2 网格，显示图标+名称+效果预览
- 日志区仅 120rpx 高度显示最近 2-3 条

---

## 当前功能清单

- [x] 5 种每月行动（实验/写论文/开会/摸鱼/副业）
- [x] 10 个随机事件（含条件触发、冷却、唯一事件）
- [x] 4 个阶段里程碑事件（资格考试/开题答辩/预答辩/盲审）
- [x] 8 个学科选择 + 5 个技能特长
- [x] 18 个成就（5 类，自动检测解锁 + 弹窗提示）
- [x] 6 种结局（光荣毕业/勉强毕业/精力耗尽/经济崩溃/退学/超限）
- [x] 3 槽位存档系统 + 每 3 月自动存档
- [x] 像素风 CSS 视觉（霓虹配色、像素边框、CRT 风格）
- [x] 操作反馈 Toast + 成就解锁弹窗
- [x] 资源变化量实时显示（预留固定高度防抖动）
- [x] 单屏无滚动布局
- [x] 中文界面（效果标签、需求提示等全部中文化）
