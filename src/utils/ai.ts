import type { ReadingInput, ReadingResult } from './readings'
import { generateLocalReading } from './readings'
import type { Orientation, TarotCard } from '../data/tarot'

const env = import.meta.env as Record<string, string | undefined>
const API_KEY = env.VITE_AI_API_KEY ?? ''
const BASE_URL = env.VITE_AI_BASE_URL ?? ''
const MODEL = env.VITE_AI_MODEL ?? 'gpt-4o-mini'

export function isAIConfigured(): boolean {
  return Boolean(API_KEY && BASE_URL)
}

function buildPrompt(input: ReadingInput): string {
  const cardsText = input.cards
    .map((item, i) => {
      const pos = input.spread.positions[i]?.label ?? `牌位 ${i + 1}`
      const c: TarotCard = item.card
      const o: Orientation = item.orientation
      return `${i + 1}. 牌位「${pos}」：${c.name}（${c.nameEn}，${o === 'upright' ? '正位' : '逆位'}，关键词：${c.keywords.join('、')}）`
    })
    .join('\n')
  return `牌阵：${input.spread.name}（${input.spread.desc}）
问题：${input.question || '（未提供，做通用指引）'}
抽到的牌：
${cardsText}

请作为塔罗师给出解读。`
}

export async function requestAIReading(input: ReadingInput): Promise<ReadingResult> {
  if (!isAIConfigured()) return generateLocalReading(input)

  const system = `你是一位神秘、温和的塔罗师。请用中文以塔罗师口吻解读牌阵，输出结构化 JSON，字段：
{"perCard":[{"position":"牌位名","cardName":"牌名","orientation":"upright|reversed","keywords":["关键词"],"text":"2-3 句解读"}],"summary":"综合解读（3-5 句）","action":"行动提示（1-2 句）","reflection":"一个供用户反思的问题"}
约束：语气神秘温和、鼓励自我探索；禁止医疗诊断、投资理财建议、法律意见等绝对化断言；不要声称预测确定的未来。只输出 JSON，不要多余文本。`

  try {
    const res = await fetch(`${BASE_URL.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: buildPrompt(input) },
        ],
        temperature: 0.8,
      }),
    })
    if (!res.ok) throw new Error(`AI 请求失败：HTTP ${res.status}`)
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
    const content = data.choices?.[0]?.message?.content
    if (!content) throw new Error('AI 返回为空')

    const jsonText = content.replace(/```json|```/g, '').trim()
    const start = jsonText.indexOf('{')
    const end = jsonText.lastIndexOf('}')
    if (start === -1 || end === -1) throw new Error('AI 返回格式异常')
    const parsed = JSON.parse(jsonText.slice(start, end + 1)) as Partial<ReadingResult>

    const perCard = (parsed.perCard ?? []).map((c, i) => ({
      position: c.position ?? input.spread.positions[i]?.label ?? `牌位 ${i + 1}`,
      cardName: c.cardName ?? input.cards[i]?.card.name ?? '',
      orientation: (c.orientation === 'reversed' ? 'reversed' : 'upright') as Orientation,
      keywords: Array.isArray(c.keywords) ? c.keywords : [],
      text: c.text ?? '',
    }))
    if (perCard.length === 0 || !parsed.summary) throw new Error('AI 返回字段不完整')

    return {
      perCard,
      summary: parsed.summary,
      action: parsed.action ?? '',
      reflection: parsed.reflection ?? '',
      aiGenerated: true,
    }
  } catch {
    // AI 失败时静默回退本地解读
    return generateLocalReading(input)
  }
}
