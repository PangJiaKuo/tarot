import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { getCardBackTexture } from '../../utils/textures'
import { getAudioEngine } from '../../audio/useAudio'
import { useTarotStore } from '../../store/useTarotStore'
import { rand } from '../../utils/random'
import { TarotCard3D } from './TarotCard3D'

const CARD_W = 1.2
const CARD_H = 2
const DECK_POS = new THREE.Vector3(0, -2.6, 2.4)

/** 牌阵世界坐标：按视口宽度缩放，保证移动端放得下 */
function useSpreadTargets(): [number, number, number][] {
  const { size } = useThree()
  const spread = useTarotStore((s) => s.spread)
  return useMemo(() => {
    if (!spread) return []
    const aspect = size.width / size.height
    const visibleW = 2 * Math.tan((55 * Math.PI) / 360) * 9 * aspect
    const needed = Math.max(...spread.positions.map((p) => Math.abs(p.pos[0]) * 2 + CARD_W + 0.5), CARD_W + 1)
    const scale = Math.min(1, (visibleW * 0.9) / needed)
    return spread.positions.map((p) => [p.pos[0] * scale, p.pos[1] * scale, 0] as [number, number, number])
  }, [spread, size.width, size.height])
}

export function TarotDeck() {
  const deck = useTarotStore((s) => s.deck)
  const drawn = useTarotStore((s) => s.drawn)
  const phase = useTarotStore((s) => s.phase)
  const settings = useTarotStore((s) => s.settings)
  const revealCard = useTarotStore((s) => s.revealCard)
  const endShuffle = useTarotStore((s) => s.endShuffle)

  const targets = useSpreadTargets()
  const stackGroup = useRef<THREE.Group>(null)
  const cardRefs = useRef<(THREE.Group | null)[]>([])
  const backTex = useMemo(() => getCardBackTexture(), [])
  const backMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: backTex,
        roughness: 0.5,
        metalness: 0.3,
        emissive: new THREE.Color('#8a5cff'),
        emissiveMap: backTex,
        emissiveIntensity: 0.22,
      }),
    [backTex],
  )

  // 剩余在牌堆里的张数
  const stackCount = Math.max(0, deck.length - drawn.length)
  const shuffleActive = phase === 'shuffle'

  // 洗牌动画：散开 → 旋转 → 收拢
  useEffect(() => {
    if (!shuffleActive) return
    const g = stackGroup.current
    if (!g) return
    getAudioEngine().playShuffle()
    const tl = gsap.timeline({ onComplete: () => endShuffle() })
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const ox = rand(-3.4, 3.4)
      const oy = rand(-1.6, 2.6)
      const oz = rand(-2, 2.5)
      const t = i * 0.004
      tl.to(
        card.position,
        { x: ox, y: oy, z: oz, duration: 0.5, ease: 'power2.out' },
        t,
      )
      tl.to(
        card.rotation,
        {
          x: rand(-1.2, 1.2),
          y: rand(-1.2, 1.2),
          z: rand(-1.2, 1.2),
          duration: 0.5,
          ease: 'power2.out',
        },
        t,
      )
      tl.to(
        card.position,
        { x: 0, y: i * 0.012, z: 0, duration: 0.55, ease: 'power2.inOut' },
        0.7 + i * 0.003,
      )
      tl.to(
        card.rotation,
        { x: -0.1, y: 0, z: rand(-0.02, 0.02), duration: 0.55, ease: 'power2.inOut' },
        0.7 + i * 0.003,
      )
    })
    return () => {
      tl.kill()
    }
  }, [shuffleActive, endShuffle])

  // 非洗牌状态时把散乱的牌归位
  useEffect(() => {
    if (shuffleActive) return
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      card.position.set(0, i * 0.012, 0)
      card.rotation.set(-0.1, 0, 0)
    })
  }, [shuffleActive, stackCount])

  useFrame((state) => {
    const g = stackGroup.current
    if (!g || shuffleActive) return
    if (!settings.reduceMotion) {
      g.position.y = DECK_POS.y + Math.sin(state.clock.elapsedTime * 0.7) * 0.04
    }
  })

  const drawnCards = drawn.map((d, i) => ({ d, i }))

  return (
    <group>
      {/* 牌堆 */}
      <group ref={stackGroup} position={DECK_POS.toArray()} rotation={[0, 0, 0]} visible={stackCount > 0}>
        {Array.from({ length: stackCount }, (_, i) => (
          <group
            key={deck[i]?.id ?? i}
            ref={(node) => {
              cardRefs.current[i] = node
            }}
            position={[0, i * 0.012, 0]}
            rotation={[-0.1, 0, 0]}
          >
            <mesh material={backMaterial}>
              <planeGeometry args={[CARD_W, CARD_H]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 已抽出的牌 */}
      {drawnCards.map(({ d, i }) => (
        <TarotCard3D
          key={`${d.card.id}-${i}`}
          card={d.card}
          orientation={d.orientation}
          index={i}
          target={targets[i] ?? [0, 0, 0]}
          revealed={d.revealed}
          interactive={phase === 'reveal'}
          reduceMotion={settings.reduceMotion}
          onRevealed={revealCard}
        />
      ))}
    </group>
  )
}
