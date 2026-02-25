import type { Variants } from 'framer-motion'

const baseEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: baseEase },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: baseEase },
  },
}

export const staggerContainer = (delayChildren = 0.08, staggerChildren = 0.08): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren, staggerChildren },
  },
})

export const viewportOnce = { once: true, amount: 0.2 } as const
