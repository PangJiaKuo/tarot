import type { Orientation, SpreadDef, TarotCard } from '../data/tarot'

export interface CardReading {
  position: string
  cardName: string
  orientation: Orientation
  keywords: string[]
  text: string
}

export interface ReadingResult {
  perCard: CardReading[]
  summary: string
  action: string
  reflection: string
  aiGenerated: boolean
}

export interface ReadingInput {
  spread: SpreadDef
  question: string
  cards: { card: TarotCard; orientation: Orientation }[]
}

interface DomainHint {
  match: RegExp
  name: string
  intro: string
}

const DOMAINS: DomainHint[] = [
  { match: /工作|事业|职业|跳槽|升职|面试|项目|创业/, name: '事业', intro: '关于事业的走向' },
  { match: /感情|爱情|恋爱|暗恋|分手|表白|伴侣|婚姻/, name: '感情', intro: '关于感情的流动' },
  { match: /金钱|财运|投资|理财|收入|债务|钱/, name: '财富', intro: '关于财富与现实的根基' },
  { match: /学习|考试|学业|论文|升学|考证/, name: '学业', intro: '关于学业的进益' },
  { match: /健康|身体|睡眠|疲惫|康复/, name: '身心', intro: '关于身心的状态' },
  { match: /家庭|家人|父母|孩子|亲情/, name: '家庭', intro: '关于家庭的连结' },
  { match: /旅行|搬家|迁徙|远方|出行/, name: '远方', intro: '关于远方的计划' },
  { match: /选择|抉择|要不要|该不该|哪条路/, name: '抉择', intro: '关于眼前的抉择' },
]

function detectDomain(question: string): DomainHint | null {
  for (const d of DOMAINS) {
    if (d.match.test(question)) return d
  }
  return null
}

const POSITION_OPENERS: Record<string, string[]> = {
  指引: ['此刻星象为你指向', '牌灵带来的核心讯息是', '当下最需要看见的'],
  过去: ['过往的星轨上', '回望来路', '在过去的位置'],
  现在: ['此时此地', '当下正上演的是', '现在照亮你的是'],
  未来: ['前方的星图上', '若保持当前的航向', '未来的位置浮现'],
  '选项 A': ['A 这条路上', '选项 A 的样貌是', '若选择 A'],
  '选项 B': ['B 这条路上', '选项 B 的样貌是', '若选择 B'],
}

function openerFor(position: string): string {
  const pool = POSITION_OPENERS[position] ?? POSITION_OPENERS['指引']
  return pool[Math.floor(Math.random() * pool.length)]
}

function domainPhrase(domain: DomainHint | null, orientation: Orientation): string {
  if (!domain) {
    return orientation === 'upright'
      ? '能量整体顺畅，这与你的直觉方向一致。'
      : '能量有些淤塞，提醒你放慢脚步，先理清内在。'
  }
  if (orientation === 'upright') {
    return `在${domain.name}的课题上，这股能量是助推的：顺着它行动，会比对抗轻松得多。`
  }
  return `在${domain.name}的课题上，这股能量提示阻力：也许需要调整方法，而非加倍用力。`
}

export function generateLocalReading(input: ReadingInput): ReadingResult {
  const domain = detectDomain(input.question)
  const perCard: CardReading[] = input.cards.map((item, i) => {
    const position = input.spread.positions[i]?.label ?? `牌位 ${i + 1}`
    const { card, orientation } = item
    const base = orientation === 'upright' ? card.upright : card.reversed
    const opener = openerFor(position)
    const kwLine = `「${card.name}」（${card.keywords.join('、')}）`
    const text = `${opener}${kwLine}。${base}${domainPhrase(domain, orientation)}`
    return { position, cardName: card.name, orientation, keywords: card.keywords, text }
  })

  const uprightCount = input.cards.filter((c) => c.orientation === 'upright').length
  const reversedCount = input.cards.length - uprightCount
  const suitCount: Record<string, number> = {}
  input.cards.forEach((c) => {
    if (c.card.suit) suitCount[c.card.suit] = (suitCount[c.card.suit] ?? 0) + 1
  })
  const dominantSuit = Object.entries(suitCount).sort((a, b) => b[1] - a[1])[0]?.[0]
  const majors = input.cards.filter((c) => c.card.arcana === 'major').length

  const parts: string[] = []
  parts.push(
    `本次牌阵呈现 ${uprightCount} 张正位、${reversedCount} 张逆位。${
      uprightCount > reversedCount
        ? '整体能量偏向流动与展开，时机对你较为友好。'
        : reversedCount > uprightCount
          ? '逆位偏多，宇宙建议你先向内梳理，再向外行动。'
          : '正逆位势均力敌，此刻正处在一个微妙的平衡点，选择权在你手中。'
    }`,
  )
  if (majors >= 2) {
    parts.push('大阿卡纳占比很高，说明这段时期触及的是命运层面的课题——顺流而行的同时，保持觉察。')
  }
  if (dominantSuit === 'wands') parts.push('权杖的能量炽热，行动与热情是关键词，别让想法只在脑内燃烧。')
  if (dominantSuit === 'cups') parts.push('圣杯的能量温柔，感受与关系是核心，倾听内心比分析利弊更有帮助。')
  if (dominantSuit === 'swords') parts.push('宝剑的能量清冽，思维与沟通是主轴，把话说清楚、把事想明白。')
  if (dominantSuit === 'pentacles') parts.push('星币的能量沉稳，现实与积累是基调，一步一步来反而最快。')
  if (domain) parts.push(`${domain.intro}，牌面建议以觉察代替焦虑：你无法控制星象，但可以调整风帆。`)

  const summary = parts.join(' ')

  const kwPool = input.cards.flatMap((c) => c.card.keywords)
  const kw = kwPool[Math.floor(Math.random() * kwPool.length)]
  const action =
    input.cards.some((c) => c.orientation === 'reversed')
      ? `先做一件小事校准状态：写下此刻最担心的一个念头，然后问自己「最坏又能怎样」。今日的关键词是「${kw}」，把它带进你的一整天。`
      : `顺势推进一步：今天就为你在意的事做一个具体的小动作——一封消息、一次尝试、一个约定。今日的关键词是「${kw}」，让它成为你的路标。`

  const reflection = domain
    ? `问自己：在${domain.name}这件事上，我真正渴望的结果是什么？此刻的担忧，有多少来自事实，有多少来自想象？`
    : '问自己：如果没有任何人会评价我，我会如何选择？这份牌面映照出的，是我早已知道的什么？'

  return { perCard, summary, action, reflection, aiGenerated: false }
}
