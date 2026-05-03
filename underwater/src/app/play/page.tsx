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
  innerThoughts: { character: string; thought: string }[];
}

interface EpilogueData {
  epilogue: string;
  depthSummary: string;
  shareText: string;
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
  const [depthResults, setDepthResults] = useState<
    { depth: DepthData; toolId: string; sceneIndex: number }[]
  >([]);
  const [activeDepth, setActiveDepth] = useState<{
    depth: DepthData;
    toolId: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [epilogue, setEpilogue] = useState<EpilogueData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentNode = storyNodes[sceneIndex];

  const depthEcho = useMemo(() => {
    const priorDepth = [...depthResults]
      .reverse()
      .find((item) => item.depth.hasDepth && item.sceneIndex < sceneIndex);

    if (!priorDepth) return null;
    const tool = tools.find((item) => item.id === priorDepth.toolId);
    const source = tool ? `方才「${tool.name}」照见的细节` : '方才照见的细节';
    return `${source}，让此刻多了一层意味：${priorDepth.depth.content.slice(0, 120)}${priorDepth.depth.content.length > 120 ? '……' : ''}`;
  }, [depthResults, sceneIndex]);

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
    if (!autoPlay || loading || epilogue) return;
    if (isLastScene && isLastBeat) return;

    const delay = activeDepth
      ? 9000
      : currentBeat.kind === 'dialogue'
        ? 5200
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
          setDepthHistory((prev) => [
            ...prev,
            `[${depth.depthTag}] ${depth.content.slice(0, 80)}`,
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
          identityName={identity.name}
          depthCount={depthCount}
          onRestart={() => router.push('/')}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-1 flex-col">
      <header className="z-10 flex items-center justify-between border-b border-border bg-bg-deep/95 px-4 py-3">
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

      <main className="relative flex-1">
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
          <div className="absolute bottom-44 left-4 right-4 z-20">
            <DepthReveal
              depth={activeDepth.depth}
              toolName={tools.find((tool) => tool.id === activeDepth.toolId)?.name || ''}
              toolIcon={tools.find((tool) => tool.id === activeDepth.toolId)?.icon || ''}
            />
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-bg-deep/45 backdrop-blur-sm">
            <div className="border border-accent-gold/30 bg-bg-card px-6 py-5 text-center shadow-2xl">
              <LoadingIndicator text="你屏住呼吸，等那点声响浮上来" />
              <p className="mt-1 text-xs text-text-dim">
                有些事不会改变，但看见它的角度会变。
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

      <footer className="border-t border-border bg-bg-deep/95 px-4 py-3">
        <ToolBar
          onUseTool={useTool}
          disabled={loading}
          activeToolId={activeToolId}
          highlightedToolIds={highlightedToolIds}
          usedToolIds={usedToolIds}
        />

        <div className="mt-3 flex justify-center">
          {isLastScene && isLastBeat ? (
            <button
              onClick={generateEpilogue}
              disabled={loading}
              className="border border-accent-gold bg-accent-gold/20 px-6 py-2 text-sm text-accent-gold transition-colors hover:bg-accent-gold/30 disabled:opacity-50 pixel-text"
            >
              结束旅程
            </button>
          ) : (
            <button
              onClick={advance}
              disabled={loading}
              className="border border-border px-8 py-2 text-sm text-text-secondary transition-colors hover:border-text-dim hover:text-text-primary disabled:opacity-50 pixel-text"
            >
              继续
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
