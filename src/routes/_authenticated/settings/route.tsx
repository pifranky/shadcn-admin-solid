import { createFileRoute } from '@tanstack/solid-router'
import { Settings } from '@/features/settings'

export const Route = createFileRoute('/_authenticated/settings')({
  component: Settings,
})
