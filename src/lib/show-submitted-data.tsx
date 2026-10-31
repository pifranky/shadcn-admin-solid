import { toast } from 'solid-sonner'

export function showSubmittedData(
  data: unknown,
  title: string = 'You submitted the following values:'
) {
  toast.message(title, {
    description: (
      <pre class='mt-2 w-full overflow-x-auto rounded-md bg-slate-950 p-4'>
        <code class='text-white'>{JSON.stringify(data, null, 2)}</code>
      </pre>
    ),
  })
}
