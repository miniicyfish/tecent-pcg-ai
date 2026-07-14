# 06-second-world

对应脚本时间码：02:40 - 02:52

## 录屏地址

- 完整动画：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/06-second-world/index.html`
- 隐藏控制：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/06-second-world/index.html?clean=1`

## Shot 定帧

- 四宫格概念拼贴：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/06-second-world/index.html?shot=grid&clean=1`
- 餐桌水下徽标：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/06-second-world/index.html?shot=emblem&clean=1`
- 结尾定帧：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/06-second-world/index.html?shot=final&clean=1`

## 使用素材

- `assets/dining-world.png`
  - 来源：`/Users/liyingyi/projects/tencent-pcg-ai/video-h5/03-entry-atlas-viewpoint/assets/dining-selected.png`
  - 用途：视角对照缩略图与最终餐桌徽标。

## 待人工确认

- “好友视角拼图”目前是概念表达，用于复赛视频展示产品天花板，尚不是主 demo 中的真实功能。
- 如后续希望更贴近腾讯视频真实页面，可将四宫格中的概念缩略替换为正式 UI 截图。

## 自检结果

- 1920x1080 首屏完整：按 16:9 stage 设计，四宫格和最终徽标均在安全区内。
- 文字裁切：四个 tile 文案为短句；最终字幕居中并控制在两行。
- 滚动：无滚动，页面 `overflow: hidden`。
- 关键视觉安全区：标题、四宫格、最终餐桌徽标均避开边缘。
- 控制按钮：`?clean=1` 可隐藏控制按钮。
- 水印风险：使用主 demo 场景图，无站外平台水印。
- 截图验证说明：不触发需要授权的 Chrome headless 截图；已保留 shot 定帧地址，便于浏览器检查。
