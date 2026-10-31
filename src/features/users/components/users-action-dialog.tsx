import { type JSX } from 'solid-js'
import { z } from 'zod'
import { createForm, type Form } from '@/lib/form'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { roles } from '../data/data'
import { type User } from '../data/schema'

const formSchema = z
  .object({
    firstName: z.string().min(1, 'First Name is required.'),
    lastName: z.string().min(1, 'Last Name is required.'),
    username: z.string().min(1, 'Username is required.'),
    phoneNumber: z.string().min(1, 'Phone number is required.'),
    email: z.email({
      error: (iss) => (iss.input === '' ? 'Email is required.' : undefined),
    }),
    password: z.string().transform((pwd) => pwd.trim()),
    role: z.string().min(1, 'Role is required.'),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    isEdit: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isEdit && !data.password) return true
      return data.password.length > 0
    },
    {
      message: 'Password is required.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return password.length >= 8
    },
    {
      message: 'Password must be at least 8 characters long.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return /[a-z]/.test(password)
    },
    {
      message: 'Password must contain at least one lowercase letter.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return /\d/.test(password)
    },
    {
      message: 'Password must contain at least one number.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password, confirmPassword }) => {
      if (isEdit && !password) return true
      return password === confirmPassword
    },
    {
      message: "Passwords don't match.",
      path: ['confirmPassword'],
    }
  )

type UserActionDialogProps = {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** A horizontal "label | control" form row used throughout this dialog. */
function FieldRow(props: {
  form: Form
  name: string
  label: string
  children: (field: ReturnType<Form['field']>) => JSX.Element
}) {
  return (
    <FormField form={props.form} name={props.name}>
      {(field) => (
        <FormItem class='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
          <FormLabel class='col-span-2 justify-end text-end'>
            {props.label}
          </FormLabel>
          {props.children(field)}
          <FormMessage class='col-span-4 col-start-3' />
        </FormItem>
      )}
    </FormField>
  )
}

export function UsersActionDialog(props: UserActionDialogProps) {
  const isEdit = !!props.currentRow
  const formId = isEdit ? `user-form-${props.currentRow!.id}` : 'user-form'

  const form = createForm({
    schema: formSchema,
    defaultValues: isEdit
      ? {
          ...props.currentRow,
          password: '',
          confirmPassword: '',
          isEdit,
        }
      : {
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          role: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
          isEdit,
        },
    onSubmit: (values) => {
      form.reset()
      showSubmittedData(values)
      props.onOpenChange(false)
    },
  })

  const isPasswordTouched = () => !!form.values.password

  return (
    <Dialog
      open={props.open}
      onOpenChange={(state) => {
        form.reset()
        props.onOpenChange(state)
      }}
    >
      <DialogContent class='sm:max-w-lg'>
        <DialogHeader class='text-start'>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the user here. ' : 'Create new user here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div class='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <form
            id={formId}
            onSubmit={form.handleSubmit}
            class='space-y-4 px-0.5'
            novalidate
          >
            <FieldRow form={form} name='firstName' label='First Name'>
              {(field) => (
                <Input
                  placeholder='John'
                  class='col-span-4'
                  autocomplete='off'
                  {...field.inputProps}
                />
              )}
            </FieldRow>
            <FieldRow form={form} name='lastName' label='Last Name'>
              {(field) => (
                <Input
                  placeholder='Doe'
                  class='col-span-4'
                  autocomplete='off'
                  {...field.inputProps}
                />
              )}
            </FieldRow>
            <FieldRow form={form} name='username' label='Username'>
              {(field) => (
                <Input
                  placeholder='john_doe'
                  class='col-span-4'
                  {...field.inputProps}
                />
              )}
            </FieldRow>
            <FieldRow form={form} name='email' label='Email'>
              {(field) => (
                <Input
                  placeholder='john.doe@gmail.com'
                  class='col-span-4'
                  {...field.inputProps}
                />
              )}
            </FieldRow>
            <FieldRow form={form} name='phoneNumber' label='Phone Number'>
              {(field) => (
                <Input
                  placeholder='+123456789'
                  class='col-span-4'
                  {...field.inputProps}
                />
              )}
            </FieldRow>
            <FieldRow form={form} name='role' label='Role'>
              {(field) => (
                <SelectDropdown
                  id={field.id}
                  value={field.value()}
                  onValueChange={field.setValue}
                  invalid={!!field.error()}
                  placeholder='Select a role'
                  class='col-span-4 w-full'
                  items={roles.map(({ label, value }) => ({
                    label,
                    value,
                  }))}
                />
              )}
            </FieldRow>
            <FieldRow form={form} name='password' label='Password'>
              {(field) => (
                <PasswordInput
                  placeholder='e.g., S3cur3P@ssw0rd'
                  class='col-span-4'
                  {...field.inputProps}
                />
              )}
            </FieldRow>
            <FieldRow
              form={form}
              name='confirmPassword'
              label='Confirm Password'
            >
              {(field) => (
                <PasswordInput
                  disabled={!isPasswordTouched()}
                  placeholder='e.g., S3cur3P@ssw0rd'
                  class='col-span-4'
                  {...field.inputProps}
                />
              )}
            </FieldRow>
          </form>
        </div>
        <DialogFooter>
          <Button type='submit' form={formId}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
