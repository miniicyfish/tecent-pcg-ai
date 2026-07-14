'use client';

import { useEffect, useRef, useState } from 'react';

interface InnerThought {
  character: string;
  thought: string;
}

type DepthBeatKind = 'narration' | 'dialogue' | 'perception' | 'thought';

interface DepthBeat {
  kind: DepthBeatKind;
  speaker?: string;
  mood?: string;
  text: string;
}

interface DepthData {
  hasDepth: boolean;
  content: string;
  depthTag: string | null;
  beats?: DepthBeat[];
  innerThoughts?: InnerThought[];
}

interface Props {
  depth: DepthData;
  toolName: string;
  toolIcon: string;
  onClose: () => void;
}

function beatLabel(beat: DepthBeat) {
  if (beat.kind === 'dialogue') return beat.speaker || '有人';
  if (beat.kind === 'thought') return beat.speaker ? `${beat.speaker}心中` : '心中';
  if (beat.kind === 'perception') return '你的感知';
  return '镜头';
}

export default function DepthReveal({
  depth,
  toolName,
  toolIcon,
  onClose,
}: Props) {
  const beats = depth.hasDepth ? depth.beats?.filter((beat) => beat.text) || [] : [];
  const hasStructuredBeats = beats.length > 0;
  const innerThoughts = depth.innerThoughts || [];
  const [beatIndex, setBeatIndex] = useState(0);
  const currentBeat = beats[beatIndex];
  const isLastBeat = beatIndex >= beats.length - 1;
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    setBeatIndex(0);
  }, [depth, toolName]);

  useEffect(() => {
    const delay = hasStructuredBeats
      ? currentBeat?.kind === 'dialogue'
        ? 3600
        : currentBeat?.kind === 'perception'
          ? 5600
          : 6000
      : 4200;

    const timer = window.setTimeout(() => {
      if (!hasStructuredBeats || isLastBeat) {
        onCloseRef.current();
        return;
      }

      setBeatIndex((value) => value + 1);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [beatIndex, currentBeat?.kind, hasStructuredBeats, isLastBeat]);

  return (
    <div className="animate-fade-in pointer-events-none mx-auto w-full max-w-2xl">
      <div className="pointer-events-auto relative w-full overflow-hidden bg-bg-deep/36 shadow-lg backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/8 via-bg-deep/10 to-transparent" />
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/35 to-accent-gold/20" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-accent-gold/18 via-accent-blue/28 to-transparent" />
        <div className="relative z-10 space-y-2.5 p-3.5 md:p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">{toolIcon}</span>
                <span className="text-accent-blue/85 text-sm pixel-text">
                  水下浮起 · {toolName}
                </span>
              </div>
              {depth.depthTag && (
                <div className="mt-1 text-xs text-accent-gold/70">
                  {depth.depthTag}
                </div>
              )}
            </div>
            <div className="shrink-0 text-xs text-text-dim pixel-text">
              {hasStructuredBeats ? `${beatIndex + 1}/${beats.length}` : '1/1'}
            </div>
          </div>

      {hasStructuredBeats ? (
        <>
          {currentBeat && (() => {
            const isDialogue = currentBeat.kind === 'dialogue';
            const isThought = currentBeat.kind === 'thought';
            const isPerception = currentBeat.kind === 'perception';

            return (
              <div
                key={`${currentBeat.kind}-${beatIndex}`}
                className="py-1"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`text-xs pixel-text ${
                      isThought
                        ? 'text-accent-gold'
                        : isPerception
                          ? 'text-accent-blue'
                          : 'text-text-secondary'
                    }`}
                  >
                    {beatLabel(currentBeat)}
                  </span>
                  {currentBeat.mood && (
                    <span className="text-xs text-text-dim">({currentBeat.mood})</span>
                  )}
                </div>
                <p
                  className={`max-h-24 overflow-y-auto pr-1 text-sm leading-7 md:max-h-28 ${
                    isThought || isPerception
                      ? 'text-text-secondary italic'
                      : 'text-text-primary'
                  }`}
                >
                  {isDialogue ? `“${currentBeat.text}”` : currentBeat.text}
                </p>
              </div>
            );
          })()}

          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="h-px flex-1 bg-gradient-to-r from-accent-blue/18 to-transparent" />
            <button
              onClick={onClose}
              className="text-xs text-text-dim transition-colors hover:text-text-secondary pixel-text"
            >
              跳过
            </button>
          </div>
        </>
      ) : (
        <>
          <p
            className={`max-h-24 overflow-y-auto pr-1 text-sm leading-7 md:max-h-28 ${depth.hasDepth ? 'text-text-primary' : 'text-text-dim italic'}`}
          >
            {depth.content}
          </p>

          <div className="flex justify-end pt-1">
            <button
              onClick={onClose}
              className="text-xs text-text-dim transition-colors hover:text-text-secondary pixel-text"
            >
              跳过
            </button>
          </div>
        </>
      )}

      {!hasStructuredBeats && innerThoughts.length > 0 && (
        <div className="space-y-2 border-t border-border pt-3">
          {innerThoughts.map((t, i) => (
            <div key={i} className="text-xs">
              <span className="text-accent-gold">{t.character}</span>
              <span className="text-text-dim">的内心：</span>
              <span className="text-text-secondary italic">{t.thought}</span>
            </div>
          ))}
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
