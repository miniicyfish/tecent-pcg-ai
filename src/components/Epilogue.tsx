'use client';

import { useMemo, useState } from 'react';
import { getSceneBackground } from '@/lib/assets';
import { Identity, tools } from '@/lib/worldbuilding';
import { StoryNode } from '@/lib/storyNodes';

interface EpilogueData {
  epilogue: string;
  depthSummary: string;
  shareText: string;
}

interface DepthBeat {
  kind: 'narration' | 'dialogue' | 'perception' | 'thought';
  speaker?: string;
  mood?: string;
  text: string;
}

interface DepthData {
  hasDepth: boolean;
  content: string;
  depthTag: string | null;
  beats?: DepthBeat[];
}

interface DepthResult {
  depth: DepthData;
  toolId: string;
  sceneIndex: number;
}

interface Props {
  data: EpilogueData;
  identity: Identity;
  identityId: string;
  depthCount: number;
  storyNodes: StoryNode[];
  depthResults: DepthResult[];
  onRestart: () => void;
}

interface MemoryCard {
  title: string;
  tag: string;
  sceneIndex: number;
  backgroundSrc: string;
  label: string;
  summary: string;
  depthTag?: string | null;
  toolName?: string;
}

function summarizeDepth(depth: DepthData, maxLength = 120) {
  const text =
    depth.content ||
    depth.beats
      ?.map((beat) => {
        if (beat.kind === 'dialogue' && beat.speaker) {
          return `${beat.speaker}说：“${beat.text}”`;
        }
        return beat.text;
      })
      .join(' ');

  if (!text) return '';
  return `${text.slice(0, maxLength)}${text.length > maxLength ? '……' : ''}`;
}

export default function Epilogue({
  data,
  identity,
  identityId,
  depthCount,
  storyNodes,
  depthResults,
  onRestart,
}: Props) {
  const cards = useMemo<MemoryCard[]>(() => {
    const depthCards = depthResults
      .filter((result) => result.depth.hasDepth)
      .map((result) => {
        const node = storyNodes[result.sceneIndex];
        const tool = tools.find((item) => item.id === result.toolId);

        return {
          title: node?.title || '水下片刻',
          tag: node?.sceneTag || '纵深',
          sceneIndex: result.sceneIndex,
          backgroundSrc: getSceneBackground(identityId, node?.sceneTag || '', node?.id),
          label: tool ? `用「${tool.name}」照见` : '水下发现',
          summary: summarizeDepth(result.depth, 118),
          depthTag: result.depth.depthTag,
          toolName: tool?.name,
        };
      });

    if (depthCards.length > 0) return depthCards;

    return storyNodes.slice(-3).map((node, index) => ({
      title: node.title,
      tag: node.sceneTag,
      sceneIndex: storyNodes.length - 3 + index,
      backgroundSrc: getSceneBackground(identityId, node.sceneTag, node.id),
      label: '旅程回看',
      summary: node.perception.slice(0, 118),
      depthTag: null,
    }));
  }, [depthResults, identityId, storyNodes]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeCard = cards[activeIndex] || cards[0];
  const finalScene = storyNodes[storyNodes.length - 1];
  const shareBackground = activeCard?.backgroundSrc
    || getSceneBackground(identityId, finalScene.sceneTag, finalScene.id);

  const goToPrevious = () => {
    setActiveIndex((value) => (value - 1 + cards.length) % cards.length);
  };

  const goToNext = () => {
    setActiveIndex((value) => (value + 1) % cards.length);
  };

  return (
    <div className="animate-fade-in mx-auto w-full max-w-5xl space-y-6">
      <section className="relative min-h-[460px] overflow-hidden border border-border bg-bg-deep shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${shareBackground})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-deep via-bg-deep/72 to-bg-deep/18" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-transparent to-accent-blue/18" />
        <div className="absolute -right-8 bottom-0 top-12 w-[48%] min-w-72">
          <img
            src={identity.avatar}
            alt={identity.name}
            className="epilogue-standee h-full w-full object-cover object-top drop-shadow-2xl"
          />
        </div>

        <div className="relative z-10 flex min-h-[460px] max-w-2xl flex-col justify-between p-6 md:p-8">
          <div>
            <div className="mb-4 inline-flex border border-accent-gold/30 bg-accent-gold/10 px-3 py-1 text-xs text-accent-gold pixel-text">
              水下之旅结束
            </div>
            <h2 className="text-3xl font-bold leading-tight text-text-primary md:text-5xl">
              {identity.name}
            </h2>
            <p className="mt-2 text-sm text-accent-blue">{identity.title}</p>
            <p className="mt-5 max-w-xl text-sm leading-7 text-text-secondary">
              {data.epilogue}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div className="border-l border-accent-gold/40 bg-bg-deep/45 py-3 pl-4 backdrop-blur">
              <p className="text-xs text-text-dim">分享卡文案</p>
              <p className="mt-2 text-lg leading-relaxed text-accent-gold">
                &ldquo;{data.shareText}&rdquo;
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="border border-border bg-bg-deep/55 px-4 py-3 backdrop-blur">
                <div className="text-2xl font-bold text-accent-gold">{storyNodes.length}</div>
                <div className="mt-1 text-xs text-text-dim">幕</div>
              </div>
              <div className="border border-border bg-bg-deep/55 px-4 py-3 backdrop-blur">
                <div className="text-2xl font-bold text-accent-blue">{depthCount}</div>
                <div className="mt-1 text-xs text-text-dim">发现</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative min-h-[360px] overflow-hidden border border-border bg-bg-surface p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-dim pixel-text">旅程回看</p>
              <h3 className="mt-1 text-lg font-bold text-text-primary">
                {activeCard?.title}
              </h3>
            </div>
            <div className="text-xs text-text-dim">
              {activeIndex + 1}/{cards.length}
            </div>
          </div>

          <div className="relative mx-auto h-[260px] max-w-md">
            {cards.map((card, index) => {
              const offset = index - activeIndex;
              const normalizedOffset =
                offset < 0 ? offset + cards.length : offset;
              const isActive = index === activeIndex;
              const isNext = normalizedOffset === 1;
              const isThird = normalizedOffset === 2;
              const visible = isActive || isNext || isThird;

              return (
                <article
                  key={`${card.title}-${index}`}
                  className={`absolute inset-0 overflow-hidden border border-border bg-bg-card shadow-2xl transition-all duration-300 ${
                    visible ? 'opacity-100' : 'pointer-events-none opacity-0'
                  }`}
                  style={{
                    transform: isActive
                      ? 'translateX(0) translateY(0) rotate(0deg) scale(1)'
                      : isNext
                        ? 'translateX(24px) translateY(14px) rotate(4deg) scale(0.95)'
                        : 'translateX(46px) translateY(30px) rotate(8deg) scale(0.9)',
                    zIndex: isActive ? 30 : isNext ? 20 : 10,
                  }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${card.backgroundSrc})` }}
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/60 to-bg-deep/12" />
                  <div className="absolute left-4 top-4 border border-accent-blue/30 bg-bg-deep/65 px-2 py-1 text-xs text-accent-blue">
                    第{card.sceneIndex + 1}幕 · {card.tag}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-xs text-accent-gold pixel-text">
                      {card.depthTag || card.label}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-text-primary">
                      {card.summary}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={goToPrevious}
              className="border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-text-dim hover:text-text-primary pixel-text"
            >
              上一张
            </button>
            <button
              onClick={goToNext}
              className="border border-accent-gold px-4 py-2 text-sm text-accent-gold transition-colors hover:bg-accent-gold/10 pixel-text"
            >
              下一张
            </button>
          </div>
        </div>

        <aside className="space-y-4 border border-border bg-bg-card/80 p-5">
          <div>
            <p className="text-xs text-text-dim pixel-text">纵深总结</p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {data.depthSummary || '这一次你没有强行撬开水下，只是从小人物的位置看完了风暴。'}
            </p>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs text-text-dim">同一个世界，换一个身份，会看到完全不同的水下。</p>
            <button
              onClick={onRestart}
              className="mt-4 w-full border border-accent-gold px-5 py-3 text-sm text-accent-gold transition-colors hover:bg-accent-gold/10 pixel-text"
            >
              换个身份再看
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}
