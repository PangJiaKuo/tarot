export function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function randInt(min: number, max: number): number {
  return Math.floor(rand(min, max + 1))
}

export function chance(p: number): boolean {
  return Math.random() < p
}

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
