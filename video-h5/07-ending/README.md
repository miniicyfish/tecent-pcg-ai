# 07-ending

对应脚本时间码：02:52 - 03:00

## 录屏地址

- 完整动画：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/07-ending/index.html`
- 隐藏控制：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/07-ending/index.html?clean=1`

## Shot 定帧

- 第一句：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/07-ending/index.html?shot=first&clean=1`
- 第二句：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/07-ending/index.html?shot=second&clean=1`
- 结尾定帧：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/07-ending/index.html?shot=final&clean=1`

## 使用素材

- 本段为纯 HTML/CSS 黑场字幕，不依赖外部图片素材。

## 待人工确认

- 当前结尾文案与脚本一致：“正片讲完故事，水下让用户继续住在故事里。”以及“腾讯视频 · 每个 IP 的第二层世界。”
- 如果最终配音节奏更慢，可以把 `--t` 从 8s 调到 10s。

## 自检结果

- 1920x1080 首屏完整：按 16:9 stage 设计。
- 文字裁切：两句字幕都在中心安全区，字号使用 clamp。
- 滚动：无滚动，页面 `overflow: hidden`。
- 关键视觉安全区：水线和字幕均居中。
- 控制按钮：`?clean=1` 可隐藏控制按钮。
- 水印风险：无图片素材，无水印。
