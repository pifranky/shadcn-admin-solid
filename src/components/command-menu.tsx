import { For, Show } from 'solid-js'
import { useNavigate } from '@tanstack/solid-router'
import { ArrowRight, ChevronRight, Laptop, Moon, Sun } from 'lucide-solid'
import { useSearch } from '@/context/search-provider'
import { useTheme } from '@/context/theme-provider'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { ScrollArea } from '@/components/ui/scroll-area'
import { sidebarData } from './layout/data/sidebar-data'

export function CommandMenu() {
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()

  const runCommand = (command: () => unknown) => {
    setOpen(false)
    command()
  }

  return (
    <CommandDialog open={open()} onOpenChange={setOpen}>
      <CommandInput placeholder='Type a command or search...' />
      <CommandList>
        <ScrollArea type='hover' class='h-72 pe-1'>
          <CommandEmpty>No results found.</CommandEmpty>
          <For each={sidebarData.navGroups}>
            {(group) => (
              <CommandGroup heading={group.title}>
                <For each={group.items}>
                  {(navItem) => (
                    <Show
                      when={navItem.url}
                      fallback={
                        <For each={navItem.items}>
                          {(subItem) => (
                            <CommandItem
                              value={`${navItem.title} ${subItem.title}`}
                              onSelect={() => {
                                runCommand(() => navigate({ to: subItem.url }))
                              }}
                            >
                              <div class='flex size-4 items-center justify-center'>
                                <ArrowRight class='size-2 text-muted-foreground/80' />
                              </div>
                              {navItem.title} <ChevronRight /> {subItem.title}
                            </CommandItem>
                          )}
                        </For>
                      }
                    >
                      <CommandItem
                        value={navItem.title}
                        onSelect={() => {
                          runCommand(() => navigate({ to: navItem.url }))
                        }}
                      >
                        <div class='flex size-4 items-center justify-center'>
                          <ArrowRight class='size-2 text-muted-foreground/80' />
                        </div>
                        {navItem.title}
                      </CommandItem>
                    </Show>
                  )}
                </For>
              </CommandGroup>
            )}
          </For>
          <CommandSeparator />
          <CommandGroup heading='Theme'>
            <CommandItem
              value='Light'
              onSelect={() => runCommand(() => setTheme('light'))}
            >
              <Sun /> <span>Light</span>
            </CommandItem>
            <CommandItem
              value='Dark'
              onSelect={() => runCommand(() => setTheme('dark'))}
            >
              <Moon class='scale-90' />
              <span>Dark</span>
            </CommandItem>
            <CommandItem
              value='System'
              onSelect={() => runCommand(() => setTheme('system'))}
            >
              <Laptop />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
