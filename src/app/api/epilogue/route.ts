// 结语生成 API

import { callAI } from '@/lib/ai';
import { buildEpilogueSystemPrompt } from '@/lib/prompts';
import { identities } from '@/lib/worldbuilding';

function fallbackEpilogue(identityId: string) {
  if (identityId === 'clerk') {
    return {
      epilogue:
        '你还是照常坐回文书房，磨墨、抄录、归档。鉴查院的灯一盏盏亮起，又一盏盏熄灭，许多名字从你笔下经过，最后变成案卷里的编号。你没有站到风暴中心，却看见了风暴经过时留下的纸屑、脚步和沉默。',
      depthSummary:
        '这一次，你从末等文书的视角看见了牛栏街事件如何在情报系统内部激起涟漪：调动、急件、封存、归档，以及每个人都不敢说出口的猜测。',
      shareText: '我在鉴查院文书房，看见了风暴的编号',
    };
  }

  if (identityId === 'servant') {
    return {
      epilogue:
        '你仍旧在天没亮时起身，扫院、搬水、巡夜。范府的门一开一合，主子们的脚步从你身边经过。你没有资格问发生了什么，却能看见一个人回来时眼神变了，看见一座府邸在沉默里收紧了呼吸。',
      depthSummary:
        '这一次，你从范府杂役的视角看见了牛栏街事件如何改变府中气息：范闲的不同、滕梓荆的警惕、深夜来客，以及风暴过后压低的脚步声。',
      shareText: '我在范府做杂役，看见少爷眼神变了',
    };
  }

  return {
    epilogue:
      '你还是照常开门、烧水、擦桌子。牛栏街的人来来往往，像什么都没发生过。但你知道，有些声音已经留在了门板缝里，有些眼神藏进了茶盏的水汽里。主角们的故事会继续往前走，而你只是站在街边，看见了水面下的一角。',
    depthSummary:
      '这一次，你从茶馆掌柜的视角看见了牛栏街事件的边缘：闲谈、踩点、混乱、排查，以及风暴过后仍留在街面上的沉默。',
    shareText: '我在牛栏街茶馆，看见了故事水下的一角',
  };
}

export async function POST(request: Request) {
  let fallbackIdentityId = 'teahouse';

  try {
    const body = await request.json();
    const { identityId, sceneHistory = [], depthHistory = [] } = body;
    fallbackIdentityId = identityId || 'teahouse';

    const identity = identities.find((i) => i.id === identityId);
    if (!identity) {
      return Response.json({ error: '未知身份' }, { status: 400 });
    }

    const systemPrompt = buildEpilogueSystemPrompt(identity);

    const userPrompt = `## 用户经历的场景
${sceneHistory.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}

## 用户使用工具发现的纵深
${depthHistory.length > 0 ? depthHistory.map((d: string) => `- ${d}`).join('\n') : '用户没有使用任何工具探索纵深。'}

请根据以上经历生成结语。直接输出JSON。`;

    const result = await callAI(systemPrompt, userPrompt, [], 0.8, 1500, 15000);

    if (result.parsed) {
      return Response.json(result.parsed);
    }

    return Response.json({
      epilogue: result.content,
      depthSummary: '',
      shareText: '我在庆国的水下世界走了一遭',
    });
  } catch (error) {
    console.error('Epilogue error:', error);
    return Response.json(fallbackEpilogue(fallbackIdentityId));
  }
}
