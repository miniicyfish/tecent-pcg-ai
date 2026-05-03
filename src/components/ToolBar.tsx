'use client';

import { tools } from '@/lib/worldbuilding';

interface Props {
  onUseTool: (toolId: string) => void;
  disabled: boolean;
  activeToolId: string | null;
  highlightedToolIds: string[];
  usedToolIds: string[];
}

export default function ToolBar({
  onUseTool,
  disabled,
  activeToolId,
  highlightedToolIds,
  usedToolIds,
}: Props) {
  return (
    <div className="flex gap-3 justify-center">
      {tools.map((tool) => {
        const used = usedToolIds.includes(tool.id);
        const highlighted = highlightedToolIds.includes(tool.id);
        const isDisabled = disabled || used;
        return (
          <button
            key={tool.id}
            onClick={() => onUseTool(tool.id)}
            disabled={isDisabled}
            className={`flex flex-col items-center gap-1.5 px-4 py-3 border transition-all ${
              activeToolId === tool.id
                ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                : isDisabled
                  ? 'border-border/50 text-text-dim cursor-not-allowed opacity-45'
                  : highlighted
                    ? 'border-accent-blue/70 text-text-primary bg-accent-blue/10 hover:border-accent-gold'
                    : 'border-border hover:border-text-dim text-text-secondary hover:text-text-primary bg-bg-card'
            }`}
            title={highlighted ? '此刻似乎值得一试' : '也可以试试，但未必有发现'}
          >
            <span className="text-xl">{tool.icon}</span>
            <span className="text-xs pixel-text">{used ? '已看过' : tool.name}</span>
          </button>
        );
      })}
    </div>
  );
}
