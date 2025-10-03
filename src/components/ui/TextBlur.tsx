'use client'

import type { ReactNode } from 'react'
import clsx from 'clsx'

interface TextBlurProps {
  isBold?: boolean
  isHorizontal?: boolean
  children: ReactNode
}

function Text({ children, isAbsolute }: TextBlurProps & { isAbsolute?: boolean }) {
  return (
    <span className={clsx({ absolute: isAbsolute, relative: !isAbsolute })}>
      <span className="absolute blur-[3px] transform-gpu" aria-hidden>{children}</span>
      <span className="absolute blur-[1.5px] transform-gpu" aria-hidden>{children}</span>
      <span className="relative blur-[0.6px] transform-gpu">{children}</span>
    </span>
  )
}

export function TextBlur({ isBold, isHorizontal, children }: TextBlurProps) {
  return (
    isBold
      ? <Text>{children}</Text>
      : (
          <span className="textBlur relative">
            <span
              className={clsx('absolute blur-[3px] opacity-20 transform-gpu ease-linear', {
                'translate-y-[calc(var(--value)_*_3_*_1%)]': !isHorizontal,
                'translate-y-[calc(var(--value)_*_3_*_1%)] md:translate-y-0 md:translate-x-[calc(var(--value)_*_3_*_1%)]': isHorizontal,
              })}
              aria-hidden
            >
              {children}
            </span>
            <span
              className={clsx('absolute blur-[3px] opacity-40 transform-gpu ease-linear', {
                'translate-y-[calc(var(--value)_*_2_*_1%)]': !isHorizontal,
                'translate-y-[calc(var(--value)_*_2_*_1%)] md:translate-y-0 md:translate-x-[calc(var(--value)_*_2_*_1%)]': isHorizontal,
              })}
              aria-hidden
            >
              {children}
            </span>
            <span
              className={clsx('absolute blur-[3px] opacity-80 transform-gpu ease-linear', {
                'translate-y-[calc(var(--value)_*_1_*_1%)]': !isHorizontal,
                'translate-y-[calc(var(--value)_*_1_*_1%)] md:translate-y-0 md:translate-x-[calc(var(--value)_*_1_*_1%)]': isHorizontal,
              })}
              aria-hidden
            >
              {children}
            </span>
            <Text>{children}</Text>
          </span>
        )
  )
}
