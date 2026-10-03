/**
 * 轻量的跨组件特效状态（每帧读写，避免触发 React 重渲染）。
 * Effects 组件在 useFrame 中读取并衰减这些值。
 */
export const fxState = {
  /** Bloom 增益，1 为基线，>1 表示脉冲增强 */
  bloomBoost: 1,
  /** 镜头震动强度 0..1，每帧衰减 */
  shake: 0,
}

export function pulseBloom(amount = 1.8): void {
  fxState.bloomBoost = Math.max(fxState.bloomBoost, amount)
}

export function kickShake(amount = 0.35): void {
  fxState.shake = Math.min(1, fxState.shake + amount)
}

export function decayFx(dt: number): void {
  fxState.bloomBoost += (1 - fxState.bloomBoost) * Math.min(1, dt * 2.2)
  fxState.shake = Math.max(0, fxState.shake - dt * 1.4)
}
