import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getStarTexture } from '../../utils/textures'
import { useTarotStore } from '../../store/useTarotStore'

interface StarfieldProps {
  count: number
}

export function Starfield({ count }: StarfieldProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const starTex = useMemo(() => getStarTexture(), [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // 球壳分布，避免星星出现在镜头与卡牌之间
      const r = 9 + Math.random() * 11
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7
      positions[i * 3 + 2] = r * Math.cos(phi)
      sizes[i] = 0.6 + Math.random() * 1.8
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    return geo
  }, [count])

  useFrame((state, delta) => {
    const pts = pointsRef.current
    if (!pts) return
    const reduce = useTarotStore.getState().settings.reduceMotion
    if (!reduce) {
      pts.rotation.y += delta * 0.012
      pts.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.04
      const mat = pts.material as THREE.PointsMaterial
      mat.opacity = 0.65 + Math.sin(state.clock.elapsedTime * 0.8) * 0.2
    }
  })

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        map={starTex}
        size={0.14}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color="#cfd0ff"
      />
    </points>
  )
}
