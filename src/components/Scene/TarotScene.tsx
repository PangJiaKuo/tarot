import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Starfield } from './Starfield'
import { Nebula } from './Nebula'
import { FloatingRunes } from './FloatingRunes'
import { TarotDeck } from './TarotDeck'
import { Effects } from './Effects'
import { useTarotStore, detectLowPower } from '../../store/useTarotStore'
import { fxState } from '../../utils/fx'

function CameraRig() {
  const { camera, size } = useThree()
  const basePos = useRef(new THREE.Vector3(0, 0, 9))

  useFrame((state, delta) => {
    const cam = camera as THREE.PerspectiveCamera
    const { settings, phase } = useTarotStore.getState()

    // 抽牌/翻牌/解读阶段轻微推进
    const closeUp = phase === 'reveal' || phase === 'reading'
    const aspect = size.width / size.height
    let targetZ = closeUp ? 8.4 : 9.2
    if (aspect < 0.8) targetZ += 1.2 // 竖屏拉远
    basePos.current.z += (targetZ - basePos.current.z) * Math.min(1, delta * 2)

    if (settings.reduceMotion) {
      cam.position.set(0, 0, basePos.current.z)
      cam.lookAt(0, 0, 0)
      return
    }

    // 鼠标视差
    const px = state.pointer.x
    const py = state.pointer.y
    const tx = px * 0.55
    const ty = py * 0.3
    cam.position.x += (tx - cam.position.x) * Math.min(1, delta * 3)
    cam.position.y += (ty - cam.position.y) * Math.min(1, delta * 3)
    cam.position.z = basePos.current.z

    // 震动
    if (fxState.shake > 0.001) {
      cam.position.x += (Math.random() - 0.5) * 0.1 * fxState.shake
      cam.position.y += (Math.random() - 0.5) * 0.1 * fxState.shake
    }
    cam.lookAt(0, 0, 0)
  })

  return null
}

export function TarotScene() {
  const quality = useTarotStore((s) => s.settings.quality)
  const lowPower = detectLowPower()
  const effQuality: 'low' | 'medium' | 'high' =
    quality === 'high' && lowPower ? 'medium' : quality
  const starCount = effQuality === 'low' ? 1200 : effQuality === 'medium' ? 3000 : 5000
  const runeCount = effQuality === 'low' ? 12 : 22

  return (
    <Canvas
      className="tarot-canvas"
      dpr={[1, 1.5]}
      gl={{ antialias: effQuality !== 'low', powerPreference: 'high-performance', alpha: false }}
      camera={{ position: [0, 0, 9], fov: 55, near: 0.1, far: 60 }}
    >
      <color attach="background" args={['#05010f']} />
      <fog attach="fog" args={['#05010f', 10, 26]} />
      <ambientLight intensity={0.45} color="#9d8cff" />
      <pointLight position={[3, 4, 5]} intensity={0.9} color="#8a5cff" distance={20} />
      <pointLight position={[-4, -2, 3]} intensity={0.55} color="#ffd27a" distance={18} />
      <spotLight position={[0, 6, 6]} angle={0.6} penumbra={0.8} intensity={0.6} color="#e9d8a6" />
      <Nebula />
      <Starfield count={starCount} />
      <FloatingRunes count={runeCount} />
      <TarotDeck />
      <CameraRig />
      <Effects />
    </Canvas>
  )
}
