import { createMemo, createSignal, For, Show } from 'solid-js'
import { format } from 'date-fns'
import {
  ArrowLeft,
  MoreVertical,
  Edit,
  Paperclip,
  Phone,
  ImagePlus,
  Plus,
  Search as SearchIcon,
  Send,
  Video,
  MessagesSquare,
} from 'lucide-solid'
import { cn, getDisplayNameInitials } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { NewChat } from './components/new-chat'
import { type ChatUser, type Convo } from './data/chat-types'
// Fake Data
import { conversations } from './data/convo.json'

export function Chats() {
  const [search, setSearch] = createSignal('')
  const [selectedUser, setSelectedUser] = createSignal<ChatUser | null>(null)
  const [mobileSelectedUser, setMobileSelectedUser] =
    createSignal<ChatUser | null>(null)
  const [createConversationDialogOpened, setCreateConversationDialog] =
    createSignal(false)

  // Filtered data based on the search query
  const filteredChatList = createMemo(() =>
    conversations.filter(({ fullName }) =>
      fullName.toLowerCase().includes(search().trim().toLowerCase())
    )
  )

  const currentMessage = createMemo(() =>
    selectedUser()?.messages.reduce((acc: Record<string, Convo[]>, obj) => {
      const key = format(obj.timestamp, 'd MMM, yyyy')

      // Create an array for the category if it doesn't exist
      if (!acc[key]) {
        acc[key] = []
      }

      // Push the current object to the array
      acc[key].push(obj)

      return acc
    }, {})
  )

  const users = conversations.map(({ messages, ...user }) => user)

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search class='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main fixed>
        <section class='flex h-full gap-6'>
          {/* Left Side */}
          <div class='flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80'>
            <div class='sticky top-0 z-10 -mx-4 bg-background px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none'>
              <div class='flex items-center justify-between py-2'>
                <div class='flex gap-2'>
                  <h1 class='text-2xl font-bold'>Inbox</h1>
                  <MessagesSquare size={20} />
                </div>

                <Button
                  size='icon'
                  variant='ghost'
                  onClick={() => setCreateConversationDialog(true)}
                  class='rounded-lg'
                >
                  <Edit size={24} class='stroke-muted-foreground' />
                </Button>
              </div>

              <label
                class={cn(
                  'focus-within:ring-1 focus-within:ring-ring focus-within:outline-hidden',
                  'flex h-10 w-full items-center space-x-0 rounded-md border border-border ps-2'
                )}
              >
                <SearchIcon size={15} class='me-2 stroke-slate-500' />
                <span class='sr-only'>Search</span>
                <input
                  type='text'
                  class='w-full flex-1 bg-inherit text-sm focus-visible:outline-hidden'
                  placeholder='Search chat...'
                  value={search()}
                  onInput={(e) => setSearch(e.currentTarget.value)}
                />
              </label>
            </div>

            <ScrollArea class='-mx-3 h-full overflow-scroll p-3'>
              <For each={filteredChatList()}>
                {(chatUsr) => {
                  const { id, profile, username, messages, fullName } = chatUsr
                  const lastConvo = messages[0]
                  const lastMsg =
                    lastConvo.sender === 'You'
                      ? `You: ${lastConvo.message}`
                      : lastConvo.message
                  return (
                    <>
                      <button
                        type='button'
                        class={cn(
                          'group hover:bg-accent hover:text-accent-foreground',
                          `flex w-full rounded-md px-2 py-2 text-start text-sm`,
                          selectedUser()?.id === id && 'sm:bg-muted'
                        )}
                        onClick={() => {
                          setSelectedUser(chatUsr)
                          setMobileSelectedUser(chatUsr)
                        }}
                      >
                        <div class='flex gap-2'>
                          <Avatar>
                            <AvatarImage src={profile} alt={username} />
                            <AvatarFallback>
                              {getDisplayNameInitials(fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span class='col-start-2 row-span-2 font-medium'>
                              {fullName}
                            </span>
                            <span class='col-start-2 row-span-2 row-start-2 line-clamp-2 text-ellipsis text-muted-foreground group-hover:text-accent-foreground/90'>
                              {lastMsg}
                            </span>
                          </div>
                        </div>
                      </button>
                      <Separator class='my-1' />
                    </>
                  )
                }}
              </For>
            </ScrollArea>
          </div>

          {/* Right Side */}
          <Show
            when={selectedUser()}
            fallback={
              <div
                class={cn(
                  'absolute inset-0 start-full z-50 hidden w-full flex-1 flex-col justify-center rounded-md border bg-card shadow-xs sm:static sm:z-auto sm:flex'
                )}
              >
                <div class='flex flex-col items-center space-y-6'>
                  <div class='flex size-16 items-center justify-center rounded-full border-2 border-border'>
                    <MessagesSquare class='size-8' />
                  </div>
                  <div class='space-y-2 text-center'>
                    <h1 class='text-xl font-semibold'>Your messages</h1>
                    <p class='text-sm text-muted-foreground'>
                      Send a message to start a chat.
                    </p>
                  </div>
                  <Button onClick={() => setCreateConversationDialog(true)}>
                    Send message
                  </Button>
                </div>
              </div>
            }
          >
            <div
              class={cn(
                'absolute inset-0 start-full z-50 hidden w-full flex-1 flex-col border bg-background shadow-xs sm:static sm:z-auto sm:flex sm:rounded-md',
                mobileSelectedUser() && 'inset-s-0 flex'
              )}
            >
              {/* Top Part */}
              <div class='mb-1 flex flex-none justify-between bg-card p-4 shadow-lg sm:rounded-t-md'>
                {/* Left */}
                <div class='flex gap-3'>
                  <Button
                    size='icon'
                    variant='ghost'
                    class='-ms-2 h-full sm:hidden'
                    onClick={() => setMobileSelectedUser(null)}
                  >
                    <ArrowLeft class='rtl:rotate-180' />
                  </Button>
                  <div class='flex items-center gap-2 lg:gap-4'>
                    <Avatar class='size-9 lg:size-11'>
                      <AvatarImage
                        src={selectedUser()!.profile}
                        alt={selectedUser()!.username}
                      />
                      <AvatarFallback>
                        {getDisplayNameInitials(selectedUser()!.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span class='col-start-2 row-span-2 text-sm font-medium lg:text-base'>
                        {selectedUser()!.fullName}
                      </span>
                      <span class='col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-xs text-nowrap text-ellipsis text-muted-foreground lg:max-w-none lg:text-sm'>
                        {selectedUser()!.title}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div class='-me-1 flex items-center gap-1 lg:gap-2'>
                  <Button
                    size='icon'
                    variant='ghost'
                    class='hidden size-8 rounded-full sm:inline-flex lg:size-10'
                  >
                    <Video size={22} class='stroke-muted-foreground' />
                  </Button>
                  <Button
                    size='icon'
                    variant='ghost'
                    class='hidden size-8 rounded-full sm:inline-flex lg:size-10'
                  >
                    <Phone size={22} class='stroke-muted-foreground' />
                  </Button>
                  <Button
                    size='icon'
                    variant='ghost'
                    class='h-10 rounded-md sm:h-8 sm:w-4 lg:h-10 lg:w-6'
                  >
                    <MoreVertical class='stroke-muted-foreground sm:size-5' />
                  </Button>
                </div>
              </div>

              {/* Conversation */}
              <div class='flex flex-1 flex-col gap-2 rounded-md px-4 pt-0 pb-4'>
                <div class='flex size-full flex-1'>
                  <div class='chat-text-container relative -me-4 flex flex-1 flex-col overflow-y-hidden'>
                    <div class='chat-flex flex h-40 w-full grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pe-4 pb-4'>
                      <For each={Object.keys(currentMessage() ?? {})}>
                        {(key) => (
                          <>
                            <For each={currentMessage()![key]}>
                              {(msg) => (
                                <div
                                  class={cn(
                                    'chat-box max-w-72 px-3 py-2 wrap-break-word shadow-lg',
                                    msg.sender === 'You'
                                      ? 'self-end rounded-[16px_16px_0_16px] bg-primary/90 text-primary-foreground/75'
                                      : 'self-start rounded-[16px_16px_16px_0] bg-muted'
                                  )}
                                >
                                  {msg.message}{' '}
                                  <span
                                    class={cn(
                                      'mt-1 block text-xs font-light text-foreground/75 italic',
                                      msg.sender === 'You' &&
                                        'text-end text-primary-foreground/85'
                                    )}
                                  >
                                    {format(msg.timestamp, 'h:mm a')}
                                  </span>
                                </div>
                              )}
                            </For>
                            <div class='text-center text-xs'>{key}</div>
                          </>
                        )}
                      </For>
                    </div>
                  </div>
                </div>
                <form class='flex w-full flex-none gap-2'>
                  <div class='flex flex-1 items-center gap-2 rounded-md border border-input bg-card px-2 py-1 focus-within:ring-1 focus-within:ring-ring focus-within:outline-hidden lg:gap-4'>
                    <div class='space-x-1'>
                      <Button
                        size='icon'
                        type='button'
                        variant='ghost'
                        class='h-8 rounded-md'
                      >
                        <Plus size={20} class='stroke-muted-foreground' />
                      </Button>
                      <Button
                        size='icon'
                        type='button'
                        variant='ghost'
                        class='hidden h-8 rounded-md lg:inline-flex'
                      >
                        <ImagePlus size={20} class='stroke-muted-foreground' />
                      </Button>
                      <Button
                        size='icon'
                        type='button'
                        variant='ghost'
                        class='hidden h-8 rounded-md lg:inline-flex'
                      >
                        <Paperclip size={20} class='stroke-muted-foreground' />
                      </Button>
                    </div>
                    <label class='flex-1'>
                      <span class='sr-only'>Chat Text Box</span>
                      <input
                        type='text'
                        placeholder='Type your messages...'
                        class='h-8 w-full bg-inherit focus-visible:outline-hidden'
                      />
                    </label>
                    <Button
                      variant='ghost'
                      size='icon'
                      class='hidden sm:inline-flex'
                    >
                      <Send size={20} />
                    </Button>
                  </div>
                  <Button class='h-full sm:hidden'>
                    <Send size={18} /> Send
                  </Button>
                </form>
              </div>
            </div>
          </Show>
        </section>
        <NewChat
          users={users}
          onOpenChange={setCreateConversationDialog}
          open={createConversationDialogOpened()}
        />
      </Main>
    </>
  )
}
