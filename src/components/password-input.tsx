import { createSignal, splitProps, type ComponentProps } from 'solid-js'
import { Eye, EyeOff } from 'lucide-solid'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

type PasswordInputProps = Omit<ComponentProps<'input'>, 'type'>

export function PasswordInput(props: PasswordInputProps) {
  const [local, others] = splitProps(props, ['class', 'disabled'])
  const [showPassword, setShowPassword] = createSignal(false)
  return (
    <div class={cn('relative rounded-md', local.class)}>
      <input
        type={showPassword() ? 'text' : 'password'}
        class='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive'
        disabled={local.disabled}
        {...others}
      />
      <Button
        type='button'
        size='icon'
        variant='ghost'
        disabled={local.disabled}
        class='absolute inset-e-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-md text-muted-foreground'
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword() ? <Eye size={18} /> : <EyeOff size={18} />}
        <span class='sr-only'>
          {showPassword() ? 'Hide password' : 'Show password'}
        </span>
      </Button>
    </div>
  )
}
