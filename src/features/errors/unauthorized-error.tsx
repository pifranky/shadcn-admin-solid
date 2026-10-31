import { useNavigate, useRouter } from '@tanstack/solid-router'
import { Button } from '@/components/ui/button'

export function UnauthorisedError() {
  const navigate = useNavigate()
  const router = useRouter()
  return (
    <div class='h-svh'>
      <div class='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 class='text-[7rem] leading-tight font-bold'>401</h1>
        <span class='font-medium'>Unauthorized Access</span>
        <p class='text-center text-muted-foreground'>
          Please log in with the appropriate credentials <br /> to access this
          resource.
        </p>
        <div class='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => router.history.go(-1)}>
            Go Back
          </Button>
          <Button onClick={() => navigate({ to: '/' })}>Back to Home</Button>
        </div>
      </div>
    </div>
  )
}
