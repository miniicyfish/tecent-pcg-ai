'use client';

import Image from 'next/image';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { identities, tools } from '@/lib/worldbuilding';
import { StoryNode, storyNodesByIdentity } from '@/lib/storyNodes';
import { getSceneBackground } from '@/lib/assets';
import SceneDisplay, { SceneBeat } from '@/components/SceneDisplay';
import ToolBar from '@/components/ToolBar';
import DepthReveal from '@/components/DepthReveal';
import LoadingIndicator from '@/components/LoadingIndicator';
import Epilogue from '@/components/Epilogue';

interface DepthData {
  hasDepth: boolean;
  content: string;
  depthTag: string | null;
  beats?: {
    kind: 'narration' | 'dialogue' | 'perception' | 'thought';
    speaker?: string;
    mood?: string;
    text: string;
  }[];
  innerThoughts: { character: string; thought: string }[];
}

interface EpilogueData {
  epilogue: string;
  depthSummary: string;
  shareText: string;
}

interface DepthResult {
  depth: DepthData;
  toolId: string;
  sceneIndex: number;
}

const contextualTools: Record<string, string[]> = {
  teahouse_01: [],
  teahouse_02: ['listen', 'observe'],
  teahouse_03: ['listen', 'observe', 'follow'],
  teahouse_04: ['observe', 'follow'],
  teahouse_05: ['listen', 'recall'],
  teahouse_06: ['recall', 'observe'],
  teahouse_07: ['listen', 'observe'],
  clerk_01: [],
  clerk_02: ['listen', 'recall'],
  clerk_03: ['listen', 'observe'],
  clerk_04: ['listen', 'observe'],
  clerk_05: ['observe', 'recall'],
  clerk_06: ['observe', 'recall'],
  clerk_07: ['listen', 'observe'],
  servant_01: [],
  servant_02: ['listen', 'observe'],
  servant_03: ['listen', 'follow'],
  servant_04: ['listen', 'observe'],
  servant_05: ['observe', 'recall'],
  servant_06: ['listen', 'observe'],
  servant_07: ['listen', 'recall'],
};

export default function PlayPage() {
  return (
    <Suspense fallback={<LoadingIndicator text="入场中" />}>
      <PlayContent />
    </Suspense>
  );
}

function buildBeats(node: StoryNode, depthEcho: string | null): SceneBeat[] {
  return [
    {
      speaker: '镜头',
      text: node.sceneDescription,
      kind: 'narration',
    },
    ...node.dialogues.map((dialogue) => ({
      speaker: dialogue.character,
      mood: dialogue.mood,
      text: dialogue.spoken,
      kind: 'dialogue' as const,
    })),
    {
      speaker: '你',
      text: node.perception,
      kind: 'perception' as const,
    },
    ...(depthEcho
      ? [
          {
            speaker: '水下回响',
            text: depthEcho,
            kind: 'echo' as const,
          },
        ]
      : []),
  ];
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

function getDepthText(depth: DepthData) {
  return (
    depth.content ||
    depth.beats
      ?.map((beat) => {
        if (beat.kind === 'dialogue' && beat.speaker) {
          return `${beat.speaker}说：“${beat.text}”`;
        }
        return beat.text;
      })
      .join(' ') ||
    ''
  ).replace(/\s+/g, ' ').trim();
}

function buildEchoSummary(depth: DepthData, maxLength = 180) {
  const text = getDepthText(depth);
  if (!text) return '';
  if (text.length <= maxLength) return text;

  const sentences = text.match(/[^。！？]+[。！？]/g);
  if (sentences?.length) {
    let summary = '';
    for (const sentence of sentences) {
      if ((summary + sentence).length > maxLength) break;
      summary += sentence;
    }
    if (summary) return summary;
  }

  const clauses = text.split(/(?<=[，；、])/);
  let summary = '';
  for (const clause of clauses) {
    if (!clause) continue;
    if ((summary + clause).length > maxLength) break;
    summary += clause;
  }

  const fallback = summary || text.slice(0, maxLength - 1);
  return /[。！？]$/.test(fallback) ? fallback : `${fallback.replace(/[，；、：]$/, '')}。`;
}

function buildDepthEcho(
  currentNode: StoryNode,
  priorDepthResult: DepthResult | undefined
) {
  if (!priorDepthResult) return null;

  const { depth, toolId } = priorDepthResult;
  const tool = tools.find((item) => item.id === toolId);
  const toolName = tool?.name || '那次探索';
  const depthTag = depth.depthTag || '水下细节';
  const summary = buildEchoSummary(depth);

  if (!summary) return null;

  const sceneHook =
    currentNode.sceneTag === '风暴'
      ? '眼前的混乱'
      : currentNode.sceneTag === '余波'
        ? '此刻的余波'
        : currentNode.sceneTag === '暗流'
          ? '眼前的暗流'
          : '此刻的寻常';

  return `方才「${toolName}」照见的${depthTag}，让${sceneHook}多了一层意味：${summary}`;
}

function PlayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const identityId = searchParams.get('id') || 'teahouse';
  const identity = identities.find((item) => item.id === identityId) || identities[0];
  const storyNodes =
    storyNodesByIdentity[identityId] || storyNodesByIdentity.teahouse;

  const [sceneIndex, setSceneIndex] = useState(0);
  const [beatIndex, setBeatIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [depthHistory, setDepthHistory] = useState<string[]>([]);
  const [depthResults, setDepthResults] = useState<DepthResult[]>([]);
  const [activeDepth, setActiveDepth] = useState<{
    depth: DepthData;
    toolId: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingElapsedSeconds, setLoadingElapsedSeconds] = useState(0);
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [epilogue, setEpilogue] = useState<EpilogueData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentNode = storyNodes[sceneIndex];

  const depthEcho = useMemo(() => {
    const previousSceneIndex = sceneIndex - 1;
    if (previousSceneIndex < 0) return null;

    const priorDepth = [...depthResults]
      .reverse()
      .find(
        (item) =>
          item.depth.hasDepth && item.sceneIndex === previousSceneIndex
      );

    return buildDepthEcho(currentNode, priorDepth);
  }, [currentNode, depthResults, sceneIndex]);

  const beats = useMemo(
    () => buildBeats(currentNode, depthEcho),
    [currentNode, depthEcho]
  );

  const currentBeat = beats[beatIndex] || beats[0];
  const isLastScene = sceneIndex >= storyNodes.length - 1;
  const isLastBeat = beatIndex >= beats.length - 1;
  const highlightedToolIds = contextualTools[currentNode.id] || [];
  const usedToolIds = depthResults
    .filter((item) => item.sceneIndex === sceneIndex)
    .map((item) => item.toolId);
  const depthCount = depthResults.filter((item) => item.depth.hasDepth).length;

  const loadingCopy = useMemo(() => {
    if (loadingElapsedSeconds >= 30) {
      return {
        text: '水下仍在回应，快到本次打捞边界',
        detail: '如果 45 秒内没有浮上来，这次探索会自然回到当前场景。',
      };
    }

    if (loadingElapsedSeconds >= 15) {
      return {
        text: '线索还在水下，模型正在判断能否看见',
        detail: '有些场景需要更久，尤其是要分辨“有发现”和“只是寻常”。',
      };
    }

    return {
      text: '你屏住呼吸，等那点声响浮上来',
      detail: '有些事不会改变，但看见它的角度会变。',
    };
  }, [loadingElapsedSeconds]);

  useEffect(() => {
    if (!loading) {
      setLoadingElapsedSeconds(0);
      return;
    }

    const startedAt = Date.now();
    setLoadingElapsedSeconds(0);
    const timer = window.setInterval(() => {
      setLoadingElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [loading]);

  const advance = useCallback(() => {
    setActiveDepth(null);
    setError(null);

    if (beatIndex < beats.length - 1) {
      setBeatIndex((value) => value + 1);
      return;
    }

    if (sceneIndex < storyNodes.length - 1) {
      setSceneIndex((value) => value + 1);
      setBeatIndex(0);
    }
  }, [beatIndex, beats.length, sceneIndex, storyNodes.length]);

  useEffect(() => {
    if (!autoPlay || activeDepth || loading || epilogue) return;
    if (isLastScene && isLastBeat) return;

    const delay =
      currentBeat.kind === 'dialogue'
        ? 3800
        : currentBeat.kind === 'perception'
          ? 6200
          : 7200;
    const timer = window.setTimeout(advance, delay);
    return () => window.clearTimeout(timer);
  }, [
    activeDepth,
    advance,
    autoPlay,
    currentBeat.kind,
    epilogue,
    isLastBeat,
    isLastScene,
    loading,
  ]);

  const useTool = useCallback(
    async (toolId: string) => {
      if (usedToolIds.includes(toolId)) {
        return;
      }

      setActiveToolId(toolId);
      setLoading(true);
      setError(null);
      setActiveDepth(null);

      try {
        const res = await fetch('/api/tool', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identityId,
            toolId,
            storyNodeId: currentNode.id,
            currentScene: currentNode.sceneDescription,
            isContextualTool: highlightedToolIds.includes(toolId),
            contextualTools: highlightedToolIds,
            sceneHistory: storyNodes
              .slice(Math.max(0, sceneIndex - 2), sceneIndex + 1)
              .map(
                (node) =>
                  `[${node.sceneTag}] ${node.title}: ${node.sceneDescription.slice(0, 80)}`
              ),
            depthHistory,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || '探索失败');
        }

        const depth: DepthData = await res.json();
        setActiveDepth({ depth, toolId });
        setDepthResults((prev) => [...prev, { depth, toolId, sceneIndex }]);

        if (depth.hasDepth && depth.depthTag) {
          const summary = summarizeDepth(depth, 80);
          setDepthHistory((prev) => [
            ...prev,
            `[${depth.depthTag}] ${summary}`,
          ]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '探索失败');
      } finally {
        setLoading(false);
        setActiveToolId(null);
      }
    },
    [
      highlightedToolIds,
      currentNode,
      depthHistory,
      identityId,
      sceneIndex,
      storyNodes,
      usedToolIds,
    ]
  );

  const generateEpilogue = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/epilogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identityId,
          sceneHistory: storyNodes.map(
            (node) =>
              `[${node.sceneTag}] ${node.title}: ${node.sceneDescription.slice(0, 100)}`
          ),
          depthHistory,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '生成失败');
      }

      const data: EpilogueData = await res.json();
      setEpilogue(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
    } finally {
      setLoading(false);
    }
  }, [depthHistory, identityId, storyNodes]);

  if (epilogue) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <Epilogue
          data={epilogue}
          identity={identity}
          identityId={identityId}
          depthCount={depthCount}
          storyNodes={storyNodes}
          depthResults={depthResults}
          onRestart={() => router.push('/')}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-screen w-full max-w-6xl flex-col overflow-hidden">
      <header className="z-10 flex h-14 shrink-0 items-center justify-between border-b border-border bg-bg-deep/95 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 overflow-hidden border border-border bg-bg-card">
            <Image
              src={identity.avatar}
              alt={identity.name}
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="text-sm font-bold text-accent-gold">{identity.name}</div>
            <div className="text-xs text-text-dim">{identity.title}</div>
          </div>
        </div>

        <button
          onClick={() => setAutoPlay((value) => !value)}
          className={`border px-3 py-1 text-xs transition-colors pixel-text ${
            autoPlay
              ? 'border-accent-blue bg-accent-blue/10 text-accent-blue'
              : 'border-border text-text-dim hover:text-text-secondary'
          }`}
        >
          {autoPlay ? '自动' : '手动'}
        </button>
      </header>

      <main className="relative min-h-0 flex-1">
        <SceneDisplay
          backgroundSrc={getSceneBackground(
            identityId,
            currentNode.sceneTag,
            currentNode.id
          )}
          sceneTitle={currentNode.title}
          sceneTag={currentNode.sceneTag}
          sceneIndex={sceneIndex}
          totalScenes={storyNodes.length}
          beat={currentBeat}
          beatIndex={beatIndex}
          totalBeats={beats.length}
          identityAvatar={identity.avatar}
        />

        {activeDepth && (
          <div className="absolute bottom-32 left-4 right-4 z-20 md:bottom-28">
            <DepthReveal
              depth={activeDepth.depth}
              toolName={tools.find((tool) => tool.id === activeDepth.toolId)?.name || ''}
              toolIcon={tools.find((tool) => tool.id === activeDepth.toolId)?.icon || ''}
              onClose={() => setActiveDepth(null)}
            />
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-bg-deep/45 backdrop-blur-sm">
            <div className="border border-accent-gold/30 bg-bg-card px-6 py-5 text-center shadow-2xl">
              <LoadingIndicator text={loadingCopy.text} />
              <p className="mt-1 text-xs text-text-dim">
                {loadingCopy.detail}
              </p>
              <p className="mt-3 text-xs text-accent-blue/70 pixel-text">
                {Math.min(loadingElapsedSeconds, 45)} / 45 秒
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute left-4 right-4 top-20 z-40 border border-accent-red/40 bg-bg-card p-3 text-center text-sm text-accent-red">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-text-dim underline"
            >
              关闭
            </button>
          </div>
        )}
      </main>

      <footer className="shrink-0 border-t border-border bg-bg-deep/95 px-4 py-2">
        <ToolBar
          onUseTool={useTool}
          disabled={loading}
          activeToolId={activeToolId}
          highlightedToolIds={highlightedToolIds}
          usedToolIds={usedToolIds}
        />

        <div className="mt-2 flex justify-center">
          {isLastScene && isLastBeat ? (
            <div className="space-y-1.5 text-center">
              <p className="text-xs leading-5 text-accent-gold/80">
                水下旅程已走到尽头，点击下方生成你的结语和分享卡。
              </p>
              <button
                onClick={generateEpilogue}
                disabled={loading}
                className="border border-accent-gold bg-accent-gold/20 px-6 py-1.5 text-sm text-accent-gold transition-colors hover:bg-accent-gold/30 disabled:opacity-50 pixel-text"
              >
                结束旅程
              </button>
            </div>
          ) : (
            <button
              onClick={advance}
              disabled={loading}
              className="border border-border px-8 py-1.5 text-sm text-text-secondary transition-colors hover:border-text-dim hover:text-text-primary disabled:opacity-50 pixel-text"
            >
              继续
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
