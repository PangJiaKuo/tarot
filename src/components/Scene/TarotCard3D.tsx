import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import type { Orientation, TarotCard } from '../../data/tarot'
import { getCardBackTexture, getCardFrontTexture } from '../../utils/textures'
import { getAudioEngine } from '../../audio/useAudio'
import { pulseBloom, kickShake } from '../../utils/fx'
import { ParticleTrail } from './ParticleTrail'

export interface TarotCard3DProps {
  card: TarotCard
  orientation: Orientation
  index: number
  /** 牌阵目标位置（世界坐标） */
  target: [number, number, number]
  /** 是否已翻开 */
  revealed: boolean
  /** 是否可以点击翻牌 */
  interactive: boolean
  /** 减少动态模式 */
  reduceMotion: boolean
  onRevealed: (index: number) => void
}

const CARD_W = 1.2
const CARD_H = 2

/** 边缘 Fresnel 发光 shader */
const RIM_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const RIM_FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uIntensity;
  void main() {
    float left = smoothstep(0.0, 0.09, vUv.x);
    float right = smoothstep(1.0, 0.91, vUv.x);
    float bottom = smoothstep(0.0, 0.055, vUv.y);
    float top = smoothstep(1.0, 0.945, vUv.y);
    float edge = 1.0 - min(min(left, right), min(bottom, top));
    gl_FragColor = vec4(uColor * uIntensity, edge * uIntensity);
  }
`

export function TarotCard3D(props: TarotCard3DProps) {
  const { card, orientation, index, target, revealed, interactive, reduceMotion, onRevealed } = props
  const groupRef = useRef<THREE.Group | undefined>(undefined)
  const meshRef = useRef<THREE.Mesh>(null)
  const trailTargetRef = useRef<THREE.Group | undefined>(undefined)
  const [drawing, setDrawing] = useState(true)
  const { viewport } = useThree()

  const frontTex = useMemo(() => getCardFrontTexture(card, orientation), [card, orientation])
  const backTex = useMemo(() => getCardBackTexture(), [])

  const materials = useMemo(() => {
    const front = new THREE.MeshStandardMaterial({
      map: frontTex,
      roughness: 0.42,
      metalness: 0.25,
      emissive: new THREE.Color(card.color),
      emissiveMap: frontTex,
      emissiveIntensity: 0.32,
      side: THREE.FrontSide,
    })
    const back = new THREE.MeshStandardMaterial({
      map: backTex,
      roughness: 0.5,
      metalness: 0.3,
      emissive: new THREE.Color('#8a5cff'),
      emissiveMap: backTex,
      emissiveIntensity: 0.22,
      side: THREE.FrontSide,
    })
    return [front, back]
  }, [frontTex, backTex, card.color])

  const rimMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: RIM_VERT,
        fragmentShader: RIM_FRAG,
        uniforms: {
          uColor: { value: new THREE.Color('#ffd27a') },
          uIntensity: { value: 0.85 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    [],
  )

  // 抽牌：沿贝塞尔曲线从牌堆飞到牌位
  useEffect(() => {
    const g = groupRef.current
    if (!g) return
    const start: THREE.Vector3 = new THREE.Vector3(0, -2.6, 2.4)
    const end = new THREE.Vector3(...target)
    const control = start.clone().add(end).multiplyScalar(0.5)
    control.y += 1.6
    control.z += 1.4

    const progress = { p: 0 }
    g.position.copy(start)
    g.rotation.set(0, Math.PI, reduceMotion ? 0 : -0.35)

    const setPos = () => {
      const p = progress.p
      const a = start.clone().lerp(control, p)
      const b = control.clone().lerp(end, p)
      g.position.copy(a.lerp(b, p))
      g.rotation.y = Math.PI - p * 0.35
      g.rotation.x = (1 - p) * -0.12
    }
    setPos()

    const dur = reduceMotion ? 0.01 : 0.95
    const delay = reduceMotion ? 0 : index * 0.28
    const tl = gsap.timeline({
      delay,
      onStart: () => {
        getAudioEngine().playDraw()
        setDrawing(true)
      },
      onComplete: () => {
        setDrawing(false)
        if (!reduceMotion) {
          gsap.fromTo(
            g.position,
            { y: end.y },
            {
              y: end.y + 0.08,
              duration: 2.2,
              yoyo: true,
              repeat: -1,
              ease: 'sine.inOut',
            },
          )
        }
      },
    })
    tl.to(progress, { p: 1, duration: dur, ease: 'power2.inOut', onUpdate: setPos }, 0)
    tl.to(g.rotation, { y: Math.PI, x: 0, duration: dur, ease: 'power2.inOut' }, 0)
    return () => {
      tl.kill()
      gsap.killTweensOf(g.position)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 翻牌动画
  const flipTl = useRef<gsap.core.Timeline | null>(null)
  useEffect(() => {
    const g = groupRef.current
    const mesh = meshRef.current
    if (!g || !mesh || !revealed) return
    if (flipTl.current) flipTl.current.kill()
    if (reduceMotion) {
      g.rotation.y = 0
      mesh.scale.setScalar(1)
      return
    }
    const scaleObj = { s: 1 }
    flipTl.current = gsap.timeline({
      onStart: () => {
        getAudioEngine().playFlip()
        pulseBloom(1.9)
        kickShake(0.25)
      },
    })
    flipTl.current
      .to(scaleObj, {
        s: 1.12,
        duration: 0.45,
        ease: 'power2.out',
        onUpdate: () => mesh.scale.setScalar(scaleObj.s),
      })
      .to(g.rotation, { y: 0, duration: 0.9, ease: 'power2.inOut' }, 0)
      .to(
        scaleObj,
        {
          s: 1,
          duration: 0.45,
          ease: 'power2.in',
          onUpdate: () => mesh.scale.setScalar(scaleObj.s),
        },
        0.45,
      )
    return () => {
      flipTl.current?.kill()
    }
  }, [revealed, reduceMotion])

  useFrame((state) => {
    const g = groupRef.current
    if (!g) return
    // 面向镜头轻微倾斜（视差感）
    if (!reduceMotion && !drawing) {
      g.rotation.z = Math.sin(state.clock.elapsedTime * 0.6 + index) * 0.015
    }
  })

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    if (!interactive || revealed) return
    onRevealed(index)
  }

  return (
    <group ref={(node) => {
      groupRef.current = node ?? undefined
      trailTargetRef.current = node ?? undefined
    }}>
      <mesh ref={meshRef} material={materials} onClick={handleClick}>
        <planeGeometry args={[CARD_W, CARD_H]} />
      </mesh>
      {/* 边缘发光 */}
      <mesh material={rimMaterial} position={[0, 0, -0.012]} raycast={() => null}>
        <planeGeometry args={[CARD_W * 1.06, CARD_H * 1.045]} />
      </mesh>
      <ParticleTrail target={trailTargetRef.current ?? null} active={drawing} count={viewport.width < 8 ? 50 : 90} />
      {/* 拾取热区放大一点方便移动端点击 */}
      {interactive && !revealed && (
        <mesh position={[0, 0, 0.05]} visible={false} onClick={handleClick}>
          <planeGeometry args={[CARD_W * 1.25, CARD_H * 1.12]} />
        </mesh>
      )}
    </group>
  )
}
