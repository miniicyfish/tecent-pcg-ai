import { coreCharacters, identities } from './worldbuilding';

const characterAliases: Record<string, string> = {
  范府少爷: '范闲',
  范公子: '范闲',
  周掌柜: '周福生',
  孙哥: '孙有德',
};

const supportingAvatars: Record<string, string> = {
  老李: '/pixels/commoner-man.png',
  户部小吏甲: '/pixels/sun-youde.png',
  户部小吏乙: '/pixels/sun-youde.png',
  鉴查院官差: '/pixels/guard.png',
  一处探子: '/pixels/wang-qinian.png',
  资深文书陈三: '/pixels/sun-youde.png',
  资深文书马四: '/pixels/sun-youde.png',
  老文书刘大人: '/pixels/sun-youde.png',
  新来的文书小周: '/pixels/sun-youde.png',
  管家赵叔: '/pixels/fan-jian.png',
  黑衣护卫: '/pixels/guard.png',
  杂役老孙: '/pixels/liu-an.png',
  伙计小张: '/pixels/commoner-man.png',
  面生客人: '/pixels/suspicious-man.png',
  路人: '/pixels/commoner-man.png',
};

export function getCharacterAvatar(character: string): string | null {
  const normalized = characterAliases[character] || character;
  const identity = identities.find((item) => item.name === normalized);
  if (identity) return identity.avatar;

  const coreCharacter = coreCharacters.find((item) => item.name === normalized);
  if (coreCharacter) return coreCharacter.avatar;

  return supportingAvatars[character] || null;
}

const storyBackgrounds: Record<string, string> = {
  teahouse_01: '/pixels/teahouse-morning.png',
  teahouse_02: '/pixels/teahouse.png',
  teahouse_03: '/pixels/teahouse-suspicious.png',
  teahouse_04: '/pixels/niulan-chaos.png',
  teahouse_05: '/pixels/niulan-aftermath.png',
  teahouse_06: '/pixels/teahouse-interrogation.png',
  teahouse_07: '/pixels/teahouse.png',
};

export function getSceneBackground(
  identityId: string,
  sceneTag: string,
  storyNodeId?: string
): string {
  if (storyNodeId && storyBackgrounds[storyNodeId]) {
    return storyBackgrounds[storyNodeId];
  }
  if (identityId === 'clerk') return '/pixels/jianchayuan-room.png';
  if (identityId === 'servant') return '/pixels/fanfu-courtyard.png';
  if (sceneTag === '风暴' || sceneTag === '余波') {
    return '/pixels/niulan-aftermath.png';
  }
  if (sceneTag === '暗流') return '/pixels/niulan-street.png';
  return '/pixels/teahouse.png';
}
