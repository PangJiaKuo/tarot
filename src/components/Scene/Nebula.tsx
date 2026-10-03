import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getNebulaTexture } from '../../utils/textures'

const LAYERS = [
  { key: 'purple', colors: ['#6a2bd9', '#3b1a8f', '#8f5cff'], scale: 24, opacity: 0.2, speed: 0.008, z: -6 },
  { key: 'indigo', colors: ['#1b2a8f', '#4b3bb8', '#2a1660'], scale: 30, opacity: 0.16, speed: -0.005, z: -8 },
  { key: 'gold', colors: ['#c98a2e', '#8a5c1a', '#e8b45c'], scale: 16, opacity: 0.08, speed: 0.012, z: -4.5 },
]

export function Nebula() {
  const groupRef = useRef<THREE.Group>(null)
  const textures = useMemo(
    () => LAYERS.map((l) => getNebulaTexture(l.key, l.colors)),
    [],
  )

  useFrame((state, delta) => {
    const g = groupRef.current
    if (!g) return
    g.children.forEach((child, i) => {
      const mat = (child as THREE.Sprite).material as THREE.SpriteMaterial
      if (!mat.rotation) mat.rotation = 0
      mat.rotation += delta * LAYERS[i].speed
      child.position.x = Math.sin(state.clock.elapsedTime * 0.05 + i * 2) * 1.2
      child.position.y = Math.cos(state.clock.elapsedTime * 0.04 + i) * 0.8
    })
  })

  return (
    <group ref={groupRef}>
      {LAYERS.map((l, i) => (
        <sprite key={l.key} position={[0, 0, l.z]} scale={[l.scale, l.scale * 0.62, 1]}>
          <spriteMaterial
            map={textures[i]}
            transparent
            opacity={l.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  )
}
