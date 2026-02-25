import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

type GlassPanelProps<T extends ElementType> = {
  as?: T
  className?: string
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

export function GlassPanel<T extends ElementType = 'div'>(props: GlassPanelProps<T>) {
  const { as, className = '', children, ...rest } = props
  const Component = as ?? 'div'
  const panelClassName = 'border border-white/5 bg-white/[0.03] backdrop-blur-[10px]'

  return (
    <Component className={`${panelClassName} ${className}`.trim()} {...rest}>
      {children}
    </Component>
  )
}
