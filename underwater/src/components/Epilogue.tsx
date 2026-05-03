'use client';

interface EpilogueData {
  epilogue: string;
  depthSummary: string;
  shareText: string;
}

interface Props {
  data: EpilogueData;
  identityName: string;
  depthCount: number;
  onRestart: () => void;
}

export default function Epilogue({
  data,
  identityName,
  depthCount,
  onRestart,
}: Props) {
  return (
    <div className="animate-fade-in space-y-8 max-w-lg mx-auto text-center">
      <h2 className="pixel-text text-2xl text-accent-gold">水下之旅结束</h2>

      {/* 结语 */}
      <p className="text-text-primary text-sm leading-relaxed text-left">
        {data.epilogue}
      </p>

      {/* 统计 */}
      <div className="flex justify-center gap-8 py-4 border-y border-border">
        <div>
          <div className="text-accent-gold text-2xl font-bold">{identityName}</div>
          <div className="text-text-dim text-xs mt-1">你的身份</div>
        </div>
        <div>
          <div className="text-accent-blue text-2xl font-bold">{depthCount}</div>
          <div className="text-text-dim text-xs mt-1">纵深发现</div>
        </div>
      </div>

      {/* 纵深总结 */}
      {data.depthSummary && (
        <p className="text-text-secondary text-sm leading-relaxed text-left">
          {data.depthSummary}
        </p>
      )}

      {/* 分享文案 */}
      <div className="bg-bg-card border border-border p-4">
        <p className="text-text-dim text-xs mb-2">分享</p>
        <p className="text-accent-gold text-sm">&ldquo;{data.shareText}&rdquo;</p>
      </div>

      {/* 重玩 */}
      <div className="space-y-3">
        <p className="text-text-dim text-xs">
          同一个世界，换一个身份，会看到完全不同的水下
        </p>
        <button
          onClick={onRestart}
          className="px-6 py-2 border border-accent-gold text-accent-gold hover:bg-accent-gold/10 transition-colors pixel-text text-sm"
        >
          换个身份再看
        </button>
      </div>
    </div>
  );
}
