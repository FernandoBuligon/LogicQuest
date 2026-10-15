// Adaptado do Button shadcn/ui (MIT), com variantes usadas neste projeto.
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ComponentProps } from 'react'

const variants = cva(
  'ui-button',
  {
    variants: {
      variant: {
        default: 'button-primary',
        outline: 'button-outline',
        ghost: 'button-ghost',
        destructive: 'button-danger',
      },
      size: { default: 'button-default', sm: 'button-small', lg: 'button-large' },
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
