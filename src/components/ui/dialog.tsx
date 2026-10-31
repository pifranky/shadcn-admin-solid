import {
  Show,
  splitProps,
  type ComponentProps,
  type JSX,
  type ValidComponent,
} from 'solid-js'
import * as DialogPrimitive from '@kobalte/core/dialog'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import { XIcon } from 'lucide-solid'
import { cn } from '@/lib/utils'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.CloseButton

type DialogOverlayProps<T extends ValidComponent = 'div'> =
  DialogPrimitive.DialogOverlayProps<T> & { class?: string | undefined }

function DialogOverlay<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DialogOverlayProps<T>>
) {
  const [local, others] = splitProps(props as DialogOverlayProps, ['class'])
  return (
    <DialogPrimitive.Overlay
      data-slot='dialog-overlay'
      class={cn(
        'fixed inset-0 z-50 bg-black/50 data-closed:animate-out data-closed:fade-out-0 data-expanded:animate-in data-expanded:fade-in-0',
        local.class
      )}
      {...others}
    />
  )
}

type DialogContentProps<T extends ValidComponent = 'div'> =
  DialogPrimitive.DialogContentProps<T> & {
    class?: string | undefined
    children?: JSX.Element
    showCloseButton?: boolean
  }

function DialogContent<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DialogContentProps<T>>
) {
  const [local, others] = splitProps(props as DialogContentProps, [
    'class',
    'children',
    'showCloseButton',
  ])
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot='dialog-content'
        class={cn(
          'fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 outline-none data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-expanded:animate-in data-expanded:fade-in-0 data-expanded:zoom-in-95 sm:max-w-lg',
          local.class
        )}
        {...others}
      >
        {local.children}
        <Show when={local.showCloseButton ?? true}>
          <DialogPrimitive.CloseButton
            data-slot='dialog-close'
            class="absolute inset-e-4 top-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span class='sr-only'>Close</span>
          </DialogPrimitive.CloseButton>
        </Show>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader(props: ComponentProps<'div'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <div
      data-slot='dialog-header'
      class={cn('flex flex-col gap-2 text-center sm:text-start', local.class)}
      {...others}
    />
  )
}

function DialogFooter(props: ComponentProps<'div'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <div
      data-slot='dialog-footer'
      class={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        local.class
      )}
      {...others}
    />
  )
}

type DialogTitleProps<T extends ValidComponent = 'h2'> =
  DialogPrimitive.DialogTitleProps<T> & { class?: string | undefined }

function DialogTitle<T extends ValidComponent = 'h2'>(
  props: PolymorphicProps<T, DialogTitleProps<T>>
) {
  const [local, others] = splitProps(props as DialogTitleProps, ['class'])
  return (
    <DialogPrimitive.Title
      data-slot='dialog-title'
      class={cn('text-lg leading-none font-semibold', local.class)}
      {...others}
    />
  )
}

type DialogDescriptionProps<T extends ValidComponent = 'p'> =
  DialogPrimitive.DialogDescriptionProps<T> & { class?: string | undefined }

function DialogDescription<T extends ValidComponent = 'p'>(
  props: PolymorphicProps<T, DialogDescriptionProps<T>>
) {
  const [local, others] = splitProps(props as DialogDescriptionProps, ['class'])
  return (
    <DialogPrimitive.Description
      data-slot='dialog-description'
      class={cn('text-sm text-muted-foreground', local.class)}
      {...others}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
