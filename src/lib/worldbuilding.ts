// 庆余年世界观数据 — 角色、身份、场景

export interface Identity {
  id: string;
  name: string;
  title: string;
  location: string;
  description: string;
  depthAngle: string;
  avatar: string; // 像素风头像路径
}

export interface Character {
  name: string;
  title: string;
  personality: string;
  motivation: string;
  avatar: string;
}

// 可选小人物身份
export const identities: Identity[] = [
  {
    id: 'teahouse',
    name: '周福生',
    title: '京都茶馆掌柜',
    location: '牛栏街·听风茶馆',
    description: '经营茶馆二十余年的老掌柜，见过太多起落兴衰，养成了察言观色、谨小慎微的性格。口头禅是"多听少说，茶凉了我给您续"。',
    depthAngle: '朝堂风云的民间回响、各方势力的暗线交汇',
    avatar: '/pixels/zhou-fusheng.png',
  },
  {
    id: 'clerk',
    name: '孙有德',
    title: '鉴查院末等文书',
    location: '鉴查院·文书房',
    description: '鉴查院最底层的文职人员，负责抄录、归档、传递文件。在外人眼中"在鉴查院做事"是体面的，但他自己知道日子过得战战兢兢。',
    depthAngle: '情报机构内部的暗流、上层权力斗争的碎片',
    avatar: '/pixels/sun-youde.png',
  },
  {
    id: 'servant',
    name: '刘安',
    title: '范府杂役',
    location: '范建府邸',
    description: '儋州人，与范闲是半个老乡。三年前进京在范府当杂役。正因为"透明"，反而能看到很多主子们不会注意到的东西。',
    depthAngle: '范闲不为人知的日常、府中人物的真实面貌',
    avatar: '/pixels/liu-an.png',
  },
];

// 核心角色（用于AI生成时的参考）
export const coreCharacters: Character[] = [
  {
    name: '范闲',
    title: '范府少爷',
    personality: '外表玩世不恭、随和幽默，内心敏锐、重情重义。具有现代人的平等意识，会对仆人点头致意。',
    motivation: '调查母亲叶轻眉的死亡真相，保护身边的人。',
    avatar: '/pixels/fan-xian.png',
  },
  {
    name: '陈萍萍',
    title: '鉴查院院长',
    personality: '阴鸷狠辣、心思缜密，坐轮椅。对叶轻眉有极深的忠诚，延续到对范闲的守护。',
    motivation: '守护范闲，追查叶轻眉之死的真相。',
    avatar: '/pixels/chen-pingping.png',
  },
  {
    name: '王启年',
    title: '鉴查院文书/范闲随从',
    personality: '市井气十足、爱财如命、惧内。看似滑稽，实则武功不俗、忠心耿耿。',
    motivation: '跟随范闲既是任务也是真心追随，同时有"油水"可捞。',
    avatar: '/pixels/wang-qinian.png',
  },
  {
    name: '林婉儿',
    title: '郡主/范闲未婚妻',
    personality: '温婉聪慧、知书达理，有倔强独立的一面。患有肺痨。',
    motivation: '渴望真挚的感情，不愿被当作政治棋子。',
    avatar: '/pixels/lin-waner.png',
  },
  {
    name: '范建',
    title: '司南伯/户部侍郎',
    personality: '沉稳内敛、老成持重。对范闲有真实的父爱。',
    motivation: '保护范闲平安。',
    avatar: '/pixels/fan-jian.png',
  },
  {
    name: '滕梓荆',
    title: '范闲护卫',
    personality: '沉默寡言、忠诚可靠，有妻有子的普通人。',
    motivation: '从监视范闲的任务变为真心保护挚友。',
    avatar: '/pixels/teng-zijing.png',
  },
  {
    name: '长公主',
    title: '李云睿/庆帝之妹',
    personality: '美艳妩媚、心机深沉、手段狠辣。政治野心极大。',
    motivation: '维持对内库的控制权，反对范闲进京。',
    avatar: '/pixels/princess.png',
  },
  {
    name: '二皇子',
    title: '李承泽',
    personality: '表面温文尔雅、洒脱不羁，实则城府极深、野心勃勃。',
    motivation: '夺取皇位，试图拉拢范闲为己用。',
    avatar: '/pixels/second-prince.png',
  },
];

// 工具定义
export interface Tool {
  id: string;
  name: string;
  icon: string;
  description: string;
  promptHint: string;
}

export const tools: Tool[] = [
  {
    id: 'listen',
    name: '侧耳',
    icon: '🔊',
    description: '仔细听听周围的声音',
    promptHint: '用户选择侧耳倾听。请判断当前场景中是否有值得听到的内容——角色没说出口的悄悄话、压低声音的密谈、或者潜台词。如果当前场景确实有可以听到的有价值信息，生成具体的偷听内容。如果此刻确实没什么可听的，就自然地描述"只有寻常的声音"。',
  },
  {
    id: 'recall',
    name: '追忆',
    icon: '💭',
    description: '回想相关的往事',
    promptHint: '用户选择追忆。请判断当前场景是否能触发角色的回忆——与当前事件相关的前因、之前见过的类似场景、或者别人曾经提过的相关信息。如果有值得回忆的内容，生成一段有意义的回忆。如果此刻确实没有什么关联的记忆，就自然地描述"你想了想，没有什么特别的"。',
  },
  {
    id: 'observe',
    name: '细看',
    icon: '👁',
    description: '仔细观察周围的细节',
    promptHint: '用户选择细看。请判断当前场景中是否有容易被忽略但有意义的细节——角色的微表情、不寻常的物件、环境中的异常。如果有值得注意的细节，生成具体的观察发现。如果此刻确实没什么特别的，就自然地描述"一切看起来都很寻常"。',
  },
  {
    id: 'follow',
    name: '跟随',
    icon: '👣',
    description: '跟着某个人看看',
    promptHint: '用户选择跟随。请判断当前场景中是否有值得跟随的人物——正在离开的可疑人物、行色匆匆的角色。如果有值得跟随的对象，生成跟随后看到的场景。如果此刻没有合适的跟随对象或跟随不合理，就自然地描述"你往前走了几步，但没什么特别的方向值得去"。',
  },
];
