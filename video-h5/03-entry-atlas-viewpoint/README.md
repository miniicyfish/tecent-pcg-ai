# 03-entry-atlas-viewpoint

对应脚本时间码：00:36 - 01:00

## 录屏地址

- 完整动画：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/03-entry-atlas-viewpoint/index.html`
- 隐藏控制：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/03-entry-atlas-viewpoint/index.html?clean=1`

## Shot 定帧

- 播放后入口：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/03-entry-atlas-viewpoint/index.html?shot=entry&clean=1`
- 本集探索图谱：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/03-entry-atlas-viewpoint/index.html?shot=atlas&clean=1`
- 视角选择：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/03-entry-atlas-viewpoint/index.html?shot=viewpoint&clean=1`
- 收束字幕：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/03-entry-atlas-viewpoint/index.html?shot=final&clean=1`

## 使用素材

- `assets/dining-selected.png`
  - 来源：`/Users/liyingyi/projects/tencent-pcg-ai/haodongxi/app/public/haodongxi/scenes/dining/dining_03_xiaoye.png`
  - 用途：播放结束背景、图谱推荐事件、视角选择背景。
- `assets/xiaoye.png`
- `assets/wang-tiemei.png`
- `assets/wang-moli.png`
- `assets/xiaoma.png`
- `assets/ex-husband.png`
  - 来源：`/Users/liyingyi/projects/tencent-pcg-ai/haodongxi/app/public/haodongxi/characters-cutout/`
  - 用途：饭桌五观察位。

## 待人工确认

- 事件图谱节点目前是视频脚本级别的概念节点，用于 24 秒展示产品天花板；后续如果需要和主 demo 中事件数据完全一致，可替换节点名。
- “饭桌 / 小叶 / 铁梅”筛选是概念展示，不需要在本 H5 中做真实交互。

## 自检结果

- 1920x1080 首屏完整：按 16:9 stage 设计，所有关键内容在安全区内。
- 文字裁切：静态检查未发现超出容器的长文本；视角卡文案控制在两行以内。
- 滚动：无滚动，页面 `overflow: hidden`。
- 关键视觉安全区：播放入口卡、图谱标题、推荐节点、五观察位均避开边缘。
- 控制按钮：`?clean=1` 可隐藏控制按钮。
- 水印风险：本段使用主 demo 场景图和透明人物立绘，无站外平台水印。
- 截图验证说明：本轮 Chrome headless 被沙箱拦截，未继续请求授权；已保留 `shot` 定帧地址，方便在浏览器中快速检查。
