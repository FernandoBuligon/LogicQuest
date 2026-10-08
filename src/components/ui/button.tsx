// Adaptado do Button shadcn/ui (MIT), com variantes usadas neste projeto.
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ComponentProps } from 'react'

const variants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-cyan-300 text-slate-950 hover:bg-cyan-200',
        outline: 'border border-slate-600 bg-slate-900 text-slate-100 hover:bg-slate-800',
        ghost: 'text-slate-300 hover:bg-slate-800 hover:text-white',
        destructive: 'bg-rose-950 text-rose-200 border border-rose-700 hover:bg-rose-900',
      },
      size: { default: 'h-11 px-4', sm: 'h-9 px-3', lg: 'h-13 px-6 text-base' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export function Button({ className, variant, size, asChild = false, type = 'button', ...props }:
  ComponentProps<'button'> & VariantProps<typeof variants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button'
  const classes: ClassValue[] = [variants({ variant, size }), className]
  return <Comp type={type} className={twMerge(clsx(classes))} {...props} />
}
