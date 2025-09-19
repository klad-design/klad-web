import type { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import { TextBlur } from '@/components/ui/TextBlur'

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  text?: string
  size?: 'xs' | 's' | 'm'
  isLink?: boolean
  blur?: 'none' | 'regular' | 'bold'
  children?: ReactNode
}

export function Button({ text, size = 'xs', className, isLink, blur, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx('button', `button--${size}`, { 'button--link': isLink }, className)}
      type="button"
      {...props}
    >
      {blur
        ? (
            <TextBlur isBold={blur === 'bold'}>
              {children || text}
            </TextBlur>
          )
        : (
            children || text
          )}
    </button>
  )
}
