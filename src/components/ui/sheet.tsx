import {
  splitProps,
  type ComponentProps,
  type JSX,
  type ValidComponent,
} from 'solid-js'
import * as SheetPrimitive from '@kobalte/core/dialog'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import { XIcon } from 'lucide-solid'
import { cn } from '@/lib/utils'

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.CloseButton
const SheetPortal = SheetPrimitive.Portal

type SheetOverlayProps<T extends ValidComponent = 'div'> =
  SheetPrimitive.DialogOverlayProps<T> & { class?: string | undefined }

function SheetOverlay<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, SheetOverlayProps<T>>
) {
  const [local, others] = splitProps(props as SheetOverlayProps, ['class'])
  return (
    <SheetPrimitive.Overlay
      data-slot='sheet-overlay'
      class={cn(
        'fixed inset-0 z-50 bg-black/50 data-closed:animate-out data-closed:fade-out-0 data-expanded:animate-in data-expanded:fade-in-0',
        local.class
      )}
      {...others}
    />
  )
}

type SheetContentProps<T extends ValidComponent = 'div'> =
  SheetPrimitive.DialogContentProps<T> & {
    class?: string | undefined
    children?: JSX.Element
    side?: 'top' | 'right' | 'bottom' | 'left'
    style?: JSX.CSSProperties
  }

function SheetContent<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, SheetContentProps<T>>
) {
  const [local, others] = splitProps(props as SheetContentProps, [
    'class',
    'children',
    'side',
  ])
  const side = () => local.side ?? 'right'
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot='sheet-content'
        class={cn(
          'fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition ease-in-out outline-none data-closed:animate-out data-closed:duration-300 data-expanded:animate-in data-expanded:duration-500',
          side() === 'right' &&
            'inset-y-0 inset-e-0 h-full w-3/4 border-s data-closed:slide-out-to-end data-expanded:slide-in-from-end sm:max-w-sm',
          side() === 'left' &&
            'inset-y-0 inset-s-0 h-full w-3/4 border-e data-closed:slide-out-to-start data-expanded:slide-in-from-start sm:max-w-sm',
          side() === 'top' &&
            'inset-x-0 top-0 h-auto border-b data-closed:slide-out-to-top data-expanded:slide-in-from-top',
          side() === 'bottom' &&
            'inset-x-0 bottom-0 h-auto border-t data-closed:slide-out-to-bottom data-expanded:slide-in-from-bottom',
          local.class
        )}
        {...others}
      >
        {local.children}
        <SheetPrimitive.CloseButton class='absolute inset-e-4 top-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none'>
          <XIcon class='size-4' />
          <span class='sr-only'>Close</span>
        </SheetPrimitive.CloseButton>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader(props: ComponentProps<'div'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <div
      data-slot='sheet-header'
      class={cn('flex flex-col gap-1.5 p-4', local.class)}
      {...others}
    />
  )
}

function SheetFooter(props: ComponentProps<'div'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <div
      data-slot='sheet-footer'
      class={cn('mt-auto flex flex-col gap-2 p-4', local.class)}
      {...others}
    />
  )
}

type SheetTitleProps<T extends ValidComponent = 'h2'> =
  SheetPrimitive.DialogTitleProps<T> & { class?: string | undefined }

function SheetTitle<T extends ValidComponent = 'h2'>(
  props: PolymorphicProps<T, SheetTitleProps<T>>
) {
  const [local, others] = splitProps(props as SheetTitleProps, ['class'])
  return (
    <SheetPrimitive.Title
      data-slot='sheet-title'
      class={cn('font-semibold text-foreground', local.class)}
      {...others}
    />
  )
}

type SheetDescriptionProps<T extends ValidComponent = 'p'> =
  SheetPrimitive.DialogDescriptionProps<T> & { class?: string | undefined }

function SheetDescription<T extends ValidComponent = 'p'>(
  props: PolymorphicProps<T, SheetDescriptionProps<T>>
) {
  const [local, others] = splitProps(props as SheetDescriptionProps, ['class'])
  return (
    <SheetPrimitive.Description
      data-slot='sheet-description'
      class={cn('text-sm text-muted-foreground', local.class)}
      {...others}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
