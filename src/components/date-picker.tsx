import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-solid'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type DatePickerProps = {
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
  placeholder?: string
  id?: string
}

export function DatePicker(props: DatePickerProps) {
  return (
    <Popover placement='bottom-start'>
      <PopoverTrigger
        as={Button}
        id={props.id}
        variant='outline'
        data-empty={!props.selected}
        class='w-60 justify-start text-start font-normal data-[empty=true]:text-muted-foreground'
      >
        {props.selected ? (
          format(props.selected, 'MMM d, yyyy')
        ) : (
          <span>{props.placeholder ?? 'Pick a date'}</span>
        )}
        <CalendarIcon class='ms-auto h-4 w-4 opacity-50' />
      </PopoverTrigger>
      <PopoverContent class='w-auto p-0'>
        <Calendar
          captionLayout='dropdown'
          selected={props.selected}
          onSelect={props.onSelect}
          disabled={(date: Date) =>
            date > new Date() || date < new Date('1900-01-01')
          }
        />
      </PopoverContent>
    </Popover>
  )
}
