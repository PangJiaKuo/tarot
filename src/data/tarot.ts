export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles'

export interface TarotCard {
  id: number
  name: string
  nameEn: string
  arcana: 'major' | 'minor'
  suit: Suit | null
  number: number | null
  roman: string
  keywords: string[]
  upright: string
  reversed: string
  symbol: string
  color: string
}

export type Orientation = 'upright' | 'reversed'

export interface SpreadPosition {
  label: string
  pos: [number, number]
}

export interface SpreadDef {
  id: string
  name: string
  desc: string
  positions: SpreadPosition[]
}

export const SPREADS: SpreadDef[] = [
  {
    id: 'single',
    name: '单张指引',
    desc: '抽取一张牌，聚焦当下最需要看见的讯息。',
    positions: [{ label: '指引', pos: [0, 0.1] }],
  },
  {
    id: 'three',
    name: '时间之流',
    desc: '过去、现在与未来，三张牌勾勒事件的流动脉络。',
    positions: [
      { label: '过去', pos: [-1.75, 0.1] },
      { label: '现在', pos: [0, 0.1] },
      { label: '未来', pos: [1.75, 0.1] },
    ],
  },
  {
    id: 'choice',
    name: '二选一',
    desc: '面临抉择时，两张牌分别呈现两条路的样貌。',
    positions: [
      { label: '选项 A', pos: [-1.25, 0.1] },
      { label: '选项 B', pos: [1.25, 0.1] },
    ],
  },
]

const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI']

interface MajorSeed {
  name: string
  nameEn: string
  keywords: string[]
  upright: string
  reversed: string
  symbol: string
  color: string
}

const MAJORS: MajorSeed[] = [
  { name: '愚者', nameEn: 'The Fool', keywords: ['新起点', '自由', '冒险'], upright: '一段全新的旅程正在你面前展开。带着信任与好奇迈出第一步，宇宙总会接住那颗愿意跳跃的心。', reversed: '脚步悬在半空，或许是冲动，或许是准备不足。先回到地面看看脚下，再谈飞翔也不迟。', symbol: 'ᛟ', color: '#ffd45c' },
  { name: '魔术师', nameEn: 'The Magician', keywords: ['显化', '资源', '意志'], upright: '你手中已握有所需的一切工具。专注于意图，把想法一字一句变成现实，此刻的显化力最为强大。', reversed: '才能暂时散落一地，或被用错了方向。诚实地检视自己的动机，再重新拾起属于你的魔杖。', symbol: '☿', color: '#7ef0d0' },
  { name: '女祭司', nameEn: 'The High Priestess', keywords: ['直觉', '奥秘', '内在'], upright: '答案不在喧嚣处，而在帷幕之后的静默里。信任第一直觉，你的内在深处早已知晓。', reversed: '内在的声音被外界的噪音盖住了。给自己一段独处的时间，让直觉重新浮出水面。', symbol: '☽', color: '#9d7bff' },
  { name: '皇后', nameEn: 'The Empress', keywords: ['丰盛', '滋养', '创造'], upright: '生命正以温柔而丰饶的方式回应你。照顾好自己与所爱之人，创造力会自然开花结果。', reversed: '过度付出或忽视自我滋养，让丰饶的土壤暂时贫瘠。先为自己浇一壶水吧。', symbol: '♀', color: '#ff9ad5' },
  { name: '皇帝', nameEn: 'The Emperor', keywords: ['秩序', '稳固', '权威'], upright: '以结构与纪律筑起你的城池。此刻适合立下规矩、承担责任，稳扎稳打胜过投机取巧。', reversed: '控制欲或僵化的规则开始松动根基。真正的力量是柔韧的，试着松开紧握的拳头。', symbol: '♈', color: '#ff6a5e' },
  { name: '教皇', nameEn: 'The Hierophant', keywords: ['传统', '指引', '学习'], upright: '向经验与智慧致敬。寻求一位良师或一套经过验证的方法，传统的力量会为你指路。', reversed: '既有的教条不再适合你。允许自己走一条未被批准的路，答案可能就在规则之外。', symbol: '♉', color: '#ffc46b' },
  { name: '恋人', nameEn: 'The Lovers', keywords: ['关系', '选择', '融合'], upright: '心与心的共振正在发生。真诚地表达感受，在关系中做出忠于内心的选择。', reversed: '价值观的错位或犹豫不决让心绪失衡。先与自己和解，才能与他人真正相拥。', symbol: '♂', color: '#ff7ab8' },
  { name: '战车', nameEn: 'The Chariot', keywords: ['意志', '前行', '掌控'], upright: '握紧缰绳，向目标全速前进。对立的力量可以被你整合为动力，胜利属于坚定者。', reversed: '方向盘暂时失灵，内在的拉扯让前进变成打转。先统一内心的声音，再出发。', symbol: '♋', color: '#6bb8ff' },
  { name: '力量', nameEn: 'Strength', keywords: ['勇气', '柔韧', '驯服'], upright: '真正的力量是温柔的。以耐心与慈悲面对内心的野兽，你会发现自己比想象中强大。', reversed: '自我怀疑或急躁正在消耗你的能量。对自己温柔一点，勇气需要被滋养而非逼迫。', symbol: '♌', color: '#ffb84d' },
  { name: '隐士', nameEn: 'The Hermit', keywords: ['内省', '寻求', '独处'], upright: '提着灯，走进自己的内在山洞。暂别人群的喧嚣，孤独中藏着此刻最珍贵的答案。', reversed: '避世太久，灯火快要熄灭。允许他人靠近，答案有时也会从别人的口中说出。', symbol: '♍', color: '#8ea8ff' },
  { name: '命运之轮', nameEn: 'Wheel of Fortune', keywords: ['转折', '周期', '机遇'], upright: '命运之轮开始转动，一个新的周期正在开启。顺势而为，机会偏爱准备好的人。', reversed: '轮子似乎卡在了低点。请记得周期终会流转，此刻的沉淀是下一次上升的伏笔。', symbol: '♃', color: '#7ce7a2' },
  { name: '正义', nameEn: 'Justice', keywords: ['公平', '因果', '权衡'], upright: '天平正在称量。诚实地面对因与果，公正的抉择会带来长久的安宁。', reversed: '天平有所倾斜，或许有未被承认的失衡。诚实审视自己的责任，别让借口蒙蔽双眼。', symbol: '♎', color: '#c9d8ff' },
  { name: '倒吊人', nameEn: 'The Hanged Man', keywords: ['悬停', '换位', '放下'], upright: '换个角度看世界。此刻的暂停不是停滞，而是以颠倒的视野换取通透的领悟。', reversed: '悬停太久，成了逃避。若牺牲不再有意义，是时候把自己放下来了。', symbol: '♆', color: '#a0f0ff' },
  { name: '死神', nameEn: 'Death', keywords: ['结束', '转化', '重生'], upright: '一扇门正在关闭，以便另一扇门打开。允许旧的告别，蜕变的痛苦之后是崭新的生命。', reversed: '紧握着已经枯萎的枝条。抗拒改变只会延长阵痛，放手本身就是一种重生。', symbol: '♏', color: '#b0a8ff' },
  { name: '节制', nameEn: 'Temperance', keywords: ['平衡', '调和', '流动'], upright: '如天使调和两盏圣杯，中道是最深的智慧。慢慢来，让不同的元素在你身上融合。', reversed: '失衡或过度正在悄悄累积。审视生活中被忽略的那一端，重新校准自己的节奏。', symbol: '♐', color: '#7dd8c0' },
  { name: '恶魔', nameEn: 'The Devil', keywords: ['束缚', '欲望', '阴影'], upright: '看清那些锁链——你会发现它们并未真正锁死。直面自己的欲望与执念，是自由的第一步。', reversed: '锁链正在松动。觉察带来解脱，你正一步步从旧有的模式中走出。', symbol: '♑', color: '#c07bff' },
  { name: '高塔', nameEn: 'The Tower', keywords: ['骤变', '崩解', '觉醒'], upright: '雷霆击中高塔，旧结构轰然倒塌。虽然剧烈，但这正是拆除虚假根基的觉醒时刻。', reversed: '你在悬崖边缘勉强稳住。与其恐惧崩塌，不如主动拆掉那些早已摇摇欲坠的部分。', symbol: '♒', color: '#ff5c5c' },
  { name: '星星', nameEn: 'The Star', keywords: ['希望', '疗愈', '信念'], upright: '风暴过后，星空温柔地亮起。希望正在回归，让信念如泉水般静静滋养你的伤口。', reversed: '信心暂时蒙尘，星光显得黯淡。请记得星星一直都在，只是云层恰好路过。', symbol: '♓', color: '#7ce0ff' },
  { name: '月亮', nameEn: 'The Moon', keywords: ['潜意识', '迷雾', '想象'], upright: '月光下的路影影绰绰。不是所有事都需要立刻看清，与不安共处，穿过迷雾即是黎明。', reversed: '迷雾开始散去，一些幻觉与恐惧正在瓦解。真实的图景正一点点浮现。', symbol: '☾', color: '#c9b8ff' },
  { name: '太阳', nameEn: 'The Sun', keywords: ['喜悦', '活力', '成功'], upright: '阳光普照，万物明朗。此刻的成功与喜悦是真实而温暖的，尽情沐浴其中吧。', reversed: '阳光被云层稍稍遮挡。喜悦仍在，只是你需要先拨开内心的阴霾去迎接它。', symbol: '☉', color: '#ffd45c' },
  { name: '审判', nameEn: 'Judgement', keywords: ['觉醒', '召唤', '清算'], upright: '号角吹响，一次深刻的自我审判与觉醒正在到来。回应那个更高的召唤，重生就在眼前。', reversed: '你听见了号角，却迟迟不愿起身。旧的账目需要清算，自我宽恕是觉醒的钥匙。', symbol: '♇', color: '#ffc0a0' },
  { name: '世界', nameEn: 'The World', keywords: ['完成', '圆满', '整合'], upright: '一个完整的周期圆满落幕。庆祝你的成就，把经验织入生命，然后带着祝福开启新篇。', reversed: '终点近在咫尺，却还差最后一块拼图。收尾的耐心决定这段旅程的完整度。', symbol: '♄', color: '#ffe9a0' },
]

interface SuitMeta {
  suit: Suit
  name: string
  nameEn: string
  symbol: string
  color: string
  element: string
  theme: string
}

const SUITS: SuitMeta[] = [
  { suit: 'wands', name: '权杖', nameEn: 'Wands', symbol: '♣', color: '#ff7a3c', element: '火', theme: '行动、热情与创造' },
  { suit: 'cups', name: '圣杯', nameEn: 'Cups', symbol: '♥', color: '#4fb8ff', element: '水', theme: '情感、关系与心灵' },
  { suit: 'swords', name: '宝剑', nameEn: 'Swords', symbol: '♠', color: '#b9c6ff', element: '风', theme: '思想、沟通与冲突' },
  { suit: 'pentacles', name: '星币', nameEn: 'Pentacles', symbol: '♦', color: '#ffd45c', element: '土', theme: '物质、工作与现实' },
]

const NUM_CN = ['', '王牌', '二', '三', '四', '五', '六', '七', '八', '九', '十']
const NUM_EN = ['', 'Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']
const NUM_ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
const COURT_CN = ['侍从', '骑士', '王后', '国王']
const COURT_EN = ['Page', 'Knight', 'Queen', 'King']
const COURT_ROMAN = ['P', 'Kn', 'Q', 'K']

type RankMeaning = { kw: string[]; up: string; rev: string }

const SUIT_MEANINGS: Record<Suit, RankMeaning[]> = {
  wands: [
    { kw: ['灵感', '开创', '热情'], up: '新的火种已经点燃，一个充满潜力的开端正等着你投入热情。', rev: '火花暂时受潮，方向也未明朗。回到初衷，找回真正让你发热的渴望。' },
    { kw: ['规划', '远见', '抉择'], up: '你站在起点眺望世界，清晰的规划会让这艘船驶向想去的地方。', rev: '计划悬而未决，对未知的担忧让你停在码头。小步试探胜过完美的蓝图。' },
    { kw: ['拓展', '进展', '远行'], up: '先前的努力已见雏形，船只离港。保持开阔的视野，拓展正当其时。', rev: '进展比预期缓慢，或遭遇延误。检视航向，别让急躁掀翻已搭好的骨架。' },
    { kw: ['稳固', '庆祝', '归乡'], up: '桥梁已经搭好，根基稳如磐石。庆祝阶段性的成果，你值得这份安稳。', rev: '庆典被推迟，安稳感出现裂痕。修补基础比急于落成更重要。' },
    { kw: ['竞争', '冲突', '摩擦'], up: '观点的碰撞带来张力。把竞争当作磨刀石，在摩擦中看见自己真正的立场。', rev: '冲突开始内耗，或你回避了必要的交锋。诚实面对分歧，别让情绪代替沟通。' },
    { kw: ['认可', '胜利', '荣誉'], up: '胜利的桂冠正在靠近。你的努力将被看见，大方接受属于你的认可。', rev: '掌声迟迟未来，或你不敢站上领奖台。价值不由他人定义，继续耕耘。' },
    { kw: ['防守', '坚持', '立场'], up: '你正守卫重要的阵地。坚定立场，但留意高处是否还有未被注意的来敌。', rev: '防线疲惫，或固执成了枷锁。分辨值得坚守的与可以放下的。' },
    { kw: ['速度', '讯息', '行动'], up: '箭已离弦，事情将以出人意料的速度推进。保持敏锐，跟上节奏。', rev: '仓促带来混乱，或消息迟迟未至。慢一点，把方向校准再射出下一箭。' },
    { kw: ['警惕', '疲惫', '最后防线'], up: '你在经验中学会了觉察。疲惫是提醒而非终点，守住最后一段路。', rev: '过度消耗让警戒成为偏执。放下随时应战的状态，允许自己休息。' },
    { kw: ['重负', '压力', '超载'], up: '肩上的担子接近极限。重新分配责任，或学会把一部分放回地面。', rev: '你终于开始卸货。放下不属于你的重担，轻装才能走远。' },
    { kw: ['好奇', '学习', '新消息'], up: '像侍从一样带着好奇心打量世界，一个新的学习机会正敲你的门。', rev: '三分钟热度或消息带来干扰。挑真正点燃你的那件事深入。' },
    { kw: ['冲劲', '冒险', '魅力'], up: '骑士般的热忱席卷而来。大胆行动，你的冲劲会感染同行的人。', rev: '横冲直撞或半途熄火。为热情装上方向盘，为目标排个优先级。' },
    { kw: ['自信', '感染力', '魄力'], up: '王后的暖意与主见兼具。你既有温度也有力量，适合主持局面、温暖他人。', rev: '火气盖过了温度。把主导欲调成暖光，先听再说。' },
    { kw: ['远见', '领导', '开拓'], up: '王者般的视野让你看见常人未见的远方。以愿景引领，以行动兑现。', rev: '固执或急躁模糊了远方。倾听幕僚的声音，王者也需要镜子。' },
  ],
  cups: [
    { kw: ['心开启', '爱', '丰沛'], up: '情感之杯满溢。新的情感或灵感正在流入，敞开心去接住它。', rev: '杯子倾倒或干涸。让情绪流动起来，堵塞的爱需要一个新的出口。' },
    { kw: ['伙伴', '吸引', '连结'], up: '一段投缘的关系或合作正在萌发。相互欣赏的目光已经相遇。', rev: '关系里出现微妙的失衡。先找回自己的节拍，再与人共舞。' },
    { kw: ['欢聚', '友谊', '庆祝'], up: '与在意的人共享喜悦。朋友圈的温暖会为你重新注满能量。', rev: '热闹散场后的空虚，或圈子里的小摩擦。真正的陪伴不在人数。' },
    { kw: ['倦怠', '重新评估', '错过'], up: '一只杯子被递来，你却提不起兴趣。重新评估什么是你真正想要的。', rev: '你开始留意那只曾被错过的杯子。新的邀请值得再看一眼。' },
    { kw: ['失落', '哀悼', '接纳'], up: '有杯倾倒，悲伤是真实的。允许自己哀悼，然后数一数还立着的杯子。', rev: '你正从失落中缓缓走出。接纳与释怀让杯子重新站稳。' },
    { kw: ['回忆', '纯真', '善意'], up: '来自过去或童年的温柔记忆浮现。带着纯真的善意去相见与和好。', rev: '活在过去的光环里。让回忆成为养分而非居所。' },
    { kw: ['幻象', '选择', '渴望'], up: '七个杯子盛着七种幻想。分辨渴望与幻想，只取真正滋养你的那一杯。', rev: '迷雾散去，选项变得清晰。是时候做出清醒的取舍了。' },
    { kw: ['离开', '寻找', '更深的意义'], up: '收拾行囊去寻找更深刻的意义。现在的离开，是为了更完整的归来。', rev: '想走却迟迟未动身。听见内心的呼唤，就给它一个出发的日期。' },
    { kw: ['满足', '心愿', '安宁'], up: '愿望之杯在星光下闪耀。你真诚的愿望正在被回应，安心收下这份满足。', rev: '满足感打了折扣。检查愿望是否出自本心，而非他人的期待。' },
    { kw: ['圆满', '归属', '喜悦'], up: '情感世界迎来丰收与团圆。爱与归属的能量环绕着你。', rev: '表面的圆满下藏着未说出口的心事。让真话上桌，圆才算真的圆。' },
    { kw: ['感性', '直觉', '萌芽'], up: '心之旅程的起点。一段细腻的情感或灵感的萌芽悄然出现。', rev: '情绪化或白日梦占据上风。给感受一个创意的出口。' },
    { kw: ['浪漫', '理想', '追寻'], up: '理想主义的骑士出发了。带着浪漫与真诚去追寻心中的圣杯。', rev: '理想与现实的落差让人失落。让梦想落地成一个个小步骤。' },
    { kw: ['共情', '包容', '慈爱'], up: '如海般包容的爱。你的共情力正抚慰他人，也请同样善待自己。', rev: '共情过载或情绪泛滥。先照顾自己的水位，再溢向他人。' },
    { kw: ['沉稳', '外交', '平衡'], up: '情感与理智达成优雅的平衡。你既能倾听也能决断，是安定的力量。', rev: '压抑情感换取表面平稳。掀开壶盖看看，感受需要出口。' },
  ],
  swords: [
    { kw: ['清明', '突破', '真相'], up: '一柄新剑破空而出。思维格外清明，真相愿意在此刻显现。', rev: '思绪混沌或真相扑朔迷离。先磨利自己的思考，再挥出这一剑。' },
    { kw: ['僵局', '权衡', '岔路'], up: '蒙眼持剑的岔路口。收集更多信息，但别让权衡变成无尽的犹豫。', rev: '僵局出现松动。迟来的信息让你终于能放下其一，选定一方。' },
    { kw: ['心痛', '真相', '释怀'], up: '心口插着剑，但雨终会停。疼痛的真相带来成长，转身即是释怀。', rev: '疗愈开始，剑正在拔出。旧伤结痂，你比之前更懂自己。' },
    { kw: ['休整', '喘息', '恢复'], up: '在战场废墟上小憩。允许自己暂停，恢复是战略的一部分。', rev: '休息不足让你无法重返战场。真实的休息不是刷手机，而是真正躺平。' },
    { kw: ['胜利', '代价', '清算'], up: '你赢得了这一局，却也有说不出的怅然。盘点代价，然后体面地收兵。', rev: '旧账未清，新的摩擦又起。彻底了结，才能避免下次开战。' },
    { kw: ['迁移', '过渡', '告别'], up: '渡河而去，告别熟悉的此岸。新的视角在对岸等你。', rev: '困在原地或滞留于旧模式。船票在手，只等你决定登船。' },
    { kw: ['策略', '机敏', '迂回'], up: '以智取胜的时刻。迂回与策略比正面硬刚更有效。', rev: '小聪明反被聪明误。坦诚有时是最快的捷径。' },
    { kw: ['束缚', '自设', '视角'], up: '捆绑你的绳索多半出自自己之手。换个信念，枷锁即刻松动。', rev: '你正在给自己松绑。觉察让旧的思维模式瓦解。' },
    { kw: ['焦虑', '噩梦', '担忧'], up: '深夜的忧虑在放大。把担忧写在纸上，天亮再看，多半没有想象中可怕。', rev: '焦虑的浓雾开始消散。你正在从噩梦的剧情里醒来。' },
    { kw: ['终结', '谷底', '黎明前'], up: '最坏的已经过去。谷底是坚实的地面，从这里只能向上。', rev: '你正从谷底缓慢爬起，却仍频频回头。向前看，黎明就在下个转角。' },
    { kw: ['警觉', '观察', '学习'], up: '睁大眼睛观察棋局。此刻多看少动，信息就是你的力量。', rev: '过度防备让你错过真诚。允许自己相信一次。' },
    { kw: ['直率', '急智', '交锋'], up: '言辞如剑般锋利而迅捷。用你的机敏为公义发声，而非逞口舌之快。', rev: '话如刀锋伤人伤己。发言前先在心里过一遍。' },
    { kw: ['界限', '清醒', '独立'], up: '以清醒的头脑设立界限。真正的慈悲带着锋利的智慧。', rev: '冷言冷语筑起高墙。把心门开一条缝，让别人看见柔软。' },
    { kw: ['理性', '决断', '权威'], up: '如大法官般理性决断。用逻辑与原则做出艰难但正确的裁定。', rev: '过度理性让决定失去人味。把心也请进会议室。' },
  ],
  pentacles: [
    { kw: ['机遇', '种子', '富足'], up: '一枚金币从天而降，握住这个新的机会。播种的时刻到了，丰足可期。', rev: '机会在指尖打转却未落地。理清现实的条件，再伸手接住它。' },
    { kw: ['变通', '平衡', '杂耍'], up: '同时抛接两枚金币，你在多线事务中寻找平衡。节奏感是你的超能力。', rev: '球越抛越多，快要接不住。优先级是唯一的解药，学会说不了。' },
    { kw: ['协作', '工艺', '精进'], up: '三人同心，其利断金。向高手请教，把技艺打磨到发光。', rev: '合作里有人掉链子或标准参差。对齐目标与水准，再一起动工。' },
    { kw: ['守成', '节俭', '安全感'], up: '紧紧护住已有的成果。此刻求稳不是保守，而是智慧。', rev: '过度紧握让金币生锈。安全感来自流动，不是囤积。' },
    { kw: ['匮乏', '信仰', '互助'], up: '物质暂时短缺，但窗外的星光仍在。接受帮助，也相信匮乏是暂时的。', rev: '你正走出困顿。资源在回归，分享会让你更快复原。' },
    { kw: ['慷慨', '给予', '回馈'], up: '施与受的天平优雅摆动。慷慨流通时，丰裕会以意想不到的方式回流。', rev: '付出与回报暂时失衡。检查你的给予是否出自心甘情愿。' },
    { kw: ['耐心', '评估', '等待'], up: '耕耘后的等待。收成有时辰，急不来的果子最甜。', rev: '投入与产出不成正比。诚实评估，该止损时果断止损。' },
    { kw: ['勤勉', '专注', '磨练'], up: '日复一日的专注打磨出真功夫。重复是通往精通的唯一道路。', rev: '机械化让你失去热情。为重复注入一点新意与目标感。' },
    { kw: ['自足', '舒适', '享受'], up: '葡萄藤下的小憩，你已挣得这份闲适。享受劳动的果实，理直气壮。', rev: '安逸成了软茧。舒适圈外，还有你想去的地方吗？' },
    { kw: ['遗产', '传承', '长久'], up: '家族之树硕果累累。你正参与或建立某种可以传承的稳固事物。', rev: '传统或关系出现裂痕。修补根基，比装饰枝叶更要紧。' },
    { kw: ['踏实', '学习', '起步'], up: '从一枚硬币开始，脚踏实地地学。慢即是快，稳稳开局。', rev: '基础不牢或动力不足。把大目标切成今天就能做的一小步。' },
    { kw: ['可靠', '务实', '推进'], up: '不疾不徐，稳扎稳打。你的可靠正是团队需要的压舱石。', rev: '墨守成规或原地打转。抬眼看路，方法可以更聪明一点。' },
    { kw: ['滋养', '务实', '自然'], up: '如大地般务实的关怀。用具体的行动去滋养人与事，事半功倍。', rev: '忙于俗务忘了生活本身。留一块时间给花园与内心。' },
    { kw: ['丰盛', '成就', '掌控'], up: '金币上的五角星熠熠生辉。物质与现实层面迎来丰收，你有资格享受它。', rev: '富有却不安，或守财而不流。重新定义属于你的丰盛。' },
  ],
}

const COURT_OFFSET = 10

function buildMinors(): TarotCard[] {
  const cards: TarotCard[] = []
  let id = 22
  for (const meta of SUITS) {
    const meanings = SUIT_MEANINGS[meta.suit]
    for (let n = 1; n <= 14; n++) {
      const m = meanings[n - 1]
      const isCourt = n > COURT_OFFSET
      const name = isCourt
        ? `${meta.name}${COURT_CN[n - COURT_OFFSET - 1]}`
        : `${meta.name}${NUM_CN[n]}`
      const nameEn = isCourt
        ? `${COURT_EN[n - COURT_OFFSET - 1]} of ${meta.nameEn}`
        : `${NUM_EN[n]} of ${meta.nameEn}`
      const roman = isCourt ? COURT_ROMAN[n - COURT_OFFSET - 1] : NUM_ROMAN[n]
      const kw = [m.kw[0], meta.element, m.kw[1] ?? meta.theme.slice(0, 2)]
      cards.push({
        id,
        name,
        nameEn,
        arcana: 'minor',
        suit: meta.suit,
        number: n,
        roman,
        keywords: kw,
        upright: `${m.up}（${meta.theme}的课题正以「${m.kw[0]}」的姿态呈现。）`,
        reversed: `${m.rev}（${meta.element}元素的能量暂时受阻，允许它慢慢恢复流动。）`,
        symbol: meta.symbol,
        color: meta.color,
      })
      id++
    }
  }
  return cards
}

export const MAJOR_ARCANA: TarotCard[] = MAJORS.map((m, i) => ({
  id: i,
  name: m.name,
  nameEn: m.nameEn,
  arcana: 'major' as const,
  suit: null,
  number: i,
  roman: ROMAN[i],
  keywords: m.keywords,
  upright: m.upright,
  reversed: m.reversed,
  symbol: m.symbol,
  color: m.color,
}))

export const MINOR_ARCANA: TarotCard[] = buildMinors()

export const TAROT_DECK: TarotCard[] = [...MAJOR_ARCANA, ...MINOR_ARCANA]

export function getCardById(id: number): TarotCard {
  return TAROT_DECK[id] ?? TAROT_DECK[0]
}
