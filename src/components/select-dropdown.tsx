import { Show, type JSX } from 'solid-js'
import { Loader } from 'lucide-solid'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectHiddenSelect,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Option = { label: string; value: string; icon?: JSX.Element }

type SelectDropdownProps = {
  onValueChange?: (value: string) => void
  /** Selected value (the select is always controlled in Solid). */
  value: string | undefined
  placeholder?: string
  isPending?: boolean
  items: Option[] | undefined
  disabled?: boolean
  class?: string
  id?: string
  name?: string
  invalid?: boolean
  'aria-label'?: string
}

export function SelectDropdown(props: SelectDropdownProps) {
  const options = () =>
    props.isPending
      ? [{ label: 'Loading...', value: 'loading', disabled: true }]
      : (props.items ?? [])
  const selected = () => options().find((o) => o.value === props.value) ?? null

  return (
    <Select<Option & { disabled?: boolean }>
      options={options()}
      optionValue='value'
      optionTextValue='label'
      optionDisabled='disabled'
      value={selected()}
      onChange={(opt) => opt && props.onValueChange?.(opt.value)}
      placeholder={props.placeholder ?? 'Select'}
      disabled={props.disabled}
      name={props.name}
      validationState={props.invalid ? 'invalid' : 'valid'}
      // Let the trigger participate directly in the parent's layout (grid, width)
      class='contents'
      itemComponent={(itemProps) => (
        <SelectItem
          item={itemProps.item}
          class={props.isPending ? 'h-14' : undefined}
        >
          <Show
            when={!props.isPending}
            fallback={
              <div class='flex items-center justify-center gap-2'>
                <Loader class='h-5 w-5 animate-spin' />
                {'  '}
                Loading...
              </div>
            }
          >
            {itemProps.item.rawValue.icon}
            {itemProps.item.rawValue.label}
          </Show>
        </SelectItem>
      )}
    >
      <SelectHiddenSelect />
      <SelectTrigger
        id={props.id}
        aria-label={props['aria-label']}
        aria-invalid={props.invalid}
        class={cn(props.class)}
      >
        <SelectValue<Option> data-slot='select-value'>
          {(state) => (
            <>
              {state.selectedOption()?.icon}
              {state.selectedOption()?.label}
            </>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  )
}
