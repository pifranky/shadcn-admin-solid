import { Show, splitProps, type ComponentProps, type JSX } from 'solid-js'
import OtpField from '@corvu/otp-field'
import { MinusIcon } from 'lucide-solid'
import { cn } from '@/lib/utils'

/** OTP input built on corvu's OtpField (replaces `input-otp`). */
function InputOTP(
  props: {
    maxLength: number
    value?: string
    onValueChange?: (value: string) => void
    onComplete?: (value: string) => void
    disabled?: boolean
    id?: string
    class?: string
    containerClass?: string
    children: JSX.Element
  } & Omit<ComponentProps<'div'>, 'onChange'>
) {
  const [local, others] = splitProps(props, [
    'maxLength',
    'value',
    'onValueChange',
    'onComplete',
    'disabled',
    'id',
    'class',
    'containerClass',
    'children',
  ])
  return (
    <OtpField
      maxLength={local.maxLength}
      value={local.value}
      onValueChange={local.onValueChange}
      onComplete={local.onComplete}
      data-slot='input-otp'
      class={cn(
        'flex items-center gap-2 has-disabled:opacity-50',
        local.containerClass
      )}
      {...others}
    >
      <OtpField.Input
        id={local.id}
        disabled={local.disabled}
        class={cn('disabled:cursor-not-allowed', local.class)}
      />
      {local.children}
    </OtpField>
  )
}

function InputOTPGroup(props: ComponentProps<'div'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <div
      data-slot='input-otp-group'
      class={cn('flex items-center', local.class)}
      {...others}
    />
  )
}

function InputOTPSlot(props: ComponentProps<'div'> & { index: number }) {
  const [local, others] = splitProps(props, ['class', 'index'])
  const context = OtpField.useContext()
  const char = () => context.value()[local.index]
  const isActive = () => context.activeSlots().includes(local.index)
  const showFakeCaret = () =>
    context.value().length === local.index && context.isInserting()
  return (
    <div
      data-slot='input-otp-slot'
      data-active={isActive() && context.isFocused()}
      class={cn(
        'relative flex h-9 w-9 items-center justify-center border-y border-e border-input text-sm shadow-xs transition-all outline-none first:rounded-s-md first:border-s last:rounded-e-md aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-[3px] data-[active=true]:ring-ring/50 dark:bg-input/30',
        local.class
      )}
      {...others}
    >
      {char()}
      <Show when={showFakeCaret()}>
        <div class='pointer-events-none absolute inset-0 flex items-center justify-center'>
          <div class='h-4 w-px animate-caret-blink bg-foreground duration-1000' />
        </div>
      </Show>
    </div>
  )
}

function InputOTPSeparator(props: ComponentProps<'div'>) {
  return (
    <div data-slot='input-otp-separator' role='separator' {...props}>
      <MinusIcon />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
