import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { BloomEffect } from 'postprocessing'
import type { RefObject } from 'react'
import { fxState, decayFx } from '../../utils/fx'
import { useTarotStore, type Quality } from '../../store/useTarotStore'

const BASE_INTENSITY: Record<Quality, number> = {
  low: 0.8,
  medium: 1.2,
  high: 1.8,
}

export function Effects() {
  const quality = useTarotStore((s) => s.settings.quality)
  const bloomRef = useRef<BloomEffect | null>(null)
  const base = BASE_INTENSITY[quality]
  useFrame((_, delta) => {
    decayFx(delta)
    if (bloomRef.current) {
      bloomRef.current.intensity = base * fxState.bloomBoost
    }
  })

  return (
    <EffectComposer multisampling={quality === 'low' ? 0 : 2}>
      <Bloom
        // @react-three/postprocessing 2.x 的 wrapEffect 类型标注有误，实际接收 BloomEffect 实例
        ref={bloomRef as unknown as RefObject<typeof BloomEffect>}
        intensity={base}
        luminanceThreshold={0.22}
        luminanceSmoothing={0.5}
        mipmapBlur
        radius={0.72}
      />
      <Vignette eskil={false} offset={0.22} darkness={0.78} />
      <>{quality !== 'low' && <Noise opacity={quality === 'high' ? 0.055 : 0.035} />}</>
    </EffectComposer>
  )
}
