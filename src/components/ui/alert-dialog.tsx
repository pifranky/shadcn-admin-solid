import {
  splitProps,
  type ComponentProps,
  type JSX,
  type ValidComponent,
} from 'solid-js'
import * as AlertDialogPrimitive from '@kobalte/core/alert-dialog'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const AlertDialog = AlertDialogPrimitive.Root
const AlertDialogTrigger = AlertDialogPrimitive.Trigger
const AlertDialogPortal = AlertDialogPrimitive.Portal

type AlertDialogOverlayProps<T extends ValidComponent = 'div'> =
  AlertDialogPrimitive.AlertDialogOverlayProps<T> & {
    class?: string | undefined
  }

function AlertDialogOverlay<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, AlertDialogOverlayProps<T>>
) {
  const [local, others] = splitProps(props as AlertDialogOverlayProps, [
    'class',
  ])
  return (
    <AlertDialogPrimitive.Overlay
      data-slot='alert-dialog-overlay'
      class={cn(
        'fixed inset-0 z-50 bg-black/50 data-closed:animate-out data-closed:fade-out-0 data-expanded:animate-in data-expanded:fade-in-0',
        local.class
      )}
      {...others}
    />
  )
}

type AlertDialogContentProps<T extends ValidComponent = 'div'> =
  AlertDialogPrimitive.AlertDialogContentProps<T> & {
    class?: string | undefined
    children?: JSX.Element
  }

function AlertDialogContent<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, AlertDialogContentProps<T>>
) {
  const [local, others] = splitProps(props as AlertDialogContentProps, [
    'class',
  ])
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot='alert-dialog-content'
        class={cn(
          'fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 outline-none data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-expanded:animate-in data-expanded:fade-in-0 data-expanded:zoom-in-95 sm:max-w-lg',
          local.class
        )}
        {...others}
      />
    </AlertDialogPortal>
  )
}

function AlertDialogHeader(props: ComponentProps<'div'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <div
      data-slot='alert-dialog-header'
      class={cn('flex flex-col gap-2 text-center sm:text-start', local.class)}
      {...others}
    />
  )
}

function AlertDialogFooter(props: ComponentProps<'div'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <div
      data-slot='alert-dialog-footer'
      class={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        local.class
      )}
      {...others}
    />
  )
}

type AlertDialogTitleProps<T extends ValidComponent = 'h2'> =
  AlertDialogPrimitive.AlertDialogTitleProps<T> & { class?: string | undefined }

function AlertDialogTitle<T extends ValidComponent = 'h2'>(
  props: PolymorphicProps<T, AlertDialogTitleProps<T>>
) {
  const [local, others] = splitProps(props as AlertDialogTitleProps, ['class'])
  return (
    <AlertDialogPrimitive.Title
      data-slot='alert-dialog-title'
      class={cn('text-lg font-semibold', local.class)}
      {...others}
    />
  )
}

type AlertDialogDescriptionProps<T extends ValidComponent = 'p'> =
  AlertDialogPrimitive.AlertDialogDescriptionProps<T> & {
    class?: string | undefined
  }

function AlertDialogDescription<T extends ValidComponent = 'p'>(
  props: PolymorphicProps<T, AlertDialogDescriptionProps<T>>
) {
  const [local, others] = splitProps(props as AlertDialogDescriptionProps, [
    'class',
  ])
  return (
    <AlertDialogPrimitive.Description
      data-slot='alert-dialog-description'
      class={cn('text-sm text-muted-foreground', local.class)}
      {...others}
    />
  )
}

type AlertDialogCancelProps<T extends ValidComponent = 'button'> =
  AlertDialogPrimitive.AlertDialogCloseButtonProps<T> & {
    class?: string | undefined
    disabled?: boolean
  }

function AlertDialogCancel<T extends ValidComponent = 'button'>(
  props: PolymorphicProps<T, AlertDialogCancelProps<T>>
) {
  const [local, others] = splitProps(props as AlertDialogCancelProps, ['class'])
  return (
    <AlertDialogPrimitive.CloseButton
      data-slot='alert-dialog-cancel'
      class={cn(buttonVariants({ variant: 'outline' }), local.class)}
      {...others}
    />
  )
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
}
