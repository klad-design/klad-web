import { ReactNode } from "react";

interface TextBlurProps {
  isBold?: boolean;
  children: ReactNode;
}

export function TextBlur({ isBold, children }: TextBlurProps) {
  return (
    isBold ? (
      <span className="relative">
        <span className="absolute blur-[3px]">{children}</span>
        <span className="absolute blur-[1.5px]">{children}</span>
        <span className="relative blur-[0.6px]">{children}</span>
      </span>
    ) : (
      <span className="blur-[0.8px]">
        {children}
      </span>
    )
  )
}