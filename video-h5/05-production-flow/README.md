# 05-production-flow

对应脚本时间码：02:12 - 02:40

## 录屏地址

- 完整动画无控制按钮，可直接录屏：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/05-production-flow/index.html`

## Shot 定帧

- 官方世界资料：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/05-production-flow/index.html?shot=official&clean=1`
- AI 深入理解：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/05-production-flow/index.html?shot=understand&clean=1`
- 用户探索剧情：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/05-production-flow/index.html?shot=intent&clean=1`
- 叙事厚度展现：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/05-production-flow/index.html?shot=reveal&clean=1`
- IP 水下资产：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/05-production-flow/index.html?shot=asset&clean=1`
- 全流程总览：`file:///Users/liyingyi/projects/tencent-pcg-ai/video-h5/05-production-flow/index.html?shot=final&clean=1`

## 使用素材

- 本段为纯 HTML/CSS motion graphic，不依赖外部图片素材。
- 视觉元素包括官方资料堆叠、AI 叙事纵深引擎、用户探索意图、叙事厚度卡和 IP 水下资产包。

## 待人工确认

- 当前将五步做成“单步出现、逐步讲清、最后汇总成完整链路”的动画，适合 28 秒连续录屏。
- 如果后期旁白节奏更慢，可以按 shot 定帧拆成 5 个短镜头使用。

## 自检结果

- 1920x1080 首屏完整：按 16:9 stage 和单步展示布局设计，避免组件互相压住。
- 文字裁切：标题、说明、五步卡片均使用短句；最终总览为横向五步链路。
- 滚动：无滚动，页面 `overflow: hidden`。
- 关键视觉安全区：标题位于左上安全区，单步卡片与机制视觉左右分区，最终五步链路在安全区内。
- 控制按钮：无暂停/重播按钮，避免录屏时露出无关控件。
- 水印风险：无图片素材，无水印。
- 截图验证说明：本轮不再触发需要授权的 Chrome headless 截图；已保留 shot 定帧地址，便于在浏览器中检查。
