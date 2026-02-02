import type { ReactNode } from 'react'

import clsx from 'clsx'

export function SectionMedia({ children }: { children: ReactNode }) {
  return (
    <section className="py-5 px-2.5 md:py-[30px] md:px-10 lg:px-[75px] 2xl:px-[100px]">
      {children}
    </section>
  )
}

export function SectionText({ title, align, children }: { title?: string, align?: 'left' | 'right' | 'center', children: ReactNode }) {
  return (
    <section className="grid-container py-[30px] md:py-[50px]">
      <div className="col-span-full md:col-span-2 md:col-start-2 lg:col-span-full lg:px-[140px]">
        <div className={clsx('[&_h2]:text-p1 2xl:[&_h2]:text-p1-2xl [&_h2]:uppercase flex flex-col gap-5 p3 w-full', {
          'lg:max-w-[440px] lg:ml-auto': align === 'right',
          'lg:max-w-[440px]': align === 'left',
          'lg:max-w-[976px] lg:mx-auto text-center': align === 'center',
        })}
        >
          {title && align === 'center' && <h2>{title}</h2>}
          {children}
        </div>
      </div>
    </section>
  )
}
