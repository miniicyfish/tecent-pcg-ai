# 01-intro

对应脚本时间码：00:00 - 00:22

## 录屏地址

- 完整动画：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/01-intro/index.html`
- 隐藏控制：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/01-intro/index.html?clean=1`

## Shot 定帧

- 项目封面 / 腾讯视频·水下模式：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/01-intro/index.html?shot=cover&clean=1`
- 播放结束：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/01-intro/index.html?shot=start&clean=1`
- 手机页 / 豆瓣：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/01-intro/index.html?shot=douban&clean=1`
- 手机页 / 小红书：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/01-intro/index.html?shot=xhs&clean=1`
- 手机页 / B 站：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/01-intro/index.html?shot=bili&clean=1`
- 站外讨论汇聚：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/01-intro/index.html?shot=social&clean=1`
- 黑场判断句：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/01-intro/index.html?shot=final&clean=1`

## 使用素材

- `assets/cover-bg.png`
  - 来源：主 demo 饭桌场景图。
  - 用途：视频首帧项目封面，标题为“腾讯视频·水下模式”，避免用带站外水印截图。
- `assets/ending-frame.jpg`
  - 来源：饭桌戏视频抽帧。
  - 用途：腾讯视频播放结束模拟画面。
- `assets/thumb-moli.jpg`
- `assets/thumb-xiaoye.jpg`
- `assets/thumb-analysis.jpg`
  - 来源：饭桌戏视频抽帧。
  - 用途：站外讨论卡片缩略图。

## 已修复问题

- 手机屏幕内“小红书”等 app 名已改为发布会式极简表达，不还原真实 app UI。
- 手机页字号和上下留白已收进安全区，`shot=xhs` 定帧下文字不再裁切。
- 首帧为“腾讯视频·水下模式”项目封面，不使用 B 站水印截图。

## 待人工确认

- `ending-frame.jpg` 和 `thumb-*.jpg` 仍可能来自带站外水印的视频抽帧。当前在画面中弱化使用；如最终视频对水印敏感，建议替换为腾讯视频官方无水印截图。
- 如果旁白节奏调整，可修改 `--t: 22s` 控制整段时长。

## 自检结果

- 1920x1080 首屏完整：已检查小红书定帧，文字完整显示。
- 文字裁切：手机页重点裁切问题已修复。
- 滚动：无滚动，页面 `overflow: hidden`。
- 关键视觉安全区：封面标题、播放结束文案、手机页内容、黑场判断句均在安全区。
- 控制按钮：`?clean=1` 可隐藏控制按钮。
- 水印风险：封面无水印；后续站外讨论缩略图和播放结束帧存在可替换风险，已记录在 TODO。
