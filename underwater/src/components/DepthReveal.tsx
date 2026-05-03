'use client';

interface InnerThought {
  character: string;
  thought: string;
}

interface DepthData {
  hasDepth: boolean;
  content: string;
  depthTag: string | null;
  innerThoughts: InnerThought[];
}

interface Props {
  depth: DepthData;
  toolName: string;
  toolIcon: string;
}

export default function DepthReveal({ depth, toolName, toolIcon }: Props) {
  return (
    <div className="animate-fade-in border border-accent-blue/30 bg-accent-blue/5 p-5 space-y-3">
      {/* 工具标签 */}
      <div className="flex items-center gap-2">
        <span className="text-lg">{toolIcon}</span>
        <span className="text-accent-blue text-sm pixel-text">{toolName}</span>
        {depth.depthTag && (
          <span className="text-accent-gold text-xs px-2 py-0.5 border border-accent-gold/30 bg-accent-gold/5 ml-auto">
            {depth.depthTag}
          </span>
        )}
      </div>

      {/* 纵深内容 */}
      <p
        className={`text-sm leading-relaxed ${depth.hasDepth ? 'text-text-primary' : 'text-text-dim italic'}`}
      >
        {depth.content}
      </p>

      {/* 角色内心 */}
      {depth.innerThoughts.length > 0 && (
        <div className="space-y-2 border-t border-border pt-3">
          {depth.innerThoughts.map((t, i) => (
            <div key={i} className="text-xs">
              <span className="text-accent-gold">{t.character}</span>
              <span className="text-text-dim">的内心：</span>
              <span className="text-text-secondary italic">{t.thought}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
