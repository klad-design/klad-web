import type { LinkProps } from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, JSX, RefObject } from 'react'

import clsx from 'clsx'
import Link from 'next/link'

interface ButtonPropsBasic {
  children?: JSX.Element
  label: string | JSX.Element
  size?: 'xs' | 's' | 'm'
  isActive?: boolean
  isInherit?: boolean
}

type ButtonProps = ButtonPropsBasic
  & (
    | (ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' })
    | (AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps & { as: 'a' })
    )

export function Button({
  ref,
  ...props
}: ButtonProps & { ref?: RefObject<HTMLAnchorElement | HTMLButtonElement> }) {
  const {
    as = 'button',
    label,
    size = 'xs',
    isActive,
    isInherit,
    className,
    children,
    ...rest
  } = props

  const Component = as === 'button' ? as : Link

  return (
    <Component
      ref={ref as any}
      {...(rest as any)}
      className={clsx(
        'button',
        `button--${size}`,
        {
          'button--inherit': isInherit,
          'button--active': isActive,
        },
        className,
      )}
      aria-label={label}
    >
      {children || <span>{label}</span>}
    </Component>
  )
}
