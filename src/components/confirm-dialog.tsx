import type { JSX } from 'solid-js'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: JSX.Element
  disabled?: boolean
  desc: JSX.Element
  cancelBtnText?: string
  confirmText?: JSX.Element
  destructive?: boolean
  isLoading?: boolean
  class?: string
  children?: JSX.Element
} & (
  | { form: string; handleConfirm?: undefined }
  | { form?: undefined; handleConfirm: () => void }
)

export function ConfirmDialog(props: ConfirmDialogProps) {
  return (
    <AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
      <AlertDialogContent class={cn(props.class)}>
        <AlertDialogHeader class='text-start'>
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
          <AlertDialogDescription as='div'>{props.desc}</AlertDialogDescription>
        </AlertDialogHeader>
        {props.children}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={props.isLoading}>
            {props.cancelBtnText ?? 'Cancel'}
          </AlertDialogCancel>
          <Button
            type={props.form ? 'submit' : 'button'}
            form={props.form}
            onClick={() => props.handleConfirm?.()}
            variant={props.destructive ? 'destructive' : 'default'}
            disabled={(props.disabled ?? false) || props.isLoading}
          >
            {props.confirmText ?? 'Continue'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
