import { HTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  text: string;
  size?: 'xs' | 's' | 'm'
}

export function Button({ text, size = 'xs', className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx('button', `button--${size}`, className)}
      type="button"
      {...props}
    >
      {text}
    </button>
  )
}