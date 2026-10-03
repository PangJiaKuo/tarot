import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getStarTexture } from '../../utils/textures'

interface ParticleTrailProps {
  target: THREE.Object3D | null
  active: boolean
  count?: number
  color?: string
}

/**
 * 粒子拖尾：每帧把 target 的世界坐标写入环形缓冲，形成发光尾迹。
 */
export function ParticleTrail({ target, active, count = 90, color = '#ffd27a' }: ParticleTrailProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const head = useRef(0)
  const inited = useRef(false)

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
    return geo
  }, [count])

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        map: getStarTexture(),
        color,
        size: 0.16,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    [color],
  )

  const tmp = useMemo(() => new THREE.Vector3(), [])

  useFrame((_, delta) => {
    const pts = pointsRef.current
    if (!pts) return
    const mat = pts.material as THREE.PointsMaterial

    if (active && target) {
      target.getWorldPosition(tmp)
      const arr = geometry.attributes.position.array as Float32Array
      if (!inited.current) {
        for (let i = 0; i < count; i++) {
          arr[i * 3] = tmp.x
          arr[i * 3 + 1] = tmp.y
          arr[i * 3 + 2] = tmp.z
        }
        inited.current = true
      }
      head.current = (head.current + 1) % count
      arr[head.current * 3] = tmp.x + (Math.random() - 0.5) * 0.25
      arr[head.current * 3 + 1] = tmp.y + (Math.random() - 0.5) * 0.25
      arr[head.current * 3 + 2] = tmp.z + (Math.random() - 0.5) * 0.25
      geometry.attributes.position.needsUpdate = true
      mat.opacity = Math.min(0.95, mat.opacity + delta * 4)
      mat.size = 0.14 + Math.random() * 0.05
    } else {
      mat.opacity = Math.max(0, mat.opacity - delta * 2.2)
      if (mat.opacity === 0) inited.current = false
    }
  })

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />
}
