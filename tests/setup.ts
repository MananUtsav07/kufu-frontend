import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => undefined
}

vi.mock('framer-motion', async () => {
  const React = await import('react')

  const MotionComponent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }
  >(function MotionComponent(props, ref) {
    const { children, ...rest } = props
    return React.createElement('div', { ...rest, ref }, children)
  })

  const motion = new Proxy(
    {},
    {
      get() {
        return MotionComponent
      },
    },
  )

  return {
    motion,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => children ?? null,
  }
})
