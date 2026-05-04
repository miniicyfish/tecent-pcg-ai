// 工具纵深 API — 侧耳/追忆/细看/跟随
// AI 的核心职责：判断当前固定场景 + 当前身份 + 当前工具，能否合理看到更深一层的信息

import { callAI } from '@/lib/ai';
import { buildToolSystemPrompt } from '@/lib/prompts';
import { identities, tools } from '@/lib/worldbuilding';
import { storyNodesByIdentity } from '@/lib/storyNodes';

const isToolDebugEnabled = process.env.TOOL_DEBUG === '1';

function emptyDepthResult() {
  return {
    hasDepth: false,
    content:
      '你试着多看了一眼，周围却只剩寻常声响。也许这一刻，水下没有给你回应。',
    depthTag: null,
    innerThoughts: [],
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      identityId,
      toolId,
      storyNodeId,
      currentScene,
      isContextualTool = false,
      contextualTools = [],
      sceneHistory = [],
      depthHistory = [],
    } = body;

    const identity = identities.find((i) => i.id === identityId);
    if (!identity) {
      return Response.json({ error: '未知身份' }, { status: 400 });
    }

    const tool = tools.find((t) => t.id === toolId);
    if (!tool) {
      return Response.json({ error: '未知工具' }, { status: 400 });
    }

    // 获取当前故事节点的完整信息
    const nodes = storyNodesByIdentity[identityId] || [];
    const currentNode = nodes.find((n) => n.id === storyNodeId);
    const nodeContext = currentNode
      ? `当前场景：「${currentNode.title}」(${currentNode.sceneTag})\n${currentNode.sceneDescription}\n\n对话：\n${currentNode.dialogues.map((d) => `${d.character}（${d.mood}）：${d.spoken}`).join('\n')}\n\n你的感知：${currentNode.perception}`
      : `当前场景：\n${currentScene}`;

    const systemPrompt = buildToolSystemPrompt(
      identity,
      tool.id,
      tool.promptHint
    );

    // 构建上下文
    const depthText =
      depthHistory.length > 0
        ? `\n## 你之前的发现\n${depthHistory.map((d: string) => `- ${d}`).join('\n')}`
        : '';

    const historyText =
      sceneHistory.length > 0
        ? `\n## 之前的场景摘要\n${sceneHistory.join('\n')}`
        : '';

    const contextualToolNames = contextualTools
      .map((id: string) => tools.find((item) => item.id === id)?.name)
      .filter(Boolean)
      .join('、');

    const userPrompt = `## 当前场景完整信息
${nodeContext}
${historyText}${depthText}

用户此刻选择了「${tool.name}」（${tool.description}）。

## 当前工具与场景的关系
- 系统判断此刻更自然的工具是：${contextualToolNames || '无明显工具'}
- 用户选择的「${tool.name}」${isContextualTool ? '与当前场景存在明显线索关联。' : '不是当前场景的明显线索工具。'}

请基于当前场景的具体内容和完整上下文，判断此刻使用这个工具是否能合理地看到更深一层的信息。

重要：默认返回 hasDepth=false。只有当前文本里存在明确触发物，并且这个工具能以小人物身份自然发现它时，才返回 hasDepth=true。若用户只是随便试探、场景没有具体可听/可看/可追/可回想的对象，必须返回自然空结果。

请直接输出JSON。`;

    const result = await callAI(systemPrompt, userPrompt, [], 0.8, 1500, 45000);

    if (isToolDebugEnabled) {
      const parsed = result.parsed as
        | {
            hasDepth?: unknown;
            depthTag?: unknown;
            content?: unknown;
            beats?: unknown;
          }
        | null;

      console.log('[tool-debug]', {
        identityId,
        storyNodeId,
        sceneTitle: currentNode?.title || null,
        toolId,
        toolName: tool.name,
        isContextualTool,
        contextualTools,
        parsed: Boolean(result.parsed),
        hasDepth: parsed?.hasDepth ?? null,
        depthTag: parsed?.depthTag ?? null,
        contentPreview:
          typeof parsed?.content === 'string'
            ? parsed.content.slice(0, 120)
            : null,
        beatsCount: Array.isArray(parsed?.beats) ? parsed.beats.length : null,
        rawPreview: result.content.slice(0, 300),
      });
    }

    if (result.parsed) {
      return Response.json(result.parsed);
    }

    if (isToolDebugEnabled) {
      console.warn('[tool-debug] falling back because AI response was not parseable', {
        identityId,
        storyNodeId,
        toolId,
        rawPreview: result.content.slice(0, 500),
      });
    }

    return Response.json(emptyDepthResult());
  } catch (error) {
    console.error('Tool depth error:', error);
    return Response.json(emptyDepthResult());
  }
}
