import type { ReactNode } from 'react'

interface TextBlurProps {
  isBold?: boolean
  children: ReactNode
}

export function TextBlur({ isBold, children }: TextBlurProps) {
  return (
    isBold
      ? (
          <span className="relative">
            <span className="absolute blur-[3px] transform-gpu">{children}</span>
            <span className="absolute blur-[1.5px] transform-gpu">{children}</span>
            <span className="relative blur-[0.6px] transform-gpu">{children}</span>
          </span>
        )
      : (
          <span className="blur-[0.8px] transform-gpu">
            {children}
          </span>
        )
  )
}
