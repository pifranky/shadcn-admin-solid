import { Telescope } from 'lucide-solid'

export function ComingSoon() {
  return (
    <div class='h-svh'>
      <div class='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <Telescope size={72} />
        <h1 class='text-4xl leading-tight font-bold'>Coming Soon!</h1>
        <p class='text-center text-muted-foreground'>
          This page has not been created yet. <br />
          Stay tuned though!
        </p>
      </div>
    </div>
  )
}
