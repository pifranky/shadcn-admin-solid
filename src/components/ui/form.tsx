import {
  createContext,
  splitProps,
  useContext,
  type ComponentProps,
  type JSX,
} from 'solid-js'
import type { FieldApi, Form } from '@/lib/form'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

/**
 * Field-level building blocks for forms created with `createForm`
 * (see `@/lib/form`). Mirrors the shadcn `<Form*>` API:
 *
 * <FormField form={form} name='email'>
 *   {(field) => (
 *     <FormItem>
 *       <FormLabel>Email</FormLabel>
 *       <Input {...field.inputProps} />
 *       <FormMessage />
 *     </FormItem>
 *   )}
 * </FormField>
 */
const FormFieldContext = createContext<FieldApi>()

function FormField(props: {
  form: Form
  name: string
  children: (field: FieldApi) => JSX.Element
}) {
  const field = props.form.field(props.name)
  return (
    <FormFieldContext.Provider value={field}>
      {props.children(field)}
    </FormFieldContext.Provider>
  )
}

function useFormField() {
  const field = useContext(FormFieldContext)
  if (!field) throw new Error('useFormField should be used within <FormField>')
  return field
}

function FormItem(props: ComponentProps<'div'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <div
      data-slot='form-item'
      class={cn('grid gap-2', local.class)}
      {...others}
    />
  )
}

function FormLabel(props: ComponentProps<'label'>) {
  const [local, others] = splitProps(props, ['class'])
  const field = useContext(FormFieldContext)
  return (
    <Label
      data-slot='form-label'
      data-error={!!field?.error()}
      class={cn('data-[error=true]:text-destructive', local.class)}
      for={field?.id}
      {...others}
    />
  )
}

function FormDescription(props: ComponentProps<'p'>) {
  const [local, others] = splitProps(props, ['class'])
  const field = useContext(FormFieldContext)
  return (
    <p
      data-slot='form-description'
      id={field ? `${field.id}-description` : undefined}
      class={cn('text-sm text-muted-foreground', local.class)}
      {...others}
    />
  )
}

function FormMessage(props: ComponentProps<'p'>) {
  const [local, others] = splitProps(props, ['class', 'children'])
  const field = useContext(FormFieldContext)
  const body = () => field?.error() ?? local.children
  return (
    <>
      {body() ? (
        <p
          data-slot='form-message'
          id={field ? `${field.id}-message` : undefined}
          class={cn('text-sm text-destructive', local.class)}
          {...others}
        >
          {body()}
        </p>
      ) : null}
    </>
  )
}

export {
  useFormField,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
}
