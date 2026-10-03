import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getRuneTexture, RUNES } from '../../utils/textures'
import { rand, pick } from '../../utils/random'
import { useTarotStore } from '../../store/useTarotStore'

interface RuneSprite {
  x: number
  y: number
  z: number
  scale: number
  phase: number
  speed: number
  spin: number
  opacity: number
  texture: THREE.CanvasTexture
}

export function FloatingRunes({ count = 22 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null)

  const sprites = useMemo<RuneSprite[]>(() => {
    return Array.from({ length: count }, () => {
      const color = pick(['#e9d8a6', '#c9b8ff', '#7ce0ff'])
      return {
        x: rand(-8, 8),
        y: rand(-4, 4.5),
        z: rand(-5, 1),
        scale: rand(0.3, 0.75),
        phase: rand(0, Math.PI * 2),
        speed: rand(0.2, 0.5),
        spin: rand(-0.15, 0.15),
        opacity: rand(0.14, 0.4),
        texture: getRuneTexture(pick(RUNES), color),
      }
    })
  }, [count])

  useFrame((state) => {
    const g = groupRef.current
    if (!g) return
    const t = state.clock.elapsedTime
    const reduce = useTarotStore.getState().settings.reduceMotion
    g.children.forEach((child, i) => {
      const s = sprites[i]
      if (reduce) return
      child.position.y = s.y + Math.sin(t * s.speed + s.phase) * 0.45
      child.position.x = s.x + Math.cos(t * s.speed * 0.6 + s.phase) * 0.3
      const mat = (child as THREE.Sprite).material as THREE.SpriteMaterial
      mat.rotation = Math.sin(t * 0.2 + s.phase) * s.spin * 8
    })
  })

  return (
    <group ref={groupRef}>
      {sprites.map((s, i) => (
        <sprite key={i} position={[s.x, s.y, s.z]} scale={[s.scale, s.scale, 1]}>
          <spriteMaterial
            map={s.texture}
            transparent
            opacity={s.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  )
}
