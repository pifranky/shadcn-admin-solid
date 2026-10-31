import { Show } from 'solid-js'
import { useNavigate, useRouter } from '@tanstack/solid-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type GeneralErrorProps = {
  class?: string
  minimal?: boolean
}

export function GeneralError(props: GeneralErrorProps) {
  const navigate = useNavigate()
  const router = useRouter()
  return (
    <div class={cn('h-svh w-full', props.class)}>
      <div class='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <Show when={!props.minimal}>
          <h1 class='text-[7rem] leading-tight font-bold'>500</h1>
        </Show>
        <span class='font-medium'>Oops! Something went wrong {`:')`}</span>
        <p class='text-center text-muted-foreground'>
          We apologize for the inconvenience. <br /> Please try again later.
        </p>
        <Show when={!props.minimal}>
          <div class='mt-6 flex gap-4'>
            <Button variant='outline' onClick={() => router.history.go(-1)}>
              Go Back
            </Button>
            <Button onClick={() => navigate({ to: '/' })}>Back to Home</Button>
          </div>
        </Show>
      </div>
    </div>
  )
}
