import { createRoot } from 'solid-js'
import { z } from 'zod'
import { describe, expect, it, vi } from 'vitest'
import { createForm } from './form'

const schema = z.object({
  email: z.email('Invalid email.'),
  urls: z.array(z.object({ value: z.url('Bad URL.') })).optional(),
})

function setup(onSubmit = vi.fn()) {
  return createRoot(() =>
    createForm({
      schema,
      defaultValues: { email: '', urls: [{ value: 'https://a.dev' }] },
      onSubmit,
    })
  )
}

describe('createForm', () => {
  it('does not show errors before the first submit', () => {
    const form = setup()
    form.setValue('email', 'nope')
    expect(form.error('email')).toBeUndefined()
  })

  it('shows errors on submit and re-validates on change afterwards', async () => {
    const onSubmit = vi.fn()
    const form = setup(onSubmit)
    await form.handleSubmit()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(form.error('email')).toBe('Invalid email.')

    form.setValue('email', 'me@example.com')
    expect(form.error('email')).toBeUndefined()
  })

  it('validates nested array paths', async () => {
    const form = setup()
    form.setValue('urls.0.value', 'not a url')
    await form.handleSubmit()
    expect(form.error('urls.0.value')).toBe('Bad URL.')
  })

  it('submits parsed data and resets to defaults', async () => {
    const onSubmit = vi.fn()
    const form = setup(onSubmit)
    form.setValue('email', 'me@example.com')
    await form.handleSubmit()
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'me@example.com',
      urls: [{ value: 'https://a.dev' }],
    })
    form.reset()
    expect(form.values.email).toBe('')
    expect(form.isSubmitted).toBe(false)
  })
})
