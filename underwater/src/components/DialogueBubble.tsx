'use client';

import Image from 'next/image';
import { getCharacterAvatar } from '@/lib/assets';

interface Dialogue {
  character: string;
  mood: string;
  spoken: string;
}

interface Props {
  dialogue: Dialogue;
}

export default function DialogueBubble({ dialogue }: Props) {
  const avatar = getCharacterAvatar(dialogue.character);

  return (
    <div className="flex items-start gap-3">
      <div className="relative w-10 h-10 shrink-0 bg-bg-surface border border-border overflow-hidden flex items-center justify-center text-sm pixel-text text-accent-gold">
        {avatar ? (
          <Image
            src={avatar}
            alt={dialogue.character}
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : (
          dialogue.character[0]
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-accent-gold text-sm font-bold">
            {dialogue.character}
          </span>
          <span className="text-text-dim text-xs">({dialogue.mood})</span>
        </div>
        <p className="text-text-primary text-sm leading-relaxed">
          &ldquo;{dialogue.spoken}&rdquo;
        </p>
      </div>
    </div>
  );
}
