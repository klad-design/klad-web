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
    <div className={clsx({ absolute: isAbsolute, relative: !isAbsolute })}>
      <div className="absolute inset-0 blur-[3px] transform-gpu" aria-hidden>{children}</div>
      <div className="absolute inset-0 blur-[1.5px] transform-gpu" aria-hidden>{children}</div>
      <div className="relative blur-[0.6px] transform-gpu">{children}</div>
    </div>
  )
}

export function TextBlur({ isBold, isHorizontal, children }: TextBlurProps) {
  return (
    isBold
      ? <Text>{children}</Text>
      : (
          <div className={clsx('textBlur relative', { textBlurHorizontal: isHorizontal })}>
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
          </div>
        )
  )
}
