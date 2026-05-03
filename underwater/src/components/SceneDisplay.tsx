'use client';

import { getCharacterAvatar } from '@/lib/assets';

export interface SceneBeat {
  speaker: string;
  mood?: string;
  text: string;
  kind: 'narration' | 'dialogue' | 'perception' | 'echo';
}

interface Props {
  backgroundSrc: string;
  sceneTitle: string;
  sceneTag: string;
  sceneIndex: number;
  totalScenes: number;
  beat: SceneBeat;
  beatIndex: number;
  totalBeats: number;
  identityAvatar: string;
}

export default function SceneDisplay({
  backgroundSrc,
  sceneTitle,
  sceneTag,
  sceneIndex,
  totalScenes,
  beat,
  beatIndex,
  totalBeats,
  identityAvatar,
}: Props) {
  const avatar =
    beat.kind === 'dialogue'
      ? getCharacterAvatar(beat.speaker)
      : beat.kind === 'perception'
        ? identityAvatar
        : null;
  const label = beat.kind === 'dialogue' ? beat.speaker : '你';
  const isNarration = beat.kind === 'narration';
  const isEcho = beat.kind === 'echo';
  const isPerception = beat.kind === 'perception';

  return (
    <section className="relative min-h-[calc(100vh-132px)] overflow-hidden border-x border-border bg-bg-deep">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundSrc})` }}
        aria-label={`${sceneTag}场景`}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/35 via-bg-deep/5 to-bg-deep/90" />

      <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
        <div className="border border-border bg-bg-deep/70 px-3 py-2 backdrop-blur">
          <div className="text-xs text-text-dim pixel-text">
            第{sceneIndex + 1}/{totalScenes}幕 · {beatIndex + 1}/{totalBeats}
          </div>
          <div className="mt-1 text-sm font-bold text-accent-gold">{sceneTitle}</div>
        </div>
        <div className="border border-accent-blue/30 bg-bg-deep/65 px-3 py-1 text-xs text-accent-blue">
          {sceneTag}
        </div>
      </div>

      {beat.kind === 'dialogue' && avatar && (
        <div className="character-standee absolute bottom-32 left-3 h-64 w-48 md:bottom-24 md:h-80 md:w-60">
          <img
            src={avatar}
            alt={beat.speaker}
            className="h-full w-full object-cover object-top drop-shadow-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/35 via-transparent to-transparent" />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div
          className={`shadow-2xl backdrop-blur ${
            isNarration
              ? 'mx-auto max-w-xl border-y border-accent-gold/30 bg-bg-deep/70 px-6 py-5 text-center'
              : isEcho
                ? 'border border-accent-blue/40 bg-accent-blue/10 p-4'
                : isPerception
                  ? 'border border-accent-gold/25 bg-bg-deep/82 p-4'
                  : 'border border-border bg-bg-card/92 p-4'
          }`}
        >
          {isNarration ? (
            <div className="mb-3 text-xs tracking-[0.3em] text-accent-gold pixel-text">
              镜头
            </div>
          ) : isEcho ? (
            <div className="mb-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-accent-blue/30" />
              <span className="text-xs tracking-[0.22em] text-accent-blue pixel-text">
                水下回响
              </span>
              <div className="h-px flex-1 bg-accent-blue/30" />
            </div>
          ) : (
            <div className="mb-3 flex items-center gap-3">
              {isPerception ? (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-accent-gold/30 bg-bg-surface">
                  <img
                    src={identityAvatar}
                    alt="你的身份"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : avatar ? (
                <div className="relative h-11 w-11 shrink-0 overflow-hidden border border-border bg-bg-surface">
                  <img
                    src={avatar}
                    alt={beat.speaker}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}

              <div className="min-w-0">
                <div
                  className={`text-sm font-bold ${
                    isPerception ? 'text-accent-blue' : 'text-accent-gold'
                  }`}
                >
                  {isPerception ? '你的感知' : label}
                </div>
                {beat.mood && (
                  <div className="text-xs text-text-dim">({beat.mood})</div>
                )}
              </div>
            </div>
          )}

          <p
            className={`max-h-36 overflow-y-auto text-sm leading-7 ${
              isNarration
                ? 'text-text-secondary'
                : isEcho
                  ? 'text-text-primary'
                  : isPerception
                    ? 'text-text-secondary italic'
                    : 'text-text-primary'
            }`}
          >
            {beat.kind === 'dialogue' ? `“${beat.text}”` : beat.text}
          </p>
        </div>
      </div>
    </section>
  );
}
