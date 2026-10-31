import { batch, createSignal } from 'solid-js'
import { createStore, produce, reconcile, unwrap } from 'solid-js/store'
import type { z } from 'zod'

/**
 * A small, signal-based form helper with Zod validation.
 * Replaces react-hook-form + @hookform/resolvers in the original project.
 *
 * - Values live in a Solid store (`form.values`), so reads are fine-grained.
 * - Validation runs on submit; after the first submit (or with `mode: 'onChange'`)
 *   every change re-validates, mirroring react-hook-form's defaults.
 * - Errors are keyed by dotted path, e.g. `urls.0.value`.
 */
type FormMode = 'onSubmit' | 'onChange'

type CreateFormOptions<S extends z.ZodType> = {
  schema: S
  defaultValues?: Partial<z.input<S>>
  mode?: FormMode
  onSubmit?: (data: z.output<S>) => void | Promise<void>
}

export type FieldApi = {
  id: string
  name: string
  value: () => any
  setValue: (value: unknown) => void
  error: () => string | undefined
  /** Spreadable props for native inputs / textareas / selects. */
  inputProps: {
    readonly id: string
    readonly name: string
    readonly value: any
    readonly 'aria-invalid': boolean
    readonly 'aria-describedby': string
    onInput: (e: InputEvent & { currentTarget: { value: string } }) => void
    onChange: (e: Event & { currentTarget: { value: string } }) => void
    onBlur: () => void
  }
}

let formCounter = 0

function getPath(obj: any, path: string) {
  return path
    .split('.')
    .reduce((acc, key) => (acc == null ? undefined : acc[key]), obj)
}

export function createForm<S extends z.ZodType>(opts: CreateFormOptions<S>) {
  type Values = z.input<S> & object
  const formId = `form-${++formCounter}`
  const initial = () =>
    structuredClone(unwrap((opts.defaultValues ?? {}) as Values)) as Values

  const [values, setValues] = createStore<Values>(initial() as any)
  const [errors, setErrors] = createStore<Record<string, string | undefined>>(
    {}
  )
  const [submitted, setSubmitted] = createSignal(false)
  const [touched, setTouched] = createStore<Record<string, boolean>>({})

  const shouldValidateOnChange = () => submitted() || opts.mode === 'onChange'

  function collectErrors() {
    const result = opts.schema.safeParse(unwrap(values))
    const next: Record<string, string> = {}
    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = issue.path.join('.')
        if (!(key in next)) next[key] = issue.message
      }
    }
    return { result, next }
  }

  function validate(onlyTouched = false) {
    const { result, next } = collectErrors()
    const visible = onlyTouched
      ? Object.fromEntries(
          Object.entries(next).filter(([k]) =>
            Object.keys(touched).some(
              (t) => touched[t] && (k === t || k.startsWith(`${t}.`))
            )
          )
        )
      : next
    setErrors(reconcile(visible))
    return result
  }

  function setValue(path: string, value: unknown) {
    const keys = path.split('.')
    setValues(
      produce((draft: any) => {
        let target = draft
        for (let i = 0; i < keys.length - 1; i++) {
          if (target[keys[i]] == null) target[keys[i]] = {}
          target = target[keys[i]]
        }
        target[keys[keys.length - 1]] = value
      })
    )
    setTouched(path, true)
    if (shouldValidateOnChange()) validate(!submitted())
  }

  function getValue(path: string) {
    return getPath(values, path)
  }

  function error(path: string) {
    return errors[path]
  }

  function field(name: string): FieldApi {
    const id = `${formId}-${name.replace(/\./g, '-')}`
    const onTextChange = (e: { currentTarget: { value: string } }) =>
      setValue(name, e.currentTarget.value)
    return {
      id,
      name,
      value: () => getValue(name),
      setValue: (v) => setValue(name, v),
      error: () => error(name),
      inputProps: {
        get id() {
          return id
        },
        get name() {
          return name
        },
        get value() {
          return getValue(name) ?? ''
        },
        get 'aria-invalid'() {
          return !!error(name)
        },
        get 'aria-describedby'() {
          return error(name)
            ? `${id}-description ${id}-message`
            : `${id}-description`
        },
        onInput: onTextChange,
        onChange: onTextChange,
        onBlur: () => {
          setTouched(name, true)
          if (opts.mode === 'onChange') validate(!submitted())
        },
      },
    }
  }

  async function handleSubmit(e?: Event) {
    e?.preventDefault()
    setSubmitted(true)
    const result = validate()
    if (result.success) await opts.onSubmit?.(result.data as z.output<S>)
  }

  function reset(next?: Partial<Values>) {
    batch(() => {
      setValues(
        reconcile(
          (next ? structuredClone(unwrap(next)) : initial()) as any
        ) as any
      )
      setErrors(reconcile({}))
      setTouched(reconcile({}))
      setSubmitted(false)
    })
  }

  return {
    id: formId,
    values,
    setValue,
    getValue,
    error,
    field,
    handleSubmit,
    reset,
    validate: () => validate().success,
    get isValid() {
      return collectErrors().result.success
    },
    get isSubmitted() {
      return submitted()
    },
  }
}

export type Form = ReturnType<typeof createForm<any>>
