import { createSignal, For, Show } from 'solid-js'
import { Check, X } from 'lucide-solid'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { type ChatUser } from '../data/chat-types'

type User = Omit<ChatUser, 'messages'>

type NewChatProps = {
  users: User[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewChat(props: NewChatProps) {
  const [selectedUsers, setSelectedUsers] = createSignal<User[]>([])

  const handleSelectUser = (user: User) => {
    if (!selectedUsers().find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers(), user])
    } else {
      handleRemoveUser(user.id)
    }
  }

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers().filter((user) => user.id !== userId))
  }

  const handleOpenChange = (newOpen: boolean) => {
    props.onOpenChange(newOpen)
    // Reset selected users when dialog closes
    if (!newOpen) {
      setSelectedUsers([])
    }
  }

  return (
    <Dialog open={props.open} onOpenChange={handleOpenChange}>
      <DialogContent class='sm:max-w-150'>
        <DialogHeader>
          <DialogTitle>New message</DialogTitle>
        </DialogHeader>
        <div class='flex flex-col gap-4'>
          <div class='flex flex-wrap items-baseline-last gap-2'>
            <span class='min-h-6 text-sm text-muted-foreground'>To:</span>
            <For each={selectedUsers()}>
              {(user) => (
                <Badge variant='default'>
                  {user.fullName}
                  <button
                    class='ms-1 rounded-full ring-offset-background outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2'
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleRemoveUser(user.id)
                      }
                    }}
                    onClick={() => handleRemoveUser(user.id)}
                  >
                    <X class='h-3 w-3 text-muted-foreground hover:text-foreground' />
                  </button>
                </Badge>
              )}
            </For>
          </div>
          <Command class='rounded-lg border'>
            <CommandInput
              placeholder='Search people...'
              class='text-foreground'
            />
            <CommandList>
              <CommandEmpty>No people found.</CommandEmpty>
              <CommandGroup>
                <For each={props.users}>
                  {(user) => (
                    <CommandItem
                      value={`${user.fullName} ${user.username}`}
                      onSelect={() => handleSelectUser(user)}
                      class='flex items-center justify-between gap-2 hover:bg-accent hover:text-accent-foreground'
                    >
                      <div class='flex items-center gap-2'>
                        <img
                          src={user.profile || '/placeholder.svg'}
                          alt={user.fullName}
                          class='h-8 w-8 rounded-full'
                        />
                        <div class='flex flex-col'>
                          <span class='text-sm font-medium'>
                            {user.fullName}
                          </span>
                          <span class='text-xs text-accent-foreground/70'>
                            {user.username}
                          </span>
                        </div>
                      </div>

                      <Show
                        when={selectedUsers().find((u) => u.id === user.id)}
                      >
                        <Check class='h-4 w-4' />
                      </Show>
                    </CommandItem>
                  )}
                </For>
              </CommandGroup>
            </CommandList>
          </Command>
          <Button
            variant={'default'}
            onClick={() => showSubmittedData(selectedUsers())}
            disabled={selectedUsers().length === 0}
          >
            Chat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
