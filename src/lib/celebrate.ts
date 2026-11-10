import confetti from 'canvas-confetti'
import { readConfettiColors } from '@/lib/theme'

// origin: center of the clicked element, as fractions of the window
export function celebrate(origin: { x: number; y: number }) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  void confetti({
    particleCount: 40,
    spread: 60,
    startVelocity: 25,
    scalar: 0.8,
    ticks: 120,
    colors: readConfettiColors(),
    origin,
  })
}

export function originOf(element: Element): { x: number; y: number } {
  const rect = element.getBoundingClientRect()
  return {
    x: (rect.left + rect.width / 2) / window.innerWidth,
    y: (rect.top + rect.height / 2) / window.innerHeight,
  }
}
